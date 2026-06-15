import { useEffect, useMemo, useState } from 'react'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AdminStatusMessage from '../../components/admin/AdminStatusMessage'
import { useUser } from '../../context/UserContext'
import {
  formatVisitDateTime,
  formatVisitTime,
  getAvailableSlots,
  getVisitStatusLabel,
  getVisitStatusTone,
  listVisits,
  rescheduleVisit,
  toClinicDateInputValue,
  updateVisitStatus,
  type AvailableSlot,
  type Visit,
  type VisitStatus,
} from '../../lib/visits'

export default function ReceptionVisitsPage() {
  const { accessToken } = useUser()
  const [visits, setVisits] = useState<Visit[]>([])
  const [statusFilter, setStatusFilter] = useState<'' | VisitStatus>('created')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [pendingVisitID, setPendingVisitID] = useState<string | null>(null)
  const [rescheduleVisitID, setRescheduleVisitID] = useState<string | null>(null)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleSlots, setRescheduleSlots] = useState<AvailableSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState('')
  const [isSlotsLoading, setIsSlotsLoading] = useState(false)

  async function loadVisits(nextStatus = statusFilter, nextSearch = search) {
    if (!accessToken) return

    setIsLoading(true)
    setError('')

    try {
      const response = await listVisits(accessToken, {
        status: nextStatus || undefined,
        search: nextSearch.trim() || undefined,
        sort: 'scheduled_at_desc',
      })
      setVisits(response)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить записи')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadVisits()
  }, [accessToken, statusFilter])

  const filteredVisits = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return visits

    return visits.filter((item) =>
      [
        item.patient_full_name,
        item.patient_phone_number,
        item.doctor_full_name,
        item.specialty_name,
      ]
        .join(' ')
        .toLowerCase()
        .includes(term),
    )
  }, [search, visits])

  async function handleConfirm(visitID: string) {
    if (!accessToken) return

    setPendingVisitID(visitID)
    setError('')
    setSuccess('')

    try {
      await updateVisitStatus(accessToken, visitID, 'confirmed')
      setSuccess('Запись подтверждена и теперь доступна врачу.')
      await loadVisits()
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Не удалось подтвердить запись')
    } finally {
      setPendingVisitID(null)
    }
  }

  async function handleCancel(visitID: string) {
    if (!accessToken) return

    setPendingVisitID(visitID)
    setError('')
    setSuccess('')

    try {
      await updateVisitStatus(accessToken, visitID, 'cancelled')
      setSuccess('Запись отменена.')
      await loadVisits()
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Не удалось отменить запись')
    } finally {
      setPendingVisitID(null)
    }
  }

  async function openReschedule(visit: Visit) {
    if (!accessToken) return

    const initialDate = toClinicDateInputValue(visit.scheduled_at)
    setRescheduleVisitID(visit.visit_id)
    setRescheduleDate(initialDate)
    setSelectedSlot('')
    setIsSlotsLoading(true)
    setError('')

    try {
      const response = await getAvailableSlots(accessToken, visit.doctor_user_id, initialDate)
      setRescheduleSlots(response)
    } catch (slotError) {
      setRescheduleSlots([])
      setError(slotError instanceof Error ? slotError.message : 'Не удалось загрузить свободные окна')
    } finally {
      setIsSlotsLoading(false)
    }
  }

  async function loadRescheduleSlots(visit: Visit, date: string) {
    if (!accessToken) return

    setRescheduleDate(date)
    setSelectedSlot('')
    setIsSlotsLoading(true)
    setError('')

    try {
      const response = await getAvailableSlots(accessToken, visit.doctor_user_id, date)
      setRescheduleSlots(response)
    } catch (slotError) {
      setRescheduleSlots([])
      setError(slotError instanceof Error ? slotError.message : 'Не удалось загрузить свободные окна')
    } finally {
      setIsSlotsLoading(false)
    }
  }

  async function handleReschedule(visit: Visit) {
    if (!accessToken || !selectedSlot) return

    setPendingVisitID(visit.visit_id)
    setError('')
    setSuccess('')

    try {
      await rescheduleVisit(accessToken, visit.visit_id, selectedSlot)
      setSuccess('Запись перенесена на другое время.')
      setRescheduleVisitID(null)
      setSelectedSlot('')
      await loadVisits()
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Не удалось перенести запись')
    } finally {
      setPendingVisitID(null)
    }
  }

  return (
    <div className="w-full px-6 py-10">
      <AdminPageHeader
        title="Записи"
        description="Подтверждение, перенос и отмена записей пациентов к врачам."
      />

      {error ? (
        <AdminStatusMessage tone="error" className="mt-6">
          {error}
        </AdminStatusMessage>
      ) : null}

      {success ? (
        <AdminStatusMessage tone="success" className="mt-6">
          {success}
        </AdminStatusMessage>
      ) : null}

      <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              void loadVisits(statusFilter, event.target.value)
            }}
            placeholder="Поиск по пациенту, номеру, врачу или специальности"
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as '' | VisitStatus)}
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
          >
            <option value="">Все статусы</option>
            <option value="created">Создана</option>
            <option value="confirmed">Подтверждена</option>
            <option value="completed">Пройдена</option>
            <option value="cancelled">Отменена</option>
          </select>
        </div>

        <div className="mt-6 space-y-4">
          {isLoading ? (
            <div className="text-sm text-slate-500">Загрузка записей...</div>
          ) : filteredVisits.length ? (
            filteredVisits.map((visit) => {
              const isPending = pendingVisitID === visit.visit_id
              const isRescheduleOpen = rescheduleVisitID === visit.visit_id

              return (
                <article
                  key={visit.visit_id}
                  className="rounded-3xl border border-slate-200 px-5 py-5"
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-[20px] font-semibold text-slate-900">
                          {visit.patient_full_name}
                        </h2>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getVisitStatusTone(visit.status)}`}
                        >
                          {getVisitStatusLabel(visit.status)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">
                        Телефон пациента: {visit.patient_phone_number || '—'}
                      </p>
                      <p className="text-sm text-slate-600">
                        Врач: {visit.doctor_full_name} • {visit.specialty_name}
                      </p>
                      <p className="text-sm text-slate-600">
                        Время приёма: {formatVisitDateTime(visit.scheduled_at)}
                      </p>
                      <p className="text-sm text-slate-500">
                        Когда записался: {formatVisitDateTime(visit.created_at)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {visit.status === 'created' ? (
                        <button
                          type="button"
                          onClick={() => void handleConfirm(visit.visit_id)}
                          disabled={isPending}
                          className="rounded-2xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:bg-slate-400"
                        >
                          Подтвердить
                        </button>
                      ) : null}

                      {(visit.status === 'created' || visit.status === 'confirmed') ? (
                        <>
                          <button
                            type="button"
                            onClick={() => void openReschedule(visit)}
                            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            Перенести
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleCancel(visit.visit_id)}
                            disabled={isPending}
                            className="rounded-2xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                          >
                            Отменить
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>

                  {isRescheduleOpen ? (
                    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <input
                          type="date"
                          value={rescheduleDate}
                          onChange={(event) => void loadRescheduleSlots(visit, event.target.value)}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setRescheduleVisitID(null)
                            setSelectedSlot('')
                          }}
                          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
                        >
                          Закрыть
                        </button>
                      </div>

                      {isSlotsLoading ? (
                        <p className="mt-4 text-sm text-slate-500">Загрузка свободных окон...</p>
                      ) : rescheduleSlots.length ? (
                        <div className="mt-4 flex flex-wrap gap-3">
                          {rescheduleSlots.map((slot) => (
                            <button
                              key={slot.start_at}
                              type="button"
                              onClick={() => setSelectedSlot(slot.start_at)}
                              className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                                selectedSlot === slot.start_at
                                  ? 'border-sky-500 bg-sky-50 text-sky-700'
                                  : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-100'
                              }`}
                            >
                              {formatVisitTime(slot.start_at)}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-4 text-sm text-slate-500">
                          На выбранную дату свободных окон нет.
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() => void handleReschedule(visit)}
                        disabled={!selectedSlot || isPending}
                        className="mt-4 rounded-2xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:bg-slate-400"
                      >
                        Сохранить новую дату
                      </button>
                    </div>
                  ) : null}
                </article>
              )
            })
          ) : (
            <div className="text-sm text-slate-500">Подходящих записей не найдено.</div>
          )}
        </div>
      </section>
    </div>
  )
}

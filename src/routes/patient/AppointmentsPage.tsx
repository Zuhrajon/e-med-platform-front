import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import AvatarImage from '../../components/common/AvatarImage'
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
  toDateInputValue,
  updateVisitStatus,
  type AvailableSlot,
  type Visit,
} from '../../lib/visits'

function nextWorkday() {
  const date = new Date()

  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1)
  }

  return toDateInputValue(date)
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
}

export default function AppointmentsPage() {
  const { accessToken } = useUser()
  const location = useLocation()
  const [visits, setVisits] = useState<Visit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<string>(location.state?.success ?? '')
  const [pendingVisitID, setPendingVisitID] = useState<string | null>(null)
  const [rescheduleVisitID, setRescheduleVisitID] = useState<string | null>(null)
  const [rescheduleDate, setRescheduleDate] = useState(nextWorkday())
  const [rescheduleSlots, setRescheduleSlots] = useState<AvailableSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState('')
  const [isSlotsLoading, setIsSlotsLoading] = useState(false)

  async function loadVisits() {
    if (!accessToken) return

    setIsLoading(true)
    setError('')

    try {
      const response = await listVisits(accessToken, { sort: 'scheduled_at_asc' })
      setVisits(response.sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at)))
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить записи')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadVisits()
  }, [accessToken])

  const upcomingVisits = useMemo(
    () => visits.filter((item) => item.status === 'created' || item.status === 'confirmed'),
    [visits],
  )
  const completedVisits = useMemo(
    () => visits.filter((item) => item.status === 'completed'),
    [visits],
  )
  const cancelledVisits = useMemo(
    () => visits.filter((item) => item.status === 'cancelled'),
    [visits],
  )

  async function handleCancel(visitID: string) {
    if (!accessToken) return

    setPendingVisitID(visitID)
    setError('')
    setSuccess('')

    try {
      await updateVisitStatus(accessToken, visitID, 'cancelled')
      setSuccess('Запись отменена.')
      await loadVisits()
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : 'Не удалось отменить запись')
    } finally {
      setPendingVisitID(null)
    }
  }

  async function openReschedule(visit: Visit) {
    if (!accessToken) return

    setRescheduleVisitID(visit.visit_id)
    setSelectedSlot('')
    setRescheduleDate(toClinicDateInputValue(visit.scheduled_at))
    setIsSlotsLoading(true)
    setError('')

    try {
      const response = await getAvailableSlots(
        accessToken,
        visit.doctor_user_id,
        toClinicDateInputValue(visit.scheduled_at),
      )
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
    } catch (rescheduleError) {
      setError(
        rescheduleError instanceof Error ? rescheduleError.message : 'Не удалось перенести запись',
      )
    } finally {
      setPendingVisitID(null)
    }
  }

  function renderVisitCard(visit: Visit) {
    const isPending = pendingVisitID === visit.visit_id
    const isRescheduleOpen = rescheduleVisitID === visit.visit_id
    const doctorPhotoUrl = visit.doctor_avatar_url || ''
    const doctorInitials = getInitials(visit.doctor_full_name)

    return (
      <article
        key={visit.visit_id}
        className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 gap-4">
            {doctorPhotoUrl ? (
              <AvatarImage
                src={doctorPhotoUrl}
                alt={visit.doctor_full_name}
                className="h-16 w-16 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl font-semibold text-slate-900">
                {doctorInitials}
              </div>
            )}

            <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-[22px] font-semibold text-slate-900">{visit.doctor_full_name}</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                {visit.specialty_name}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${getVisitStatusTone(visit.status)}`}
              >
                {getVisitStatusLabel(visit.status)}
              </span>
            </div>
            <p className="mt-3 text-[16px] text-slate-600">
              Дата визита: {formatVisitDateTime(visit.scheduled_at)}
            </p>
            <p className="mt-1 text-[15px] text-slate-500">
              Запись создана: {formatVisitDateTime(visit.created_at)}
            </p>
            </div>
          </div>

          {(visit.status === 'created' || visit.status === 'confirmed') && (
            <div className="flex flex-wrap gap-3">
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
            </div>
          )}
        </div>

        {visit.status === 'created' ? (
          <div className="mt-5 rounded-2xl bg-amber-50 px-4 py-4 text-sm text-amber-800">
            Запись создана и ожидает подтверждения регистратурой.
          </div>
        ) : null}

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
              <p className="mt-4 text-sm text-slate-500">На выбранную дату свободных окон нет.</p>
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
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] px-8 py-10">
      <h1 className="text-[32px] font-semibold text-slate-900">Мои записи</h1>
      <p className="mt-3 text-[18px] text-gray-500">Управляйте своими визитами к врачам</p>

      {success ? (
        <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">
          {success}
        </div>
      ) : null}

      {error ? (
        <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="mt-10 rounded-2xl bg-white p-6 text-lg text-slate-600 shadow-sm">
          Загрузка записей...
        </div>
      ) : (
        <div className="mt-10 space-y-14">
          <section>
            <h2 className="text-[24px] font-semibold text-slate-900">Актуальные записи</h2>
            <div className="mt-6 space-y-5">
              {upcomingVisits.length ? (
                upcomingVisits.map(renderVisitCard)
              ) : (
                <div className="rounded-2xl bg-white p-6 text-lg text-slate-600 shadow-sm">
                  Актуальных записей нет.
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-[24px] font-semibold text-slate-900">Завершённые записи</h2>
            <div className="mt-6 space-y-5">
              {completedVisits.length ? (
                completedVisits.map(renderVisitCard)
              ) : (
                <div className="rounded-2xl bg-white p-6 text-lg text-slate-600 shadow-sm">
                  Завершённых записей пока нет.
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-[24px] font-semibold text-slate-900">Отменённые записи</h2>
            <div className="mt-6 space-y-5">
              {cancelledVisits.length ? (
                cancelledVisits.map(renderVisitCard)
              ) : (
                <div className="rounded-2xl bg-white p-6 text-lg text-slate-600 shadow-sm">
                  Отменённых записей пока нет.
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

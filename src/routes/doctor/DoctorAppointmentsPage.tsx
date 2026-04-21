import { useEffect, useMemo, useState } from 'react'
import { useUser } from '../../context/UserContext'
import {
  formatVisitDateTime,
  listVisits,
  toDateInputValue,
  updateVisitStatus,
  type Visit,
} from '../../lib/visits'

export default function DoctorAppointmentsPage() {
  const { accessToken } = useUser()
  const [selectedDate, setSelectedDate] = useState(() => toDateInputValue(new Date()))
  const [visits, setVisits] = useState<Visit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [pendingVisitID, setPendingVisitID] = useState<string | null>(null)

  async function loadVisits(targetDate = selectedDate) {
    if (!accessToken) return

    setIsLoading(true)
    setError('')

    try {
      const response = await listVisits(accessToken, { date: targetDate })
      setVisits(response.sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at)))
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить приёмы')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadVisits()
  }, [accessToken, selectedDate])

  const visibleVisits = useMemo(
    () => visits.filter((item) => item.status === 'confirmed' || item.status === 'completed'),
    [visits],
  )

  const total = visibleVisits.length
  const completed = visibleVisits.filter((item) => item.status === 'completed').length
  const waiting = visibleVisits.filter((item) => item.status === 'confirmed').length

  async function handleComplete(visitID: string) {
    if (!accessToken) return

    setPendingVisitID(visitID)
    setError('')
    setSuccess('')

    try {
      await updateVisitStatus(accessToken, visitID, 'completed')
      setSuccess('Приём отмечен как завершённый.')
      await loadVisits()
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Не удалось завершить приём')
    } finally {
      setPendingVisitID(null)
    }
  }

  return (
    <div className="w-full bg-[#f7f7f8] px-6 py-10">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-[28px] font-semibold text-slate-900">Мои приёмы</h1>
          <p className="mt-3 text-[18px] text-gray-500">
            Подтверждённые записи, которые уже передала регистратура
          </p>
        </div>

        <input
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-500"
        />
      </header>

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

      <section className="mt-10 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-gray-200 bg-white px-8 py-8 shadow-sm">
          <h2 className="text-[24px] font-semibold text-slate-900">Приёмы на день</h2>
          <div className="mt-8 space-y-5">
            {isLoading ? (
              <div className="text-[18px] text-slate-500">Загрузка приёмов...</div>
            ) : visibleVisits.length ? (
              visibleVisits.map((visit) => {
                const isPending = pendingVisitID === visit.visit_id

                return (
                  <article
                    key={visit.visit_id}
                    className="rounded-3xl border border-gray-200 px-6 py-6"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <h3 className="text-[22px] font-semibold text-slate-900">
                          {visit.patient_full_name}
                        </h3>
                        <p className="mt-2 text-[16px] text-slate-600">
                          {visit.specialty_name} • {formatVisitDateTime(visit.scheduled_at)}
                        </p>
                        <p className="mt-1 text-[15px] text-slate-500">
                          Телефон: {visit.patient_phone_number || '—'}
                        </p>
                      </div>

                      {visit.status === 'confirmed' ? (
                        <button
                          type="button"
                          onClick={() => void handleComplete(visit.visit_id)}
                          disabled={isPending}
                          className="rounded-2xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:bg-slate-400"
                        >
                          Завершить приём
                        </button>
                      ) : (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                          Завершён
                        </span>
                      )}
                    </div>
                  </article>
                )
              })
            ) : (
              <div className="rounded-3xl border border-dashed border-gray-300 px-6 py-10 text-center text-[18px] text-gray-500">
                На выбранную дату подтверждённых приёмов нет.
              </div>
            )}
          </div>
        </div>

        <section className="rounded-3xl border border-gray-200 bg-white px-8 py-8 shadow-sm">
          <h2 className="text-[24px] font-semibold text-slate-900">Статистика за день</h2>
          <div className="mt-8 space-y-8">
            <div>
              <p className="text-[18px] text-gray-500">Всего приёмов</p>
              <p className="mt-3 text-[22px] font-semibold text-slate-900">{total}</p>
            </div>
            <div>
              <p className="text-[18px] text-gray-500">Завершено</p>
              <p className="mt-3 text-[22px] font-semibold text-slate-900">{completed}</p>
            </div>
            <div>
              <p className="text-[18px] text-gray-500">Ожидают</p>
              <p className="mt-3 text-[22px] font-semibold text-slate-900">{waiting}</p>
            </div>
          </div>
        </section>
      </section>
    </div>
  )
}

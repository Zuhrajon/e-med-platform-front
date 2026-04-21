import { CalendarDays, Clock3, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { formatVisitTime, listVisits, toDateInputValue, type Visit } from '../../lib/visits'

function getFormattedToday() {
  return new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())
}

export default function DoctorHomePage() {
  const { user, accessToken } = useUser()
  const [visits, setVisits] = useState<Visit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!accessToken) return

    const today = toDateInputValue(new Date())

    const loadVisits = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await listVisits(accessToken, { date: today })
        setVisits(response.filter((item) => item.status === 'confirmed' || item.status === 'completed'))
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить приёмы')
      } finally {
        setIsLoading(false)
      }
    }

    void loadVisits()
  }, [accessToken])

  const stats = useMemo(
    () => ({
      total: visits.length,
      waiting: visits.filter((item) => item.status === 'confirmed').length,
      completed: visits.filter((item) => item.status === 'completed').length,
    }),
    [visits],
  )

  const statCards = [
    {
      title: 'Приёмов сегодня',
      value: stats.total,
      icon: CalendarDays,
      tone: 'bg-sky-100 text-sky-600',
    },
    {
      title: 'Ожидают приёма',
      value: stats.waiting,
      icon: Clock3,
      tone: 'bg-amber-100 text-amber-500',
    },
    {
      title: 'Завершено',
      value: stats.completed,
      icon: Users,
      tone: 'bg-emerald-100 text-emerald-600',
    },
  ]

  return (
    <div className="w-full bg-[#f7f7f8] px-6 py-10">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-[28px] font-semibold text-slate-900">
            Добро пожаловать, {user.firstName || 'доктор'}!
          </h1>
          <p className="mt-3 text-[18px] capitalize text-gray-500">Сегодня {getFormattedToday()}</p>
        </div>

        <Link
          to="/doctor/appointments"
          className="rounded-2xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
        >
          Открыть все приёмы
        </Link>
      </header>

      {error ? (
        <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          {error}
        </div>
      ) : null}

      <section className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon

          return (
            <div
              key={card.title}
              className="flex min-h-[160px] items-center justify-between rounded-3xl border border-gray-200 bg-white px-8 py-8 shadow-sm"
            >
              <div>
                <p className="text-[18px] text-gray-500">{card.title}</p>
                <p className="mt-4 text-[22px] font-semibold text-slate-900">
                  {isLoading ? '...' : card.value}
                </p>
              </div>

              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${card.tone}`}>
                <Icon className="h-7 w-7" />
              </div>
            </div>
          )
        })}
      </section>

      <section className="mt-10 rounded-3xl border border-gray-200 bg-white px-8 py-8 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-[24px] font-semibold text-slate-900">Сегодняшние пациенты</h2>
          <span className="text-sm text-slate-500">Только подтверждённые и завершённые записи</span>
        </div>

        <div className="mt-8 space-y-4">
          {isLoading ? (
            <div className="text-[18px] text-slate-500">Загрузка приёмов...</div>
          ) : visits.length ? (
            visits.map((visit) => (
              <article
                key={visit.visit_id}
                className="flex flex-col gap-4 rounded-3xl border border-gray-200 px-6 py-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="text-[20px] font-semibold text-slate-900">
                    {visit.patient_full_name}
                  </h3>
                  <p className="mt-1 text-[15px] text-slate-500">{visit.patient_phone_number || '—'}</p>
                </div>
                <div className="text-sm text-slate-600">
                  {formatVisitTime(visit.scheduled_at)}
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-300 px-6 py-10 text-center text-[18px] text-gray-500">
              На сегодня подтверждённых приёмов нет.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

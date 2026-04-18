import { Activity, CalendarDays, Stethoscope, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  checkWorkingDay,
  listDoctors,
  listHolidays,
  listSpecialties,
  type Holiday,
  type Specialty,
} from '../../lib/admin'
import { useUser } from '../../context/UserContext'
import { formatRuDate } from './admin-utils'

type DashboardState = {
  doctors: number
  specialties: Specialty[]
  holidays: Holiday[]
  todayStatus: {
    is_working: boolean
    is_holiday: boolean
    holiday_name: string
  } | null
}

function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function AdminHomePage() {
  const { accessToken, user } = useUser()
  const [state, setState] = useState<DashboardState>({
    doctors: 0,
    specialties: [],
    holidays: [],
    todayStatus: null,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!accessToken) return

    const token = accessToken
    let isMounted = true
    const currentYear = new Date().getFullYear()
    const today = getTodayDate()

    async function loadDashboard() {
      setIsLoading(true)
      setError(null)

      try {
        const [doctors, specialties, holidays, todayStatus] = await Promise.all([
          listDoctors(token),
          listSpecialties(token),
          listHolidays(token, currentYear),
          checkWorkingDay(token, today),
        ])

        if (!isMounted) return

        setState({
          doctors: doctors.length,
          specialties,
          holidays,
          todayStatus,
        })
      } catch (err) {
        if (!isMounted) return

        setError(err instanceof Error ? err.message : 'Не удалось загрузить панель')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadDashboard()

    return () => {
      isMounted = false
    }
  }, [accessToken])

  const activeSpecialties = useMemo(
    () => state.specialties.filter((item) => item.is_active).length,
    [state.specialties],
  )

  const upcomingHolidays = useMemo(
    () => [...state.holidays].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5),
    [state.holidays],
  )

  const statCards = [
    {
      title: 'Врачи в системе',
      value: state.doctors,
      icon: Users,
      tone: 'bg-sky-50 text-sky-700',
    },
    {
      title: 'Активные специальности',
      value: activeSpecialties,
      icon: Stethoscope,
      tone: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Праздничные дни',
      value: state.holidays.length,
      icon: CalendarDays,
      tone: 'bg-amber-50 text-amber-700',
    },
    {
      title: 'Статус сегодняшнего дня',
      value: state.todayStatus?.is_working ? 'Рабочий' : 'Нерабочий',
      icon: Activity,
      tone: 'bg-rose-50 text-rose-700',
    },
  ]

  return (
    <div className="w-full px-6 py-10">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-[25px] font-semibold text-slate-900">
            Панель администратора
          </h1>
          <p className="mt-2 text-[17px] text-slate-500">
            {user.firstName || 'Администратор'}, здесь собрана сводка по персоналу,
            специальностям и календарю клиники.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
          Сегодня: <span className="font-semibold text-slate-900">{formatRuDate(getTodayDate())}</span>
        </div>
      </header>

      {error ? (
        <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          {error}
        </div>
      ) : null}

      <section className="mt-8 grid gap-5 lg:grid-cols-2 2xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon

          return (
            <article
              key={card.title}
              className="rounded-[28px] border border-slate-200 bg-white px-6 py-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">{card.title}</p>
                  <p className="mt-4 text-3xl font-semibold text-slate-900">
                    {isLoading ? '...' : card.value}
                  </p>
                </div>

                <div className={`rounded-2xl p-3 ${card.tone}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </article>
          )
        })}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-[21px] font-semibold text-slate-900">
                Ближайшие праздничные дни
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Источник: `GET /api/v1/calendar/holidays`
              </p>
            </div>

            <Link
              to="/admin/appointments"
              className="rounded-2xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800"
            >
              Открыть календарь
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {isLoading ? (
              <p className="text-sm text-slate-500">Загрузка календаря...</p>
            ) : upcomingHolidays.length ? (
              upcomingHolidays.map((holiday) => (
                <div
                  key={holiday.id}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">{holiday.name}</p>
                    <p className="text-sm text-slate-500">{formatRuDate(holiday.date)}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                    {holiday.date}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Праздничные дни пока не заведены.</p>
            )}
          </div>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-[21px] font-semibold text-slate-900">Быстрые действия</h2>
          <div className="mt-5 space-y-3">
            <Link
              to="/admin/users"
              className="block rounded-2xl bg-slate-50 px-4 py-4 transition hover:bg-slate-100"
            >
              <p className="font-medium text-slate-900">Добавить врача</p>
              <p className="mt-1 text-sm text-slate-500">
                Создание staff-пользователя через multipart endpoint.
              </p>
            </Link>

            <Link
              to="/admin/settings"
              className="block rounded-2xl bg-slate-50 px-4 py-4 transition hover:bg-slate-100"
            >
              <p className="font-medium text-slate-900">Управлять специальностями</p>
              <p className="mt-1 text-sm text-slate-500">
                Создание, редактирование и деактивация специализаций.
              </p>
            </Link>

            <Link
              to="/admin/fake-data"
              className="block rounded-2xl bg-slate-50 px-4 py-4 transition hover:bg-slate-100"
            >
              <p className="font-medium text-slate-900">Тестовые данные</p>
              <p className="mt-1 text-sm text-slate-500">
                Заполнение и очистка demo-набора данных через новые backend-ручки.
              </p>
            </Link>

            <div className="rounded-2xl border border-slate-200 px-4 py-4">
              <p className="font-medium text-slate-900">Статус текущего дня</p>
              <p className="mt-1 text-sm text-slate-500">
                {isLoading
                  ? 'Проверка...'
                  : state.todayStatus?.is_holiday
                    ? `Сегодня праздник: ${state.todayStatus.holiday_name}`
                    : state.todayStatus?.is_working
                      ? 'Сегодня рабочий день.'
                      : 'Сегодня нерабочий день.'}
              </p>
            </div>
          </div>
        </article>
      </section>
    </div>
  )
}

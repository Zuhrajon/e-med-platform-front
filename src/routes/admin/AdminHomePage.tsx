import { Activity, CalendarDays, Stethoscope, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AdminQuickActionsCard from '../../components/admin/AdminQuickActionsCard'
import AdminStatsGrid from '../../components/admin/AdminStatsGrid'
import AdminStatusMessage from '../../components/admin/AdminStatusMessage'
import AdminUpcomingHolidaysCard from '../../components/admin/AdminUpcomingHolidaysCard'
import { useUser } from '../../context/UserContext'
import {
  checkWorkingDay,
  getAdminDashboard,
  listDoctors,
  listHolidays,
  listSpecialties,
  type AdminDashboardStats,
  type Holiday,
  type Specialty,
} from '../../lib/admin'
import { formatRuDate } from './admin-utils'

type DashboardState = {
  doctors: number
  specialties: Specialty[]
  holidays: Holiday[]
  stats: AdminDashboardStats | null
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
    stats: null,
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
        const [dashboard, doctors, specialties, holidays, todayStatus] = await Promise.all([
          getAdminDashboard(token),
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
          stats: dashboard,
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
      title: 'Пользователей всего',
      value: state.stats?.users.total ?? state.doctors,
      icon: Users,
      tone: 'bg-sky-50 text-sky-700',
    },
    {
      title: 'Активные сотрудники',
      value: state.stats?.users.active_staff ?? state.doctors,
      icon: Stethoscope,
      tone: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Записей всего',
      value: state.stats?.visits.total ?? state.holidays.length,
      icon: CalendarDays,
      tone: 'bg-amber-50 text-amber-700',
    },
    {
      title: 'Готовых анализов',
      value: state.stats?.laboratory.completed ?? (state.todayStatus?.is_working ? 'Рабочий' : 'Нерабочий'),
      icon: Activity,
      tone: 'bg-rose-50 text-rose-700',
    },
    {
      title: 'Активные специальности',
      value: state.stats?.catalogs.specialties ?? activeSpecialties,
      icon: Stethoscope,
      tone: 'bg-violet-50 text-violet-700',
    },
    {
      title: 'Неподтверждённые пациенты',
      value: state.stats?.users.unverified_patients ?? 0,
      icon: Users,
      tone: 'bg-slate-100 text-slate-700',
    },
  ]

  return (
    <div className="w-full px-6 py-10">
      <AdminPageHeader
        title="Панель администратора"
        description={`${user.firstName || 'Администратор'}, здесь собрана сводка по персоналу, специальностям и календарю клиники.`}
        aside={
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
            Сегодня:{' '}
            <span className="font-semibold text-slate-900">{formatRuDate(getTodayDate())}</span>
          </div>
        }
      />

      {error ? (
        <AdminStatusMessage tone="error" className="mt-8">
          {error}
        </AdminStatusMessage>
      ) : null}

      <AdminStatsGrid cards={statCards} isLoading={isLoading} />

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminUpcomingHolidaysCard holidays={upcomingHolidays} isLoading={isLoading} />
        <AdminQuickActionsCard isLoading={isLoading} todayStatus={state.todayStatus} />
      </section>
    </div>
  )
}

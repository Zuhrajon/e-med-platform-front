import { CalendarDays, Clock3, Users, TrendingUp } from 'lucide-react'
import { useUser } from '../../context/UserContext'
import TodayAppointmentsSection from '../../components/doctor/TodayAppointmentsSection'
import LatestProtocolsSection from '../../components/doctor/LatestProtocolsSection'
import type {
  DoctorDashboardStats,
  DoctorProtocol,
  DoctorTodayAppointment,
} from '../../type/doctor'

function getFormattedToday() {
  const today = new Date()

  return new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(today)
}

export default function DoctorHomePage() {
  const { user } = useUser()

  // ВРЕМЕННЫЕ ДАННЫЕ
  // Потом здесь можно сделать запросы к бэкенду:
  // useEffect(() => { fetchDoctorDashboard() }, [])

  const stats: DoctorDashboardStats = {
    appointmentsToday: 3,
    waitingPatients: 1,
    patientsThisMonth: 87,
    rating: 4.8,
  }

  const todayAppointments: DoctorTodayAppointment[] = [
    {
      id: '1',
      patientId: 'p1',
      patientName: 'Иванова Мария Петровна',
      complaint: 'Профилактический осмотр',
      time: '10:00',
    },
    {
      id: '2',
      patientId: 'p2',
      patientName: 'Петров Алексей Сергеевич',
      complaint: 'Консультация',
      time: '11:30',
    },
    {
      id: '3',
      patientId: 'p3',
      patientName: 'Сидорова Елена Викторовна',
      complaint: 'Повторный приём',
      time: '14:00',
    },
  ]

  const latestProtocols: DoctorProtocol[] = [
    {
      id: 'protocol-1',
      patientId: 'p10',
      patientName: 'Новикова А.С.',
      diagnosis: 'ОРВИ',
      createdAt: '28 марта 2026',
    },
    {
      id: 'protocol-2',
      patientId: 'p11',
      patientName: 'Смирнов Д.В.',
      diagnosis: 'Консультация',
      createdAt: '25 марта 2026',
    },
  ]

  const statCards = [
    {
      title: 'Приёмов сегодня',
      value: stats.appointmentsToday,
      icon: CalendarDays,
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-600',
    },
    {
      title: 'Ожидают приёма',
      value: stats.waitingPatients,
      icon: Clock3,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-500',
    },
    {
      title: 'Пациентов за месяц',
      value: stats.patientsThisMonth,
      icon: Users,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Рейтинг',
      value: stats.rating,
      icon: TrendingUp,
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-500',
    },
  ]

  return (
    <div className="w-full bg-[#f7f7f8] px-6 py-10">
      <header>
        <h1 className="text-[28px] font-semibold text-slate-900">
          Добро пожаловать, {user.firstName}!
        </h1>
        <p className="mt-3 text-[18px] capitalize text-gray-500">
          Сегодня {getFormattedToday()}
        </p>
      </header>

      <section className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {statCards.map((card) => {
          const Icon = card.icon

          return (
            <div
              key={card.title}
              className="flex min-h-[180px] items-center justify-between rounded-3xl border border-gray-200 bg-white px-9 py-8 shadow-sm"
            >
              <div>
                <p className="text-[18px] text-gray-500">{card.title}</p>
                <p className="mt-4 text-[22px] font-semibold text-slate-900">
                  {card.value}
                </p>
              </div>

              <div
                className={`flex h-18 w-18 items-center justify-center rounded-2xl ${card.iconBg}`}
              >
                <Icon className={`h-8 w-8 ${card.iconColor}`} />
              </div>
            </div>
          )
        })}
      </section>

      <div className="mt-10">
        <TodayAppointmentsSection appointments={todayAppointments} />
      </div>

      <div className="mt-10">
        <LatestProtocolsSection protocols={latestProtocols} />
      </div>
    </div>
  )
}
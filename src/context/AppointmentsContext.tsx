import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type AppointmentStatus =
  | 'Подтверждена'
  | 'Создана'
  | 'Завершена'
  | 'Отменена'

export type Appointment = {
  id: string
  doctorId?: string
  doctorName: string
  specialty: string
  date: string
  time: string
  status: AppointmentStatus
  reason: string
}

type AppointmentsContextType = {
  upcomingAppointments: Appointment[]
  completedAppointments: Appointment[]
  cancelledAppointments: Appointment[]
  addAppointment: (appointment: Appointment) => void
  cancelAppointment: (id: string) => void
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined)

const defaultUpcomingAppointments: Appointment[] = [
  {
    id: '1',
    doctorId: '1',
    doctorName: 'Анна Иванова',
    specialty: 'Терапевт',
    date: '10 апреля',
    time: '10:00',
    status: 'Подтверждена',
    reason: 'Профилактический осмотр',
  },
  {
    id: '2',
    doctorId: '2',
    doctorName: 'Дмитрий Петров',
    specialty: 'Кардиолог',
    date: '15 апреля',
    time: '14:30',
    status: 'Создана',
    reason: 'Консультация кардиолога',
  },
]

const defaultCompletedAppointments: Appointment[] = [
  {
    id: '3',
    doctorId: '3',
    doctorName: 'Елена Сидорова',
    specialty: 'Невролог',
    date: '28 марта',
    time: '11:00',
    status: 'Завершена',
    reason: 'Головные боли',
  },
]

const defaultCancelledAppointments: Appointment[] = []

type AppointmentsStorage = {
  upcomingAppointments: Appointment[]
  completedAppointments: Appointment[]
  cancelledAppointments: Appointment[]
}

const STORAGE_KEY = 'appointments-data'

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([])
  const [completedAppointments] = useState<Appointment[]>(defaultCompletedAppointments)
  const [cancelledAppointments, setCancelledAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved) {
      const parsed: AppointmentsStorage = JSON.parse(saved)
      setUpcomingAppointments(parsed.upcomingAppointments || [])
      setCancelledAppointments(parsed.cancelledAppointments || [])
    } else {
      setUpcomingAppointments(defaultUpcomingAppointments)
      setCancelledAppointments(defaultCancelledAppointments)

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          upcomingAppointments: defaultUpcomingAppointments,
          completedAppointments: defaultCompletedAppointments,
          cancelledAppointments: defaultCancelledAppointments,
        }),
      )
    }
  }, [])

  const saveAll = (
    nextUpcoming: Appointment[],
    nextCancelled: Appointment[],
    nextCompleted: Appointment[] = completedAppointments,
  ) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        upcomingAppointments: nextUpcoming,
        completedAppointments: nextCompleted,
        cancelledAppointments: nextCancelled,
      }),
    )
  }

  const addAppointment = (appointment: Appointment) => {
    const nextUpcoming = [appointment, ...upcomingAppointments]
    setUpcomingAppointments(nextUpcoming)
    saveAll(nextUpcoming, cancelledAppointments)
  }

  const cancelAppointment = (id: string) => {
    const appointmentToCancel = upcomingAppointments.find((item) => item.id === id)
    if (!appointmentToCancel) return

    const nextUpcoming = upcomingAppointments.filter((item) => item.id !== id)
    const nextCancelled = [
      {
        ...appointmentToCancel,
        status: 'Отменена' as const,
      },
      ...cancelledAppointments,
    ]

    setUpcomingAppointments(nextUpcoming)
    setCancelledAppointments(nextCancelled)
    saveAll(nextUpcoming, nextCancelled)
  }

  return (
    <AppointmentsContext.Provider
      value={{
        upcomingAppointments,
        completedAppointments,
        cancelledAppointments,
        addAppointment,
        cancelAppointment,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  )
}

export function useAppointments() {
  const context = useContext(AppointmentsContext)

  if (!context) {
    throw new Error('useAppointments must be used inside AppointmentsProvider')
  }

  return context
}
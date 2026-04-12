import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type AppointmentStatus =
  | 'Подтверждена'
  | 'Создана'
  | 'Завершена'
  | 'Отменена'

export type AppointmentProtocol = {
  complaint: string
  diagnosis: string
  treatment: string
  recommendations: string
  createdAt: string
}

export type AppointmentPrescription = {
  text: string
  createdAt: string
}

export type AppointmentFile = {
  id: string
  name: string
  url?: string
}

export type Appointment = {
  id: string
  doctorId?: string
  doctorName: string
  specialty: string
  date: string
  time: string
  status: AppointmentStatus
  reason: string

  patientId?: string
  patientName?: string
  patientCode?: string

  protocol?: AppointmentProtocol | null
  prescription?: AppointmentPrescription | null
  files?: AppointmentFile[]
}

type AppointmentsContextType = {
  upcomingAppointments: Appointment[]
  completedAppointments: Appointment[]
  cancelledAppointments: Appointment[]
  addAppointment: (appointment: Appointment) => void
  cancelAppointment: (id: string) => void

  saveProtocol: (
    id: string,
    payload: Omit<AppointmentProtocol, 'createdAt'>,
  ) => void

  savePrescription: (
    id: string,
    payload: Omit<AppointmentPrescription, 'createdAt'>,
  ) => void

  uploadFiles: (id: string, files: AppointmentFile[]) => void

  getDoctorAppointmentsByDate: (date: string) => Appointment[]
  getDoctorDayStats: (date: string) => {
    total: number
    completed: number
    waiting: number
  }
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined)

const defaultUpcomingAppointments: Appointment[] = [
  {
    id: '1',
    doctorId: '1',
    doctorName: 'Анна Иванова',
    specialty: 'Терапевт',
    date: '13 апреля',
    time: '10:00',
    status: 'Подтверждена',
    reason: 'Профилактический осмотр',
    patientId: 'p1',
    patientName: 'Иванова Мария Петровна',
    patientCode: 'P001',
    protocol: null,
    prescription: null,
    files: [],
  },
  {
    id: '2',
    doctorId: '1',
    doctorName: 'Анна Иванова',
    specialty: 'Терапевт',
    date: '13 апреля',
    time: '11:30',
    status: 'Подтверждена',
    reason: 'Консультация',
    patientId: 'p2',
    patientName: 'Петров Алексей Сергеевич',
    patientCode: 'P002',
    protocol: null,
    prescription: null,
    files: [],
  },
  {
    id: '3',
    doctorId: '1',
    doctorName: 'Анна Иванова',
    specialty: 'Терапевт',
    date: '13 апреля',
    time: '14:00',
    status: 'Создана',
    reason: 'Повторный приём',
    patientId: 'p3',
    patientName: 'Сидорова Елена Викторовна',
    patientCode: 'P003',
    protocol: null,
    prescription: null,
    files: [],
  },
]

const defaultCompletedAppointments: Appointment[] = []
const defaultCancelledAppointments: Appointment[] = []

type AppointmentsStorage = {
  upcomingAppointments: Appointment[]
  completedAppointments: Appointment[]
  cancelledAppointments: Appointment[]
}

const STORAGE_KEY = 'appointments-data'

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([])
  const [completedAppointments, setCompletedAppointments] =
    useState<Appointment[]>(defaultCompletedAppointments)
  const [cancelledAppointments, setCancelledAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved) {
      const parsed: AppointmentsStorage = JSON.parse(saved)
      setUpcomingAppointments(parsed.upcomingAppointments || [])
      setCompletedAppointments(parsed.completedAppointments || [])
      setCancelledAppointments(parsed.cancelledAppointments || [])
    } else {
      setUpcomingAppointments(defaultUpcomingAppointments)
      setCompletedAppointments(defaultCompletedAppointments)
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
    nextCompleted: Appointment[],
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
    saveAll(nextUpcoming, cancelledAppointments, completedAppointments)
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
    saveAll(nextUpcoming, nextCancelled, completedAppointments)
  }

  const saveProtocol = (
    id: string,
    payload: Omit<AppointmentProtocol, 'createdAt'>,
  ) => {
    const nextUpcoming = upcomingAppointments.map((item) =>
      item.id === id
        ? {
            ...item,
            protocol: {
              ...payload,
              createdAt: new Date().toISOString(),
            },
          }
        : item,
    )

    setUpcomingAppointments(nextUpcoming)
    saveAll(nextUpcoming, cancelledAppointments, completedAppointments)
  }

  const savePrescription = (
    id: string,
    payload: Omit<AppointmentPrescription, 'createdAt'>,
  ) => {
    const nextUpcoming = upcomingAppointments.map((item) =>
      item.id === id
        ? {
            ...item,
            prescription: {
              ...payload,
              createdAt: new Date().toISOString(),
            },
          }
        : item,
    )

    setUpcomingAppointments(nextUpcoming)
    saveAll(nextUpcoming, cancelledAppointments, completedAppointments)
  }

  const uploadFiles = (id: string, files: AppointmentFile[]) => {
    const nextUpcoming = upcomingAppointments.map((item) =>
      item.id === id
        ? {
            ...item,
            files: [...(item.files || []), ...files],
          }
        : item,
    )

    setUpcomingAppointments(nextUpcoming)
    saveAll(nextUpcoming, cancelledAppointments, completedAppointments)
  }

  const getDoctorAppointmentsByDate = (date: string) => {
    return upcomingAppointments
      .filter((item) => item.date === date)
      .sort((a, b) => a.time.localeCompare(b.time))
  }

  const getDoctorDayStats = (date: string) => {
    const items = upcomingAppointments.filter((item) => item.date === date)

    return {
      total: items.length,
      completed: items.filter((item) => !!item.protocol).length,
      waiting: items.filter((item) => !item.protocol).length,
    }
  }

  return (
    <AppointmentsContext.Provider
      value={{
        upcomingAppointments,
        completedAppointments,
        cancelledAppointments,
        addAppointment,
        cancelAppointment,
        saveProtocol,
        savePrescription,
        uploadFiles,
        getDoctorAppointmentsByDate,
        getDoctorDayStats,
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
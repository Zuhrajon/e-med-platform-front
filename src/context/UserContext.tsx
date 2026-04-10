import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type UserRole = 'patient' | 'doctor' | 'admin'

export type Appointment = {
  id: string
  doctorName: string
  specialty: string
  date: string
  time: string
  status: 'Подтверждена' | 'Отменена' | 'Создана'
  reason: string
}


export type UserProfile = {
  firstName: string
  lastName: string
  middleName: string
  email: string
  phone: string
  gender: string
  birthDate: string
  address: string
  documentNumber: string
  avatar: string | null
  role: UserRole
  appointments: Appointment[]
}

type UserContextType = {
  user: UserProfile
  updateUser: (data: Partial<UserProfile>) => void
  setUser: (data: UserProfile) => void
  addAppointment: (appointment: Appointment) => void
  cancelAppointment: (id: string) => void
}

export const defaultUser: UserProfile = {
  firstName: '',
  lastName: '',
  middleName: '',
  email: '',
  phone: '',
  gender: '',
  birthDate: '',
  address: '',
  documentNumber: '',
  role: 'patient',
  avatar: null,
  appointments: [],
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile>(defaultUser)

  useEffect(() => {
  const savedUser = localStorage.getItem('user-profile')
  if (savedUser) {
    const parsedUser = JSON.parse(savedUser)
    setUserState({
      ...defaultUser,
      ...parsedUser,
      role: parsedUser.role ?? 'patient',
    })
  }
}, [])

  const saveUser = (data: UserProfile) => {
    setUserState(data)
    localStorage.setItem('user-profile', JSON.stringify(data))
  }

  const setUser = (data: UserProfile) => {
    saveUser(data)
  }

  const updateUser = (data: Partial<UserProfile>) => {
    const updated = { ...user, ...data }
    saveUser(updated)
  }

  const addAppointment = (appointment: Appointment) => {
    const updated = {
      ...user,
      appointments: [appointment, ...user.appointments],
    }
    saveUser(updated)
  }

  const cancelAppointment = (id: string) => {
    const updated = {
      ...user,
      appointments: user.appointments.map((item) =>
        item.id === id ? { ...item, status: 'Отменена' } : item
      ),
    }
    saveUser(updated)
  }

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        setUser,
        addAppointment,
        cancelAppointment,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used inside UserProvider')
  }
  return context
}
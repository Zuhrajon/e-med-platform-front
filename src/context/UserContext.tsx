// 

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

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
  role: 'patient' | 'doctor' | 'admin'

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

  // doctor fields
  position: string
  officeNumber: string
  department: string
  specialization: string
  qualification: string
  description: string

  // security
  password: string

  appointments: Appointment[]
}

type UserContextType = {
  user: UserProfile
  updateUser: (data: Partial<UserProfile>) => void
  setUser: (data: UserProfile) => void
}

const defaultUser: UserProfile = {
  role: 'admin',

  firstName: 'Анна',
  lastName: 'Иванова',
  middleName: 'Сергеевна',
  email: 'doctor@example.com',
  phone: '+7 (999) 123-45-67',
  gender: 'Женский',
  birthDate: '1990-04-12',
  address: 'г. Душанбе',
  documentNumber: 'A1234567',
  avatar: null,

  position: 'Врач-терапевт',
  officeNumber: 'Кабинет 204',
  department: 'Терапевтическое отделение',
  specialization: 'Терапия',
  qualification: 'Высшая категория',
  description: 'Врач с опытом работы более 10 лет. Специализируется на профилактике и лечении заболеваний внутренних органов.',

  password: '12345678',

  appointments: [],
}

const STORAGE_KEY = 'user-profile'

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile>(defaultUser)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setUserState(JSON.parse(saved))
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUser))
    }
  }, [])

  const persistUser = (nextUser: UserProfile) => {
    setUserState(nextUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
  }

  const updateUser = (data: Partial<UserProfile>) => {
    const nextUser = { ...user, ...data }
    persistUser(nextUser)
  }

  const setUser = (data: UserProfile) => {
    persistUser(data)
  }

  return (
    <UserContext.Provider value={{ user, updateUser, setUser }}>
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
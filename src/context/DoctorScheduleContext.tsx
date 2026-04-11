import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  AppointmentSettings,
  DoctorSchedule,
  ScheduleException,
  WeekDay,
  WorkingDay,
} from '../type/schedule'
import {
  DEFAULT_DOCTOR_SCHEDULE,
  generateTimeSlots,
  getWeekDayFromDate,
  sortWorkingDays,
} from '../utils/schedule'

type DoctorScheduleContextType = {
  schedule: DoctorSchedule
  saveWorkingDay: (payload: WorkingDay) => void
  removeWorkingDay: (day: WeekDay) => void
  addException: (payload: Omit<ScheduleException, 'id'>) => void
  removeException: (id: string) => void
  saveSettings: (payload: AppointmentSettings) => void
  getAvailableSlotsForDate: (date: Date) => string[]
}

const DoctorScheduleContext = createContext<DoctorScheduleContextType | undefined>(
  undefined,
)

export function DoctorScheduleProvider({ children }: { children: ReactNode }) {
  const [schedule, setSchedule] = useState<DoctorSchedule>(DEFAULT_DOCTOR_SCHEDULE)

  const saveWorkingDay = (payload: WorkingDay) => {
    setSchedule((prev) => {
      const existing = prev.workingDays.find((item) => item.day === payload.day)

      if (existing) {
        return {
          ...prev,
          workingDays: sortWorkingDays(
            prev.workingDays.map((item) =>
              item.day === payload.day ? payload : item,
            ),
          ),
        }
      }

      return {
        ...prev,
        workingDays: sortWorkingDays([...prev.workingDays, payload]),
      }
    })
  }

  const removeWorkingDay = (day: WeekDay) => {
    setSchedule((prev) => ({
      ...prev,
      workingDays: prev.workingDays.filter((item) => item.day !== day),
    }))
  }

  const addException = (payload: Omit<ScheduleException, 'id'>) => {
    setSchedule((prev) => ({
      ...prev,
      exceptions: [
        ...prev.exceptions.filter((item) => item.date !== payload.date),
        { id: crypto.randomUUID(), ...payload },
      ].sort((a, b) => a.date.localeCompare(b.date)),
    }))
  }

  const removeException = (id: string) => {
    setSchedule((prev) => ({
      ...prev,
      exceptions: prev.exceptions.filter((item) => item.id !== id),
    }))
  }

  const saveSettings = (payload: AppointmentSettings) => {
    setSchedule((prev) => ({
      ...prev,
      settings: payload,
    }))
  }

  const getAvailableSlotsForDate = (date: Date) => {
    const inputDate = date.toISOString().split('T')[0]
    const exception = schedule.exceptions.find((item) => item.date === inputDate)

    if (exception) {
      return []
    }

    const weekDay = getWeekDayFromDate(date)
    const workingDay = schedule.workingDays.find((item) => item.day === weekDay)

    if (!workingDay) {
      return []
    }

    return generateTimeSlots(
      workingDay.startTime,
      workingDay.endTime,
      schedule.settings.appointmentDuration,
      schedule.settings.breakBetweenAppointments,
    )
  }

  const value = useMemo(
    () => ({
      schedule,
      saveWorkingDay,
      removeWorkingDay,
      addException,
      removeException,
      saveSettings,
      getAvailableSlotsForDate,
    }),
    [schedule],
  )

  return (
    <DoctorScheduleContext.Provider value={value}>
      {children}
    </DoctorScheduleContext.Provider>
  )
}

export function useDoctorSchedule() {
  const context = useContext(DoctorScheduleContext)

  if (!context) {
    throw new Error('useDoctorSchedule must be used within DoctorScheduleProvider')
  }

  return context
}
import { useEffect, useMemo, useState } from 'react'
import AddWorkingDayModal from '../../components/doctor/AddWorkingDayModal'
import AppointmentSettingsSection from '../../components/doctor/AppointmentSettingsSection'
import ExceptionsSection from '../../components/doctor/ExceptionsSection'
import ScheduleInfo from '../../components/doctor/ScheduleInfo'
import WorkingHoursSection from '../../components/doctor/WorkingHoursSection'
import { useDoctorSchedule } from '../../context/DoctorScheduleContext'
import { useUser } from '../../context/UserContext'
import { listHolidays } from '../../lib/admin'

export default function DoctorSchedulePage() {
  const { schedule, saveWorkingDay, removeWorkingDay, saveSettings } =
    useDoctorSchedule()
  const { accessToken } = useUser()

  const [isWorkingDayModalOpen, setIsWorkingDayModalOpen] = useState(false)
  const [holidayExceptions, setHolidayExceptions] = useState<
    Array<{ id: string; date: string; reason: string }>
  >([])

  useEffect(() => {
    if (!accessToken) return

    const token = accessToken
    let isMounted = true
    const year = new Date().getFullYear()

    async function loadExceptions() {
      try {
        const holidays = await listHolidays(token, year)
        if (!isMounted) return

        setHolidayExceptions(
          holidays.map((holiday) => ({
            id: holiday.id,
            date: holiday.date,
            reason: holiday.name,
          })),
        )
      } catch {
        if (isMounted) {
          setHolidayExceptions([])
        }
      }
    }

    void loadExceptions()

    return () => {
      isMounted = false
    }
  }, [accessToken])

  const exceptions = useMemo(
    () =>
      holidayExceptions.length
        ? holidayExceptions
        : schedule.exceptions,
    [holidayExceptions, schedule.exceptions],
  )

  return (
    <div className="w-full bg-[#f7f7f8] px-6 py-10">
      <header>
        <h1 className="text-[25px] font-semibold text-slate-900">Расписание</h1>
        <p className="mt-2 text-[17px] text-gray-500">
          Управляйте рабочими часами и настройками приема. Исключения задаются
          администратором и доступны только для просмотра.
        </p>
      </header>

      <div className="mt-10 space-y-10">
        <WorkingHoursSection
          workingDays={schedule.workingDays}
          onAddClick={() => setIsWorkingDayModalOpen(true)}
          onRemoveDay={removeWorkingDay}
        />

        <ExceptionsSection exceptions={exceptions} />

        <AppointmentSettingsSection
          settings={schedule.settings}
          onSave={saveSettings}
        />

        <ScheduleInfo />
      </div>

      <AddWorkingDayModal
        isOpen={isWorkingDayModalOpen}
        onClose={() => setIsWorkingDayModalOpen(false)}
        onSave={saveWorkingDay}
      />
    </div>
  )
}

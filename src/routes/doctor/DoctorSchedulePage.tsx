import { useEffect, useMemo, useState } from 'react'
import ExceptionsSection from '../../components/doctor/ExceptionsSection'
import ScheduleInfo from '../../components/doctor/ScheduleInfo'
import WorkingHoursSection from '../../components/doctor/WorkingHoursSection'
import { useDoctorSchedule } from '../../context/DoctorScheduleContext'
import { useUser } from '../../context/UserContext'
import { listHolidays } from '../../lib/admin'

export default function DoctorSchedulePage() {
  const { schedule } = useDoctorSchedule()
  const { accessToken } = useUser()
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
    () => (holidayExceptions.length ? holidayExceptions : schedule.exceptions),
    [holidayExceptions, schedule.exceptions],
  )

  return (
    <div className="w-full bg-[#f7f7f8] px-6 py-10">
      <header>
        <h1 className="text-[25px] font-semibold text-slate-900">Расписание</h1>
        <p className="mt-2 text-[17px] text-gray-500">
          Рабочие часы и исключения задаются администратором. Врач может только просматривать
          текущее расписание.
        </p>
      </header>

      <div className="mt-10 space-y-10">
        <WorkingHoursSection workingDays={schedule.workingDays} />

        <ExceptionsSection exceptions={exceptions} />

        <ScheduleInfo />
      </div>
    </div>
  )
}

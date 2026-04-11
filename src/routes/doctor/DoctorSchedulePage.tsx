import { useState } from 'react'
import { useDoctorSchedule } from '../../context/DoctorScheduleContext'
import AddExceptionModal from '../../components/doctor/AddExceptionModal'
import AddWorkingDayModal from '../../components/doctor/AddWorkingDayModal'
import AppointmentSettingsSection from '../../components/doctor/AppointmentSettingsSection'
import ExceptionsSection from '../../components/doctor/ExceptionsSection'
import ScheduleInfo from '../../components/doctor/ScheduleInfo'
import WorkingHoursSection from '../../components/doctor/WorkingHoursSection'

export default function DoctorSchedulePage() {
  const {
    schedule,
    saveWorkingDay,
    removeWorkingDay,
    addException,
    removeException,
    saveSettings,
  } = useDoctorSchedule()

  const [isWorkingDayModalOpen, setIsWorkingDayModalOpen] = useState(false)
  const [isExceptionModalOpen, setIsExceptionModalOpen] = useState(false)

  return (
    <div className="w-full bg-[#f7f7f8] px-6 py-10">
      <header>
        <h1 className="text-[28px] font-semibold text-slate-900">Расписание</h1>
        <p className="mt-3 text-[18px] text-gray-500">
          Управляйте своим рабочим графиком
        </p>
      </header>

      <div className="mt-10 space-y-10">
        <WorkingHoursSection
          workingDays={schedule.workingDays}
          onAddClick={() => setIsWorkingDayModalOpen(true)}
          onRemoveDay={removeWorkingDay}
        />

        <ExceptionsSection
          exceptions={schedule.exceptions}
          onAddClick={() => setIsExceptionModalOpen(true)}
          onRemove={removeException}
        />

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

      <AddExceptionModal
        isOpen={isExceptionModalOpen}
        onClose={() => setIsExceptionModalOpen(false)}
        onSave={addException}
      />
    </div>
  )
}
import { useEffect, useState } from 'react'
import type { WeekDay, WorkingDay } from '../../type/schedule'
import { WEEK_DAYS } from '../../utils/schedule'
import Modal from './Modal'

type AddWorkingDayModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (payload: WorkingDay) => void
}

export default function AddWorkingDayModal({
  isOpen,
  onClose,
  onSave,
}: AddWorkingDayModalProps) {
  const [day, setDay] = useState<WeekDay>('monday')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')

  useEffect(() => {
    if (isOpen) {
      setDay('monday')
      setStartTime('09:00')
      setEndTime('17:00')
    }
  }, [isOpen])

  const handleSave = () => {
    if (!day || !startTime || !endTime) return
    onSave({ day, startTime, endTime })
    onClose()
  }

  return (
    <Modal title="Добавить рабочий день" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-5">
        <div>
          <label className="mb-3 block text-[16px] font-semibold text-slate-900">
            День недели
          </label>

          <select
            value={day}
            onChange={(e) => setDay(e.target.value as WeekDay)}
            className="h-14 w-full rounded-2xl border border-gray-200 px-5 text-[16px] outline-none transition focus:border-sky-500"
          >
            {WEEK_DAYS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-3 block text-[16px] font-semibold text-slate-900">
              Начало
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="h-14 w-full rounded-2xl border border-gray-200 px-5 text-[16px] outline-none transition focus:border-sky-500"
            />
          </div>

          <div>
            <label className="mb-3 block text-[16px] font-semibold text-slate-900">
              Конец
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="h-14 w-full rounded-2xl border border-gray-200 px-5 text-[16px] outline-none transition focus:border-sky-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
          <button
            type="button"
            onClick={onClose}
            className="h-14 rounded-2xl border border-gray-200 text-[16px] font-semibold text-slate-900 transition hover:bg-gray-50"
          >
            Отмена
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="h-14 rounded-2xl bg-sky-600 text-[16px] font-semibold text-white transition hover:bg-sky-700"
          >
            Добавить
          </button>
        </div>
      </div>
    </Modal>
  )
}

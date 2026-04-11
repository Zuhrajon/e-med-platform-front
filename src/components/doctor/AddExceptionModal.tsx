import { useEffect, useState } from 'react'
import Modal from './Modal'
import { toInputDate } from '../../utils/schedule'

type AddExceptionModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (payload: { date: string; reason: string }) => void
}

export default function AddExceptionModal({
  isOpen,
  onClose,
  onSave,
}: AddExceptionModalProps) {
  const [date, setDate] = useState(toInputDate(new Date()))
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (isOpen) {
      setDate(toInputDate(new Date()))
      setReason('')
    }
  }, [isOpen])

  const handleSave = () => {
    if (!date) return
    onSave({
      date,
      reason: reason.trim() || 'Выходной день',
    })
    onClose()
  }

  return (
    <Modal title="Добавить исключение" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <label className="mb-3 block text-[18px] font-semibold text-slate-900">
            Дата
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-16 w-full rounded-2xl border border-gray-200 px-6 text-[18px] outline-none transition focus:border-sky-500"
          />
        </div>

        <div>
          <label className="mb-3 block text-[18px] font-semibold text-slate-900">
            Причина
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Например: праздничный день"
            className="h-16 w-full rounded-2xl border border-gray-200 px-6 text-[18px] outline-none transition focus:border-sky-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
          <button
            type="button"
            onClick={onClose}
            className="h-16 rounded-2xl border border-gray-200 text-[18px] font-semibold text-slate-900 transition hover:bg-gray-50"
          >
            Отмена
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="h-16 rounded-2xl bg-sky-600 text-[18px] font-semibold text-white transition hover:bg-sky-700"
          >
            Добавить
          </button>
        </div>
      </div>
    </Modal>
  )
}
import { CalendarCheck2, LoaderCircle } from 'lucide-react'
import type { FormEvent } from 'react'
import type { WorkingDayStatus } from '../../lib/admin'
import { formatRuDate } from '../../routes/admin/admin-utils'
import AdminCard from './AdminCard'

type HolidayFormState = {
  date: string
  name: string
}

type AdminHolidayEditorCardProps = {
  form: HolidayFormState
  editingHolidayID: string | null
  isSubmitting: boolean
  checkDate: string
  isChecking: boolean
  workingDay: WorkingDayStatus | null
  onFormChange: (next: HolidayFormState) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>
  onResetEditing: () => void
  onCheckDateChange: (value: string) => void
  onCheckSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>
}

export default function AdminHolidayEditorCard({
  form,
  editingHolidayID,
  isSubmitting,
  checkDate,
  isChecking,
  workingDay,
  onFormChange,
  onSubmit,
  onResetEditing,
  onCheckDateChange,
  onCheckSubmit,
}: AdminHolidayEditorCardProps) {
  return (
    <AdminCard>
      <h2 className="text-[21px] font-semibold text-slate-900">
        {editingHolidayID ? 'Редактировать праздник' : 'Добавить праздник'}
      </h2>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input
          required
          type="date"
          value={form.date}
          onChange={(event) => onFormChange({ ...form, date: event.target.value })}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
        />
        <input
          required
          value={form.name}
          onChange={(event) => onFormChange({ ...form, name: event.target.value })}
          placeholder="Название праздника"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
        />

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-700 px-5 py-3 font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {editingHolidayID ? 'Сохранить' : 'Создать'}
          </button>

          {editingHolidayID ? (
            <button
              type="button"
              onClick={onResetEditing}
              className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Отменить
            </button>
          ) : null}
        </div>
      </form>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <h3 className="text-lg font-semibold text-slate-900">Проверка рабочего дня</h3>
        <form onSubmit={onCheckSubmit} className="mt-4 flex flex-wrap gap-3">
          <input
            type="date"
            value={checkDate}
            onChange={(event) => onCheckDateChange(event.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={!checkDate || isChecking}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-700 px-5 py-3 font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isChecking ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <CalendarCheck2 className="h-4 w-4" />
            )}
            Проверить
          </button>
        </form>

        {workingDay ? (
          <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-700">
            <p>
              <span className="font-semibold text-slate-900">Дата:</span> {formatRuDate(workingDay.date)}
            </p>
            <p className="mt-2">
              <span className="font-semibold text-slate-900">Статус:</span>{' '}
              {workingDay.is_working ? 'рабочий день' : 'нерабочий день'}
            </p>
            {workingDay.is_holiday ? (
              <p className="mt-2">
                <span className="font-semibold text-slate-900">Праздник:</span> {workingDay.holiday_name}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </AdminCard>
  )
}

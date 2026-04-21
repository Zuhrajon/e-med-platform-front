import { Trash2 } from 'lucide-react'
import type { Holiday } from '../../lib/admin'
import { formatRuDate } from '../../routes/admin/admin-utils'
import AdminCard from './AdminCard'

type AdminHolidayListCardProps = {
  year: string
  holidays: Holiday[]
  isLoading: boolean
  onYearChange: (value: string) => void
  onLoad: () => void | Promise<void>
  onEdit: (holiday: Holiday) => void
  onDelete: (holidayID: string) => void | Promise<void>
}

export default function AdminHolidayListCard({
  year,
  holidays,
  isLoading,
  onYearChange,
  onLoad,
  onEdit,
  onDelete,
}: AdminHolidayListCardProps) {
  return (
    <AdminCard>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-[21px] font-semibold text-slate-900">Праздничные дни</h2>
          <p className="mt-1 text-sm text-slate-500">`GET /api/v1/calendar/holidays?year=...`</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-500">Год</label>
          <input
            value={year}
            onChange={(event) => onYearChange(event.target.value)}
            className="w-28 rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
          />
          <button
            type="button"
            onClick={() => void onLoad()}
            className="rounded-2xl bg-sky-700 px-5 py-3 font-semibold text-white transition hover:bg-sky-800"
          >
            Загрузить
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <div className="text-sm text-slate-500">Загрузка списка...</div>
        ) : holidays.length ? (
          holidays.map((holiday) => (
            <div
              key={holiday.id}
              className="flex flex-col gap-4 rounded-3xl border border-slate-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <p className="text-lg font-semibold text-slate-900">{holiday.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {formatRuDate(holiday.date)} ({holiday.date})
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onEdit(holiday)}
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Редактировать
                </button>
                <button
                  type="button"
                  onClick={() => void onDelete(holiday.id)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Удалить
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-slate-500">Для выбранного года праздников нет.</div>
        )}
      </div>
    </AdminCard>
  )
}

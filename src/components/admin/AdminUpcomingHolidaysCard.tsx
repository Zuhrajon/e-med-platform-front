import { Link } from 'react-router-dom'
import type { Holiday } from '../../lib/admin'
import { formatRuDate } from '../../routes/admin/admin-utils'
import AdminCard from './AdminCard'

type AdminUpcomingHolidaysCardProps = {
  holidays: Holiday[]
  isLoading: boolean
}

export default function AdminUpcomingHolidaysCard({
  holidays,
  isLoading,
}: AdminUpcomingHolidaysCardProps) {
  return (
    <AdminCard>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[21px] font-semibold text-slate-900">Ближайшие праздничные дни</h2>
        </div>

        <Link
          to="/admin/appointments"
          className="rounded-2xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800"
        >
          Открыть календарь
        </Link>
      </div>

      <div className="mt-5 space-y-3">
        {isLoading ? (
          <p className="text-sm text-slate-500">Загрузка календаря...</p>
        ) : holidays.length ? (
          holidays.map((holiday) => (
            <div
              key={holiday.id}
              className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
            >
              <div>
                <p className="font-medium text-slate-900">{holiday.name}</p>
                <p className="text-sm text-slate-500">{formatRuDate(holiday.date)}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                {holiday.date}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">Праздничные дни пока не заведены.</p>
        )}
      </div>
    </AdminCard>
  )
}

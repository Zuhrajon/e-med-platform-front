import { Link } from 'react-router-dom'
import AdminCard from './AdminCard'

type AdminQuickActionsCardProps = {
  isLoading: boolean
  todayStatus:
    | {
        is_working: boolean
        is_holiday: boolean
        holiday_name: string
      }
    | null
}

export default function AdminQuickActionsCard({
  isLoading,
  todayStatus,
}: AdminQuickActionsCardProps) {
  return (
    <AdminCard>
      <h2 className="text-[21px] font-semibold text-slate-900">Быстрые действия</h2>
      <div className="mt-5 space-y-3">
        <Link
          to="/admin/users"
          className="block rounded-2xl bg-slate-50 px-4 py-4 transition hover:bg-slate-100"
        >
          <p className="font-medium text-slate-900">Управлять сотрудниками</p>
          <p className="mt-1 text-sm text-slate-500">
            Добавление, редактирование и сброс пароля сотрудников.
          </p>
        </Link>

        <Link
          to="/admin/users"
          className="block rounded-2xl bg-slate-50 px-4 py-4 transition hover:bg-slate-100"
        >
          <p className="font-medium text-slate-900">Управлять специальностями</p>
          <p className="mt-1 text-sm text-slate-500">
            Все специальности теперь собраны на странице сотрудников.
          </p>
        </Link>

        <Link
          to="/admin/fake-data"
          className="block rounded-2xl bg-slate-50 px-4 py-4 transition hover:bg-slate-100"
        >
          <p className="font-medium text-slate-900">Тестовые данные</p>
          <p className="mt-1 text-sm text-slate-500">
            Заполнение и очистка demo-набора через backend-ручки.
          </p>
        </Link>

        <div className="rounded-2xl border border-slate-200 px-4 py-4">
          <p className="font-medium text-slate-900">Статус текущего дня</p>
          <p className="mt-1 text-sm text-slate-500">
            {isLoading
              ? 'Проверка...'
              : todayStatus?.is_holiday
                ? `Сегодня праздник: ${todayStatus.holiday_name}`
                : todayStatus?.is_working
                  ? 'Сегодня рабочий день.'
                  : 'Сегодня нерабочий день.'}
          </p>
        </div>
      </div>
    </AdminCard>
  )
}

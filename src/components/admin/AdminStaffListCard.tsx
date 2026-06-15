import { Ban, CheckCircle2, Pencil, RefreshCcw, Trash2 } from 'lucide-react'
import type { FormEvent } from 'react'
import type { StaffMember } from '../../lib/admin'
import { formatCurrency } from '../../routes/admin/admin-utils'
import AvatarImage from '../common/AvatarImage'
import AdminCard from './AdminCard'
import { roleBadgeClass, roleLabel } from './AdminUsers.shared'

type AdminStaffListCardProps = {
  staff: StaffMember[]
  isLoading: boolean
  search: string
  roleFilter: '' | 'doctor' | 'receptionist' | 'laborant'
  pendingActionId: string | null
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>
  onSearchChange: (value: string) => void
  onRoleFilterChange: (value: '' | 'doctor' | 'receptionist' | 'laborant') => void
  onEdit: (item: StaffMember) => void
  onToggleStatus: (item: StaffMember) => void | Promise<void>
  onResetPassword: (item: StaffMember) => void | Promise<void>
  onDelete: (item: StaffMember) => void | Promise<void>
}

export default function AdminStaffListCard({
  staff,
  isLoading,
  search,
  roleFilter,
  pendingActionId,
  onSearchSubmit,
  onSearchChange,
  onRoleFilterChange,
  onEdit,
  onToggleStatus,
  onResetPassword,
  onDelete,
}: AdminStaffListCardProps) {
  return (
    <AdminCard>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-[21px] font-semibold text-slate-900">Список сотрудников</h2>
        </div>

        <form onSubmit={onSearchSubmit} className="grid gap-3 md:grid-cols-[1fr_170px_auto]">
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Поиск по ФИО"
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
          />
          <select
            value={roleFilter}
            onChange={(event) =>
              onRoleFilterChange(event.target.value as '' | 'doctor' | 'receptionist' | 'laborant')
            }
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
          >
            <option value="">Все роли</option>
            <option value="doctor">Врачи</option>
            <option value="receptionist">Регистратура</option>
            <option value="laborant">Лаборатория</option>
          </select>
          <button
            type="submit"
            className="rounded-2xl bg-sky-700 px-5 py-3 font-semibold text-white transition hover:bg-sky-800"
          >
            Найти
          </button>
        </form>
      </div>

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <div className="text-sm text-slate-500">Загрузка сотрудников...</div>
        ) : staff.length ? (
          staff.map((item) => {
            const pending = pendingActionId === item.user_id

            return (
              <div
                key={item.user_id}
                className="flex flex-col gap-4 rounded-3xl border border-slate-200 px-5 py-4"
              >
                <div className="flex items-center gap-4">
                  {item.avatar_url ? (
                    <AvatarImage
                      src={item.avatar_url}
                      alt={item.full_name}
                      className="h-14 w-14 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-900">
                      {item.full_name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2) || 'С'}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-lg font-semibold text-slate-900">{item.full_name}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${roleBadgeClass(item.role)}`}
                    >
                      {roleLabel(item.role)}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.is_active ? 'Активен' : 'Неактивен'}
                    </span>
                  </div>
                </div>

                <div className="grid gap-2 text-sm text-slate-500 md:grid-cols-2">
                  <p>Email: {item.email}</p>
                  <p>Телефон: {item.phone_number || '—'}</p>
                  <p>Специальность: {item.specialty_name || 'Не назначена'}</p>
                  <p>Оплата: {item.role === 'doctor' ? formatCurrency(item.appointment_fee) : 'Не применяется'}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Pencil className="h-4 w-4" />
                    Редактировать
                  </button>
                  <button
                    type="button"
                    onClick={() => void onToggleStatus(item)}
                    disabled={pending}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-70"
                  >
                    {item.is_active ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                    {item.is_active ? 'Деактивировать' : 'Активировать'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void onResetPassword(item)}
                    disabled={pending}
                    className="inline-flex items-center gap-2 rounded-2xl border border-sky-200 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-50 disabled:opacity-70"
                  >
                    <RefreshCcw className={`h-4 w-4 ${pending ? 'animate-spin' : ''}`} />
                    Забыл пароль
                  </button>
                  <button
                    type="button"
                    onClick={() => void onDelete(item)}
                    disabled={pending}
                    className="inline-flex items-center gap-2 rounded-2xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-70"
                  >
                    <Trash2 className="h-4 w-4" />
                    Удалить
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-sm text-slate-500">Сотрудники не найдены.</div>
        )}
      </div>
    </AdminCard>
  )
}

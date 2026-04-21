import { LoaderCircle, Trash2 } from 'lucide-react'
import type { FormEvent } from 'react'
import type { Specialty } from '../../lib/admin'
import AdminCard from './AdminCard'

type AdminSpecialtiesCardProps = {
  specialties: Specialty[]
  specialtyName: string
  isSaving: boolean
  onNameChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>
  onToggle: (item: Specialty) => void | Promise<void>
  onDelete: (item: Specialty) => void | Promise<void>
}

export default function AdminSpecialtiesCard({
  specialties,
  specialtyName,
  isSaving,
  onNameChange,
  onSubmit,
  onToggle,
  onDelete,
}: AdminSpecialtiesCardProps) {
  return (
    <AdminCard>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-[21px] font-semibold text-slate-900">Медицинские специальности</h2>
          <p className="mt-1 text-sm text-slate-500">
            Справочник для создания и редактирования врачей.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex w-full max-w-xl gap-3">
          <input
            required
            value={specialtyName}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Название специальности"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-700 px-5 py-3 font-semibold text-white transition hover:bg-sky-800 disabled:bg-slate-400"
          >
            {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            Добавить
          </button>
        </form>
      </div>

      <div className="mt-6 space-y-3">
        {specialties.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-4 rounded-3xl border border-slate-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
          >
            <div>
              <p className="text-lg font-semibold text-slate-900">{item.name}</p>
              <p className="mt-1 text-sm text-slate-500">
                Статус:{' '}
                <span
                  className={
                    item.is_active ? 'font-semibold text-emerald-700' : 'font-semibold text-slate-500'
                  }
                >
                  {item.is_active ? 'активна' : 'неактивна'}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void onToggle(item)}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {item.is_active ? 'Деактивировать' : 'Активировать'}
              </button>
              <button
                type="button"
                onClick={() => void onDelete(item)}
                className="inline-flex items-center gap-2 rounded-2xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminCard>
  )
}

import type { FormEvent } from 'react'

export type ProfileFormState = {
  firstName: string
  lastName: string
  middleName: string
  email: string
  phone: string
  gender: 'Мужской' | 'Женский'
  birthDate: string
  address: string
  documentNumber: string
  description?: string
}

type ProfileDetailsSectionProps = {
  title: string
  subtitle: string
  form: ProfileFormState
  isEditing: boolean
  isSaving?: boolean
  showDescription?: boolean
  readOnlyBadges?: Array<{ label: string; value: string }>
  onChange: (field: keyof ProfileFormState, value: string) => void
  onStartEdit: () => void
  onCancelEdit: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

function inputClassName(isEditing: boolean) {
  return `w-full rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-900 outline-none transition ${
    isEditing ? 'focus:border-sky-500' : 'bg-slate-50'
  }`
}

export default function ProfileDetailsSection({
  title,
  subtitle,
  form,
  isEditing,
  isSaving = false,
  showDescription = false,
  readOnlyBadges = [],
  onChange,
  onStartEdit,
  onCancelEdit,
  onSubmit,
}: ProfileDetailsSectionProps) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-[22px] font-semibold text-slate-900">{title}</h2>
          <p className="mt-2 text-[15px] text-slate-500">{subtitle}</p>
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={onStartEdit}
            className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Редактировать
          </button>
        ) : null}
      </div>

      {readOnlyBadges.length ? (
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {readOnlyBadges.map((item) => (
            <div key={item.label} className="rounded-2xl bg-slate-50 px-4 py-4">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-2 text-base font-medium text-slate-900">{item.value || '—'}</p>
            </div>
          ))}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Имя</span>
            <input
              value={form.firstName}
              onChange={(event) => onChange('firstName', event.target.value)}
              disabled={!isEditing}
              className={inputClassName(isEditing)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Фамилия</span>
            <input
              value={form.lastName}
              onChange={(event) => onChange('lastName', event.target.value)}
              disabled={!isEditing}
              className={inputClassName(isEditing)}
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">Отчество</span>
            <input
              value={form.middleName}
              onChange={(event) => onChange('middleName', event.target.value)}
              disabled={!isEditing}
              className={inputClassName(isEditing)}
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
            <input value={form.email} disabled className={inputClassName(false)} />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Телефон</span>
            <input
              value={form.phone}
              onChange={(event) => onChange('phone', event.target.value)}
              disabled={!isEditing}
              className={inputClassName(isEditing)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Пол</span>
            <select
              value={form.gender}
              onChange={(event) => onChange('gender', event.target.value)}
              disabled={!isEditing}
              className={inputClassName(isEditing)}
            >
              <option value="Мужской">Мужской</option>
              <option value="Женский">Женский</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Дата рождения</span>
            <input
              type="date"
              value={form.birthDate}
              onChange={(event) => onChange('birthDate', event.target.value)}
              disabled={!isEditing}
              className={inputClassName(isEditing)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Номер документа</span>
            <input
              value={form.documentNumber}
              onChange={(event) => onChange('documentNumber', event.target.value)}
              disabled={!isEditing}
              className={inputClassName(isEditing)}
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">Адрес</span>
            <input
              value={form.address}
              onChange={(event) => onChange('address', event.target.value)}
              disabled={!isEditing}
              className={inputClassName(isEditing)}
            />
          </label>

          {showDescription ? (
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Описание</span>
              <textarea
                value={form.description || ''}
                onChange={(event) => onChange('description', event.target.value)}
                disabled={!isEditing}
                rows={4}
                className={inputClassName(isEditing)}
              />
            </label>
          ) : null}
        </div>

        {isEditing ? (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-2xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:bg-slate-400"
            >
              {isSaving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        ) : null}
      </form>
    </section>
  )
}

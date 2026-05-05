import { LoaderCircle, Upload } from 'lucide-react'
import type { ChangeEvent, FormEvent } from 'react'
import type { Specialty } from '../../lib/admin'
import AdminCard from './AdminCard'
import {
  fileNames,
  roleLabel,
  type CreateStaffForm,
  type EditStaffForm,
} from './AdminUsers.shared'

type AdminStaffFormCardProps = {
  createForm: CreateStaffForm
  editForm: EditStaffForm | null
  activeSpecialties: Specialty[]
  isSubmitting: boolean
  isSavingEdit: boolean
  onCreateSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>
  onEditSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>
  onCreateChange: <K extends keyof CreateStaffForm>(key: K, value: CreateStaffForm[K]) => void
  onEditChange: <K extends keyof EditStaffForm>(key: K, value: EditStaffForm[K]) => void
  onFilesChange: (
    key: 'passport_files' | 'diploma_files' | 'employment_record_files',
    event: ChangeEvent<HTMLInputElement>,
  ) => void
  onCancelEdit: () => void
}

function FileField({
  label,
  required,
  files,
  onChange,
}: {
  label: string
  required: boolean
  files: File[]
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <label className="block rounded-2xl border border-dashed border-slate-300 px-4 py-4">
      <span className="flex items-center gap-2 font-medium text-slate-900">
        <Upload className="h-4 w-4" /> {label}
      </span>
      <input
        required={required}
        multiple
        type="file"
        onChange={onChange}
        className="mt-3 block w-full text-sm text-slate-500"
      />
      {files.length ? <p className="mt-2 text-sm text-slate-500">{fileNames(files)}</p> : null}
    </label>
  )
}

export default function AdminStaffFormCard({
  createForm,
  editForm,
  activeSpecialties,
  isSubmitting,
  isSavingEdit,
  onCreateSubmit,
  onEditSubmit,
  onCreateChange,
  onEditChange,
  onFilesChange,
  onCancelEdit,
}: AdminStaffFormCardProps) {
  const isDoctorCreate = createForm.role === 'doctor'

  return (
    <AdminCard>
      <h2 className="text-[21px] font-semibold text-slate-900">
        {editForm ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
      </h2>

      {editForm ? (
        <form onSubmit={onEditSubmit} className="mt-6 space-y-4">
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {editForm.full_name} • {roleLabel(editForm.role)}
          </div>

          <input
            required
            type="email"
            value={editForm.email}
            onChange={(event) => onEditChange('email', event.target.value)}
            placeholder="Email"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
          />

          <input
            required
            value={editForm.phone_number}
            onChange={(event) => onEditChange('phone_number', event.target.value)}
            placeholder="Телефон"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
          />

          {editForm.role === 'doctor' ? (
            <>
              <select
                required
                value={editForm.specialty_id}
                onChange={(event) => onEditChange('specialty_id', event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
              >
                <option value="">Выберите специальность</option>
                {activeSpecialties.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <input
                required
                type="number"
                min="0"
                value={editForm.work_experience_years}
                onChange={(event) => onEditChange('work_experience_years', event.target.value)}
                placeholder="Стаж"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
              />

              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={editForm.appointment_fee}
                onChange={(event) => onEditChange('appointment_fee', event.target.value)}
                placeholder="Оплата / стоимость приёма"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
              />
            </>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
              Для ресепшена доступно редактирование контактов и активности.
            </div>
          )}

          <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={editForm.is_active}
              onChange={(event) => onEditChange('is_active', event.target.checked)}
              className="h-4 w-4"
            />
            Сотрудник активен
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSavingEdit}
              className="inline-flex items-center gap-2 rounded-2xl bg-sky-700 px-5 py-3 font-semibold text-white transition hover:bg-sky-800 disabled:bg-slate-400"
            >
              {isSavingEdit ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              Сохранить изменения
            </button>
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Отменить
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={onCreateSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <select
              required
              value={createForm.role}
              onChange={(event) =>
                onCreateChange('role', event.target.value as CreateStaffForm['role'])
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 md:col-span-2"
            >
              <option value="doctor">Врач</option>
              <option value="receptionist">Сотрудник ресепшена</option>
            </select>

            <input
              required
              value={createForm.last_name}
              onChange={(event) => onCreateChange('last_name', event.target.value)}
              placeholder="Фамилия"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
            />

            <input
              required
              value={createForm.first_name}
              onChange={(event) => onCreateChange('first_name', event.target.value)}
              placeholder="Имя"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
            />

            <input
              value={createForm.middle_name}
              onChange={(event) => onCreateChange('middle_name', event.target.value)}
              placeholder="Отчество"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
            />

            <input
              required
              type="email"
              value={createForm.email}
              onChange={(event) => onCreateChange('email', event.target.value)}
              placeholder="Email"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
            />

            <input
              required
              value={createForm.phone_number}
              onChange={(event) => onCreateChange('phone_number', event.target.value)}
              placeholder="Телефон"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
            />

            <input
              required
              value={createForm.passport_number}
              onChange={(event) => onCreateChange('passport_number', event.target.value)}
              placeholder="Номер паспорта"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
            />

            <input
              required
              type="date"
              value={createForm.date_of_birth}
              onChange={(event) => onCreateChange('date_of_birth', event.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
            />

            <select
              required
              value={createForm.gender_id}
              onChange={(event) => onCreateChange('gender_id', event.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
            >
              <option value="1">Мужской</option>
              <option value="2">Женский</option>
            </select>

            {isDoctorCreate ? (
              <>
                <select
                  required
                  value={createForm.specialty_id}
                  onChange={(event) => onCreateChange('specialty_id', event.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                >
                  <option value="">Выберите специальность</option>
                  {activeSpecialties.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>

                <input
                  required
                  type="number"
                  min="0"
                  value={createForm.work_experience_years}
                  onChange={(event) => onCreateChange('work_experience_years', event.target.value)}
                  placeholder="Стаж"
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                />

                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={createForm.appointment_fee}
                  onChange={(event) => onCreateChange('appointment_fee', event.target.value)}
                  placeholder="Стоимость приёма"
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                />
              </>
            ) : null}

            <input
              required
              value={createForm.address}
              onChange={(event) => onCreateChange('address', event.target.value)}
              placeholder="Адрес"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 md:col-span-2"
            />
          </div>

          <FileField
            label="Паспорт"
            required
            files={createForm.passport_files}
            onChange={(event) => onFilesChange('passport_files', event)}
          />
          <FileField
            label="Диплом"
            required
            files={createForm.diploma_files}
            onChange={(event) => onFilesChange('diploma_files', event)}
          />
          <FileField
            label="Трудовая книжка"
            required
            files={createForm.employment_record_files}
            onChange={(event) => onFilesChange('employment_record_files', event)}
          />

          <button
            type="submit"
            disabled={isSubmitting || (isDoctorCreate && !activeSpecialties.length)}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-700 px-5 py-3 font-semibold text-white transition hover:bg-sky-800 disabled:bg-slate-400"
          >
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {isDoctorCreate ? 'Создать врача' : 'Создать сотрудника'}
          </button>
        </form>
      )}
    </AdminCard>
  )
}

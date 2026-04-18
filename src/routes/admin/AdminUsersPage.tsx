import { LoaderCircle, Upload } from 'lucide-react'
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import {
  createDoctorStaff,
  listDoctors,
  listSpecialties,
  type CreateStaffPayload,
  type DoctorStaff,
  type Specialty,
} from '../../lib/admin'
import { useUser } from '../../context/UserContext'
import { formatCurrency } from './admin-utils'

type FormState = Omit<CreateStaffPayload, 'passport_files' | 'diploma_files' | 'employment_record_files'> & {
  passport_files: File[]
  diploma_files: File[]
  employment_record_files: File[]
}

const initialForm: FormState = {
  role: 'doctor',
  email: '',
  first_name: '',
  last_name: '',
  middle_name: '',
  phone_number: '',
  gender_id: '1',
  passport_number: '',
  address: '',
  date_of_birth: '',
  specialty_id: '',
  work_experience_years: '',
  appointment_fee: '',
  passport_files: [],
  diploma_files: [],
  employment_record_files: [],
}

function fileNames(files: File[]) {
  return files.map((file) => file.name).join(', ')
}

export default function AdminUsersPage() {
  const { accessToken } = useUser()
  const [doctors, setDoctors] = useState<DoctorStaff[]>([])
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [search, setSearch] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [form, setForm] = useState<FormState>(initialForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const activeSpecialties = useMemo(
    () => specialties.filter((item) => item.is_active),
    [specialties],
  )

  async function loadData(currentSearch = search, specialtyId = selectedSpecialty) {
    if (!accessToken) return

    setIsLoading(true)
    setError(null)

    try {
      const [doctorsResponse, specialtiesResponse] = await Promise.all([
        listDoctors(accessToken, {
          search: currentSearch.trim() || undefined,
          specialtyId: specialtyId || undefined,
        }),
        listSpecialties(accessToken),
      ])

      setDoctors(doctorsResponse)
      setSpecialties(specialtiesResponse)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить врачей')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [accessToken])

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleFilesChange(
    key: 'passport_files' | 'diploma_files' | 'employment_record_files',
    event: ChangeEvent<HTMLInputElement>,
  ) {
    updateForm(key, Array.from(event.target.files ?? []))
  }

  async function handleFilterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await loadData(search, selectedSpecialty)
  }

  async function handleCreateDoctor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!accessToken) return

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await createDoctorStaff(accessToken, form)
      setSuccess(
        response.temporary_password_sent
          ? 'Врач создан. Временный пароль отправлен на email.'
          : 'Врач создан, но отправка временного пароля не подтверждена бекендом.',
      )
      setForm({
        ...initialForm,
        specialty_id: activeSpecialties[0]?.id ?? '',
      })
      await loadData(search, selectedSpecialty)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать врача')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (!form.specialty_id && activeSpecialties.length) {
      setForm((prev) => ({ ...prev, specialty_id: activeSpecialties[0].id }))
    }
  }, [activeSpecialties, form.specialty_id])

  return (
    <div className="w-full px-6 py-10">
      <header>
        <h1 className="text-[25px] font-semibold text-slate-900">Сотрудники</h1>
        <p className="mt-2 text-[17px] text-slate-500">
          Поиск врачей и создание новых staff-аккаунтов через backend admin API.
        </p>
      </header>

      {error ? (
        <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">
          {success}
        </div>
      ) : null}

      <section className="mt-8 grid gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-[21px] font-semibold text-slate-900">Список врачей</h2>
              <p className="mt-1 text-sm text-slate-500">
                `GET /api/v1/users/staff?role=doctor`
              </p>
            </div>

            <form
              onSubmit={handleFilterSubmit}
              className="grid gap-3 md:grid-cols-[1fr_220px_auto]"
            >
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Поиск по ФИО"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
              />
              <select
                value={selectedSpecialty}
                onChange={(event) => setSelectedSpecialty(event.target.value)}
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
              >
                <option value="">Все специальности</option>
                {activeSpecialties.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-2xl bg-sky-700 px-5 py-3 font-semibold text-white transition hover:bg-sky-800"
              >
                Найти
              </button>
            </form>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
            <div className="grid grid-cols-[1.5fr_1fr_120px_140px] gap-3 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-600">
              <span>Врач</span>
              <span>Специальность</span>
              <span>Опыт</span>
              <span>Стоимость</span>
            </div>

            <div className="divide-y divide-slate-200">
              {isLoading ? (
                <div className="px-5 py-6 text-sm text-slate-500">Загрузка врачей...</div>
              ) : doctors.length ? (
                doctors.map((doctor) => (
                  <div
                    key={doctor.user_id}
                    className="grid grid-cols-[1.5fr_1fr_120px_140px] gap-3 px-5 py-4 text-sm text-slate-700"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{doctor.full_name}</p>
                      <p className="mt-1 text-slate-500">ID: {doctor.user_id}</p>
                    </div>
                    <span>{doctor.specialty_name}</span>
                    <span>{doctor.work_experience_years} лет</span>
                    <span>{formatCurrency(doctor.appointment_fee)}</span>
                  </div>
                ))
              ) : (
                <div className="px-5 py-6 text-sm text-slate-500">
                  Ничего не найдено по текущим фильтрам.
                </div>
              )}
            </div>
          </div>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-[21px] font-semibold text-slate-900">Добавить врача</h2>
          <p className="mt-1 text-sm text-slate-500">
            `POST /api/v1/users/staff` с multipart/form-data
          </p>

          <form onSubmit={handleCreateDoctor} className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                required
                value={form.last_name}
                onChange={(event) => updateForm('last_name', event.target.value)}
                placeholder="Фамилия"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
              />
              <input
                required
                value={form.first_name}
                onChange={(event) => updateForm('first_name', event.target.value)}
                placeholder="Имя"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
              />
              <input
                value={form.middle_name}
                onChange={(event) => updateForm('middle_name', event.target.value)}
                placeholder="Отчество"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
              />
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => updateForm('email', event.target.value)}
                placeholder="Email"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
              />
              <input
                required
                value={form.phone_number}
                onChange={(event) => updateForm('phone_number', event.target.value)}
                placeholder="Телефон"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
              />
              <input
                required
                value={form.passport_number}
                onChange={(event) => updateForm('passport_number', event.target.value)}
                placeholder="Номер паспорта"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
              />
              <input
                required
                type="date"
                value={form.date_of_birth}
                onChange={(event) => updateForm('date_of_birth', event.target.value)}
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
              />
              <select
                required
                value={form.gender_id}
                onChange={(event) => updateForm('gender_id', event.target.value)}
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
              >
                <option value="1">Мужской</option>
                <option value="2">Женский</option>
              </select>
              <select
                required
                value={form.specialty_id}
                onChange={(event) => updateForm('specialty_id', event.target.value)}
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
              >
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
                value={form.work_experience_years}
                onChange={(event) =>
                  updateForm('work_experience_years', event.target.value)
                }
                placeholder="Стаж"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
              />
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.appointment_fee}
                onChange={(event) => updateForm('appointment_fee', event.target.value)}
                placeholder="Стоимость приема"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
              />
              <input
                required
                value={form.address}
                onChange={(event) => updateForm('address', event.target.value)}
                placeholder="Адрес"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 md:col-span-2"
              />
            </div>

            <label className="block rounded-2xl border border-dashed border-slate-300 px-4 py-4">
              <span className="flex items-center gap-2 font-medium text-slate-900">
                <Upload className="h-4 w-4" /> Паспорт
              </span>
              <input
                required
                multiple
                type="file"
                onChange={(event) => handleFilesChange('passport_files', event)}
                className="mt-3 block w-full text-sm text-slate-500"
              />
              {form.passport_files.length ? (
                <p className="mt-2 text-sm text-slate-500">{fileNames(form.passport_files)}</p>
              ) : null}
            </label>

            <label className="block rounded-2xl border border-dashed border-slate-300 px-4 py-4">
              <span className="flex items-center gap-2 font-medium text-slate-900">
                <Upload className="h-4 w-4" /> Диплом
              </span>
              <input
                required
                multiple
                type="file"
                onChange={(event) => handleFilesChange('diploma_files', event)}
                className="mt-3 block w-full text-sm text-slate-500"
              />
              {form.diploma_files.length ? (
                <p className="mt-2 text-sm text-slate-500">{fileNames(form.diploma_files)}</p>
              ) : null}
            </label>

            <label className="block rounded-2xl border border-dashed border-slate-300 px-4 py-4">
              <span className="flex items-center gap-2 font-medium text-slate-900">
                <Upload className="h-4 w-4" /> Трудовая книжка
              </span>
              <input
                required
                multiple
                type="file"
                onChange={(event) =>
                  handleFilesChange('employment_record_files', event)
                }
                className="mt-3 block w-full text-sm text-slate-500"
              />
              {form.employment_record_files.length ? (
                <p className="mt-2 text-sm text-slate-500">
                  {fileNames(form.employment_record_files)}
                </p>
              ) : null}
            </label>

            <button
              type="submit"
              disabled={isSubmitting || !activeSpecialties.length}
              className="inline-flex items-center gap-2 rounded-2xl bg-sky-700 px-5 py-3 font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              Создать врача
            </button>
          </form>
        </article>
      </section>
    </div>
  )
}

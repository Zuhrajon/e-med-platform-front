import { LoaderCircle, UserPlus2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useUser } from '../../context/UserContext'
import { createPatient, type CreatePatientPayload } from '../../lib/patients'

const initialForm: CreatePatientPayload = {
  email: '',
  first_name: '',
  last_name: '',
  middle_name: '',
  phone_number: '',
  gender_id: 1,
  passport_number: '',
  address: '',
  date_of_birth: '',
}

export default function DoctorPatientsPage() {
  const { accessToken } = useUser()
  const [form, setForm] = useState<CreatePatientPayload>(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function updateField<K extends keyof CreatePatientPayload>(
    key: K,
    value: CreatePatientPayload[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!accessToken) return

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await createPatient(accessToken, form)
      setSuccess(
        `Пациент создан${response.patient_profile_id ? `. ID профиля: ${response.patient_profile_id}` : '.'}`,
      )
      setForm(initialForm)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Не удалось создать пациента')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full bg-[#f7f7f8] px-6 py-10">
      <header>
        <h1 className="text-[25px] font-semibold text-slate-900">Пациенты</h1>
        <p className="mt-2 text-[17px] text-slate-500">
          Создание новой карточки пациента через backend-ручку `/api/v1/patients/`.
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

      <section className="mt-8 max-w-4xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
            <UserPlus2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-[21px] font-semibold text-slate-900">Добавить пациента</h2>
            <p className="mt-1 text-sm text-slate-500">POST /api/v1/patients/</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              required
              value={form.last_name}
              onChange={(event) => updateField('last_name', event.target.value)}
              placeholder="Фамилия"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none transition focus:border-sky-500"
            />
            <input
              required
              value={form.first_name}
              onChange={(event) => updateField('first_name', event.target.value)}
              placeholder="Имя"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none transition focus:border-sky-500"
            />
            <input
              value={form.middle_name}
              onChange={(event) => updateField('middle_name', event.target.value)}
              placeholder="Отчество"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none transition focus:border-sky-500"
            />
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="Email"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none transition focus:border-sky-500"
            />
            <input
              required
              value={form.phone_number}
              onChange={(event) => updateField('phone_number', event.target.value)}
              placeholder="Телефон"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none transition focus:border-sky-500"
            />
            <input
              required
              value={form.passport_number}
              onChange={(event) => updateField('passport_number', event.target.value)}
              placeholder="Номер паспорта"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none transition focus:border-sky-500"
            />
            <input
              required
              type="date"
              value={form.date_of_birth}
              onChange={(event) => updateField('date_of_birth', event.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none transition focus:border-sky-500"
            />
            <select
              value={form.gender_id}
              onChange={(event) => updateField('gender_id', Number(event.target.value))}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none transition focus:border-sky-500"
            >
              <option value={1}>Мужской</option>
              <option value={2}>Женский</option>
            </select>
            <input
              required
              value={form.address}
              onChange={(event) => updateField('address', event.target.value)}
              placeholder="Адрес"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none transition focus:border-sky-500 md:col-span-2"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-700 px-5 py-3 text-base font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            Создать пациента
          </button>
        </form>
      </section>
    </div>
  )
}

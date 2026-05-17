import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { LoaderCircle, Search, UserPlus2 } from 'lucide-react'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AdminStatusMessage from '../../components/admin/AdminStatusMessage'
import { useUser } from '../../context/UserContext'
import {
  createPatient,
  getPatientByID,
  listPatients,
  updatePatient,
  type CreatePatientPayload,
  type PatientListItem,
} from '../../lib/patients'

type StaffPatientsPageProps = {
  roleLabel: 'admin' | 'receptionist'
}

const initialCreateForm: CreatePatientPayload = {
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

function toEditForm(patient: PatientListItem) {
  return {
    email: patient.email,
    first_name: patient.first_name,
    last_name: patient.last_name,
    middle_name: patient.middle_name,
    phone_number: patient.phone_number,
    gender_id: patient.gender_id,
    passport_number: patient.passport_number,
    address: patient.address,
    date_of_birth: patient.date_of_birth,
  }
}

export default function StaffPatientsPage({ roleLabel }: StaffPatientsPageProps) {
  const { accessToken } = useUser()
  const [patients, setPatients] = useState<PatientListItem[]>([])
  const [selectedPatient, setSelectedPatient] = useState<PatientListItem | null>(null)
  const [search, setSearch] = useState('')
  const [verifiedFilter, setVerifiedFilter] = useState<'' | 'true' | 'false'>('')
  const [createForm, setCreateForm] = useState<CreatePatientPayload>(initialCreateForm)
  const [editForm, setEditForm] = useState<CreatePatientPayload>(initialCreateForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function loadPatients(nextSearch = search, nextVerified = verifiedFilter) {
    if (!accessToken) return

    setIsLoading(true)
    setError('')

    try {
      const response = await listPatients(accessToken, {
        search: nextSearch,
        verified:
          nextVerified === ''
            ? ''
            : nextVerified === 'true'
              ? true
              : false,
      })
      setPatients(response)

      if (selectedPatient) {
        const refreshedSelected =
          response.find((item) => item.user_id === selectedPatient.user_id) ?? null
        setSelectedPatient(refreshedSelected)
        setEditForm(refreshedSelected ? toEditForm(refreshedSelected) : initialCreateForm)
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить пациентов')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadPatients()
  }, [accessToken])

  const pageText = useMemo(
    () =>
      roleLabel === 'admin'
        ? {
            title: 'Пациенты',
            description: 'Создание и ведение карточек пациентов для административной зоны.',
          }
        : {
            title: 'Пациенты',
            description: 'Создание карточек и обновление данных пациентов на ресепшене.',
          },
    [roleLabel],
  )

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await loadPatients(search, verifiedFilter)
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!accessToken) return

    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const response = await createPatient(accessToken, createForm)
      setCreateForm(initialCreateForm)
      setSuccess(
        `Пациент создан${response.patient_profile_id ? `. ID профиля: ${response.patient_profile_id}` : '.'}`,
      )
      await loadPatients(search, verifiedFilter)
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'Не удалось создать пациента',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSelectPatient(patientUserID: string) {
    if (!accessToken) return

    setError('')

    try {
      const response = await getPatientByID(accessToken, patientUserID)
      setSelectedPatient(response)
      setEditForm(toEditForm(response))
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Не удалось открыть пациента')
    }
  }

  async function handleSavePatient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!accessToken || !selectedPatient) return

    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await updatePatient(accessToken, selectedPatient.user_id, editForm)
      setSelectedPatient(response)
      setEditForm(toEditForm(response))
      setSuccess('Карточка пациента обновлена.')
      await loadPatients(search, verifiedFilter)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Не удалось обновить пациента')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full px-6 py-10">
      <AdminPageHeader title={pageText.title} description={pageText.description} />

      {error ? (
        <AdminStatusMessage tone="error" className="mt-6">
          {error}
        </AdminStatusMessage>
      ) : null}

      {success ? (
        <AdminStatusMessage tone="success" className="mt-6">
          {success}
        </AdminStatusMessage>
      ) : null}

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                <UserPlus2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-[21px] font-semibold text-slate-900">Новый пациент</h2>
              </div>
            </div>

            <form onSubmit={handleCreate} className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  required
                  value={createForm.last_name}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, last_name: event.target.value }))
                  }
                  placeholder="Фамилия"
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                />
                <input
                  required
                  value={createForm.first_name}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, first_name: event.target.value }))
                  }
                  placeholder="Имя"
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                />
                <input
                  value={createForm.middle_name}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, middle_name: event.target.value }))
                  }
                  placeholder="Отчество"
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                />
                <input
                  required
                  type="email"
                  value={createForm.email}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                  placeholder="Email"
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                />
                <input
                  required
                  value={createForm.phone_number}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, phone_number: event.target.value }))
                  }
                  placeholder="Телефон"
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                />
                <input
                  required
                  value={createForm.passport_number}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, passport_number: event.target.value }))
                  }
                  placeholder="Номер документа"
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                />
                <input
                  required
                  type="date"
                  value={createForm.date_of_birth}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, date_of_birth: event.target.value }))
                  }
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                />
                <select
                  value={createForm.gender_id}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, gender_id: Number(event.target.value) }))
                  }
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                >
                  <option value={1}>Мужской</option>
                  <option value={2}>Женский</option>
                </select>
                <input
                  required
                  value={createForm.address}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, address: event.target.value }))
                  }
                  placeholder="Адрес"
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 md:col-span-2"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-2xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:bg-slate-400"
              >
                {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                Создать пациента
              </button>
            </form>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-[21px] font-semibold text-slate-900">Список пациентов</h2>
              </div>

              <form onSubmit={handleSearch} className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Поиск по ФИО или email"
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                />
                <select
                  value={verifiedFilter}
                  onChange={(event) => setVerifiedFilter(event.target.value as '' | 'true' | 'false')}
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                >
                  <option value="">Все пациенты</option>
                  <option value="true">Только верифицированные</option>
                  <option value="false">Только не верифицированные</option>
                </select>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-2xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
                >
                  <Search className="h-4 w-4" />
                  Найти
                </button>
              </form>
            </div>

            <div className="mt-6 space-y-3">
              {isLoading ? (
                <div className="text-sm text-slate-500">Загрузка пациентов...</div>
              ) : patients.length ? (
                patients.map((patient) => (
                  <button
                    key={patient.user_id}
                    type="button"
                    onClick={() => void handleSelectPatient(patient.user_id)}
                    className={`block w-full rounded-3xl border px-5 py-4 text-left transition ${
                      selectedPatient?.user_id === patient.user_id
                        ? 'border-sky-300 bg-sky-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-lg font-semibold text-slate-900">{patient.full_name}</p>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          patient.is_verified
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {patient.is_verified ? 'Верифицирован' : 'Не верифицирован'}
                      </span>
                    </div>
                    <div className="mt-2 grid gap-2 text-sm text-slate-500 md:grid-cols-2">
                      <p>Email: {patient.email}</p>
                      <p>Телефон: {patient.phone_number || '—'}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-sm text-slate-500">Пациенты не найдены.</div>
              )}
            </div>
          </section>
        </div>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-[21px] font-semibold text-slate-900">Карточка пациента</h2>
          <p className="mt-2 text-[15px] text-slate-500">
            Выберите пациента слева, чтобы просмотреть и обновить данные.
          </p>

          {selectedPatient ? (
            <form onSubmit={handleSavePatient} className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 px-4 py-4 md:col-span-2">
                  <p className="text-sm text-slate-500">Статус верификации</p>
                  <p className="mt-2 text-base font-medium text-slate-900">
                    {selectedPatient.is_verified ? 'Пациент верифицирован' : 'Пациент ещё не верифицирован'}
                  </p>
                  {selectedPatient.is_verified ? (
                    <p className="mt-2 text-sm text-slate-500">
                      Проверил: {selectedPatient.verified_by_full_name || '—'}
                    </p>
                  ) : null}
                </div>

                <input
                  value={editForm.last_name}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, last_name: event.target.value }))}
                  placeholder="Фамилия"
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                />
                <input
                  value={editForm.first_name}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, first_name: event.target.value }))}
                  placeholder="Имя"
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                />
                <input
                  value={editForm.middle_name}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, middle_name: event.target.value }))}
                  placeholder="Отчество"
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                />
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="Email"
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                />
                <input
                  value={editForm.phone_number}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, phone_number: event.target.value }))}
                  placeholder="Телефон"
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                />
                <input
                  value={editForm.passport_number}
                  onChange={(event) =>
                    setEditForm((prev) => ({ ...prev, passport_number: event.target.value }))
                  }
                  placeholder="Номер документа"
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                />
                <input
                  type="date"
                  value={editForm.date_of_birth}
                  onChange={(event) =>
                    setEditForm((prev) => ({ ...prev, date_of_birth: event.target.value }))
                  }
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                />
                <select
                  value={editForm.gender_id}
                  onChange={(event) =>
                    setEditForm((prev) => ({ ...prev, gender_id: Number(event.target.value) }))
                  }
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                >
                  <option value={1}>Мужской</option>
                  <option value={2}>Женский</option>
                </select>
                <input
                  value={editForm.address}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, address: event.target.value }))}
                  placeholder="Адрес"
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 md:col-span-2"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="rounded-2xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:bg-slate-400"
              >
                {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </form>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 px-5 py-10 text-center text-sm text-slate-500">
              Пациент пока не выбран.
            </div>
          )}
        </section>
      </section>
    </div>
  )
}

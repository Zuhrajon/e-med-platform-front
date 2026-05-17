import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import ProfileDetailsSection, {
  type ProfileFormState,
} from '../../components/account/ProfileDetailsSection'
import SecuritySettingsSection from '../../components/account/SecuritySettingsSection'
import { useUser } from '../../context/UserContext'
import { saveCachedDoctorDescription } from '../../lib/doctorDescription'
import {
  getCachedDoctorPhoto,
  removeCachedDoctorPhoto,
  saveCachedDoctorPhoto,
} from '../../lib/doctorPhoto'
import { genderLabelToId, updateMyProfile } from '../../lib/profile'

function buildForm(user: ReturnType<typeof useUser>['user']): ProfileFormState {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    middleName: user.middleName,
    email: user.email,
    phone: user.phone,
    gender: user.gender === 'Женский' ? 'Женский' : 'Мужской',
    birthDate: user.birthDate,
    address: user.address,
    documentNumber: user.documentNumber,
    description: user.description,
  }
}

export default function DoctorProfilePage() {
  const { accessToken, user, updateUser } = useUser()
  const [form, setForm] = useState<ProfileFormState>(() => buildForm(user))
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [photoUrl, setPhotoUrl] = useState(() => getCachedDoctorPhoto(user.userId || ''))

  useEffect(() => {
    if (!isEditing) {
      setForm(buildForm(user))
    }
  }, [user, isEditing])

  useEffect(() => {
    setPhotoUrl(getCachedDoctorPhoto(user.userId || ''))
  }, [user.userId])

  function handleChange(field: keyof ProfileFormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !user.userId) return

    if (!file.type.startsWith('image/')) {
      setError('Выберите файл изображения.')
      setSuccess('')
      return
    }

    if (file.size > 1024 * 1024) {
      setError('Размер фото должен быть не больше 1 МБ.')
      setSuccess('')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      if (!result) return

      saveCachedDoctorPhoto(user.userId || '', result)
      setPhotoUrl(result)
      updateUser({ avatar: result })
      setError('')
      setSuccess('Фото профиля обновлено.')
    }
    reader.onerror = () => {
      setError('Не удалось загрузить фото.')
      setSuccess('')
    }
    reader.readAsDataURL(file)
  }

  function handleRemovePhoto() {
    if (!user.userId) return

    removeCachedDoctorPhoto(user.userId)
    setPhotoUrl('')
    updateUser({ avatar: null })
    setError('')
    setSuccess('Фото профиля удалено.')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!accessToken) return

    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      await updateMyProfile(accessToken, {
        first_name: form.firstName,
        last_name: form.lastName,
        middle_name: form.middleName,
        phone_number: form.phone,
        gender_id: genderLabelToId(form.gender),
        passport_number: form.documentNumber,
        address: form.address,
        date_of_birth: form.birthDate,
        description: form.description || '',
      })

      updateUser({
        firstName: form.firstName,
        lastName: form.lastName,
        middleName: form.middleName,
        phone: form.phone,
        gender: form.gender,
        birthDate: form.birthDate,
        address: form.address,
        documentNumber: form.documentNumber,
        description: form.description || '',
      })
      if (user.userId) {
        saveCachedDoctorDescription(user.userId, form.description || '')
      }
      setIsEditing(false)
      setSuccess('Профиль врача обновлён.')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Не удалось обновить профиль')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full bg-[#f7f7f8] px-6 py-10">
      <header>
        <h1 className="text-[25px] font-semibold text-slate-900">Профиль</h1>
        <p className="mt-2 text-[17px] text-slate-500">
          Личные данные врача, описание профиля и управление паролем.
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

      <div className="mt-8 space-y-6">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Фото врача"
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-2xl font-semibold text-slate-900">
                  {[user.firstName, user.lastName]
                    .filter(Boolean)
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2) || 'В'}
                </div>
              )}

              <div>
                <h2 className="text-[22px] font-semibold text-slate-900">Фото врача</h2>
                <p className="mt-2 text-[15px] text-slate-500">
                  Это фото будет отображаться в карточке врача.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <label className="cursor-pointer rounded-2xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800">
                Загрузить фото
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="sr-only"
                />
              </label>

              {photoUrl ? (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Удалить
                </button>
              ) : null}
            </div>
          </div>
        </section>

        <ProfileDetailsSection
          title="Личные и профессиональные данные"
          subtitle="Поля, доступные врачу, синхронизируются с серверным профилем."
          form={form}
          isEditing={isEditing}
          isSaving={isSaving}
          showDescription
          readOnlyBadges={[
            { label: 'Специальность', value: user.specialization || '—' },
            { label: 'Квалификация', value: user.qualification || '—' },
            { label: 'Должность', value: user.position || 'Врач' },
          ]}
          onChange={handleChange}
          onStartEdit={() => {
            setForm(buildForm(user))
            setIsEditing(true)
            setError('')
            setSuccess('')
          }}
          onCancelEdit={() => {
            setForm(buildForm(user))
            setIsEditing(false)
          }}
          onSubmit={handleSubmit}
        />

        <SecuritySettingsSection className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm" />
      </div>
    </div>
  )
}

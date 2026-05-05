import { useEffect, useState, type FormEvent } from 'react'
import ProfileDetailsSection, {
  type ProfileFormState,
} from '../../components/account/ProfileDetailsSection'
import SecuritySettingsSection from '../../components/account/SecuritySettingsSection'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import { useUser } from '../../context/UserContext'
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
  }
}

export default function AdminProfilePage() {
  const { accessToken, user, updateUser } = useUser()
  const [form, setForm] = useState<ProfileFormState>(() => buildForm(user))
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!isEditing) {
      setForm(buildForm(user))
    }
  }, [isEditing, user])

  function handleChange(field: keyof ProfileFormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
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
      })
      setIsEditing(false)
      setSuccess('Профиль администратора обновлён.')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Не удалось обновить профиль')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full px-6 py-10">
      <AdminPageHeader
        title="Профиль"
        description="Личные данные администратора и управление паролем."
      />

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

      <div className="mt-8 max-w-4xl space-y-6">
        <ProfileDetailsSection
          title="Личные данные"
          subtitle="Изменения применяются к серверному профилю администратора."
          form={form}
          isEditing={isEditing}
          isSaving={isSaving}
          readOnlyBadges={[{ label: 'Роль', value: 'Администратор' }]}
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

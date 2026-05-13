import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AdminSpecialtiesCard from '../../components/admin/AdminSpecialtiesCard'
import AdminStaffFormCard from '../../components/admin/AdminStaffFormCard'
import AdminStaffListCard from '../../components/admin/AdminStaffListCard'
import AdminStatusMessage from '../../components/admin/AdminStatusMessage'
import {
  initialCreateStaffForm,
  nextSpecialtyID,
  toEditStaffForm,
  type CreateStaffForm,
  type EditStaffForm,
} from '../../components/admin/AdminUsers.shared'
import { useUser } from '../../context/UserContext'
import {
  createDoctorStaff,
  createSpecialty,
  deleteSpecialty,
  deleteStaff,
  getStaffByID,
  listSpecialties,
  listStaff,
  resetStaffPassword,
  updateSpecialty,
  updateStaff,
  updateStaffStatus,
  type CreateStaffPayload,
  type Specialty,
  type StaffMember,
} from '../../lib/admin'

export default function AdminUsersPage() {
  const { accessToken } = useUser()
  const formRef = useRef<HTMLDivElement | null>(null)
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'' | 'doctor' | 'receptionist' | 'laborant'>('')
  const [createForm, setCreateForm] = useState<CreateStaffForm>(initialCreateStaffForm)
  const [editForm, setEditForm] = useState<EditStaffForm | null>(null)
  const [specialtyName, setSpecialtyName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [isSavingSpecialty, setIsSavingSpecialty] = useState(false)
  const [pendingActionId, setPendingActionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const activeSpecialties = useMemo(
    () => specialties.filter((item) => item.is_active),
    [specialties],
  )

  async function loadData(currentSearch = search, currentRole = roleFilter) {
    if (!accessToken) return

    setIsLoading(true)
    setError(null)

    try {
      const [staffResponse, specialtiesResponse] = await Promise.all([
        listStaff(accessToken, {
          search: currentSearch.trim() || undefined,
          role: currentRole,
        }),
        listSpecialties(accessToken),
      ])

      setStaff(staffResponse)
      setSpecialties(specialtiesResponse.sort((a, b) => a.name.localeCompare(b.name)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить данные')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [accessToken])

  useEffect(() => {
    if (!createForm.specialty_id && activeSpecialties.length) {
      setCreateForm((prev) => ({ ...prev, specialty_id: nextSpecialtyID(activeSpecialties) }))
    }
  }, [activeSpecialties, createForm.specialty_id])

  useEffect(() => {
    if (!editForm) return

    formRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [editForm])

  function updateCreate<K extends keyof CreateStaffForm>(key: K, value: CreateStaffForm[K]) {
    setCreateForm((prev) => ({ ...prev, [key]: value }))
  }

  function updateEdit<K extends keyof EditStaffForm>(key: K, value: EditStaffForm[K]) {
    setEditForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  async function onEdit(item: StaffMember) {
    if (!accessToken) return

    setPendingActionId(item.user_id)
    setError(null)

    try {
      const response = await getStaffByID(accessToken, item.user_id)
      setEditForm(toEditStaffForm(response))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить сотрудника')
    } finally {
      setPendingActionId(null)
    }
  }

  function onFiles(
    key: 'passport_files' | 'diploma_files' | 'employment_record_files',
    event: ChangeEvent<HTMLInputElement>,
  ) {
    updateCreate(key, Array.from(event.target.files ?? []))
  }

  async function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await loadData(search, roleFilter)
  }

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!accessToken) return

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const payload: CreateStaffPayload =
        createForm.role === 'doctor'
          ? createForm
          : { ...createForm, specialty_id: '', work_experience_years: '', appointment_fee: '' }

      const response = await createDoctorStaff(accessToken, payload)
      setSuccess(
        response.temporary_password_sent
          ? 'Сотрудник создан. Временный пароль отправлен на email.'
          : 'Сотрудник создан, но отправка временного пароля не подтверждена.',
      )
      setCreateForm({ ...initialCreateStaffForm, specialty_id: nextSpecialtyID(activeSpecialties) })
      await loadData(search, roleFilter)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать сотрудника')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function onSaveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!accessToken || !editForm) return

    setIsSavingEdit(true)
    setError(null)
    setSuccess(null)

    try {
      await updateStaff(
        accessToken,
        editForm.user_id,
        editForm.role === 'doctor'
          ? {
              email: editForm.email,
              phone_number: editForm.phone_number,
              specialty_id: editForm.specialty_id,
              appointment_fee: editForm.appointment_fee,
              work_experience_years: Number(editForm.work_experience_years),
              is_active: editForm.is_active,
            }
          : {
              email: editForm.email,
              phone_number: editForm.phone_number,
              is_active: editForm.is_active,
            },
      )
      setSuccess('Данные сотрудника обновлены.')
      setEditForm(null)
      await loadData(search, roleFilter)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось обновить сотрудника')
    } finally {
      setIsSavingEdit(false)
    }
  }

  async function onResetPassword(item: StaffMember) {
    if (!accessToken) return

    setPendingActionId(item.user_id)
    setError(null)
    setSuccess(null)

    try {
      await resetStaffPassword(accessToken, item.user_id)
      setSuccess(`Одноразовый пароль отправлен на ${item.email}.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сбросить пароль')
    } finally {
      setPendingActionId(null)
    }
  }

  async function onToggleStatus(item: StaffMember) {
    if (!accessToken) return

    setPendingActionId(item.user_id)
    setError(null)
    setSuccess(null)

    try {
      await updateStaffStatus(accessToken, item.user_id, !item.is_active)
      setSuccess(item.is_active ? 'Сотрудник деактивирован.' : 'Сотрудник активирован.')
      if (editForm?.user_id === item.user_id) {
        setEditForm((prev) => (prev ? { ...prev, is_active: !item.is_active } : prev))
      }
      await loadData(search, roleFilter)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось изменить статус сотрудника')
    } finally {
      setPendingActionId(null)
    }
  }

  async function onDelete(item: StaffMember) {
    if (!accessToken) return
    if (!window.confirm(`Удалить сотрудника ${item.full_name || item.email}?`)) return

    setPendingActionId(item.user_id)
    setError(null)
    setSuccess(null)

    try {
      await deleteStaff(accessToken, item.user_id)
      setSuccess('Сотрудник удалён.')
      if (editForm?.user_id === item.user_id) setEditForm(null)
      await loadData(search, roleFilter)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось удалить сотрудника')
    } finally {
      setPendingActionId(null)
    }
  }

  async function onCreateSpecialty(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!accessToken) return

    setIsSavingSpecialty(true)
    setError(null)

    try {
      await createSpecialty(accessToken, specialtyName)
      setSpecialtyName('')
      await loadData(search, roleFilter)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать специальность')
    } finally {
      setIsSavingSpecialty(false)
    }
  }

  async function onToggleSpecialty(item: Specialty) {
    if (!accessToken) return

    setError(null)

    try {
      await updateSpecialty(accessToken, item.id, {
        name: item.name,
        is_active: !item.is_active,
      })
      await loadData(search, roleFilter)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось изменить статус специальности')
    }
  }

  async function onDeleteSpecialty(item: Specialty) {
    if (!accessToken) return

    setError(null)

    try {
      await deleteSpecialty(accessToken, item.id)
      await loadData(search, roleFilter)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось удалить специальность')
    }
  }

  return (
    <div className="w-full px-6 py-10">
      <AdminPageHeader
        title="Сотрудники"
        description="Поиск по сотрудникам, ручной сброс пароля и обновление оплаты труда."
      />

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

      <section className="mt-8 grid gap-6 2xl:grid-cols-[1.2fr_0.9fr]">
        <div className="space-y-6">
          <AdminStaffListCard
            staff={staff}
            isLoading={isLoading}
            search={search}
            roleFilter={roleFilter}
            pendingActionId={pendingActionId}
            onSearchSubmit={onSearch}
            onSearchChange={setSearch}
            onRoleFilterChange={setRoleFilter}
            onEdit={onEdit}
            onToggleStatus={onToggleStatus}
            onResetPassword={onResetPassword}
            onDelete={onDelete}
          />

          <AdminSpecialtiesCard
            specialties={specialties}
            specialtyName={specialtyName}
            isSaving={isSavingSpecialty}
            onNameChange={setSpecialtyName}
            onSubmit={onCreateSpecialty}
            onToggle={onToggleSpecialty}
            onDelete={onDeleteSpecialty}
          />
        </div>

        <div ref={formRef} className="space-y-6">
          <AdminStaffFormCard
            createForm={createForm}
            editForm={editForm}
            activeSpecialties={activeSpecialties}
            isSubmitting={isSubmitting}
            isSavingEdit={isSavingEdit}
            onCreateSubmit={onCreate}
            onEditSubmit={onSaveEdit}
            onCreateChange={updateCreate}
            onEditChange={updateEdit}
            onFilesChange={onFiles}
            onCancelEdit={() => setEditForm(null)}
          />
        </div>
      </section>
    </div>
  )
}

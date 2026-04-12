import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useUser } from '../../context/UserContext'
import DoctorSecuritySettings from '../../components/doctor/DoctorSecuritySettings'

export default function DoctorProfilePage() {
  const { user, updateUser } = useUser()
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    middleName: user.middleName,
    email: user.email,
    phone: user.phone,
    position: user.position,
    officeNumber: user.officeNumber,
    department: user.department,
    specialization: user.specialization,
    qualification: user.qualification,
    description: user.description,
  })

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!isEditing) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        email: user.email,
        phone: user.phone,
        position: user.position,
        officeNumber: user.officeNumber,
        department: user.department,
        specialization: user.specialization,
        qualification: user.qualification,
        description: user.description,
      })
    }
  }, [user, isEditing])

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`

  const handleEdit = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      email: user.email,
      phone: user.phone,
      position: user.position,
      officeNumber: user.officeNumber,
      department: user.department,
      specialization: user.specialization,
      qualification: user.qualification,
      description: user.description,
    })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      email: user.email,
      phone: user.phone,
      position: user.position,
      officeNumber: user.officeNumber,
      department: user.department,
      specialization: user.specialization,
      qualification: user.qualification,
      description: user.description,
    })
    setIsEditing(false)
  }

  const handleSave = () => {
    updateUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
      middleName: formData.middleName,
      email: formData.email,
      phone: formData.phone,
      position: formData.position,
      officeNumber: formData.officeNumber,
      department: formData.department,
      specialization: formData.specialization,
      qualification: formData.qualification,
      description: formData.description,
    })
    setIsEditing(false)
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      updateUser({ avatar: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="w-full bg-[#f7f7f8] px-8 py-8 md:px-12">
      <header className="mb-8">
        <h1 className="text-4xl font-semibold text-slate-900">Профиль</h1>
        <p className="mt-3 text-xl text-gray-500">
          Управляйте своей профессиональной информацией
        </p>
      </header>

      <div className="space-y-8">
        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Аватар"
                className="h-44 w-44 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-44 w-44 items-center justify-center rounded-full bg-gray-100 text-5xl font-medium text-slate-900">
                {initials || 'Д'}
              </div>
            )}

            <h2 className="mt-6 text-3xl font-semibold text-slate-900">
              {user.firstName} {user.lastName}
            </h2>

            <p className="mt-2 text-2xl text-gray-500">{user.email}</p>

            <button
              type="button"
              onClick={handlePhotoClick}
              className="mt-8 w-full max-w-3xl rounded-2xl border border-gray-200 px-6 py-4 text-2xl font-medium text-slate-900 transition hover:bg-gray-50"
            >
              Изменить фото
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-slate-900">
              Личная и профессиональная информация
            </h2>

            {!isEditing && (
              <button
                type="button"
                onClick={handleEdit}
                className="rounded-2xl border border-gray-200 px-6 py-3 text-xl font-medium text-slate-900 transition hover:bg-gray-50"
              >
                Редактировать
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-3 block text-2xl font-semibold text-slate-900">
                Имя
              </label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-2xl outline-none disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="mb-3 block text-2xl font-semibold text-slate-900">
                Фамилия
              </label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-2xl outline-none disabled:bg-gray-50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-3 block text-2xl font-semibold text-slate-900">
                Отчество
              </label>
              <input
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-2xl outline-none disabled:bg-gray-50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-3 block text-2xl font-semibold text-slate-900">
                Email
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-2xl outline-none disabled:bg-gray-50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-3 block text-2xl font-semibold text-slate-900">
                Телефон
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-2xl outline-none disabled:bg-gray-50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-3 block text-2xl font-semibold text-slate-900">
                Должность
              </label>
              <input
                name="position"
                value={formData.position}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-2xl outline-none disabled:bg-gray-50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-3 block text-2xl font-semibold text-slate-900">
                Кабинет / номер кабинета
              </label>
              <input
                name="officeNumber"
                value={formData.officeNumber}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-2xl outline-none disabled:bg-gray-50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-3 block text-2xl font-semibold text-slate-900">
                Отделение / подразделение
              </label>
              <input
                name="department"
                value={formData.department}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-2xl outline-none disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="mb-3 block text-2xl font-semibold text-slate-900">
                Специализация
              </label>
              <input
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-2xl outline-none disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="mb-3 block text-2xl font-semibold text-slate-900">
                Квалификация / категория
              </label>
              <input
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-2xl outline-none disabled:bg-gray-50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-3 block text-2xl font-semibold text-slate-900">
                Короткое описание
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={!isEditing}
                rows={5}
                className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-2xl outline-none disabled:bg-gray-50"
              />
            </div>
          </div>

          {isEditing && (
            <div className="mt-8 flex gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-2xl border border-gray-200 px-6 py-3 text-xl font-medium text-slate-900 transition hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-2xl bg-emerald-600 px-6 py-3 text-xl font-medium text-white transition hover:bg-emerald-700"
              >
                Сохранить
              </button>
            </div>
          )}
        </section>

        <DoctorSecuritySettings />
      </div>
    </div>
  )
}
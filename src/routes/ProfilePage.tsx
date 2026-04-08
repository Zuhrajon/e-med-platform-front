import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useUser } from '../context/UserContext'

export default function ProfilePage() {
  const { user, updateUser } = useUser()
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    middleName: user.middleName,
    email: user.email,
    phone: user.phone,
    gender: user.gender,
    birthDate: user.birthDate,
    address: user.address,
    documentNumber: user.documentNumber,
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
        gender: user.gender,
        birthDate: user.birthDate,
        address: user.address,
        documentNumber: user.documentNumber,
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
      gender: user.gender,
      birthDate: user.birthDate,
      address: user.address,
      documentNumber: user.documentNumber,
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
      gender: user.gender,
      birthDate: user.birthDate,
      address: user.address,
      documentNumber: user.documentNumber,
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
      gender: formData.gender,
      birthDate: formData.birthDate,
      address: formData.address,
      documentNumber: formData.documentNumber,
    })
    setIsEditing(false)
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
    <div className="flex min-h-screen bg-[#f7f7f8]">
      <div className="w-full px-8 py-8 md:px-12">
        <header className="mb-8">
          <h1 className="text-4xl font-semibold text-slate-900">Профиль</h1>
          <p className="mt-3 text-xl text-gray-500">
            Управляйте своей личной информацией
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
                  {initials || 'П'}
                </div>
              )}

              <h2 className="mt-6 text-3xl font-semibold text-slate-900">
                {user.firstName} {user.lastName}
              </h2>

              <p className="mt-2 text-2xl text-gray-500">{user.email}</p>

              <button
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
                Личная информация
              </h2>

              {!isEditing && (
                <button
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

              <div>
                <label className="mb-3 block text-2xl font-semibold text-slate-900">
                  Пол
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-2xl outline-none disabled:bg-gray-50"
                >
                  <option value="">Выберите пол</option>
                  <option value="Мужской">Мужской</option>
                  <option value="Женский">Женский</option>
                </select>
              </div>

              <div>
                <label className="mb-3 block text-2xl font-semibold text-slate-900">
                  Дата рождения
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-2xl outline-none disabled:bg-gray-50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-3 block text-2xl font-semibold text-slate-900">
                  Адрес
                </label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-2xl outline-none disabled:bg-gray-50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-3 block text-2xl font-semibold text-slate-900">
                  Номер документа
                </label>
                <input
                  name="documentNumber"
                  value={formData.documentNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-2xl outline-none disabled:bg-gray-50"
                />
              </div>
            </div>

            {isEditing && (
              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleCancel}
                  className="rounded-2xl border border-gray-200 px-6 py-3 text-xl font-medium text-slate-900 transition hover:bg-gray-50"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSave}
                  className="rounded-2xl bg-emerald-600 px-6 py-3 text-xl font-medium text-white transition hover:bg-emerald-700"
                >
                  Сохранить
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
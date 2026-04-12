import { useState } from 'react'
import { useUser } from '../../context/UserContext'

export default function DoctorSecuritySettings() {
  const { user, updateUser } = useUser()

  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleStartEdit = () => {
    setIsEditingPassword(true)
    setError('')
    setSuccessMessage('')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleCancel = () => {
    setIsEditingPassword(false)
    setError('')
    setSuccessMessage('')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleSavePassword = () => {
    setError('')
    setSuccessMessage('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Заполните все поля')
      return
    }

    if (currentPassword !== user.password) {
      setError('Текущий пароль введён неверно')
      return
    }

    if (newPassword.length < 6) {
      setError('Новый пароль должен содержать минимум 6 символов')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают')
      return
    }

    updateUser({ password: newPassword })
    setSuccessMessage('Пароль успешно изменён')
    setIsEditingPassword(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-slate-900">
          Настройки безопасности
        </h2>

        {!isEditingPassword && (
          <button
            type="button"
            onClick={handleStartEdit}
            className="rounded-2xl border border-gray-200 px-6 py-3 text-xl font-medium text-slate-900 transition hover:bg-gray-50"
          >
            Изменить
          </button>
        )}
      </div>

      {!isEditingPassword ? (
        <div className="border-b border-gray-200 pb-6">
          <p className="text-2xl font-semibold text-slate-900">Пароль</p>
          <p className="mt-2 text-2xl text-gray-500">••••••••</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="mb-3 block text-2xl font-semibold text-slate-900">
              Текущий пароль
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-2xl outline-none"
            />
          </div>

          <div>
            <label className="mb-3 block text-2xl font-semibold text-slate-900">
              Новый пароль
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-2xl outline-none"
            />
          </div>

          <div>
            <label className="mb-3 block text-2xl font-semibold text-slate-900">
              Повторите новый пароль
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-2xl outline-none"
            />
          </div>

          {error && (
            <p className="text-lg text-red-500">{error}</p>
          )}

          {successMessage && (
            <p className="text-lg text-emerald-600">{successMessage}</p>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-2xl border border-gray-200 px-6 py-3 text-xl font-medium text-slate-900 transition hover:bg-gray-50"
            >
              Отмена
            </button>

            <button
              type="button"
              onClick={handleSavePassword}
              className="rounded-2xl bg-emerald-600 px-6 py-3 text-xl font-medium text-white transition hover:bg-emerald-700"
            >
              Сохранить
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
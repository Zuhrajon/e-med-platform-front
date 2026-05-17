import { useState } from 'react'
import { ApiError } from '../../lib/api'
import { useUser } from '../../context/UserContext'

type SecuritySettingsSectionProps = {
  className?: string
}

export default function SecuritySettingsSection({
  className = 'mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm',
}: SecuritySettingsSectionProps) {
  const { changePassword } = useUser()
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const resetFields = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleStartEdit = () => {
    setIsEditingPassword(true)
    setError('')
    setSuccessMessage('')
    resetFields()
  }

  const handleCancel = () => {
    setIsEditingPassword(false)
    setError('')
    setSuccessMessage('')
    resetFields()
  }

  const handleSavePassword = async () => {
    setError('')
    setSuccessMessage('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Заполните все поля')
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

    setIsSaving(true)

    try {
      await changePassword(currentPassword, newPassword)
      setSuccessMessage('Пароль успешно изменён')
      setIsEditingPassword(false)
      resetFields()
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setError('Текущий пароль введён неверно')
      } else if (error instanceof ApiError && error.status === 400) {
        setError('Проверьте введённые данные')
      } else {
        setError('Не удалось изменить пароль')
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className={className}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Настройки безопасности</h2>
        {!isEditingPassword && (
          <button
            type="button"
            onClick={handleStartEdit}
            className="rounded-2xl border border-gray-200 px-5 py-2 text-base font-medium text-slate-900 transition hover:bg-gray-50"
          >
            Изменить
          </button>
        )}
      </div>

      {!isEditingPassword ? (
        <div>
          <p className="text-sm text-slate-500">Пароль</p>
          <p className="mt-2 text-lg text-slate-900">••••••••</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-500">Текущий пароль</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-base outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-500">Новый пароль</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-base outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-500">Повторите новый пароль</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-base outline-none focus:border-sky-500"
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-2xl border border-gray-200 px-6 py-3 text-base font-medium text-slate-900 transition hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleSavePassword}
              disabled={isSaving}
              className="rounded-2xl bg-sky-700 px-6 py-3 text-base font-medium text-white transition hover:bg-sky-800 disabled:opacity-70"
            >
              {isSaving ? 'Сохраняем...' : 'Сохранить'}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

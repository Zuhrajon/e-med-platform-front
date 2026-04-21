import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../../lib/api'
import { forgotPasswordRequest } from '../../lib/auth'

type ForgotPasswordResult =
  | null
  | 'temporary_password_sent'
  | 'contact_administrator'
  | 'contact_developers'
  | 'check_email_if_exists'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ForgotPasswordResult>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setResult(null)

    if (!email.trim()) {
      setError('Введите email')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await forgotPasswordRequest(email.trim())
      setResult(response.next_step)
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        setError('Проверьте корректность email')
      } else {
        setError('Не удалось обработать запрос. Попробуйте позже.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  function renderMessage() {
    if (result === 'temporary_password_sent') {
      return 'Если этот email принадлежит пациенту, на почту отправлен одноразовый пароль.'
    }

    if (result === 'contact_administrator') {
      return 'Для сотрудников, врачей и регистратуры самостоятельный сброс недоступен. Обратитесь к администратору сети.'
    }

    if (result === 'contact_developers') {
      return 'Для администратора самостоятельный сброс недоступен. Нужно обратиться к разработчикам.'
    }

    if (result === 'check_email_if_exists') {
      return 'Если такой email существует в системе, дальнейшие инструкции уже определены правилами восстановления.'
    }

    return null
  }

  const message = renderMessage()

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7f8] px-4">
      <div className="w-full max-w-2xl rounded-[32px] bg-white p-10 shadow-sm">
        <h1 className="text-4xl font-semibold text-slate-900">Восстановление пароля</h1>
        <p className="mt-3 text-lg text-slate-500">
          Введите email. Для пациентов система отправит одноразовый пароль, для сотрудников покажет следующий шаг.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block text-lg font-medium text-slate-800">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="example@mail.ru"
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-lg text-slate-900 outline-none transition focus:border-sky-500"
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-14 w-full rounded-2xl bg-sky-700 text-lg font-medium text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Отправляем...' : 'Продолжить'}
          </button>
        </form>

        <p className="mt-6 text-center text-base text-slate-500">
          <Link to="/" className="font-medium text-sky-700 hover:text-sky-800">
            Вернуться ко входу
          </Link>
        </p>
      </div>
    </div>
  )
}

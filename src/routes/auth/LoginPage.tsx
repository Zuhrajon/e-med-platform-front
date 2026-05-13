import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../../lib/api'
import { useUser } from '../../context/UserContext'

type LoginForm = {
  email: string
  password: string
}

type FieldErrors = {
  email?: string
  password?: string
  general?: string
}

export default function LoginPage() {
  const { login } = useUser()
  const navigate = useNavigate()

  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate(values: LoginForm): FieldErrors {
    const newErrors: FieldErrors = {}

    if (!values.email.trim()) {
      newErrors.email = 'Введите email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = 'Введите корректный email'
    }

    if (!values.password.trim()) {
      newErrors.password = 'Введите пароль'
    } else if (values.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов'
    }

    return newErrors
  }

  function handleChange(field: keyof LoginForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const role = await login({
        email: form.email.trim(),
        password: form.password,
      })

      if (role === 'doctor') {
        navigate('/doctor')
      } else if (role === 'laboratory') {
        navigate('/laboratory')
      } else if (role === 'receptionist') {
        navigate('/reception')
      } else if (role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/app')
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setErrors({ general: 'Неверный email или пароль' })
        } else if (error.status === 403) {
          setErrors({ general: 'Пользователь деактивирован' })
        } else {
          setErrors({ general: 'Не удалось войти. Попробуйте позже.' })
        }
      } else {
        setErrors({ general: 'Не удалось войти. Попробуйте позже.' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7f8] px-4">
      <div className="w-full max-w-2xl rounded-[32px] bg-white p-10 shadow-sm">
        <h1 className="text-4xl font-semibold text-slate-900">Вход в систему</h1>
        <p className="mt-3 text-lg text-slate-500">Введите свои данные для входа</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block text-lg font-medium text-slate-800">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(event) => handleChange('email', event.target.value)}
              placeholder="example@mail.ru"
              className={`h-14 w-full rounded-2xl border bg-white px-5 text-lg text-slate-900 outline-none transition ${
                errors.email
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-slate-200 focus:border-sky-500'
              }`}
            />
            {errors.email ? <p className="mt-2 text-sm text-red-500">{errors.email}</p> : null}
          </div>

          <div>
            <label className="mb-2 block text-lg font-medium text-slate-800">Пароль</label>
            <input
              type="password"
              value={form.password}
              onChange={(event) => handleChange('password', event.target.value)}
              placeholder="••••••••"
              className={`h-14 w-full rounded-2xl border bg-white px-5 text-lg text-slate-900 outline-none transition ${
                errors.password
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-slate-200 focus:border-sky-500'
              }`}
            />
            {errors.password ? (
              <p className="mt-2 text-sm text-red-500">{errors.password}</p>
            ) : null}
            <div className="mt-3 text-right">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-sky-700 hover:text-sky-800"
              >
                Забыли пароль?
              </Link>
            </div>
          </div>

          {errors.general ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {errors.general}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-14 w-full rounded-2xl bg-sky-700 text-lg font-medium text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Входим...' : 'Войти'}
          </button>
        </form>

        <p className="mt-6 text-center text-base text-slate-500">
          Нет аккаунта?{' '}
          <Link to="/register" className="font-medium text-sky-700 hover:text-sky-800">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}

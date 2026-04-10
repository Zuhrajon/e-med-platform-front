import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
    const { setUser } = useUser()
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
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }))

        setErrors((prev) => ({
            ...prev,
            [field]: undefined,
            general: undefined,
        }))
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const validationErrors = validate(form)
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setIsSubmitting(true)
        setErrors({})

        try {
            setUser({
                firstName: 'Иван',
                lastName: 'Петров',
                middleName: '',
                email: form.email,
                phone: '+7 (999) 123-45-67',
                gender: '',
                birthDate: '',
                address: '',
                documentNumber: '',
                avatar: null,
                appointments: [],
            })

            navigate('/app')
        } catch (error) {
            console.error(error)
            setErrors({
                general: 'Не удалось войти. Проверьте данные и попробуйте снова.',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#f4f6f8] px-4 py-8">
            <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
                <div className="w-full max-w-[720px] rounded-[32px] bg-white px-8 py-10 shadow-sm sm:px-14 sm:py-12">
                    <div className="mb-10 flex flex-col items-center">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-sm">
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M3 12H7L9.5 5L13.5 19L16 12H21"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>

                        <h1 className="text-center text-3xl font-semibold text-slate-900 sm:text-4xl">
                            Вход в систему
                        </h1>
                        <p className="mt-4 text-center text-lg text-slate-500">
                            Введите свои данные для входа
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate className="space-y-7">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-3 block text-xl font-medium text-slate-900"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                value={form.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="example@mail.ru"
                                className={`h-16 w-full rounded-2xl border bg-white px-5 text-xl text-slate-900 outline-none transition ${errors.email
                                    ? 'border-red-400 focus:border-red-500'
                                    : 'border-slate-200 focus:border-sky-500'
                                    }`}
                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-3 block text-xl font-medium text-slate-900"
                            >
                                Пароль
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                value={form.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                placeholder="••••••••"
                                className={`h-16 w-full rounded-2xl border bg-white px-5 text-xl text-slate-900 outline-none transition ${errors.password
                                    ? 'border-red-400 focus:border-red-500'
                                    : 'border-slate-200 focus:border-sky-500'
                                    }`}
                            />
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>

                        {errors.general && (
                            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {errors.general}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-16 w-full rounded-2xl bg-sky-600 text-2xl font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isSubmitting ? 'Входим...' : 'Войти'}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-lg text-slate-500">
                            Нет аккаунта?{' '}
                            <Link
                                to="/register"
                                className="font-medium text-sky-600 transition hover:text-sky-700"
                            >
                                Зарегистрироваться
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

type RegisterForm = {
    firstName: string
    lastName: string
    middleName: string
    phone: string
    email: string
    gender: string
    birthDate: string
    address: string
    documentNumber: string
    password: string
    confirmPassword: string
}

type FieldErrors = Partial<Record<keyof RegisterForm, string>> & {
    general?: string
}

export default function RegisterPage() {
    const navigate = useNavigate()
    const { setUser } = useUser()

    const [form, setForm] = useState<RegisterForm>({
        firstName: '',
        lastName: '',
        middleName: '',
        phone: '',
        email: '',
        gender: '',
        birthDate: '',
        address: '',
        documentNumber: '',
        password: '',
        confirmPassword: '',
    })

    const [errors, setErrors] = useState<FieldErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    function handleChange(field: keyof RegisterForm, value: string) {
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

    function validate(values: RegisterForm): FieldErrors {
        const newErrors: FieldErrors = {}

        if (!values.firstName.trim()) newErrors.firstName = 'Введите имя'
        if (!values.lastName.trim()) newErrors.lastName = 'Введите фамилию'
        if (!values.phone.trim()) newErrors.phone = 'Введите телефон'
        if (!values.email.trim()) {
            newErrors.email = 'Введите email'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            newErrors.email = 'Введите корректный email'
        }

        if (!values.gender.trim()) newErrors.gender = 'Выберите пол'
        if (!values.birthDate.trim()) newErrors.birthDate = 'Укажите дату рождения'
        if (!values.address.trim()) newErrors.address = 'Введите адрес'
        if (!values.documentNumber.trim()) newErrors.documentNumber = 'Введите номер документа'

        if (!values.password.trim()) {
            newErrors.password = 'Введите пароль'
        } else if (values.password.length < 6) {
            newErrors.password = 'Пароль должен содержать минимум 6 символов'
        }

        if (!values.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Подтвердите пароль'
        } else if (values.password !== values.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают'
        }

        return newErrors
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
                firstName: form.firstName,
                lastName: form.lastName,
                middleName: form.middleName,
                email: form.email,
                phone: form.phone,
                gender: form.gender,
                birthDate: form.birthDate,
                address: form.address,
                documentNumber: form.documentNumber,
                avatar: null,
                appointments: [],
            })

            navigate('/app')
        } catch (error) {
            setErrors({
                general: 'Не удалось зарегистрироваться. Попробуйте снова.',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#f4f6f8] px-4 py-8">
            <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
                <div className="w-full max-w-[760px] rounded-[32px] bg-white px-8 py-10 shadow-sm sm:px-14 sm:py-12">
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
                            Регистрация
                        </h1>
                        <p className="mt-4 text-center text-lg text-slate-500">
                            Создайте новый аккаунт
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate className="space-y-6">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-lg font-medium text-slate-900">Имя</label>
                                <input
                                    value={form.firstName}
                                    onChange={(e) => handleChange('firstName', e.target.value)}
                                    className="h-14 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-sky-500"
                                    placeholder="Иван"
                                />
                                {errors.firstName && <p className="mt-2 text-sm text-red-500">{errors.firstName}</p>}
                            </div>

                            <div>
                                <label className="mb-2 block text-lg font-medium text-slate-900">Фамилия</label>
                                <input
                                    value={form.lastName}
                                    onChange={(e) => handleChange('lastName', e.target.value)}
                                    className="h-14 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-sky-500"
                                    placeholder="Петров"
                                />
                                {errors.lastName && <p className="mt-2 text-sm text-red-500">{errors.lastName}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-lg font-medium text-slate-900">
                                Отчество
                            </label>
                            <input
                                value={form.middleName}
                                onChange={(e) => handleChange('middleName', e.target.value)}
                                className="h-14 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-sky-500"
                                placeholder="Необязательно"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-lg font-medium text-slate-900">Телефон</label>
                            <input
                                value={form.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                className="h-14 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-sky-500"
                                placeholder="+7 (999) 123-45-67"
                            />
                            {errors.phone && <p className="mt-2 text-sm text-red-500">{errors.phone}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-lg font-medium text-slate-900">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className="h-14 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-sky-500"
                                placeholder="example@mail.ru"
                            />
                            {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-lg font-medium text-slate-900">Пол</label>
                            <select
                                value={form.gender}
                                onChange={(e) => handleChange('gender', e.target.value)}
                                className="h-14 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-sky-500"
                            >
                                <option value="">Выберите пол</option>
                                <option value="male">Мужской</option>
                                <option value="female">Женский</option>
                            </select>
                            {errors.gender && <p className="mt-2 text-sm text-red-500">{errors.gender}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-lg font-medium text-slate-900">Дата рождения</label>
                            <input
                                type="date"
                                value={form.birthDate}
                                onChange={(e) => handleChange('birthDate', e.target.value)}
                                className="h-14 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-sky-500"
                            />
                            {errors.birthDate && <p className="mt-2 text-sm text-red-500">{errors.birthDate}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-lg font-medium text-slate-900">Адрес проживания</label>
                            <input
                                value={form.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                className="h-14 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-sky-500"
                                placeholder="Введите адрес"
                            />
                            {errors.address && <p className="mt-2 text-sm text-red-500">{errors.address}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-lg font-medium text-slate-900">
                                Номер документа
                            </label>
                            <input
                                value={form.documentNumber}
                                onChange={(e) => handleChange('documentNumber', e.target.value)}
                                className="h-14 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-sky-500"
                                placeholder="Паспорт"
                            />
                            {errors.documentNumber && (
                                <p className="mt-2 text-sm text-red-500">{errors.documentNumber}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-lg font-medium text-slate-900">Пароль</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                className="h-14 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-sky-500"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-lg font-medium text-slate-900">
                                Подтвердите пароль
                            </label>
                            <input
                                type="password"
                                value={form.confirmPassword}
                                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                className="h-14 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-sky-500"
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-2 text-sm text-red-500">{errors.confirmPassword}</p>
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
                            className="h-14 w-full rounded-2xl bg-sky-600 text-xl font-semibold text-white transition hover:bg-sky-700 disabled:opacity-70"
                        >
                            {isSubmitting ? 'Регистрируем...' : 'Зарегистрироваться'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-lg text-slate-500">
                            Уже есть аккаунт?{' '}
                            <Link to="/" className="font-medium text-sky-600 transition hover:text-sky-700">
                                Войти
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
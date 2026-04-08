import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { doctorsData } from '../data/doctors'
import { useAppointments } from '../context/AppointmentsContext'

const availableDates = ['10 апреля', '11 апреля', '14 апреля', '15 апреля', '16 апреля']
const availableTimes = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
]

export default function DoctorDetailsPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addAppointment } = useAppointments()

    const doctor = useMemo(
        () => doctorsData.find((item) => item.id === id),
        [id],
    )

    const [selectedDate, setSelectedDate] = useState(availableDates[0])
    const [selectedTime, setSelectedTime] = useState('')

    if (!doctor) {
        return (
            <div className="min-h-screen bg-[#f7f7f8] px-8 py-10">
                <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-sm">
                    <h1 className="text-2xl font-semibold text-slate-900">Врач не найден</h1>
                </div>
            </div>
        )
    }

    const initials = doctor.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)

    const handleBook = () => {
        if (!selectedDate || !selectedTime) return

        addAppointment({
            id: crypto.randomUUID(),
            doctorId: doctor.id,
            doctorName: doctor.name,
            specialty: doctor.specialty,
            date: selectedDate,
            time: selectedTime,
            status: 'Подтверждена',
            reason: 'Консультация',
        })

        navigate('/appointments')
    }

    return (
        <div className="min-h-screen bg-[#f7f7f8] px-8 py-10">
            <div className="mx-auto max-w-5xl">
                <button
                    onClick={() => navigate('/doctors')}
                    className="mb-8 text-[18px] font-medium text-slate-900"
                >
                    ← Назад к врачам
                </button>

                <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center">
                        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gray-100 text-4xl text-slate-900">
                            {initials}
                        </div>

                        <div>
                            <h1 className="text-[32px] font-semibold text-slate-900">{doctor.name}</h1>
                            <p className="mt-2 inline-block rounded-full bg-blue-100 px-4 py-1 text-[18px] text-blue-700">
                                {doctor.specialty}
                            </p>

                            <div className="mt-5 flex flex-col gap-2 text-[18px] text-gray-500 md:flex-row md:gap-8">
                                <span>⭐ {doctor.rating} ({doctor.reviewsCount})</span>
                                <span>Стаж {doctor.experience}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
                    <h2 className="text-[24px] font-semibold text-slate-900">О враче</h2>
                    <p className="mt-5 text-[18px] leading-8 text-gray-500">{doctor.description}</p>
                </div>

                <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
                    <h2 className="text-[24px] font-semibold text-slate-900">Запись на приём</h2>

                    <div className="mt-6">
                        <p className="text-[18px] text-gray-500">Стоимость приёма</p>
                        <p className="mt-2 text-[32px] font-semibold text-slate-900">{doctor.price} ₽</p>
                    </div>

                    <div className="mt-10">
                        <h3 className="text-[22px] font-semibold text-slate-900">Выберите дату</h3>

                        <div className="mt-4 flex flex-wrap gap-3">
                            {availableDates.map((date) => (
                                <button
                                    key={date}
                                    onClick={() => setSelectedDate(date)}
                                    className={`rounded-xl border px-4 py-3 text-[16px] font-medium transition ${selectedDate === date
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 bg-white text-slate-900 hover:bg-gray-50'
                                        }`}
                                >
                                    {date}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-10">
                        <h3 className="text-[22px] font-semibold text-slate-900">Выберите время</h3>

                        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                            {availableTimes.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`rounded-xl border px-4 py-4 text-[18px] font-medium transition ${selectedTime === time
                                        ? 'border-blue-500 bg-blue-50 text-slate-900'
                                        : 'border-gray-200 bg-white text-slate-900 hover:bg-gray-50'
                                        }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleBook}
                        disabled={!selectedTime}
                        className="mt-10 w-full rounded-2xl bg-sky-500 px-6 py-5 text-[22px] font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-sky-300"
                    >
                        Записаться на приём
                    </button>
                </div>
            </div>
        </div>
    )
}
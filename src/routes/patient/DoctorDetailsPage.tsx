import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { getDoctors, mapDoctorFromBackend, type DoctorListItem } from '../../lib/doctors'
import { createVisit, getAvailableSlots, toDateInputValue, type AvailableSlot } from '../../lib/visits'
import { formatCurrency } from '../admin/admin-utils'

function getNextWorkdays(daysCount: number) {
  const dates: string[] = []
  const cursor = new Date()

  while (dates.length < daysCount) {
    const weekday = cursor.getDay()
    if (weekday !== 0 && weekday !== 6) {
      dates.push(toDateInputValue(cursor))
    }
    cursor.setDate(cursor.getDate() + 1)
  }

  return dates
}

function formatDateLabel(dateValue: string) {
  const [year, month, day] = dateValue.split('-').map(Number)
  const date = new Date(year, (month || 1) - 1, day || 1)

  return new Intl.DateTimeFormat('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  }).format(date)
}

function formatSlotTime(slot: AvailableSlot) {
  const start = new Date(slot.start_at)

  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Moscow',
  }).format(start)
}

export default function DoctorDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { accessToken } = useUser()

  const [doctor, setDoctor] = useState<DoctorListItem | null>(null)
  const [isDoctorLoading, setIsDoctorLoading] = useState(true)
  const [doctorError, setDoctorError] = useState('')
  const [selectedDate, setSelectedDate] = useState<string>(() => getNextWorkdays(1)[0] ?? '')
  const [slots, setSlots] = useState<AvailableSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState('')
  const [isSlotsLoading, setIsSlotsLoading] = useState(false)
  const [slotsError, setSlotsError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const availableDates = useMemo(() => getNextWorkdays(10), [])

  useEffect(() => {
    if (!accessToken || !id) return

    const loadDoctor = async () => {
      setIsDoctorLoading(true)
      setDoctorError('')

      try {
        const doctors = await getDoctors(accessToken)
        const mapped = doctors.map(mapDoctorFromBackend).filter((item) => item.isActive)
        setDoctor(mapped.find((item) => item.id === id) ?? null)
      } catch {
        setDoctorError('Не удалось загрузить данные врача')
        setDoctor(null)
      } finally {
        setIsDoctorLoading(false)
      }
    }

    void loadDoctor()
  }, [accessToken, id])

  useEffect(() => {
    if (!accessToken || !doctor || !selectedDate) return

    const loadSlots = async () => {
      setIsSlotsLoading(true)
      setSlotsError('')
      setSelectedSlot('')

      try {
        const response = await getAvailableSlots(accessToken, doctor.id, selectedDate)
        setSlots(response)
      } catch {
        setSlots([])
        setSlotsError('Не удалось загрузить свободные окна врача')
      } finally {
        setIsSlotsLoading(false)
      }
    }

    void loadSlots()
  }, [accessToken, doctor, selectedDate])

  if (isDoctorLoading) {
    return <div className="py-10 text-xl text-slate-600">Загрузка врача...</div>
  }

  if (doctorError) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-5 text-red-700">
        {doctorError}
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="py-10">
        <h1 className="text-3xl font-semibold text-slate-900">Врач не найден</h1>
      </div>
    )
  }

  const currentDoctor = doctor

  const initials = currentDoctor.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

  async function handleBook() {
    if (!accessToken || !selectedSlot) return

    setIsSubmitting(true)
    setSlotsError('')

    try {
      await createVisit(accessToken, {
        doctor_user_id: currentDoctor.id,
        scheduled_at: selectedSlot,
      })

      navigate('/app/appointments', {
        state: {
          success: 'Запись создана. Окно заблокировано и ожидает подтверждения регистратурой.',
        },
      })
    } catch (error) {
      setSlotsError(error instanceof Error ? error.message : 'Не удалось создать запись')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-6">
      <button onClick={() => navigate('/app/doctors')} className="mb-8 text-[18px] font-medium text-slate-900">
        ← Назад к врачам
      </button>

      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-start gap-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-3xl text-slate-900">
            {initials}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-slate-900">{currentDoctor.name}</h1>
            <p className="mt-2 text-xl text-gray-500">{currentDoctor.specialty}</p>
            <p className="mt-3 text-lg text-gray-500">Стаж {currentDoctor.experience}</p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-slate-900">О враче</h2>
          <p className="mt-4 text-[18px] leading-8 text-slate-600">{currentDoctor.description}</p>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-slate-900">Запись на приём</h2>
          <div className="mt-4 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Стоимость приёма</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {formatCurrency(String(currentDoctor.price))}
            </p>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-medium text-slate-900">Свободные даты</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {availableDates.map((dateValue) => {
                const isSelected = selectedDate === dateValue

                return (
                  <button
                    key={dateValue}
                    onClick={() => setSelectedDate(dateValue)}
                    className={`rounded-xl border px-4 py-3 text-[16px] font-medium transition ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-slate-900 hover:bg-gray-50'
                    }`}
                  >
                    {formatDateLabel(dateValue)}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-medium text-slate-900">Свободные окна</h3>
            {isSlotsLoading ? (
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-slate-600">Загрузка слотов...</div>
            ) : slots.length ? (
              <div className="mt-4 flex flex-wrap gap-3">
                {slots.map((slot) => {
                  const label = formatSlotTime(slot)

                  return (
                    <button
                      key={slot.start_at}
                      onClick={() => setSelectedSlot(slot.start_at)}
                      className={`rounded-xl border px-4 py-4 text-[18px] font-medium transition ${
                        selectedSlot === slot.start_at
                          ? 'border-blue-500 bg-blue-50 text-slate-900'
                          : 'border-gray-200 bg-white text-slate-900 hover:bg-gray-50'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 px-4 py-5 text-slate-500">
                На выбранную дату свободных окон нет.
              </div>
            )}
          </div>

          {slotsError ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-red-700">
              {slotsError}
            </div>
          ) : null}

          <button
            onClick={() => void handleBook()}
            disabled={!selectedSlot || isSubmitting}
            className="mt-8 rounded-2xl bg-sky-700 px-8 py-4 text-lg font-medium text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? 'Создание записи...' : 'Создать запись'}
          </button>
        </div>
      </div>
    </div>
  )
}

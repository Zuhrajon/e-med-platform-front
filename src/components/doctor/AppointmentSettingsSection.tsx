import { useEffect, useState } from 'react'
import type { AppointmentSettings } from '../../type/schedule'

type AppointmentSettingsSectionProps = {
  settings: AppointmentSettings
  onSave: (payload: AppointmentSettings) => void
}

export default function AppointmentSettingsSection({
  settings,
  onSave,
}: AppointmentSettingsSectionProps) {
  const [form, setForm] = useState(settings)

  useEffect(() => {
    setForm(settings)
  }, [settings])

  return (
    <section className="rounded-3xl border border-gray-200 bg-white px-9 py-8 shadow-sm">
      <h2 className="text-[24px] font-semibold text-slate-900">
        Настройки приёма
      </h2>

      <div className="mt-8 space-y-7">
        <div>
          <label className="mb-3 block text-[18px] font-semibold text-slate-900">
            Длительность приёма
          </label>
          <select
            value={form.appointmentDuration}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                appointmentDuration: Number(e.target.value),
              }))
            }
            className="h-16 w-full rounded-2xl border border-gray-200 px-6 text-[18px] outline-none transition focus:border-sky-500"
          >
            <option value={15}>15 минут</option>
            <option value={30}>30 минут</option>
            <option value={45}>45 минут</option>
            <option value={60}>60 минут</option>
          </select>
        </div>

        <div>
          <label className="mb-3 block text-[18px] font-semibold text-slate-900">
            Перерыв между приёмами
          </label>
          <select
            value={form.breakBetweenAppointments}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                breakBetweenAppointments: Number(e.target.value),
              }))
            }
            className="h-16 w-full rounded-2xl border border-gray-200 px-6 text-[18px] outline-none transition focus:border-sky-500"
          >
            <option value={0}>Без перерыва</option>
            <option value={5}>5 минут</option>
            <option value={10}>10 минут</option>
            <option value={15}>15 минут</option>
          </select>
        </div>

        <div>
          <label className="mb-3 block text-[18px] font-semibold text-slate-900">
            Максимум записей в день
          </label>
          <select
            value={form.maxAppointmentsPerDay === null ? 'null' : form.maxAppointmentsPerDay}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                maxAppointmentsPerDay:
                  e.target.value === 'null' ? null : Number(e.target.value),
              }))
            }
            className="h-16 w-full rounded-2xl border border-gray-200 px-6 text-[18px] outline-none transition focus:border-sky-500"
          >
            <option value={5}>5 пациентов</option>
            <option value={10}>10 пациентов</option>
            <option value={15}>15 пациентов</option>
            <option value="null">Без ограничений</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => onSave(form)}
          className="mt-2 h-16 w-full rounded-2xl bg-sky-600 text-[18px] font-semibold text-white transition hover:bg-sky-700"
        >
          Сохранить настройки
        </button>
      </div>
    </section>
  )
}
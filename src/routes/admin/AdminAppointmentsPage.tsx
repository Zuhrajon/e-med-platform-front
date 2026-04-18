import { CalendarCheck2, LoaderCircle, Trash2 } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import {
  checkWorkingDay,
  createHoliday,
  deleteHoliday,
  listHolidays,
  updateHoliday,
  type Holiday,
  type WorkingDayStatus,
} from '../../lib/admin'
import { useUser } from '../../context/UserContext'
import { formatRuDate } from './admin-utils'

type HolidayFormState = {
  date: string
  name: string
}

const initialHolidayForm: HolidayFormState = {
  date: '',
  name: '',
}

export default function AdminAppointmentsPage() {
  const { accessToken } = useUser()
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [form, setForm] = useState<HolidayFormState>(initialHolidayForm)
  const [editingHolidayID, setEditingHolidayID] = useState<string | null>(null)
  const [checkDate, setCheckDate] = useState('')
  const [workingDay, setWorkingDay] = useState<WorkingDayStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadHolidays(targetYear = year) {
    if (!accessToken) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await listHolidays(accessToken, Number(targetYear))
      setHolidays(response.sort((a, b) => a.date.localeCompare(b.date)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить праздники')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadHolidays()
  }, [accessToken])

  async function handleHolidaySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!accessToken) return

    setIsSubmitting(true)
    setError(null)

    try {
      if (editingHolidayID) {
        await updateHoliday(accessToken, editingHolidayID, form)
      } else {
        await createHoliday(accessToken, form)
      }

      setForm(initialHolidayForm)
      setEditingHolidayID(null)
      await loadHolidays()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить праздник')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteHoliday(holidayID: string) {
    if (!accessToken) return

    setError(null)

    try {
      await deleteHoliday(accessToken, holidayID)
      await loadHolidays()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось удалить праздник')
    }
  }

  async function handleCheckWorkingDay(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!accessToken || !checkDate) return

    setIsChecking(true)
    setError(null)

    try {
      const response = await checkWorkingDay(accessToken, checkDate)
      setWorkingDay(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось проверить день')
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="w-full px-6 py-10">
      <header>
        <h1 className="text-[25px] font-semibold text-slate-900">Календарь клиники</h1>
        <p className="mt-2 text-[17px] text-slate-500">
          Управление праздничными днями и проверка рабочих дат.
        </p>
      </header>

      {error ? (
        <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          {error}
        </div>
      ) : null}

      <section className="mt-8 grid gap-6 2xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-[21px] font-semibold text-slate-900">
            {editingHolidayID ? 'Редактировать праздник' : 'Добавить праздник'}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            `POST/PATCH /api/v1/calendar/holidays`
          </p>

          <form onSubmit={handleHolidaySubmit} className="mt-6 space-y-4">
            <input
              required
              type="date"
              value={form.date}
              onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
            />
            <input
              required
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Название праздника"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
            />

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-2xl bg-sky-700 px-5 py-3 font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                {editingHolidayID ? 'Сохранить' : 'Создать'}
              </button>

              {editingHolidayID ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingHolidayID(null)
                    setForm(initialHolidayForm)
                  }}
                  className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Отменить
                </button>
              ) : null}
            </div>
          </form>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900">Проверка рабочего дня</h3>
            <form onSubmit={handleCheckWorkingDay} className="mt-4 flex flex-wrap gap-3">
              <input
                type="date"
                value={checkDate}
                onChange={(event) => setCheckDate(event.target.value)}
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={!checkDate || isChecking}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isChecking ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CalendarCheck2 className="h-4 w-4" />}
                Проверить
              </button>
            </form>

            {workingDay ? (
              <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-700">
                <p>
                  <span className="font-semibold text-slate-900">Дата:</span>{' '}
                  {formatRuDate(workingDay.date)}
                </p>
                <p className="mt-2">
                  <span className="font-semibold text-slate-900">Статус:</span>{' '}
                  {workingDay.is_working ? 'рабочий день' : 'нерабочий день'}
                </p>
                {workingDay.is_holiday ? (
                  <p className="mt-2">
                    <span className="font-semibold text-slate-900">Праздник:</span>{' '}
                    {workingDay.holiday_name}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-[21px] font-semibold text-slate-900">Праздничные дни</h2>
              <p className="mt-1 text-sm text-slate-500">
                `GET /api/v1/calendar/holidays?year=...`
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-500">Год</label>
              <input
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className="w-28 rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
              />
              <button
                type="button"
                onClick={() => void loadHolidays(year)}
                className="rounded-2xl bg-sky-700 px-5 py-3 font-semibold text-white transition hover:bg-sky-800"
              >
                Загрузить
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {isLoading ? (
              <div className="text-sm text-slate-500">Загрузка списка...</div>
            ) : holidays.length ? (
              holidays.map((holiday) => (
                <div
                  key={holiday.id}
                  className="flex flex-col gap-4 rounded-3xl border border-slate-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{holiday.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatRuDate(holiday.date)} ({holiday.date})
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingHolidayID(holiday.id)
                        setForm({ date: holiday.date, name: holiday.name })
                      }}
                      className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Редактировать
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDeleteHoliday(holiday.id)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Удалить
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500">Для выбранного года праздников нет.</div>
            )}
          </div>
        </article>
      </section>
    </div>
  )
}

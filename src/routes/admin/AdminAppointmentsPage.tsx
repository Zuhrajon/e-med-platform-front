import { useEffect, useRef, useState, type FormEvent } from 'react'
import AdminHolidayEditorCard from '../../components/admin/AdminHolidayEditorCard'
import AdminHolidayListCard from '../../components/admin/AdminHolidayListCard'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AdminStatusMessage from '../../components/admin/AdminStatusMessage'
import { useUser } from '../../context/UserContext'
import {
  checkWorkingDay,
  createHoliday,
  deleteHoliday,
  listHolidays,
  updateHoliday,
  type Holiday,
  type WorkingDayStatus,
} from '../../lib/admin'

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
  const editorRef = useRef<HTMLDivElement | null>(null)
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

  useEffect(() => {
    if (!editingHolidayID) return

    editorRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [editingHolidayID])

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
      <AdminPageHeader
        title="Календарь клиники"
        description="Управление праздничными днями и проверка рабочих дат."
      />

      {error ? (
        <AdminStatusMessage tone="error" className="mt-6">
          {error}
        </AdminStatusMessage>
      ) : null}

      <section className="mt-8 grid gap-6 2xl:grid-cols-[0.9fr_1.1fr]">
        <div ref={editorRef}>
          <AdminHolidayEditorCard
            form={form}
            editingHolidayID={editingHolidayID}
            isSubmitting={isSubmitting}
            checkDate={checkDate}
            isChecking={isChecking}
            workingDay={workingDay}
            onFormChange={setForm}
            onSubmit={handleHolidaySubmit}
            onResetEditing={() => {
              setEditingHolidayID(null)
              setForm(initialHolidayForm)
            }}
            onCheckDateChange={setCheckDate}
            onCheckSubmit={handleCheckWorkingDay}
          />
        </div>

        <AdminHolidayListCard
          year={year}
          holidays={holidays}
          isLoading={isLoading}
          onYearChange={setYear}
          onLoad={() => loadHolidays(year)}
          onEdit={(holiday) => {
            setEditingHolidayID(holiday.id)
            setForm({ date: holiday.date, name: holiday.name })
          }}
          onDelete={handleDeleteHoliday}
        />
      </section>
    </div>
  )
}

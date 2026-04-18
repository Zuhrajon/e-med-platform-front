import { LoaderCircle, Trash2 } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import {
  createSpecialty,
  deleteSpecialty,
  listSpecialties,
  updateSpecialty,
  type Specialty,
} from '../../lib/admin'
import { useUser } from '../../context/UserContext'

type SpecialtyFormState = {
  name: string
  is_active: boolean
}

const initialForm: SpecialtyFormState = {
  name: '',
  is_active: true,
}

export default function AdminSettingsPage() {
  const { accessToken } = useUser()
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [form, setForm] = useState<SpecialtyFormState>(initialForm)
  const [editingID, setEditingID] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadSpecialties() {
    if (!accessToken) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await listSpecialties(accessToken)
      setSpecialties(response.sort((a, b) => a.name.localeCompare(b.name)))
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Не удалось загрузить специальности',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadSpecialties()
  }, [accessToken])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!accessToken) return

    setIsSubmitting(true)
    setError(null)

    try {
      if (editingID) {
        await updateSpecialty(accessToken, editingID, form)
      } else {
        await createSpecialty(accessToken, form.name)
      }

      setEditingID(null)
      setForm(initialForm)
      await loadSpecialties()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Не удалось сохранить специальность',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleToggle(item: Specialty) {
    if (!accessToken) return

    setError(null)

    try {
      await updateSpecialty(accessToken, item.id, {
        is_active: !item.is_active,
        name: item.name,
      })
      await loadSpecialties()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Не удалось изменить статус',
      )
    }
  }

  async function handleDelete(id: string) {
    if (!accessToken) return

    setError(null)

    try {
      await deleteSpecialty(accessToken, id)
      await loadSpecialties()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Не удалось удалить специальность',
      )
    }
  }

  return (
    <div className="w-full px-6 py-10">
      <header>
        <h1 className="text-[25px] font-semibold text-slate-900">Настройки</h1>
        <p className="mt-2 text-[17px] text-slate-500">
          Управление специальностями, которые используются при создании врачей.
        </p>
      </header>

      {error ? (
        <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          {error}
        </div>
      ) : null}

      <section className="mt-8 grid gap-6 2xl:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-[21px] font-semibold text-slate-900">
            {editingID ? 'Редактировать специальность' : 'Новая специальность'}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            `POST/PATCH /api/v1/specialties`
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              required
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="Название специальности"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
            />

            {editingID ? (
              <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, is_active: event.target.checked }))
                  }
                  className="h-4 w-4"
                />
                Специальность активна
              </label>
            ) : (
              <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
                Новая специальность создается активной. Статус можно изменить после создания.
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-2xl bg-sky-700 px-5 py-3 font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                {editingID ? 'Сохранить' : 'Создать'}
              </button>

              {editingID ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingID(null)
                    setForm(initialForm)
                  }}
                  className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Отменить
                </button>
              ) : null}
            </div>
          </form>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-[21px] font-semibold text-slate-900">Справочник специальностей</h2>

          <div className="mt-6 space-y-3">
            {isLoading ? (
              <div className="text-sm text-slate-500">Загрузка списка...</div>
            ) : specialties.length ? (
              specialties.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-3xl border border-slate-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Статус:{' '}
                      <span
                        className={
                          item.is_active ? 'font-semibold text-emerald-700' : 'font-semibold text-slate-500'
                        }
                      >
                        {item.is_active ? 'активна' : 'неактивна'}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingID(item.id)
                        setForm({
                          name: item.name,
                          is_active: item.is_active,
                        })
                      }}
                      className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Редактировать
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleToggle(item)}
                      className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      {item.is_active ? 'Деактивировать' : 'Активировать'}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(item.id)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Удалить
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500">Список специальностей пуст.</div>
            )}
          </div>
        </article>
      </section>
    </div>
  )
}

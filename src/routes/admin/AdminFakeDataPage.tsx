import { Database, LoaderCircle, Trash2, WandSparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  deleteFakeData,
  getFakeData,
  populateFakeData,
  type FakeDataSnapshot,
} from '../../lib/admin'
import { useUser } from '../../context/UserContext'
import { formatRuDate } from './admin-utils'

const emptySnapshot: FakeDataSnapshot = {
  users: [],
  specialties: [],
  holidays: [],
}

export default function AdminFakeDataPage() {
  const { accessToken } = useUser()
  const [snapshot, setSnapshot] = useState<FakeDataSnapshot>(emptySnapshot)
  const [isLoading, setIsLoading] = useState(true)
  const [isMutating, setIsMutating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function loadSnapshot() {
    if (!accessToken) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await getFakeData(accessToken)
      setSnapshot(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить тестовые данные')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadSnapshot()
  }, [accessToken])

  async function handlePopulate() {
    if (!accessToken) return

    setIsMutating(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await populateFakeData(accessToken)
      setSnapshot(response)
      setSuccess('Тестовые данные успешно перезаполнены.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось заполнить тестовые данные')
    } finally {
      setIsMutating(false)
    }
  }

  async function handleDelete() {
    if (!accessToken) return

    setIsMutating(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await deleteFakeData(accessToken)
      setSnapshot(emptySnapshot)
      setSuccess(
        `Удалено: пользователей ${response.deleted_users}, специальностей ${response.deleted_specialties}, праздников ${response.deleted_holidays}.`,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось удалить тестовые данные')
    } finally {
      setIsMutating(false)
    }
  }

  return (
    <div className="w-full px-6 py-10">
      <header>
        <h1 className="text-[25px] font-semibold text-slate-900">Тестовые данные</h1>
        <p className="mt-2 text-[17px] text-slate-500">
          Управление fake-data из бекенда для быстрого наполнения демо-среды.
        </p>
      </header>

      {error ? (
        <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">
          {success}
        </div>
      ) : null}

      <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-[21px] font-semibold text-slate-900">Управление набором данных</h2>
            <p className="mt-1 text-sm text-slate-500">
              `GET /api/v1/fake-data`, `POST /api/v1/fake-data/populate`, `DELETE /api/v1/fake-data`
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void handlePopulate()}
              disabled={isMutating}
              className="inline-flex items-center gap-2 rounded-2xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isMutating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <WandSparkles className="h-4 w-4" />}
              Заполнить
            </button>
            <button
              type="button"
              onClick={() => void handleDelete()}
              disabled={isMutating}
              className="inline-flex items-center gap-2 rounded-2xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Очистить
            </button>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-3">
        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-sky-700" />
            <h2 className="text-[21px] font-semibold text-slate-900">
              Пользователи ({isLoading ? '...' : snapshot.users.length})
            </h2>
          </div>
          <div className="mt-5 space-y-3">
            {isLoading ? (
              <p className="text-sm text-slate-500">Загрузка...</p>
            ) : snapshot.users.length ? (
              snapshot.users.map((user) => (
                <div key={user.user_id} className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="font-medium text-slate-900">{user.full_name}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {user.role} • {user.email}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">Пароль: {user.password}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Тестовых пользователей нет.</p>
            )}
          </div>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-[21px] font-semibold text-slate-900">
            Специальности ({isLoading ? '...' : snapshot.specialties.length})
          </h2>
          <div className="mt-5 space-y-3">
            {isLoading ? (
              <p className="text-sm text-slate-500">Загрузка...</p>
            ) : snapshot.specialties.length ? (
              snapshot.specialties.map((item) => (
                <div key={item.specialty_id} className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <p className="mt-1 text-sm text-slate-500">ID: {item.specialty_id}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Тестовых специальностей нет.</p>
            )}
          </div>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-[21px] font-semibold text-slate-900">
            Праздники ({isLoading ? '...' : snapshot.holidays.length})
          </h2>
          <div className="mt-5 space-y-3">
            {isLoading ? (
              <p className="text-sm text-slate-500">Загрузка...</p>
            ) : snapshot.holidays.length ? (
              snapshot.holidays.map((item) => (
                <div key={item.holiday_id} className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{formatRuDate(item.date)}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Тестовых праздников нет.</p>
            )}
          </div>
        </article>
      </section>
    </div>
  )
}

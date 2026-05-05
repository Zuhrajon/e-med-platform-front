import { LoaderCircle, Trash2, WandSparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import AdminCard from '../../components/admin/AdminCard'
import AdminFakeDataCollectionCard from '../../components/admin/AdminFakeDataCollectionCard'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AdminStatusMessage from '../../components/admin/AdminStatusMessage'
import { useUser } from '../../context/UserContext'
import {
  deleteFakeData,
  getFakeData,
  populateFakeData,
  type FakeDataSnapshot,
} from '../../lib/admin'
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
      <AdminPageHeader
        title="Тестовые данные"
        description="Быстрое наполнение и очистка демонстрационной среды."
      />

      {error ? (
        <AdminStatusMessage tone="error" className="mt-6">
          {error}
        </AdminStatusMessage>
      ) : null}

      {success ? (
        <AdminStatusMessage tone="success" className="mt-6">
          {success}
        </AdminStatusMessage>
      ) : null}

      <section className="mt-8">
        <AdminCard>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-[21px] font-semibold text-slate-900">Управление набором данных</h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void handlePopulate()}
                disabled={isMutating}
                className="inline-flex items-center gap-2 rounded-2xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isMutating ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <WandSparkles className="h-4 w-4" />
                )}
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
        </AdminCard>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-3">
        <AdminFakeDataCollectionCard
          title="Пользователи"
          count={snapshot.users.length}
          isLoading={isLoading}
        >
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
        </AdminFakeDataCollectionCard>

        <AdminFakeDataCollectionCard
          title="Специальности"
          count={snapshot.specialties.length}
          isLoading={isLoading}
        >
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
        </AdminFakeDataCollectionCard>

        <AdminFakeDataCollectionCard
          title="Праздники"
          count={snapshot.holidays.length}
          isLoading={isLoading}
        >
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
        </AdminFakeDataCollectionCard>
      </section>
    </div>
  )
}

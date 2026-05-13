import { LoaderCircle, Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import type { LaboratoryTestType } from '../../lib/laboratory'

type LaboratoryTestTypesManagerProps = {
  testTypes: LaboratoryTestType[]
  isLoading: boolean
  isSaving: boolean
  pendingTestTypeID: string | null
  onCreate: (payload: { name: string; description: string }) => Promise<void>
  onUpdate: (
    testTypeID: string,
    payload: { name?: string; description?: string; is_active?: boolean },
  ) => Promise<void>
  onDelete: (testTypeID: string) => Promise<void>
}

type FormState = {
  name: string
  description: string
}

const emptyForm: FormState = {
  name: '',
  description: '',
}

export default function LaboratoryTestTypesManager({
  testTypes,
  isLoading,
  isSaving,
  pendingTestTypeID,
  onCreate,
  onUpdate,
  onDelete,
}: LaboratoryTestTypesManagerProps) {
  const [createForm, setCreateForm] = useState<FormState>(emptyForm)
  const [editingID, setEditingID] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<FormState>(emptyForm)

  const sortedTypes = useMemo(
    () => testTypes.slice().sort((a, b) => a.name.localeCompare(b.name)),
    [testTypes],
  )

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onCreate(createForm)
    setCreateForm(emptyForm)
  }

  async function handleSaveEdit(testTypeID: string) {
    await onUpdate(testTypeID, editForm)
    setEditingID(null)
    setEditForm(emptyForm)
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[0.95fr_1.25fr]">
      <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-[22px] font-semibold text-slate-900">Типы анализов</h2>
        <p className="mt-2 text-[15px] text-slate-500">
          Справочник лабораторных исследований для назначения врачом.
        </p>

        <form onSubmit={handleCreate} className="mt-6 space-y-4">
          <input
            required
            value={createForm.name}
            onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Название анализа"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
          />
          <textarea
            value={createForm.description}
            onChange={(event) =>
              setCreateForm((prev) => ({ ...prev, description: event.target.value }))
            }
            placeholder="Описание или комментарий"
            rows={4}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
          />

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:bg-slate-400"
          >
            {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Добавить тип анализа
          </button>
        </form>
      </article>

      <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-semibold text-slate-900">Текущий список</h2>
            <p className="mt-2 text-[15px] text-slate-500">
              Активные типы доступны врачу и лаборатории.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-600">
            Всего: <span className="font-semibold text-slate-900">{sortedTypes.length}</span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {isLoading ? (
            <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-8 text-center text-slate-500">
              Загрузка типов анализов...
            </div>
          ) : sortedTypes.length ? (
            sortedTypes.map((item) => {
              const isEditing = editingID === item.id
              const isPending = pendingTestTypeID === item.id

              return (
                <div key={item.id} className="rounded-3xl border border-slate-200 px-5 py-5">
                  {isEditing ? (
                    <div className="space-y-4">
                      <input
                        value={editForm.name}
                        onChange={(event) =>
                          setEditForm((prev) => ({ ...prev, name: event.target.value }))
                        }
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(event) =>
                          setEditForm((prev) => ({ ...prev, description: event.target.value }))
                        }
                        rows={4}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                      />
                      <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={item.is_active}
                          onChange={(event) =>
                            void onUpdate(item.id, { is_active: event.target.checked })
                          }
                        />
                        Активен для новых назначений
                      </label>
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => void handleSaveEdit(item.id)}
                          disabled={isPending}
                          className="rounded-2xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:bg-slate-400"
                        >
                          Сохранить
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingID(null)
                            setEditForm(emptyForm)
                          }}
                          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Отменить
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-[18px] font-semibold text-slate-900">{item.name}</p>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              item.is_active
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.is_active ? 'Активен' : 'Скрыт'}
                          </span>
                        </div>
                        <p className="mt-3 whitespace-pre-line text-[15px] text-slate-600">
                          {item.description || 'Описание пока не заполнено.'}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingID(item.id)
                            setEditForm({
                              name: item.name,
                              description: item.description,
                            })
                          }}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <Pencil className="h-4 w-4" />
                          Изменить
                        </button>
                        <button
                          type="button"
                          onClick={() => void onDelete(item.id)}
                          disabled={isPending}
                          className="inline-flex items-center gap-2 rounded-2xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                        >
                          <Trash2 className="h-4 w-4" />
                          Удалить
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-8 text-center text-slate-500">
              Типы анализов пока не добавлены.
            </div>
          )}
        </div>
      </article>
    </section>
  )
}

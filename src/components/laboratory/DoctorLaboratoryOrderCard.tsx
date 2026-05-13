import { FlaskConical, LoaderCircle } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import type { LaboratoryOrder, LaboratoryTestType } from '../../lib/laboratory'
import LaboratoryStatusBadge from './LaboratoryStatusBadge'

type DoctorLaboratoryOrderCardProps = {
  visitID: string
  orders: LaboratoryOrder[]
  testTypes: LaboratoryTestType[]
  canCreate: boolean
  isSubmitting: boolean
  onCreateOrder: (
    visitID: string,
    payload: {
      doctor_comment: string
      items: Array<{ test_type_id: string; notes: string }>
    },
  ) => Promise<void>
}

type DraftItem = {
  test_type_id: string
  notes: string
}

const emptyDraft: DraftItem = {
  test_type_id: '',
  notes: '',
}

export default function DoctorLaboratoryOrderCard({
  visitID,
  orders,
  testTypes,
  canCreate,
  isSubmitting,
  onCreateOrder,
}: DoctorLaboratoryOrderCardProps) {
  const [doctorComment, setDoctorComment] = useState('')
  const [draftItems, setDraftItems] = useState<DraftItem[]>([emptyDraft])

  const activeTypes = useMemo(() => testTypes.filter((item) => item.is_active), [testTypes])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    await onCreateOrder(visitID, {
      doctor_comment: doctorComment,
      items: draftItems
        .filter((item) => item.test_type_id)
        .map((item) => ({
          test_type_id: item.test_type_id,
          notes: item.notes,
        })),
    })

    setDoctorComment('')
    setDraftItems([emptyDraft])
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5">
      <div className="flex items-center gap-3">
        <FlaskConical className="h-5 w-5 text-sky-700" />
        <h4 className="text-[18px] font-semibold text-slate-900">Назначения в лабораторию</h4>
      </div>

      <div className="mt-5 space-y-3">
        {orders.length ? (
          orders.map((order) => (
            <div key={order.order_id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-semibold text-slate-900">
                  {order.items.map((item) => item.test_type_name).join(', ')}
                </p>
                <LaboratoryStatusBadge status={order.status} />
              </div>
              {order.doctor_comment ? (
                <p className="mt-2 text-sm text-slate-600">{order.doctor_comment}</p>
              ) : null}
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500">
            Для этого приёма лабораторные назначения ещё не создавались.
          </div>
        )}
      </div>

      {canCreate ? (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <textarea
            value={doctorComment}
            onChange={(event) => setDoctorComment(event.target.value)}
          rows={3}
          placeholder="Комментарий врача для лаборатории"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500"
        />

        <div className="space-y-3">
          {draftItems.map((item, index) => (
            <div key={`${visitID}-${index}`} className="rounded-2xl border border-slate-200 px-4 py-4">
              <div className="grid gap-3 md:grid-cols-[1fr_1.2fr]">
                <select
                  required
                  value={item.test_type_id}
                  onChange={(event) =>
                    setDraftItems((prev) =>
                      prev.map((entry, entryIndex) =>
                        entryIndex === index
                          ? { ...entry, test_type_id: event.target.value }
                          : entry,
                      ),
                    )
                  }
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500"
                >
                  <option value="">Выберите анализ</option>
                  {activeTypes.map((testType) => (
                    <option key={testType.id} value={testType.id}>
                      {testType.name}
                    </option>
                  ))}
                </select>

                <input
                  value={item.notes}
                  onChange={(event) =>
                    setDraftItems((prev) =>
                      prev.map((entry, entryIndex) =>
                        entryIndex === index ? { ...entry, notes: event.target.value } : entry,
                      ),
                    )
                  }
                  placeholder="Комментарий к анализу"
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setDraftItems((prev) => [...prev, emptyDraft])}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Добавить анализ
          </button>
          {draftItems.length > 1 ? (
            <button
              type="button"
              onClick={() => setDraftItems((prev) => prev.slice(0, -1))}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Убрать последний
            </button>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting || !activeTypes.length}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:bg-slate-400"
          >
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            Назначить анализы
          </button>
        </div>
      </form>
      ) : null}
    </div>
  )
}

import { Download, FlaskConical, LoaderCircle } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useUser } from '../../context/UserContext'
import { downloadFile } from '../../lib/files'
import type { LaboratoryOrder, LaboratoryTestType } from '../../lib/laboratory'
import { formatFileSize } from '../../lib/medicalCard'
import { formatVisitDateTime } from '../../lib/visits'
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
  onReviewOrder: (orderID: string, doctorResultComment: string) => Promise<void>
  reviewPendingOrderID: string | null
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
  onReviewOrder,
  reviewPendingOrderID,
}: DoctorLaboratoryOrderCardProps) {
  const { accessToken } = useUser()
  const [doctorComment, setDoctorComment] = useState('')
  const [draftItems, setDraftItems] = useState<DraftItem[]>([emptyDraft])
  const [reviewComments, setReviewComments] = useState<Record<string, string>>({})

  const activeTypes = useMemo(() => testTypes.filter((item) => item.is_active), [testTypes])

  useEffect(() => {
    setReviewComments((prev) => ({
      ...Object.fromEntries(
        orders.map((order) => [order.order_id, prev[order.order_id] ?? order.doctor_result_comment ?? '']),
      ),
    }))
  }, [orders])

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

  async function handleDownload(fileID: string, fileName: string) {
    if (!accessToken) return
    await downloadFile(accessToken, fileID, fileName)
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
              {order.status === 'completed' ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Результаты лаборатории</p>
                      {order.completed_at ? (
                        <p className="mt-1 text-sm text-slate-500">
                          Готово: {formatVisitDateTime(order.completed_at)}
                        </p>
                      ) : null}
                      {order.laboratory_comment ? (
                        <p className="mt-3 whitespace-pre-line text-sm text-slate-600">
                          {order.laboratory_comment}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.order_item_id}
                          className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                        >
                          <p className="text-sm font-semibold text-slate-900">
                            {item.test_type_name}
                          </p>
                          {item.notes ? (
                            <p className="mt-1 text-xs text-slate-500">Назначение: {item.notes}</p>
                          ) : null}
                          <p className="mt-2 whitespace-pre-line text-sm text-slate-700">
                            {item.result_text || 'Результат не заполнен'}
                          </p>
                        </div>
                      ))}
                    </div>

                    {order.result_files.length ? (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-slate-900">Файлы результата</p>
                        {order.result_files.map((file) => (
                          <div
                            key={file.file_id}
                            className="flex flex-col gap-3 rounded-2xl border border-slate-100 px-4 py-3 md:flex-row md:items-center md:justify-between"
                          >
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{file.file_name}</p>
                              <p className="mt-1 text-xs text-slate-500">
                                {file.content_type} • {formatFileSize(file.size_bytes)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => void handleDownload(file.file_id, file.file_name)}
                              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              <Download className="h-4 w-4" />
                              Скачать
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4 border-t border-slate-200 pt-4">
                  {order.reviewed_at ? (
                    <div className="text-sm text-slate-600">
                      <p className="font-semibold text-slate-900">
                        Результат просмотрен врачом
                      </p>
                      <p className="mt-1">{formatVisitDateTime(order.reviewed_at)}</p>
                      {order.doctor_result_comment ? (
                        <p className="mt-3 whitespace-pre-line">{order.doctor_result_comment}</p>
                      ) : null}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        value={reviewComments[order.order_id] || ''}
                        onChange={(event) =>
                          setReviewComments((prev) => ({
                            ...prev,
                            [order.order_id]: event.target.value,
                          }))
                        }
                        rows={3}
                        placeholder="Комментарий врача по результату анализа"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          void onReviewOrder(order.order_id, reviewComments[order.order_id] || '')
                        }
                        disabled={reviewPendingOrderID === order.order_id}
                        className="inline-flex items-center gap-2 rounded-2xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:bg-slate-400"
                      >
                        {reviewPendingOrderID === order.order_id ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : null}
                        Отметить как просмотрено
                      </button>
                    </div>
                  )}
                  </div>
                </div>
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

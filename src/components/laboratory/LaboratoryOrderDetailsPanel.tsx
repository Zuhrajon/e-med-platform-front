import { Download, LoaderCircle, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import type {
  CompleteLaboratoryOrderPayload,
  LaboratoryOrder,
  LaboratoryStatus,
} from '../../lib/laboratory'
import { formatVisitDateTime } from '../../lib/visits'
import LaboratoryStatusBadge from './LaboratoryStatusBadge'

type LaboratoryOrderDetailsPanelProps = {
  order: LaboratoryOrder | null
  isLoading: boolean
  actionOrderID: string | null
  completeOrderID: string | null
  onAccept: (orderID: string) => Promise<void>
  onComplete: (orderID: string, payload: CompleteLaboratoryOrderPayload) => Promise<void>
  onUploadFiles: (orderID: string, files: File[]) => Promise<void>
  onDownloadFile: (fileID: string, fileName: string) => Promise<void>
}

export default function LaboratoryOrderDetailsPanel({
  order,
  isLoading,
  actionOrderID,
  completeOrderID,
  onAccept,
  onComplete,
  onUploadFiles,
  onDownloadFile,
}: LaboratoryOrderDetailsPanelProps) {
  const [laboratoryComment, setLaboratoryComment] = useState('')
  const [resultValues, setResultValues] = useState<Record<string, string>>({})
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  useEffect(() => {
    if (!order) return

    setLaboratoryComment(order.laboratory_comment || '')
    setResultValues(
      Object.fromEntries(order.items.map((item) => [item.test_type_id, item.result_text || ''])),
    )
    setSelectedFiles([])
  }, [order])

  if (isLoading) {
    return (
      <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-10 text-center text-slate-500">
          Загрузка деталей направления...
        </div>
      </article>
    )
  }

  if (!order) {
    return (
      <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-10 text-center text-slate-500">
          Выберите направление слева, чтобы увидеть состав анализов и действия.
        </div>
      </article>
    )
  }

  const isAccepting = actionOrderID === order.order_id
  const isCompleting = completeOrderID === order.order_id

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-[22px] font-semibold text-slate-900">{order.patient_full_name}</h2>
          <LaboratoryStatusBadge status={order.status as LaboratoryStatus} />
        </div>

        <div className="grid gap-3 text-sm text-slate-500 md:grid-cols-2">
          <p>Телефон пациента: {order.patient_phone_number || 'Скрыт'}</p>
          <p>Врач: {order.doctor_full_name}</p>
          <p>Создано: {formatVisitDateTime(order.created_at)}</p>
          <p>Принято: {order.accepted_at ? formatVisitDateTime(order.accepted_at) : 'Ещё нет'}</p>
        </div>

        {order.doctor_comment ? (
          <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Комментарий врача</p>
            <p className="mt-2 whitespace-pre-line">{order.doctor_comment}</p>
          </div>
        ) : null}
      </div>

      <div className="mt-6 space-y-5">
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.order_item_id} className="rounded-3xl border border-slate-200 px-5 py-5">
              <p className="text-[17px] font-semibold text-slate-900">{item.test_type_name}</p>
              {item.notes ? <p className="mt-2 text-sm text-slate-500">{item.notes}</p> : null}
              {order.status === 'accepted' ? (
                <textarea
                  value={resultValues[item.test_type_id] || ''}
                  onChange={(event) =>
                    setResultValues((prev) => ({
                      ...prev,
                      [item.test_type_id]: event.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="Введите результат анализа"
                  className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500"
                />
              ) : (
                <p className="mt-3 whitespace-pre-line text-sm text-slate-600">
                  {item.result_text || 'Результат пока не заполнен.'}
                </p>
              )}
            </div>
          ))}
        </div>

        {order.status === 'created' ? (
          <button
            type="button"
            onClick={() => void onAccept(order.order_id)}
            disabled={isAccepting}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:bg-slate-400"
          >
            {isAccepting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            Принять в работу
          </button>
        ) : null}

        {order.status === 'accepted' ? (
          <div className="space-y-4 rounded-3xl border border-sky-100 bg-sky-50/50 px-5 py-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-900">
                Комментарий лаборатории
              </span>
              <textarea
                value={laboratoryComment}
                onChange={(event) => setLaboratoryComment(event.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500"
              />
            </label>

            <label className="block rounded-2xl border border-dashed border-slate-300 px-4 py-4">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Upload className="h-4 w-4" />
                Файлы результатов
              </span>
              <input
                type="file"
                multiple
                onChange={(event) => setSelectedFiles(Array.from(event.target.files ?? []))}
                className="mt-3 block w-full text-sm text-slate-600"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void onUploadFiles(order.order_id, selectedFiles)}
                disabled={!selectedFiles.length || isCompleting}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Загрузить файлы
              </button>
              <button
                type="button"
                onClick={() =>
                  void onComplete(order.order_id, {
                    laboratory_comment: laboratoryComment,
                    items: order.items.map((item) => ({
                      test_type_id: item.test_type_id,
                      result_text: resultValues[item.test_type_id] || '',
                    })),
                  })
                }
                disabled={
                  isCompleting ||
                  order.items.some((item) => !(resultValues[item.test_type_id] || '').trim())
                }
                className="inline-flex items-center gap-2 rounded-2xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:bg-slate-400"
              >
                {isCompleting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                Завершить и сохранить результаты
              </button>
            </div>
          </div>
        ) : null}

        {order.result_files.length ? (
          <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-5">
            <p className="text-sm font-semibold text-slate-900">Прикреплённые файлы</p>
            {order.result_files.map((file) => (
              <div
                key={file.file_id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{file.file_name}</p>
                  <p className="mt-1 text-xs text-slate-500">{file.content_type}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void onDownloadFile(file.file_id, file.file_name)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <Download className="h-4 w-4" />
                  Скачать
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  )
}

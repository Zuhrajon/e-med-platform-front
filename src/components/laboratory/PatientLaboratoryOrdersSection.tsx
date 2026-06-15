import { Download, FlaskConical } from 'lucide-react'
import type { LaboratoryOrder } from '../../lib/laboratory'
import { formatVisitDateTime } from '../../lib/visits'
import LaboratoryStatusBadge from './LaboratoryStatusBadge'

type PatientLaboratoryOrdersSectionProps = {
  orders: LaboratoryOrder[]
  isLoading: boolean
  onDownloadFile: (fileID: string, fileName: string) => Promise<void>
}

export default function PatientLaboratoryOrdersSection({
  orders,
  isLoading,
  onDownloadFile,
}: PatientLaboratoryOrdersSectionProps) {
  return (
    <section className="mt-12 rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">
      <div className="flex items-center gap-3">
        <FlaskConical className="h-6 w-6 text-sky-700" />
        <h2 className="text-[28px] font-semibold text-slate-900">Результаты анализов</h2>
      </div>

      <div className="mt-8 space-y-5">
        {isLoading ? (
          <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-10 text-center text-[18px] text-gray-500">
            Загрузка результатов анализов...
          </div>
        ) : orders.length ? (
          orders.map((order) => (
            <article key={order.order_id} className="rounded-3xl border border-slate-200 px-6 py-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-[22px] font-semibold text-slate-900">
                      {order.items.map((item) => item.test_type_name).join(', ')}
                    </h3>
                    <LaboratoryStatusBadge status={order.status} />
                  </div>
                  <p className="mt-2 text-[16px] text-slate-600">Врач: {order.doctor_full_name}</p>
                  <p className="mt-1 text-[15px] text-slate-500">
                    Готово: {order.completed_at ? formatVisitDateTime(order.completed_at) : 'Ожидает'}
                  </p>
                </div>
              </div>

              {order.laboratory_comment ? (
                <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Комментарий лаборатории</p>
                  <p className="mt-2 whitespace-pre-line">{order.laboratory_comment}</p>
                </div>
              ) : null}

              {order.reviewed_at || order.doctor_result_comment ? (
                <div className="mt-4 rounded-2xl bg-sky-50 px-4 py-4 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Комментарий врача по результату</p>
                  <p className="mt-2 whitespace-pre-line">
                    {order.doctor_result_comment || 'Врач просмотрел результат анализа.'}
                  </p>
                  {order.reviewed_at ? (
                    <p className="mt-2 text-slate-500">
                      Просмотрено: {formatVisitDateTime(order.reviewed_at)}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-5 space-y-3">
                {order.items.map((item) => (
                  <div key={item.order_item_id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <p className="text-sm font-semibold text-slate-900">{item.test_type_name}</p>
                    <p className="mt-2 whitespace-pre-line text-sm text-slate-600">
                      {item.result_text || 'Результат ещё не загружен.'}
                    </p>
                  </div>
                ))}
              </div>

              {order.result_files.length ? (
                <div className="mt-5 space-y-3">
                  {order.result_files.map((file) => (
                    <div
                      key={file.file_id}
                      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="text-[16px] font-semibold text-slate-900">{file.file_name}</p>
                        <p className="mt-1 text-sm text-slate-500">{file.content_type}</p>
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
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-10 text-center text-[18px] text-gray-500">
            Готовых результатов анализов пока нет.
          </div>
        )}
      </div>
    </section>
  )
}

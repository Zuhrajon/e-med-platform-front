import { ChevronRight, Search } from 'lucide-react'
import type { LaboratoryOrder, LaboratoryStatus } from '../../lib/laboratory'
import { formatVisitDateTime } from '../../lib/visits'
import LaboratoryStatusBadge from './LaboratoryStatusBadge'

type LaboratoryOrdersListProps = {
  orders: LaboratoryOrder[]
  isLoading: boolean
  search: string
  statusFilter: '' | LaboratoryStatus
  selectedOrderID: string | null
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: '' | LaboratoryStatus) => void
  onSelect: (order: LaboratoryOrder) => void
}

export default function LaboratoryOrdersList({
  orders,
  isLoading,
  search,
  statusFilter,
  selectedOrderID,
  onSearchChange,
  onStatusFilterChange,
  onSelect,
}: LaboratoryOrdersListProps) {
  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-[22px] font-semibold text-slate-900">Лабораторные направления</h2>
          <p className="mt-2 text-[15px] text-slate-500">
            Выберите направление, чтобы принять его в работу или загрузить результаты.
          </p>
        </div>

        <div className="grid gap-3 xl:grid-cols-[1fr_190px]">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Поиск по пациенту или врачу"
              className="w-full bg-transparent text-sm text-slate-900 outline-none"
            />
          </label>

          <select
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value as '' | LaboratoryStatus)}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500"
          >
            <option value="">Все статусы</option>
            <option value="created">Созданы</option>
            <option value="accepted">В работе</option>
            <option value="completed">Готовые</option>
            <option value="cancelled">Отменённые</option>
          </select>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-8 text-center text-slate-500">
            Загрузка направлений...
          </div>
        ) : orders.length ? (
          orders.map((order) => {
            const isActive = selectedOrderID === order.order_id

            return (
              <button
                key={order.order_id}
                type="button"
                onClick={() => onSelect(order)}
                className={`flex w-full items-start justify-between gap-4 rounded-3xl border px-5 py-5 text-left transition ${
                  isActive
                    ? 'border-sky-300 bg-sky-50/60'
                    : 'border-slate-200 bg-white hover:border-sky-200 hover:bg-slate-50'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-[18px] font-semibold text-slate-900">{order.patient_full_name}</p>
                    <LaboratoryStatusBadge status={order.status} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{order.doctor_full_name}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Создано: {formatVisitDateTime(order.created_at)}
                  </p>
                  <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                    {order.items.map((item) => item.test_type_name).join(', ')}
                  </p>
                </div>

                <ChevronRight className={`mt-1 h-5 w-5 shrink-0 ${isActive ? 'text-sky-700' : 'text-slate-400'}`} />
              </button>
            )
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-8 text-center text-slate-500">
            Подходящих лабораторных направлений пока нет.
          </div>
        )}
      </div>
    </article>
  )
}

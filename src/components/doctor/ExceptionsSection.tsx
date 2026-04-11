import { Plus, X } from 'lucide-react'
import type { ScheduleException } from '../../utils/schedule'
import { formatExceptionDate } from '../../utils/schedule'

type ExceptionsSectionProps = {
  exceptions: ScheduleException[]
  onAddClick: () => void
  onRemove: (id: string) => void
}

export default function ExceptionsSection({
  exceptions,
  onAddClick,
  onRemove,
}: ExceptionsSectionProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white px-9 py-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-[24px] font-semibold text-slate-900">Исключения</h2>
        <p className="mt-6 text-[18px] text-gray-500">
          Укажите дни, когда вы не принимаете пациентов
        </p>
      </div>

      <div className="space-y-5">
        {exceptions.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-3xl border border-gray-200 px-6 py-7"
          >
            <div>
              <h3 className="text-[22px] font-semibold text-slate-900">
                {formatExceptionDate(item.date)}
              </h3>
              <p className="mt-3 text-[18px] text-gray-500">{item.reason}</p>
            </div>

            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="text-slate-900 transition hover:text-red-500"
            >
              <X className="h-8 w-8" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={onAddClick}
          className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 text-[18px] font-semibold text-slate-900 transition hover:bg-gray-50"
        >
          <Plus className="h-6 w-6" />
          Добавить исключение
        </button>
      </div>
    </section>
  )
}
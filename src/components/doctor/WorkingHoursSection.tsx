import { Clock3, Plus, X } from 'lucide-react'
import type { WeekDay, WorkingDay } from '../../type/schedule'
import { getWeekDayLabel } from '../../utils/schedule'

type WorkingHoursSectionProps = {
  workingDays: WorkingDay[]
  onAddClick: () => void
  onRemoveDay: (day: WeekDay) => void
}

export default function WorkingHoursSection({
  workingDays,
  onAddClick,
  onRemoveDay,
}: WorkingHoursSectionProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white px-9 py-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-[21px] font-semibold text-slate-900">Рабочие часы</h2>

        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-sky-600 px-6 text-[16px] font-semibold text-white transition hover:bg-sky-700"
        >
          <Plus className="h-5 w-5" />
          Добавить
        </button>
      </div>

      <div className="space-y-5">
        {workingDays.map((item) => (
          <div
            key={item.day}
            className="flex items-center justify-between rounded-3xl border border-gray-200 px-6 py-6"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-14">
              <h3 className="min-w-[170px] text-[18px] font-semibold text-slate-900">
                {getWeekDayLabel(item.day)}
              </h3>

              <div className="flex items-center gap-3 text-[16px] text-gray-500">
                <Clock3 className="h-5 w-5" />
                <span>
                  {item.startTime} - {item.endTime}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onRemoveDay(item.day)}
              className="text-slate-900 transition hover:text-red-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        ))}

        {workingDays.length === 0 && (
          <div className="rounded-3xl border border-dashed border-gray-300 px-6 py-8 text-center text-[16px] text-gray-500">
            Рабочие дни пока не добавлены
          </div>
        )}
      </div>
    </section>
  )
}

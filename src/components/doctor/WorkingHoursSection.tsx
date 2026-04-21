import { Clock3, Lock } from 'lucide-react'
import type { WorkingDay } from '../../type/schedule'
import { getWeekDayLabel } from '../../utils/schedule'

type WorkingHoursSectionProps = {
  workingDays: WorkingDay[]
}

export default function WorkingHoursSection({
  workingDays,
}: WorkingHoursSectionProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white px-9 py-8 shadow-sm">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[21px] font-semibold text-slate-900">Рабочие часы</h2>
          <p className="mt-3 text-[16px] text-gray-500">
            Этот блок доступен только для просмотра. Рабочее расписание сотрудника
            задаётся администратором.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] font-medium text-slate-600">
          <Lock className="h-4 w-4" />
          Только просмотр
        </div>
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

            <span className="rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-500">
              Назначено администратором
            </span>
          </div>
        ))}

        {workingDays.length === 0 && (
          <div className="rounded-3xl border border-dashed border-gray-300 px-6 py-8 text-center text-[16px] text-gray-500">
            Администратор пока не добавил рабочие часы
          </div>
        )}
      </div>
    </section>
  )
}

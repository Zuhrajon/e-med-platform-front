import type { ScheduleException } from '../../type/schedule'
import { formatExceptionDate } from '../../utils/schedule'

type ExceptionsSectionProps = {
  exceptions: ScheduleException[]
}

export default function ExceptionsSection({
  exceptions,
}: ExceptionsSectionProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white px-9 py-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-[21px] font-semibold text-slate-900">Исключения</h2>
        <p className="mt-3 text-[17px] text-gray-500">
          Праздничные и нерабочие дни задаются администратором и отображаются здесь
          только для просмотра.
        </p>
      </div>

      <div className="space-y-4">
        {exceptions.length ? (
          exceptions.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-gray-200 px-6 py-6"
            >
              <h3 className="text-[18px] font-semibold text-slate-900">
                {formatExceptionDate(item.date)}
              </h3>
              <p className="mt-2 text-[16px] text-gray-500">{item.reason}</p>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-300 px-6 py-8 text-center text-[16px] text-gray-500">
            Администратор пока не добавил исключения в календарь.
          </div>
        )}
      </div>
    </section>
  )
}

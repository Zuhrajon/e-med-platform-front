type DoctorDayStatsCardProps = {
  total: number
  completed: number
  waiting: number
}

export default function DoctorDayStatsCard({
  total,
  completed,
  waiting,
}: DoctorDayStatsCardProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white px-9 py-8 shadow-sm">
      <h2 className="text-[24px] font-semibold text-slate-900">
        Статистика за день
      </h2>

      <div className="mt-8 space-y-8">
        <div>
          <p className="text-[18px] text-gray-500">Всего приёмов</p>
          <p className="mt-3 text-[22px] font-semibold text-slate-900">{total}</p>
        </div>

        <div>
          <p className="text-[18px] text-gray-500">Завершено</p>
          <p className="mt-3 text-[22px] font-semibold text-slate-900">
            {completed}
          </p>
        </div>

        <div>
          <p className="text-[18px] text-gray-500">Ожидают</p>
          <p className="mt-3 text-[22px] font-semibold text-slate-900">{waiting}</p>
        </div>
      </div>
    </section>
  )
}
export default function ScheduleInfoSection() {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white px-9 py-8 shadow-sm">
      <h2 className="text-[24px] font-semibold text-slate-900">Информация</h2>

      <div className="mt-8 space-y-6 text-[18px] leading-9 text-gray-500">
        <p>
          Пациенты смогут записываться на приём в указанные рабочие часы с учётом
          длительности приёма и перерывов.
        </p>

        <p>
          Изменения в расписании вступят в силу немедленно и будут доступны для
          бронирования.
        </p>
      </div>
    </section>
  )
}
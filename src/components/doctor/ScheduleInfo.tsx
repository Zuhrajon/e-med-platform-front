export default function ScheduleInfoSection() {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white px-9 py-8 shadow-sm">
      <h2 className="text-[21px] font-semibold text-slate-900">Информация</h2>

      <div className="mt-6 space-y-4 text-[16px] leading-8 text-gray-500">
        <p>
          Пациенты смогут записываться на прием в указанные рабочие часы с учетом
          длительности приема и перерывов.
        </p>

        <p>
          Исключения в календаре теперь задаются администратором. Если день помечен
          как праздничный или нерабочий, он просто отобразится в списке выше.
        </p>
      </div>
    </section>
  )
}

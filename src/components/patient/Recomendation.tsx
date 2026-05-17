export default function Recomendation() {
  const recommendations = [
    'Не забудьте пройти ежегодную диспансеризацию',
    'Рекомендуем записаться на профилактический осмотр',
  ]

  return (
    <section className="w-full rounded-[32px] border border-slate-200 bg-white px-8 py-8 shadow-sm">
      <h2 className="text-[26px] font-semibold text-slate-900">Рекомендации</h2>

      <div className="mt-6 flex flex-col gap-4">
        {recommendations.map((item) => (
          <div key={item} className="rounded-2xl bg-sky-50 px-5 py-5">
            <p className="text-[15px] text-slate-700">{item}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

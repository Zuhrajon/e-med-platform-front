export default function Recomendation() {
    const recommendations = [
        "Не забудьте пройти ежегодную диспансеризацию",
        "Рекомендуем записаться на профилактический осмотр",
    ]
    return (
        <div className="w-full max-w-[860px] rounded-2xl border mt-10 border-gray-200 bg-white px-9 py-10 shadow-sm">
            <h2 className="text-[21px] font-semibold text-slate-900">
                Рекомендации
            </h2>

            <div className="mt-7 flex flex-col gap-4">
                {recommendations.map((item) => (
                    <div key={item} className="rounded-2xl bg-blue-100 px-5 py-5">
                        <p className="text-[15px] text-slate-700">{item}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

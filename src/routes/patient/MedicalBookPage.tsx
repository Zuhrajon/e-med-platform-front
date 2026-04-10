import { useState } from 'react'
import MedicalVisitCard, { type MedicalVisit } from '../../components/patient/MedicalVisitCard'
import ProtocolModal from '../../components/patient/ProtocolModal'

export default function MedicalBookPage() {
  const [selectedVisit, setSelectedVisit] = useState<MedicalVisit | null>(null)

  const visits: MedicalVisit[] = [
    {
      id: '1',
      doctorName: 'Елена Сидорова',
      specialty: 'Невролог',
      date: '28.03.2026',
      diagnosis: 'Мигрень',
      hasProtocol: true,
      prescriptionsCount: 1,
      protocol: {
        complaints:
          'Периодические головные боли в височной области, усиливающиеся к вечеру.\nПовышенная утомляемость.',
        diagnosis: 'Мигрень',
        treatment:
          'Назначены обезболивающие препараты, рекомендован режим отдыха.\nПроведена консультация по профилактике головных болей.',
        recommendations:
          'Соблюдать режим сна, избегать стрессовых ситуаций. Повторный приём через 2 недели. При усилении симптомов обратиться незамедлительно.',
        prescriptions: [
          {
            id: '1',
            name: 'Ибупрофен 400мг',
            dosage: 'По 1 таблетке 2-3 раза в день после еды. Курс 5-7 дней.',
          },
        ],
      },
    },
    {
      id: '2',
      doctorName: 'Анна Иванова',
      specialty: 'Терапевт',
      date: '15.02.2026',
      diagnosis: 'ОРВИ',
      hasProtocol: true,
      filesCount: 2,
      prescriptionsCount: 1,
      protocol: {
        complaints:
          'Повышенная температура, слабость, боль в горле, насморк.',
        diagnosis: 'ОРВИ',
        treatment:
          'Назначено симптоматическое лечение, обильное питьё и постельный режим.',
        recommendations:
          'Избегать переохлаждения, соблюдать режим отдыха, повторно обратиться при ухудшении состояния.',
        prescriptions: [
          {
            id: '2',
            name: 'Парацетамол 500мг',
            dosage: 'По 1 таблетке при температуре выше 38°C, не более 4 раз в сутки.',
          },
        ],
      },
    },
  ]

  return (
    <div className="min-h-screen bg-[#f7f7f8] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <header>
          <h1 className="text-[32px] font-semibold text-slate-900">
            Медицинская книжка
          </h1>

          <p className="mt-4 text-[18px] text-gray-500">
            История ваших визитов и медицинские документы
          </p>
        </header>

        <section className="mt-12 rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">
          <h2 className="text-[28px] font-semibold text-slate-900">
            История визитов
          </h2>

          <div className="mt-10 flex flex-col gap-6">
            {visits.map((visit) => (
              <MedicalVisitCard
                key={visit.id}
                visit={visit}
                onOpenProtocol={setSelectedVisit}
              />
            ))}
          </div>
        </section>
      </div>

      <ProtocolModal
        visit={selectedVisit}
        onClose={() => setSelectedVisit(null)}
      />
    </div>
  )
}
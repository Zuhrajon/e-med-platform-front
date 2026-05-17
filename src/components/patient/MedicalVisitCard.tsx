import { Calendar, Download, FileText, Pill, UserRound } from 'lucide-react'

type Prescription = {
  id: string
  name: string
  dosage: string
}

export type MedicalVisit = {
  id: string
  doctorName: string
  doctorPhotoUrl?: string
  specialty: string
  date: string
  diagnosis: string
  createdAt?: string
  filesCount?: number
  prescriptionsCount?: number
  hasProtocol?: boolean
  protocol?: {
    complaints: string
    diagnosis: string
    treatment: string
    recommendations: string
    prescriptions?: Prescription[]
    files?: Array<{
      id: string
      name: string
      sizeBytes: number
      contentType: string
    }>
  }
}

type MedicalVisitCardProps = {
  visit: MedicalVisit
  onOpenProtocol: (visit: MedicalVisit) => void
}

export default function MedicalVisitCard({
  visit,
  onOpenProtocol,
}: MedicalVisitCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-5">
          {visit.doctorPhotoUrl ? (
            <img
              src={visit.doctorPhotoUrl}
              alt={visit.doctorName}
              className="h-18 w-18 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-full bg-gray-100 text-slate-800">
              <UserRound size={34} strokeWidth={1.8} />
            </div>
          )}

          <div>
            <h3 className="text-[22px] font-semibold text-slate-900">{visit.doctorName}</h3>

            <p className="mt-2 text-[18px] text-gray-500">{visit.specialty}</p>

            <div className="mt-5 flex items-center gap-3 text-[18px] text-gray-500">
              <Calendar size={22} />
              <span>{visit.date}</span>
            </div>

            {visit.createdAt ? (
              <p className="mt-3 text-[15px] text-gray-400">Добавлено: {visit.createdAt}</p>
            ) : null}
          </div>
        </div>

        <span className="rounded-full bg-sky-100 px-5 py-2 text-[16px] font-medium text-sky-700">
          {visit.diagnosis}
        </span>
      </div>

      <div className="my-6 border-t border-gray-200" />

      <div className="flex flex-wrap gap-3">
        {visit.hasProtocol ? (
          <button
            onClick={() => onOpenProtocol(visit)}
            className="inline-flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-5 py-3 text-[16px] font-semibold text-slate-900 transition hover:bg-gray-50"
          >
            <FileText size={22} />
            Протокол
          </button>
        ) : null}

        {visit.filesCount && visit.filesCount > 0 ? (
          <button
            onClick={() => onOpenProtocol(visit)}
            className="inline-flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-5 py-3 text-[16px] font-semibold text-slate-900 transition hover:bg-gray-50"
          >
            <Download size={22} />
            Файлы ({visit.filesCount})
          </button>
        ) : null}

        {visit.prescriptionsCount && visit.prescriptionsCount > 0 ? (
          <button className="inline-flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-5 py-3 text-[16px] font-semibold text-slate-900 transition hover:bg-gray-50">
            <Pill size={22} />
            Рецепты ({visit.prescriptionsCount})
          </button>
        ) : null}
      </div>
    </div>
  )
}

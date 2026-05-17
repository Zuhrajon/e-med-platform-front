import { Download, Pill, X } from 'lucide-react'
import { useUser } from '../../context/UserContext'
import { downloadFile } from '../../lib/files'
import { formatFileSize } from '../../lib/medicalCard'

type Prescription = {
  id: string
  name: string
  dosage: string
}

type ProtocolData = {
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

type ProtocolVisit = {
  doctorName: string
  doctorPhotoUrl?: string
  date: string
  protocol?: ProtocolData
}

type ProtocolModalProps = {
  visit: ProtocolVisit | null
  onClose: () => void
}

export default function ProtocolModal({ visit, onClose }: ProtocolModalProps) {
  const { accessToken } = useUser()

  if (!visit || !visit.protocol) return null

  const { protocol } = visit

  async function handleDownload(fileID: string, fileName: string) {
    if (!accessToken) return
    await downloadFile(accessToken, fileID, fileName)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-10 py-7">
          <h2 className="text-[24px] font-semibold text-slate-900">Протокол приёма</h2>

          <button onClick={onClose} className="text-gray-500 transition hover:text-slate-900">
            <X size={34} />
          </button>
        </div>

        <div className="overflow-y-auto px-10 py-8">
          <div className="grid grid-cols-1 gap-4 rounded-2xl bg-gray-100 px-6 py-6 md:grid-cols-2">
            <div className="flex items-center gap-4">
              {visit.doctorPhotoUrl ? (
                <img
                  src={visit.doctorPhotoUrl}
                  alt={visit.doctorName}
                  className="h-14 w-14 shrink-0 rounded-full object-cover"
                />
              ) : null}

              <div>
                <p className="text-[16px] text-gray-500">Врач</p>
                <p className="mt-2 text-[20px] font-semibold text-slate-900">{visit.doctorName}</p>
              </div>
            </div>

            <div>
              <p className="text-[16px] text-gray-500">Дата визита</p>
              <p className="mt-2 text-[20px] font-semibold text-slate-900">{visit.date}</p>
            </div>
          </div>

          <div className="mt-8 space-y-8">
            <div>
              <h3 className="text-[18px] font-semibold text-slate-900">Жалобы</h3>
              <p className="mt-4 whitespace-pre-line text-[18px] leading-9 text-gray-500">
                {protocol.complaints || 'Не указано'}
              </p>
            </div>

            <div>
              <h3 className="text-[18px] font-semibold text-slate-900">Диагноз</h3>
              <p className="mt-4 whitespace-pre-line text-[18px] leading-9 text-gray-500">
                {protocol.diagnosis || 'Не указано'}
              </p>
            </div>

            <div>
              <h3 className="text-[18px] font-semibold text-slate-900">Лечение</h3>
              <p className="mt-4 whitespace-pre-line text-[18px] leading-9 text-gray-500">
                {protocol.treatment || 'Не указано'}
              </p>
            </div>

            <div>
              <h3 className="text-[18px] font-semibold text-slate-900">Рекомендации</h3>
              <p className="mt-4 whitespace-pre-line text-[18px] leading-9 text-gray-500">
                {protocol.recommendations || 'Не указано'}
              </p>
            </div>

            {protocol.prescriptions && protocol.prescriptions.length > 0 ? (
              <div className="rounded-2xl bg-sky-100 px-6 py-6">
                <h3 className="text-[18px] font-semibold text-slate-900">Рецепты</h3>

                <div className="mt-5 space-y-4">
                  {protocol.prescriptions.map((prescription) => (
                    <div key={prescription.id} className="flex gap-4">
                      <Pill className="mt-1 text-sky-600" size={24} />
                      <div>
                        <p className="text-[18px] font-semibold text-slate-900">
                          {prescription.name}
                        </p>
                        <p className="mt-1 text-[16px] text-gray-500">{prescription.dosage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {protocol.files && protocol.files.length > 0 ? (
              <div className="rounded-2xl bg-slate-50 px-6 py-6">
                <h3 className="text-[18px] font-semibold text-slate-900">Прикреплённые файлы</h3>

                <div className="mt-5 space-y-3">
                  {protocol.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="text-[17px] font-semibold text-slate-900">{file.name}</p>
                        <p className="mt-1 text-[15px] text-gray-500">
                          {file.contentType} • {formatFileSize(file.sizeBytes)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => void handleDownload(file.id, file.name)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Download className="h-4 w-4" />
                        Скачать
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="border-t border-gray-200 px-10 py-6">
          <button
            onClick={onClose}
            className="w-full rounded-2xl border border-gray-300 bg-white px-6 py-4 text-[18px] font-semibold text-slate-900 transition hover:bg-gray-50"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  )
}

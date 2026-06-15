import { useEffect, useMemo, useState } from 'react'
import PatientLaboratoryOrdersSection from '../../components/laboratory/PatientLaboratoryOrdersSection'
import MedicalVisitCard, { type MedicalVisit } from '../../components/patient/MedicalVisitCard'
import ProtocolModal from '../../components/patient/ProtocolModal'
import { useUser } from '../../context/UserContext'
import { downloadFile } from '../../lib/files'
import { listLaboratoryOrders, type LaboratoryOrder } from '../../lib/laboratory'
import {
  listMedicalCardRecords,
  parseProtocolText,
  type MedicalCardRecord,
} from '../../lib/medicalCard'
import { formatVisitDateTime, listVisits, type Visit } from '../../lib/visits'

export default function MedicalBookPage() {
  const { accessToken, user } = useUser()
  const [selectedVisit, setSelectedVisit] = useState<MedicalVisit | null>(null)
  const [visits, setVisits] = useState<Visit[]>([])
  const [records, setRecords] = useState<MedicalCardRecord[]>([])
  const [labOrders, setLabOrders] = useState<LaboratoryOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!accessToken) return

    const loadMedicalBook = async () => {
      setIsLoading(true)
      setError('')

      try {
        const visitsResponse = await listVisits(accessToken)
        setVisits(visitsResponse)

        const patientUserID = user.userId || visitsResponse[0]?.patient_user_id
        if (!patientUserID) {
          setRecords([])
          return
        }

        const recordsResponse = await listMedicalCardRecords(accessToken, patientUserID)
        const labOrdersResponse = await listLaboratoryOrders(accessToken)
        setRecords(recordsResponse)
        setLabOrders(labOrdersResponse.filter((item) => item.status === 'completed'))
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Не удалось загрузить медицинскую книжку',
        )
      } finally {
        setIsLoading(false)
      }
    }

    void loadMedicalBook()
  }, [accessToken, user.userId])

  const visitMap = useMemo(
    () => new Map(visits.map((visit) => [visit.visit_id, visit])),
    [visits],
  )

  const medicalVisits = useMemo<MedicalVisit[]>(
    () =>
      records.map((record) => {
        const visit = visitMap.get(record.visit_id)
        const protocol = parseProtocolText(record.protocol_text)
        const recordLabOrders = labOrders.filter((order) => order.visit_id === record.visit_id)

        return {
          id: record.record_id,
          doctorName: record.doctor_full_name,
          doctorPhotoUrl: record.doctor_avatar_url || '',
          specialty: visit?.specialty_name ?? 'Специальность не указана',
          date: formatVisitDateTime(visit?.scheduled_at ?? record.created_at),
          createdAt: formatVisitDateTime(record.created_at),
          diagnosis: protocol.diagnosis || 'Без диагноза',
          hasProtocol: true,
          filesCount: record.files.length,
          protocol: {
            ...protocol,
            files: record.files.map((file) => ({
              id: file.file_id,
              name: file.file_name,
              sizeBytes: file.size_bytes,
              contentType: file.content_type,
            })),
            labOrders: recordLabOrders,
          },
        }
      }),
    [labOrders, records, visitMap],
  )

  return (
    <div className="min-h-screen bg-[#f7f7f8] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <header>
          <h1 className="text-[32px] font-semibold text-slate-900">Медицинская книжка</h1>

          <p className="mt-4 text-[18px] text-gray-500">
            История ваших визитов и медицинские документы
          </p>
        </header>

        <section className="mt-12 rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">
          <h2 className="text-[28px] font-semibold text-slate-900">История визитов</h2>

          <div className="mt-10 flex flex-col gap-6">
            {isLoading ? (
              <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-10 text-center text-[18px] text-gray-500">
                Загрузка медицинской книжки...
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-[16px] text-red-700">
                {error}
              </div>
            ) : medicalVisits.length ? (
              medicalVisits.map((visit) => (
                <MedicalVisitCard
                  key={visit.id}
                  visit={visit}
                  onOpenProtocol={setSelectedVisit}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-10 text-center text-[18px] text-gray-500">
                Записей в медицинской книжке пока нет.
              </div>
            )}
          </div>
        </section>

        <PatientLaboratoryOrdersSection
          orders={labOrders}
          isLoading={isLoading}
          onDownloadFile={async (fileID, fileName) => {
            if (!accessToken) return
            await downloadFile(accessToken, fileID, fileName)
          }}
        />
      </div>

      <ProtocolModal visit={selectedVisit} onClose={() => setSelectedVisit(null)} />
    </div>
  )
}

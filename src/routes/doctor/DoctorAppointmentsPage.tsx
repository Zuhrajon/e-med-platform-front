import { Clock3, FileText, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import DoctorLaboratoryOrderCard from '../../components/laboratory/DoctorLaboratoryOrderCard'
import ProtocolModal from '../../components/patient/ProtocolModal'
import type { MedicalVisit } from '../../components/patient/MedicalVisitCard'
import { useUser } from '../../context/UserContext'
import {
  createLaboratoryOrder,
  listLaboratoryOrders,
  listLaboratoryTestTypes,
  reviewLaboratoryOrder,
  type LaboratoryOrder,
  type LaboratoryTestType,
} from '../../lib/laboratory'
import {
  addMedicalRecordFiles,
  buildProtocolText,
  createMedicalRecord,
  listMedicalCardRecords,
  parseProtocolText,
  type MedicalCardRecord,
} from '../../lib/medicalCard'
import {
  formatVisitDateTime,
  formatVisitTime,
  getVisitByID,
  listVisits,
  toDateInputValue,
  updateVisitStatus,
  type Visit,
  type VisitDetails,
  type VisitStatus,
} from '../../lib/visits'
import {
  getPatientByID,
  verifyPatient,
  type PatientListItem,
} from '../../lib/patients'

type ProtocolFormState = {
  complaints: string
  diagnosis: string
  treatment: string
  recommendations: string
}

const emptyProtocol: ProtocolFormState = {
  complaints: '',
  diagnosis: '',
  treatment: '',
  recommendations: '',
}

function mapRecordToProtocolVisit(
  record: MedicalCardRecord,
  visits: Visit[],
  labOrders: LaboratoryOrder[],
): MedicalVisit {
  const linkedVisit = visits.find((visit) => visit.visit_id === record.visit_id)
  const protocol = parseProtocolText(record.protocol_text)
  const recordLabOrders = labOrders.filter(
    (order) => order.visit_id === record.visit_id && order.status === 'completed',
  )

  return {
    id: record.record_id,
    doctorName: record.doctor_full_name,
    doctorPhotoUrl: record.doctor_avatar_url || '',
    specialty: linkedVisit?.specialty_name ?? 'Прошлый приём',
    date: formatVisitDateTime(linkedVisit?.scheduled_at ?? record.created_at),
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
}

export default function DoctorAppointmentsPage() {
  const { accessToken } = useUser()
  const [selectedDate, setSelectedDate] = useState(() => toDateInputValue(new Date()))
  const [statusFilter, setStatusFilter] = useState<'' | Extract<VisitStatus, 'confirmed' | 'completed'>>('')
  const [visits, setVisits] = useState<Visit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [pendingVisitID, setPendingVisitID] = useState<string | null>(null)
  const [expandedVisitID, setExpandedVisitID] = useState<string | null>(null)
  const [visitDetailsMap, setVisitDetailsMap] = useState<Record<string, VisitDetails>>({})
  const [visitRecordsMap, setVisitRecordsMap] = useState<Record<string, MedicalCardRecord | null>>({})
  const [visitPatientsMap, setVisitPatientsMap] = useState<Record<string, PatientListItem>>({})
  const [recordLoadingVisitID, setRecordLoadingVisitID] = useState<string | null>(null)
  const [recordSubmittingVisitID, setRecordSubmittingVisitID] = useState<string | null>(null)
  const [verifyPendingVisitID, setVerifyPendingVisitID] = useState<string | null>(null)
  const [protocolForm, setProtocolForm] = useState<ProtocolFormState>(emptyProtocol)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [historyError, setHistoryError] = useState('')
  const [historyPatientName, setHistoryPatientName] = useState('')
  const [historyRecords, setHistoryRecords] = useState<MedicalCardRecord[]>([])
  const [historyVisitMap, setHistoryVisitMap] = useState<Record<string, Visit[]>>({})
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)
  const [selectedProtocol, setSelectedProtocol] = useState<MedicalVisit | null>(null)
  const [labOrders, setLabOrders] = useState<LaboratoryOrder[]>([])
  const [labTestTypes, setLabTestTypes] = useState<LaboratoryTestType[]>([])
  const [labSubmittingVisitID, setLabSubmittingVisitID] = useState<string | null>(null)
  const [labReviewingOrderID, setLabReviewingOrderID] = useState<string | null>(null)

  async function loadVisits(targetDate = selectedDate) {
    if (!accessToken) return

    setIsLoading(true)
    setError('')

    try {
      const response = await listVisits(accessToken, {
        date: targetDate || undefined,
        sort: 'scheduled_at_desc',
      })
      setVisits(response.sort((a, b) => b.scheduled_at.localeCompare(a.scheduled_at)))
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить приёмы')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadVisits()
  }, [accessToken, selectedDate])

  useEffect(() => {
    if (!accessToken) return
    const token = accessToken

    async function loadLaboratoryData() {
      try {
        const [ordersResponse, testTypesResponse] = await Promise.all([
          listLaboratoryOrders(token),
          listLaboratoryTestTypes(token),
        ])
        setLabOrders(ordersResponse)
        setLabTestTypes(testTypesResponse)
      } catch {
        // Keep the appointments workflow available even if laboratory data fails to load.
      }
    }

    void loadLaboratoryData()
  }, [accessToken])

  const visibleVisits = useMemo(
    () =>
      visits.filter((item) => {
        const isDoctorWorkStatus = item.status === 'confirmed' || item.status === 'completed'
        const matchesStatus = !statusFilter || item.status === statusFilter

        return isDoctorWorkStatus && matchesStatus
      }),
    [visits, statusFilter],
  )

  const confirmedCount = useMemo(
    () => visibleVisits.filter((item) => item.status === 'confirmed').length,
    [visibleVisits],
  )

  const completedCount = useMemo(
    () => visibleVisits.filter((item) => item.status === 'completed').length,
    [visibleVisits],
  )

  async function handleComplete(visitID: string) {
    if (!accessToken) return

    setPendingVisitID(visitID)
    setError('')
    setSuccess('')

    try {
      await updateVisitStatus(accessToken, visitID, 'completed')
      setSuccess('Приём отмечен как завершённый.')
      await loadVisits()
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Не удалось завершить приём')
    } finally {
      setPendingVisitID(null)
    }
  }

  async function openMedicalRecord(visit: Visit) {
    if (!accessToken) return

    if (expandedVisitID === visit.visit_id) {
      setExpandedVisitID(null)
      setSelectedFiles([])
      return
    }

    setExpandedVisitID(visit.visit_id)
    setRecordLoadingVisitID(visit.visit_id)
    setSelectedFiles([])
    setError('')

    try {
      const details = await getVisitByID(accessToken, visit.visit_id)
      const patient = await getPatientByID(accessToken, visit.patient_user_id)
      const allPatientRecords = await listMedicalCardRecords(accessToken, visit.patient_user_id)
      const visitRecord = allPatientRecords.find((item) => item.visit_id === visit.visit_id) ?? null

      setVisitDetailsMap((prev) => ({ ...prev, [visit.visit_id]: details }))
      setVisitPatientsMap((prev) => ({ ...prev, [visit.visit_id]: patient }))
      setVisitRecordsMap((prev) => ({ ...prev, [visit.visit_id]: visitRecord }))
      setProtocolForm(visitRecord ? parseProtocolText(visitRecord.protocol_text) : emptyProtocol)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить данные приёма')
    } finally {
      setRecordLoadingVisitID(null)
    }
  }

  async function openPatientHistory(visit: Visit) {
    if (!accessToken) return

    setHistoryPatientName(visit.patient_full_name)
    setIsHistoryOpen(true)
    setIsHistoryLoading(true)
    setHistoryError('')

    try {
      const [recordsResponse, visitsResponse] = await Promise.all([
        listMedicalCardRecords(accessToken, visit.patient_user_id),
        listVisits(accessToken),
      ])

      setHistoryRecords(recordsResponse)
      setHistoryVisitMap((prev) => ({
        ...prev,
        [visit.patient_user_id]: visitsResponse.filter(
          (item) => item.patient_user_id === visit.patient_user_id,
        ),
      }))
    } catch (loadError) {
      setHistoryRecords([])
      setHistoryError(
        loadError instanceof Error ? loadError.message : 'Не удалось загрузить прошлые протоколы',
      )
    } finally {
      setIsHistoryLoading(false)
    }
  }

  async function handleCreateLaboratoryOrder(
    visitID: string,
    payload: {
      doctor_comment: string
      items: Array<{ test_type_id: string; notes: string }>
    },
  ) {
    if (!accessToken || !payload.items.length) return

    setLabSubmittingVisitID(visitID)
    setError('')
    setSuccess('')

    try {
      await createLaboratoryOrder(accessToken, visitID, payload)
      const updatedOrders = await listLaboratoryOrders(accessToken)
      setLabOrders(updatedOrders)
      setSuccess('Лабораторное направление создано.')
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : 'Не удалось создать лабораторное направление',
      )
    } finally {
      setLabSubmittingVisitID(null)
    }
  }

  async function handleReviewLaboratoryOrder(orderID: string, doctorResultComment: string) {
    if (!accessToken) return

    setLabReviewingOrderID(orderID)
    setError('')
    setSuccess('')

    try {
      const reviewedOrder = await reviewLaboratoryOrder(accessToken, orderID, {
        doctor_result_comment: doctorResultComment,
      })
      setLabOrders((prev) =>
        prev.map((item) => (item.order_id === reviewedOrder.order_id ? reviewedOrder : item)),
      )
      setSuccess('Результат анализа отмечен как просмотренный.')
    } catch (reviewError) {
      setError(
        reviewError instanceof Error
          ? reviewError.message
          : 'Не удалось отметить результат анализа',
      )
    } finally {
      setLabReviewingOrderID(null)
    }
  }

  async function handleSaveRecord(visit: Visit) {
    if (!accessToken) return

    setRecordSubmittingVisitID(visit.visit_id)
    setError('')
    setSuccess('')

    try {
      let visitRecord = visitRecordsMap[visit.visit_id]

      if (!visitRecord) {
        const createdRecord = await createMedicalRecord(
          accessToken,
          visit.visit_id,
          buildProtocolText(protocolForm),
        )

        visitRecord = {
          record_id: createdRecord.record_id,
          patient_user_id: createdRecord.patient_user_id,
          visit_id: createdRecord.visit_id,
          doctor_user_id: visit.doctor_user_id,
          doctor_full_name: visit.doctor_full_name,
          protocol_text: createdRecord.protocol_text,
          created_at: new Date().toISOString(),
          files: [],
        }
      }

      if (selectedFiles.length) {
        await addMedicalRecordFiles(accessToken, visit.visit_id, visitRecord.record_id, selectedFiles)
      }

      const refreshedRecords = await listMedicalCardRecords(accessToken, visit.patient_user_id)
      const refreshedVisitRecord =
        refreshedRecords.find((item) => item.visit_id === visit.visit_id) ?? visitRecord

      setVisitRecordsMap((prev) => ({ ...prev, [visit.visit_id]: refreshedVisitRecord }))
      setProtocolForm(parseProtocolText(refreshedVisitRecord.protocol_text))
      setSelectedFiles([])
      setSuccess('Медицинская запись сохранена.')
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Не удалось сохранить медицинскую запись',
      )
    } finally {
      setRecordSubmittingVisitID(null)
    }
  }

  async function handleVerifyPatient(visit: Visit) {
    if (!accessToken) return

    setVerifyPendingVisitID(visit.visit_id)
    setError('')
    setSuccess('')

    try {
      await verifyPatient(accessToken, visit.patient_user_id, visit.visit_id)
      const refreshedPatient = await getPatientByID(accessToken, visit.patient_user_id)
      setVisitPatientsMap((prev) => ({ ...prev, [visit.visit_id]: refreshedPatient }))
      setSuccess('Пациент верифицирован по завершённому приёму.')
    } catch (verifyError) {
      setError(
        verifyError instanceof Error
          ? verifyError.message
          : 'Не удалось подтвердить верификацию пациента',
      )
    } finally {
      setVerifyPendingVisitID(null)
    }
  }

  const activeHistoryVisits = visibleVisits.find((visit) => visit.patient_full_name === historyPatientName)
    ? historyVisitMap[
        visibleVisits.find((visit) => visit.patient_full_name === historyPatientName)?.patient_user_id ||
          ''
      ] ?? []
    : []

  return (
    <div className="w-full bg-[#f7f7f8] px-6 py-10">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-[28px] font-semibold text-slate-900">Журнал приёмов</h1>
          <p className="mt-3 text-[17px] text-gray-500">
            Все записи пациентов с фильтрацией по дате и статусу
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-sky-500"
          />

          <button
            type="button"
            onClick={() => setSelectedDate('')}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Все даты
          </button>

          <div className="flex h-12 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {[
              { label: 'Все статусы', value: '' },
              { label: 'Подтверждённые', value: 'confirmed' },
              { label: 'Завершённые', value: 'completed' },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() =>
                  setStatusFilter(item.value as '' | Extract<VisitStatus, 'confirmed' | 'completed'>)
                }
                className={`h-full px-4 text-sm font-semibold transition ${
                  statusFilter === item.value
                    ? 'bg-sky-700 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {success ? (
        <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">
          {success}
        </div>
      ) : null}

      {error ? (
        <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          {error}
        </div>
      ) : null}

      <section className="mt-10 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-[linear-gradient(135deg,#eef7ff_0%,#ffffff_55%,#f8fbff_100%)] px-8 py-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-[26px] font-semibold text-slate-900">Список приёмов</h2>
              <p className="mt-2 text-[15px] text-slate-500">
                {selectedDate ? 'Записи на выбранную дату' : 'Записи за всё время'}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-white/80 px-4 py-3 ring-1 ring-slate-100">
                Всего: <span className="font-semibold text-slate-900">{visibleVisits.length}</span>
              </div>
              <div className="rounded-2xl bg-white/80 px-4 py-3 ring-1 ring-slate-100">
                Подтверждены: <span className="font-semibold text-slate-900">{confirmedCount}</span>
              </div>
              <div className="rounded-2xl bg-white/80 px-4 py-3 ring-1 ring-slate-100">
                Завершены: <span className="font-semibold text-slate-900">{completedCount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-8">
          {isLoading ? (
            <div className="rounded-3xl border border-dashed border-slate-300 px-6 py-10 text-center text-[18px] text-slate-500">
              Загрузка приёмов...
            </div>
          ) : visibleVisits.length ? (
            <div className="space-y-5">
              {visibleVisits.map((visit) => {
                const isPending = pendingVisitID === visit.visit_id
                const isExpanded = expandedVisitID === visit.visit_id
                const visitDetails = visitDetailsMap[visit.visit_id]
                const visitRecord = visitRecordsMap[visit.visit_id]
                const patientDetails = visitPatientsMap[visit.visit_id]
                const isRecordLoading = recordLoadingVisitID === visit.visit_id
                const isRecordSubmitting = recordSubmittingVisitID === visit.visit_id
                const isVerifyingPatient = verifyPendingVisitID === visit.visit_id
                const parsedRecord = visitRecord ? parseProtocolText(visitRecord.protocol_text) : null
                const isCompleted = visit.status === 'completed'
                const visitLabOrders = labOrders.filter((item) => item.visit_id === visit.visit_id)

                return (
                  <article
                    key={visit.visit_id}
                    className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] px-6 py-6 transition hover:border-sky-200 hover:shadow-sm"
                  >
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-[22px] font-semibold text-slate-900">
                            {visit.patient_full_name}
                          </h3>
                          <span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${
                              isCompleted
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-sky-50 text-sky-700'
                            }`}
                          >
                            {isCompleted ? 'Завершён' : 'Подтверждён'}
                          </span>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3">
                          <div className="w-fit rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5">
                            <div className="flex items-center gap-2 text-slate-400">
                              <Clock3 className="h-4 w-4" />
                              <p className="text-xs uppercase tracking-[0.12em]">Время</p>
                            </div>
                            <p className="mt-2 text-[15px] font-semibold text-slate-900">
                              {formatVisitTime(visit.scheduled_at)}
                            </p>
                          </div>

                          <div className="w-fit rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5">
                            <div className="flex items-center gap-2 text-slate-400">
                              <FileText className="h-4 w-4" />
                              <p className="text-xs uppercase tracking-[0.12em]">Создано</p>
                            </div>
                            <p className="mt-2 whitespace-nowrap text-[15px] font-semibold text-slate-900">
                              {formatVisitDateTime(visitDetails?.created_at ?? visit.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col-reverseьов gap-3 xl:max-w-[360px] xl:justify-end">
                        <button
                          type="button"
                          onClick={() => void openPatientHistory(visit)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                        >
                          <FileText className="h-4 w-4" />
                          Прошлые протоколы
                        </button>

                        <button
                          type="button"
                          onClick={() => void openMedicalRecord(visit)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                        >
                          <FileText className="h-4 w-4" />
                          {visitRecord ? 'Медзапись' : 'Добавить протокол'}
                        </button>

                        {visit.status === 'confirmed' ? (
                          <button
                            type="button"
                            onClick={() => void handleComplete(visit.visit_id)}
                            disabled={isPending || !visitRecord}
                            className="rounded-2xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:bg-slate-400"
                          >
                            Завершить приём
                          </button>
                        ) : (
                          <span className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                            Приём закрыт
                          </span>
                        )}
                      </div>
                    </div>

                    {isExpanded ? (
                      <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-5">
                        <DoctorLaboratoryOrderCard
                          visitID={visit.visit_id}
                          orders={visitLabOrders}
                          testTypes={labTestTypes}
                          canCreate={visit.status === 'confirmed'}
                          isSubmitting={labSubmittingVisitID === visit.visit_id}
                          onCreateOrder={handleCreateLaboratoryOrder}
                          onReviewOrder={handleReviewLaboratoryOrder}
                          reviewPendingOrderID={labReviewingOrderID}
                        />
                        {isRecordLoading ? (
                          <p className="mt-5 text-sm text-slate-500">Загрузка медицинской записи...</p>
                        ) : visitRecord ? (
                          <div className="mt-5 space-y-5">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="rounded-2xl bg-white px-4 py-4">
                                <p className="text-sm text-slate-500">Статус пациента</p>
                                <p className="mt-2 text-[15px] font-semibold text-slate-900">
                                  {patientDetails?.is_verified
                                    ? 'Пациент верифицирован'
                                    : 'Пациент ещё не верифицирован'}
                                </p>
                                {patientDetails?.verified_by_full_name ? (
                                  <p className="mt-2 text-sm text-slate-500">
                                    Проверил: {patientDetails.verified_by_full_name}
                                  </p>
                                ) : null}
                              </div>

                              {visit.status === 'completed' && !patientDetails?.is_verified ? (
                                <div className="rounded-2xl bg-white px-4 py-4">
                                  <p className="text-sm text-slate-500">Верификация пациента</p>
                                  <p className="mt-2 text-[15px] text-slate-700">
                                    После завершённого приёма врач может подтвердить личность пациента.
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => void handleVerifyPatient(visit)}
                                    disabled={isVerifyingPatient}
                                    className="mt-4 rounded-2xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:bg-slate-400"
                                  >
                                    {isVerifyingPatient ? 'Подтверждение...' : 'Верифицировать пациента'}
                                  </button>
                                </div>
                              ) : null}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="rounded-2xl bg-white px-4 py-4">
                                <p className="text-sm text-slate-500">Жалобы</p>
                                <p className="mt-2 whitespace-pre-line text-[15px] text-slate-700">
                                  {parsedRecord?.complaints || 'Не указано'}
                                </p>
                              </div>
                              <div className="rounded-2xl bg-white px-4 py-4">
                                <p className="text-sm text-slate-500">Диагноз</p>
                                <p className="mt-2 whitespace-pre-line text-[15px] text-slate-700">
                                  {parsedRecord?.diagnosis || 'Не указано'}
                                </p>
                              </div>
                              <div className="rounded-2xl bg-white px-4 py-4">
                                <p className="text-sm text-slate-500">Лечение</p>
                                <p className="mt-2 whitespace-pre-line text-[15px] text-slate-700">
                                  {parsedRecord?.treatment || 'Не указано'}
                                </p>
                              </div>
                              <div className="rounded-2xl bg-white px-4 py-4">
                                <p className="text-sm text-slate-500">Рекомендации</p>
                                <p className="mt-2 whitespace-pre-line text-[15px] text-slate-700">
                                  {parsedRecord?.recommendations || 'Не указано'}
                                </p>
                              </div>
                            </div>

                            <div className="rounded-2xl bg-white px-4 py-4">
                              <p className="text-sm text-slate-500">Прикреплённые файлы</p>
                              {visitRecord.files.length ? (
                                <div className="mt-3 space-y-2">
                                  {visitRecord.files.map((file) => (
                                    <div key={file.file_id} className="text-[15px] text-slate-700">
                                      {file.file_name}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="mt-2 text-[15px] text-slate-500">Файлы пока не добавлены.</p>
                              )}
                            </div>

                            {visit.status === 'confirmed' ? (
                              <div className="rounded-2xl bg-white px-4 py-4">
                                <label className="block text-sm font-semibold text-slate-900">
                                  Добавить ещё файлы
                                </label>
                                <input
                                  type="file"
                                  multiple
                                  onChange={(event) =>
                                    setSelectedFiles(Array.from(event.target.files ?? []))
                                  }
                                  className="mt-3 block w-full text-sm text-slate-600"
                                />
                                <button
                                  type="button"
                                  onClick={() => void handleSaveRecord(visit)}
                                  disabled={!selectedFiles.length || isRecordSubmitting}
                                  className="mt-4 rounded-2xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:bg-slate-400"
                                >
                                  {isRecordSubmitting ? 'Сохранение...' : 'Загрузить файлы'}
                                </button>
                              </div>
                            ) : null}
                          </div>
                        ) : visit.status === 'confirmed' ? (
                          <div className="space-y-4">
                            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
                              Сначала сохраните протокол, а затем завершайте приём. После завершения приёма добавить новую медицинскую запись уже нельзя.
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-slate-900">Жалобы</span>
                                <textarea
                                  value={protocolForm.complaints}
                                  onChange={(event) =>
                                    setProtocolForm((prev) => ({
                                      ...prev,
                                      complaints: event.target.value,
                                    }))
                                  }
                                  rows={4}
                                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition focus:border-sky-500"
                                />
                              </label>

                              <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-slate-900">Диагноз</span>
                                <textarea
                                  value={protocolForm.diagnosis}
                                  onChange={(event) =>
                                    setProtocolForm((prev) => ({
                                      ...prev,
                                      diagnosis: event.target.value,
                                    }))
                                  }
                                  rows={4}
                                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition focus:border-sky-500"
                                />
                              </label>

                              <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-slate-900">Лечение</span>
                                <textarea
                                  value={protocolForm.treatment}
                                  onChange={(event) =>
                                    setProtocolForm((prev) => ({
                                      ...prev,
                                      treatment: event.target.value,
                                    }))
                                  }
                                  rows={4}
                                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition focus:border-sky-500"
                                />
                              </label>

                              <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-slate-900">
                                  Рекомендации
                                </span>
                                <textarea
                                  value={protocolForm.recommendations}
                                  onChange={(event) =>
                                    setProtocolForm((prev) => ({
                                      ...prev,
                                      recommendations: event.target.value,
                                    }))
                                  }
                                  rows={4}
                                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition focus:border-sky-500"
                                />
                              </label>
                            </div>

                            <div className="rounded-2xl bg-white px-4 py-4">
                              <label className="block text-sm font-semibold text-slate-900">
                                Файлы к медицинской записи
                              </label>
                              <input
                                type="file"
                                multiple
                                onChange={(event) =>
                                  setSelectedFiles(Array.from(event.target.files ?? []))
                                }
                                className="mt-3 block w-full text-sm text-slate-600"
                              />
                              <p className="mt-2 text-sm text-slate-500">
                                Сначала сохраняется протокол, затем к нему прикрепляются файлы.
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => void handleSaveRecord(visit)}
                              disabled={isRecordSubmitting}
                              className="rounded-2xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:bg-slate-400"
                            >
                              {isRecordSubmitting ? 'Сохранение...' : 'Сохранить протокол'}
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500">
                            По этому приёму медицинская запись ещё не создана.
                          </p>
                        )}
                      </div>
                    ) : null}
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 px-6 py-10 text-center text-[18px] text-slate-500">
              Приёмов по выбранным фильтрам нет.
            </div>
          )}
        </div>
      </section>

      {isHistoryOpen ? (
        <div className="fixed inset-0 z-40 flex justify-end bg-slate-950/35 p-4">
          <div className="flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-7 py-6">
              <div>
                <h2 className="text-[24px] font-semibold text-slate-900">Прошлые протоколы</h2>
                <p className="mt-2 text-[15px] text-slate-500">{historyPatientName}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsHistoryOpen(false)
                  setHistoryError('')
                }}
                className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-7 py-6">
              {historyError ? (
                <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
                  {historyError}
                </div>
              ) : isHistoryLoading ? (
                <div className="rounded-3xl border border-dashed border-slate-300 px-6 py-10 text-center text-[17px] text-slate-500">
                  Загрузка прошлых протоколов...
                </div>
              ) : historyRecords.length ? (
                <div className="space-y-4">
                  {historyRecords
                    .slice()
                    .sort((a, b) => b.created_at.localeCompare(a.created_at))
                    .map((record) => {
                      const protocol = parseProtocolText(record.protocol_text)
                      const linkedVisit = activeHistoryVisits.find((item) => item.visit_id === record.visit_id)

                      return (
                        <article
                          key={record.record_id}
                          className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-5"
                        >
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                              <p className="text-[18px] font-semibold text-slate-900">
                                {protocol.diagnosis || 'Без диагноза'}
                              </p>
                              <p className="mt-2 text-[15px] text-slate-500">
                                {formatVisitDateTime(linkedVisit?.scheduled_at ?? record.created_at)}
                              </p>
                              <p className="mt-3 line-clamp-3 whitespace-pre-line text-[15px] text-slate-600">
                                {protocol.complaints || record.protocol_text}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setSelectedProtocol(
                                  mapRecordToProtocolVisit(record, activeHistoryVisits, labOrders),
                                )
                              }
                              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                            >
                              Открыть протокол
                            </button>
                          </div>
                        </article>
                      )
                    })}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 px-6 py-10 text-center text-[17px] text-slate-500">
                  У этого пациента пока нет сохранённых прошлых протоколов.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <ProtocolModal visit={selectedProtocol} onClose={() => setSelectedProtocol(null)} />
    </div>
  )
}

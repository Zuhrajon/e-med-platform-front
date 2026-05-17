import { CalendarDays, ChevronRight, Clock3, FileText, Users, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ProtocolModal from '../../components/patient/ProtocolModal'
import type { MedicalVisit } from '../../components/patient/MedicalVisitCard'
import { useUser } from '../../context/UserContext'
import {
  listMedicalCardRecords,
  parseProtocolText,
  type MedicalCardRecord,
} from '../../lib/medicalCard'
import {
  formatVisitDateTime,
  formatVisitTime,
  listVisits,
  toDateInputValue,
  type Visit,
} from '../../lib/visits'

function getFormattedToday() {
  return new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())
}

function mapRecordToProtocolVisit(record: MedicalCardRecord, visits: Visit[]): MedicalVisit {
  const linkedVisit = visits.find((visit) => visit.visit_id === record.visit_id)
  const protocol = parseProtocolText(record.protocol_text)

  return {
    id: record.record_id,
    doctorName: record.doctor_full_name,
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
    },
  }
}

export default function DoctorHomePage() {
  const { user, accessToken } = useUser()
  const [visits, setVisits] = useState<Visit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [historyError, setHistoryError] = useState('')
  const [historyPatientName, setHistoryPatientName] = useState('')
  const [historyRecords, setHistoryRecords] = useState<MedicalCardRecord[]>([])
  const [historyVisitMap, setHistoryVisitMap] = useState<Record<string, Visit[]>>({})
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)
  const [selectedProtocol, setSelectedProtocol] = useState<MedicalVisit | null>(null)

  useEffect(() => {
    if (!accessToken) return

    const today = toDateInputValue(new Date())

    const loadVisits = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await listVisits(accessToken, { date: today })
        setVisits(
          response
            .filter((item) => item.status === 'confirmed' || item.status === 'completed')
            .sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at)),
        )
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить приёмы')
      } finally {
        setIsLoading(false)
      }
    }

    void loadVisits()
  }, [accessToken])

  const stats = useMemo(
    () => ({
      total: visits.length,
      waiting: visits.filter((item) => item.status === 'confirmed').length,
      completed: visits.filter((item) => item.status === 'completed').length,
    }),
    [visits],
  )

  const statCards = [
    {
      title: 'Приёмов сегодня',
      value: stats.total,
      icon: CalendarDays,
      tone: 'bg-sky-100 text-sky-700',
      accent: 'from-sky-50 to-white',
    },
    {
      title: 'Ожидают приёма',
      value: stats.waiting,
      icon: Clock3,
      tone: 'bg-amber-100 text-amber-600',
      accent: 'from-amber-50 to-white',
    },
    {
      title: 'Завершено',
      value: stats.completed,
      icon: Users,
      tone: 'bg-emerald-100 text-emerald-700',
      accent: 'from-emerald-50 to-white',
    },
  ]

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

  const activeHistoryVisits = visits.find((visit) => visit.patient_full_name === historyPatientName)
    ? historyVisitMap[
        visits.find((visit) => visit.patient_full_name === historyPatientName)?.patient_user_id || ''
      ] ?? []
    : []

  return (
    <div className="w-full bg-[#f7f7f8] px-6 py-10">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-[28px] font-semibold text-slate-900">
            Добро пожаловать, {user.firstName || 'доктор'}!
          </h1>
          <p className="mt-3 text-[17px] capitalize text-gray-500">Сегодня {getFormattedToday()}</p>
        </div>

        <Link
          to="/doctor/appointments"
          className="inline-flex items-center gap-2 rounded-2xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
        >
          Открыть все приёмы
          <ChevronRight className="h-4 w-4" />
        </Link>
      </header>

      {error ? (
        <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          {error}
        </div>
      ) : null}

      <section className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon

          return (
            <div
              key={card.title}
              className={`rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,var(--tw-gradient-stops))] ${card.accent} px-7 py-7 shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[16px] text-slate-500">{card.title}</p>
                  <p className="mt-3 text-[26px] font-semibold text-slate-900">
                    {isLoading ? '...' : card.value}
                  </p>
                </div>

                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.tone}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          )
        })}
      </section>

      <section className="mt-10 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-[linear-gradient(135deg,#eef7ff_0%,#ffffff_55%,#f8fbff_100%)] px-8 py-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-[26px] font-semibold text-slate-900">Приёмы на день</h2>
              <p className="mt-2 text-[15px] text-slate-500">
                Основной рабочий список по подтверждённым и завершённым записям
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm text-slate-600 ring-1 ring-slate-100">
              Всего пациентов сегодня: <span className="font-semibold text-slate-900">{stats.total}</span>
            </div>
          </div>
        </div>

        <div className="px-8 py-8">
          {isLoading ? (
            <div className="rounded-3xl border border-dashed border-slate-300 px-6 py-10 text-center text-[17px] text-slate-500">
              Загрузка приёмов...
            </div>
          ) : visits.length ? (
            <div className="space-y-5">
              {visits.map((visit) => {
                const isCompleted = visit.status === 'completed'

                return (
                  <article
                    key={visit.visit_id}
                    className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] px-6 py-6 transition hover:border-sky-200 hover:shadow-sm"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0">
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

                        <div className="mt-4 flex flex-wrap gap-4 text-[15px] text-slate-600">
                          <div className="w-fit rounded-2xl bg-slate-50 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Время</p>
                            <p className="mt-2 inline-flex items-center gap-2 font-semibold text-slate-900">
                              <Clock3 className="h-4 w-4 text-slate-400" />
                              {formatVisitTime(visit.scheduled_at)}
                            </p>
                          </div>

                          <div className="w-fit rounded-2xl bg-slate-50 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Создано</p>
                            <p className="mt-2 whitespace-nowrap font-semibold text-slate-900">
                              {formatVisitDateTime(visit.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => void openPatientHistory(visit)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                        >
                          <FileText className="h-4 w-4" />
                          Прошлые протоколы
                        </button>

                        <Link
                          to="/doctor/appointments"
                          className="inline-flex items-center gap-2 rounded-2xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
                        >
                          Открыть приём
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 px-6 py-12 text-center text-[18px] text-slate-500">
              На сегодня подтверждённых приёмов нет.
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
                      const linkedVisit = activeHistoryVisits.find((visit) => visit.visit_id === record.visit_id)

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
                                setSelectedProtocol(mapRecordToProtocolVisit(record, activeHistoryVisits))
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

import { CalendarDays, ChevronRight, Clock3, UserRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import calendar from '../../assets/card-svg/calendar.svg'
import clock from '../../assets/card-svg/clock.svg'
import paper from '../../assets/card-svg/paper.svg'
import person from '../../assets/card-svg/person.svg'
import Recomendation from '../../components/patient/Recomendation'
import { useUser } from '../../context/UserContext'
import { getCachedDoctorPhoto } from '../../lib/doctorPhoto'
import { getDoctors } from '../../lib/doctors'
import {
  formatVisitDateTime,
  formatVisitTime,
  getVisitStatusLabel,
  listVisits,
  type Visit,
} from '../../lib/visits'

export default function HomePage() {
  const navigate = useNavigate()
  const { user, accessToken } = useUser()
  const [visits, setVisits] = useState<Visit[]>([])
  const [doctorCount, setDoctorCount] = useState(0)

  useEffect(() => {
    if (!accessToken) return

    const loadDashboard = async () => {
      try {
        const [visitsResponse, doctorsResponse] = await Promise.all([
          listVisits(accessToken),
          getDoctors(accessToken),
        ])

        setVisits(visitsResponse.sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at)))
        setDoctorCount(doctorsResponse.filter((doctor) => doctor.is_active).length)
      } catch {
        setVisits([])
        setDoctorCount(0)
      }
    }

    void loadDashboard()
  }, [accessToken])

  const upcomingVisits = useMemo(
    () =>
      visits.filter(
        (visit) =>
          (visit.status === 'created' || visit.status === 'confirmed') &&
          visit.scheduled_at >= new Date().toISOString(),
      ),
    [visits],
  )

  const nextVisit = upcomingVisits[0]

  return (
    <div className="w-full bg-[#f7f7f8] px-6 py-10">
      <header>
        <h1 className="mt-3 pb-1 text-[25px] font-semibold text-slate-900">
          Добро пожаловать, {user.firstName}
        </h1>
        <h2 className="text-[17px] font-normal text-gray-500">
          Управляйте своим здоровьем в одном месте
        </h2>
      </header>

      <div className="grid grid-cols-1 gap-4 py-10 md:grid-cols-2">
        <div className="flex min-h-[185px] items-center justify-between rounded-2xl border border-gray-200 bg-white px-7 py-7 shadow-sm">
          <div>
            <h4 className="text-[17px] font-normal text-gray-500">Ближайший приём</h4>
            <h3 className="mt-3 text-[20px] font-semibold text-slate-900">
              {nextVisit ? formatVisitDateTime(nextVisit.scheduled_at) : 'Пока нет записей'}
            </h3>
          </div>

          <div className="flex h-18 w-18 items-center justify-center rounded-2xl bg-sky-100">
            <img src={calendar} alt="" className="h-9 w-9" />
          </div>
        </div>

        <div className="flex min-h-[185px] items-center justify-between rounded-2xl border border-gray-200 bg-white px-7 py-7 shadow-sm">
          <div>
            <h4 className="text-[17px] font-normal text-gray-500">Активных записей</h4>
            <h3 className="mt-3 text-[20px] font-semibold text-slate-900">{upcomingVisits.length}</h3>
          </div>

          <div className="flex h-18 w-18 items-center justify-center rounded-2xl bg-[#e7f8f2]">
            <img src={clock} alt="" className="h-9 w-9" />
          </div>
        </div>

        <div className="flex min-h-[185px] items-center justify-between rounded-2xl border border-gray-200 bg-white px-7 py-7 shadow-sm">
          <div>
            <h4 className="text-[17px] font-normal text-gray-500">Врачей в базе</h4>
            <h3 className="mt-3 text-[20px] font-semibold text-slate-900">{doctorCount}</h3>
          </div>

          <div className="flex h-18 w-18 items-center justify-center rounded-2xl bg-[#fdf5e6]">
            <img src={person} alt="" className="h-9 w-9" />
          </div>
        </div>

        <div className="flex min-h-[185px] items-center justify-between rounded-2xl border border-gray-200 bg-white px-7 py-7 shadow-sm">
          <div>
            <h4 className="text-[17px] font-normal text-gray-500">Всего визитов</h4>
            <h3 className="mt-3 text-[20px] font-semibold text-slate-900">{visits.length}</h3>
          </div>

          <div className="flex h-18 w-18 items-center justify-center rounded-2xl bg-[#fdecec]">
            <img src={paper} alt="" className="h-9 w-9" />
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-[linear-gradient(135deg,#eef7ff_0%,#ffffff_55%,#f8fbff_100%)] px-8 py-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-[26px] font-semibold text-slate-900">Приёмы на день</h2>
              <p className="mt-2 text-[15px] text-slate-500">Ваши ближайшие записи в клинику</p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/app/appointments')}
              className="inline-flex items-center gap-2 rounded-[20px] bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
            >
              Все записи
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-8 py-8">
          {upcomingVisits.length ? (
            <div className="space-y-5">
              {upcomingVisits.slice(0, 4).map((visit) => {
                const isConfirmed = visit.status === 'confirmed'
                const doctorPhotoUrl = getCachedDoctorPhoto(visit.doctor_user_id)
                const doctorInitials = visit.doctor_full_name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)

                return (
                  <article
                    key={visit.visit_id}
                    className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] px-6 py-6 transition hover:border-sky-200 hover:shadow-sm"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                      <div className="flex min-w-0 gap-4">
                        {doctorPhotoUrl ? (
                          <img
                            src={doctorPhotoUrl}
                            alt={visit.doctor_full_name}
                            className="h-14 w-14 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-900">
                            {doctorInitials}
                          </div>
                        )}

                        <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-[22px] font-semibold text-slate-900">
                            {visit.doctor_full_name}
                          </h3>
                          <span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${
                              isConfirmed ? 'bg-sky-50 text-sky-700' : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {getVisitStatusLabel(visit.status)}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 text-[15px] text-slate-600 md:grid-cols-3">
                          <div className="rounded-2xl bg-slate-50 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Время</p>
                            <p className="mt-2 inline-flex items-center gap-2 font-semibold text-slate-900">
                              <Clock3 className="h-4 w-4 text-slate-400" />
                              {formatVisitTime(visit.scheduled_at)}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-slate-50 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Специальность</p>
                            <p className="mt-2 font-semibold text-slate-900">{visit.specialty_name}</p>
                          </div>

                          <div className="rounded-2xl bg-slate-50 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Дата</p>
                            <p className="mt-2 inline-flex items-center gap-2 font-semibold text-slate-900">
                              <CalendarDays className="h-4 w-4 text-slate-400" />
                              {formatVisitDateTime(visit.scheduled_at)}
                            </p>
                          </div>
                        </div>

                        <p className="mt-4 inline-flex items-center gap-2 text-[14px] text-slate-400">
                          <UserRound className="h-4 w-4" />
                          Запись создана: {formatVisitDateTime(visit.created_at)}
                        </p>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 px-6 py-10 text-center text-[18px] text-slate-500">
              Предстоящих приёмов пока нет.
            </div>
          )}
        </div>
      </section>

      <div className="mt-10">
        <Recomendation />
      </div>
    </div>
  )
}

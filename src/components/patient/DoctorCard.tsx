import { useNavigate } from 'react-router-dom'
import type { DoctorListItem } from '../../lib/doctors'

type DoctorCardProps = {
  doctor: DoctorListItem
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const navigate = useNavigate()

  const initials = doctor.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

  return (
    <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] text-[22px] font-semibold text-slate-900">
          {initials}
        </div>

        <div className="min-w-0 flex flex-col">
          <div className="flex flex-col gap-2">
            <h2 className="text-[22px] font-semibold leading-tight text-slate-900">
              {doctor.name}
            </h2>

            <p className="inline-flex w-fit rounded-full bg-[#eef6ff] px-3 py-1 text-[14px] font-medium text-sky-700">
              {doctor.specialty}
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-[15px] text-gray-500">
              <span className="font-medium text-slate-700">Стаж:</span> {doctor.experience}
            </p>

            <p className="text-[15px] text-gray-500">
              <span className="font-medium text-slate-700">Рейтинг:</span> {doctor.rating} ({doctor.reviewsCount} отзывов)
            </p>

            <p className="line-clamp-3 text-[15px] leading-6 text-gray-500">
              {doctor.description}
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <p className="text-[18px] font-semibold text-slate-900">
              {doctor.price} ₽
            </p>

            <button
              type="button"
              onClick={() => navigate(`/app/doctors/${doctor.id}`)}
              className="rounded-2xl bg-sky-500 px-4 py-2.5 text-[15px] font-medium text-white transition hover:bg-sky-600"
            >
              Записаться
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
import { useNavigate } from 'react-router-dom'
import type { DoctorListItem } from '../../lib/doctors'
import { formatCurrency } from '../../routes/admin/admin-utils'
import AvatarImage from '../common/AvatarImage'

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
    <article className="rounded-[30px] border border-slate-200 bg-white px-6 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
      <div className="flex gap-4">
        {doctor.photoUrl ? (
          <AvatarImage
            src={doctor.photoUrl}
            alt={doctor.name}
            className="h-18 w-18 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[30px] font-semibold text-slate-900">
            {initials}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h2 className="text-[21px] font-semibold leading-tight text-slate-900">{doctor.name}</h2>

          <p className="mt-3 inline-flex rounded-full bg-sky-100 px-3.5 py-1.5 text-[13px] font-medium text-sky-700">
            {doctor.specialty}
          </p>

          <div className="mt-5 space-y-3 text-[15px] text-slate-500">
            <p>
              <span className="font-semibold text-slate-900">Стаж:</span> {doctor.experience}
            </p>
          </div>

          <p className="mt-5 line-clamp-2 max-w-[520px] text-[15px] leading-8 text-slate-500">
            {doctor.description}
          </p>

          <div className="mt-6 flex items-end justify-between gap-4">
            <p className="text-[22px] font-semibold text-slate-900">
              {formatCurrency(String(doctor.price))}
            </p>

            <button
              type="button"
              onClick={() => navigate(`/app/doctors/${doctor.id}`)}
              className="rounded-[20px] bg-sky-700 px-6 py-3 text-[15px] font-medium text-white transition hover:bg-sky-800"
            >
              Записаться
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

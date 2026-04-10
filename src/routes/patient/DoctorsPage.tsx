import { useMemo, useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import DoctorCard from '../../components/patient/DoctorCard'
import { doctorsData } from '../../data/doctors'

const specialties = [
  'Все специальности',
  'Терапевт',
  'Кардиолог',
  'Невролог',
  'Педиатр',
]

export default function DoctorsPage() {
  const [search, setSearch] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('Все специальности')

  const filteredDoctors = useMemo(() => {
    return doctorsData.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(search.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(search.toLowerCase())

      const matchesSpecialty =
        selectedSpecialty === 'Все специальности' ||
        doctor.specialty === selectedSpecialty

      return matchesSearch && matchesSpecialty
    })
  }, [search, selectedSpecialty])

  return (
    <div className="min-h-screen bg-[#f7f7f8] px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <header>
          <h1 className="text-[32px] font-semibold text-slate-900">Наши врачи</h1>
          <p className="mt-4 text-[18px] text-gray-500">
            Найдите подходящего специалиста
          </p>
        </header>

        <div className="mt-12 flex flex-col gap-4 md:flex-row">
          <div className="flex h-[64px] w-full items-center rounded-2xl border border-gray-200 bg-white px-5 md:max-w-[84px]">
            <Search className="text-gray-500" size={32} />
          </div>

          <div className="relative w-full flex-1">
            <input
              type="text"
              placeholder="Поиск врача"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-[64px] w-full rounded-2xl border border-gray-200 bg-white px-6 text-[18px] text-slate-900 outline-none placeholder:text-gray-500"
            />
          </div>

          <div className="relative w-full md:max-w-[320px]">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="h-[64px] w-full appearance-none rounded-2xl border border-gray-200 bg-white px-6 pr-14 text-[18px] text-slate-900 outline-none"
            >
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>

            <ChevronDown
              size={24}
              className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-900"
            />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-10 text-center text-[18px] text-gray-500 shadow-sm">
            Врачи не найдены
          </div>
        )}
      </div>
    </div>
  )
}
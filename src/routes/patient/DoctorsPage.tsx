import { ChevronDown, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import DoctorCard from '../../components/patient/DoctorCard'
import { useUser } from '../../context/UserContext'
import {
  getDoctors,
  getSpecialties,
  mapDoctorFromBackend,
  type BackendSpecialty,
  type DoctorListItem,
} from '../../lib/doctors'

export default function DoctorsPage() {
  const { accessToken } = useUser()

  const [search, setSearch] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [doctors, setDoctors] = useState<DoctorListItem[]>([])
  const [specialties, setSpecialties] = useState<BackendSpecialty[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!accessToken) return

    const load = async () => {
      setIsLoading(true)
      setError('')

      try {
        const [specialtiesResponse, doctorsResponse] = await Promise.all([
          getSpecialties(accessToken),
          getDoctors(accessToken),
        ])

        setSpecialties(specialtiesResponse.filter((item) => item.is_active))
        setDoctors(doctorsResponse.map(mapDoctorFromBackend).filter((item) => item.isActive))
      } catch {
        setError('Не удалось загрузить список врачей')
      } finally {
        setIsLoading(false)
      }
    }

    void load()
  }, [accessToken])

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(search.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(search.toLowerCase())

      const matchesSpecialty =
        selectedSpecialty === 'all' || doctor.specialtyId === selectedSpecialty

      return matchesSearch && matchesSpecialty
    })
  }, [doctors, search, selectedSpecialty])

  return (
    <div className="px-2 py-6">
      <h1 className="text-[32px] font-semibold text-slate-900">Наши врачи</h1>
      <p className="mt-2 text-[18px] text-gray-500">Найдите подходящего специалиста</p>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
            size={22}
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск врача или специальности"
            className="h-[64px] w-full rounded-2xl border border-gray-200 bg-white px-14 text-[18px] text-slate-900 outline-none placeholder:text-gray-500"
          />
        </div>

        <div className="relative">
          <select
            value={selectedSpecialty}
            onChange={(event) => setSelectedSpecialty(event.target.value)}
            className="h-[64px] w-full appearance-none rounded-2xl border border-gray-200 bg-white px-6 pr-14 text-[18px] text-slate-900 outline-none"
          >
            <option value="all">Все специальности</option>
            {specialties.map((specialty) => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.name}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
            size={22}
          />
        </div>
      </div>

      {isLoading && (
        <div className="mt-10 rounded-2xl bg-white p-6 text-lg text-slate-600">
          Загрузка врачей...
        </div>
      )}

      {error && (
        <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 text-lg text-red-600">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}

          {filteredDoctors.length === 0 && (
            <div className="rounded-2xl bg-white p-6 text-lg text-slate-600 xl:col-span-2">
              Врачи не найдены
            </div>
          )}
        </div>
      )}
    </div>
  )
}

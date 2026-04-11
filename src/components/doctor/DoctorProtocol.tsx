import { useParams } from 'react-router-dom'

export default function DoctorProtocol() {
  const { id } = useParams()

  return (
    <div className="w-full rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <h1 className="text-[28px] font-semibold text-slate-900">
        Протокол
      </h1>
      <p className="mt-3 text-[18px] text-gray-500">
        Открыт протокол с id: {id}
      </p>
    </div>
  )
}
import { useNavigate } from 'react-router-dom'
import type { DoctorProtocol } from '../../type/doctor'

type LatestProtocolsSectionProps = {
  protocols: DoctorProtocol[]
}

export default function LatestProtocolsSection({
  protocols,
}: LatestProtocolsSectionProps) {
  const navigate = useNavigate()

  return (
    <section className="rounded-3xl border border-gray-200 bg-white px-9 py-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-[24px] font-semibold text-slate-900">
          Последние протоколы
        </h2>
      </div>

      <div className="space-y-5">
        {protocols.length > 0 ? (
          protocols.map((protocol) => (
            <div
              key={protocol.id}
              className="flex items-center justify-between rounded-3xl border border-gray-200 px-6 py-6"
            >
              <div>
                <h3 className="text-[22px] font-semibold text-slate-900">
                  {protocol.patientName}
                </h3>
                <p className="mt-2 text-[18px] text-gray-500">
                  {protocol.diagnosis}, {protocol.createdAt}
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/doctor/protocols/${protocol.id}`)}
                className="text-[20px] font-semibold text-slate-900 transition hover:text-sky-600"
              >
                Открыть
              </button>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-300 px-6 py-10 text-center text-[18px] text-gray-500">
            Протоколов пока нет
          </div>
        )}
      </div>
    </section>
  )
}
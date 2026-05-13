import {
  getLaboratoryStatusLabel,
  getLaboratoryStatusTone,
  type LaboratoryStatus,
} from '../../lib/laboratory'

export default function LaboratoryStatusBadge({ status }: { status: LaboratoryStatus }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getLaboratoryStatusTone(status)}`}>
      {getLaboratoryStatusLabel(status)}
    </span>
  )
}

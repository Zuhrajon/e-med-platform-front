import AdminCard from './AdminCard'

type AdminProfileSummaryCardProps = {
  fullName: string
  email: string
  roleLabel?: string
  fallbackName?: string
}

export default function AdminProfileSummaryCard({
  fullName,
  email,
  roleLabel = 'Администратор',
  fallbackName = 'Администратор',
}: AdminProfileSummaryCardProps) {
  return (
    <AdminCard>
      <h2 className="text-[21px] font-semibold text-slate-900">Учётная запись</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 px-5 py-4">
          <p className="text-sm text-slate-500">Имя</p>
          <p className="mt-2 text-base font-medium text-slate-900">{fullName || fallbackName}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-5 py-4">
          <p className="text-sm text-slate-500">Email</p>
          <p className="mt-2 text-base font-medium text-slate-900">{email || '—'}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-5 py-4">
          <p className="text-sm text-slate-500">Роль</p>
          <p className="mt-2 text-base font-medium text-slate-900">{roleLabel}</p>
        </div>
      </div>
    </AdminCard>
  )
}

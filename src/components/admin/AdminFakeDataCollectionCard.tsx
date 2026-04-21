import { Database } from 'lucide-react'
import type { ReactNode } from 'react'
import AdminCard from './AdminCard'

type AdminFakeDataCollectionCardProps = {
  title: string
  count: number
  isLoading: boolean
  children: ReactNode
}

export default function AdminFakeDataCollectionCard({
  title,
  count,
  isLoading,
  children,
}: AdminFakeDataCollectionCardProps) {
  return (
    <AdminCard>
      <div className="flex items-center gap-3">
        <Database className="h-5 w-5 text-sky-700" />
        <h2 className="text-[21px] font-semibold text-slate-900">
          {title} ({isLoading ? '...' : count})
        </h2>
      </div>
      <div className="mt-5 space-y-3">{children}</div>
    </AdminCard>
  )
}

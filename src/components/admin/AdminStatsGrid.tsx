import type { LucideIcon } from 'lucide-react'
import AdminCard from './AdminCard'

type StatCard = {
  title: string
  value: string | number
  icon: LucideIcon
  tone: string
}

type AdminStatsGridProps = {
  cards: StatCard[]
  isLoading: boolean
}

export default function AdminStatsGrid({ cards, isLoading }: AdminStatsGridProps) {
  return (
    <section className="mt-8 grid gap-5 lg:grid-cols-2 2xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <AdminCard key={card.title} className="px-6 py-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">{card.title}</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">
                  {isLoading ? '...' : card.value}
                </p>
              </div>
              <div className={`rounded-2xl p-3 ${card.tone}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </AdminCard>
        )
      })}
    </section>
  )
}

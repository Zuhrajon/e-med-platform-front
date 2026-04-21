import type { HTMLAttributes, ReactNode } from 'react'

type AdminCardProps = {
  children: ReactNode
  className?: string
} & HTMLAttributes<HTMLElement>

export default function AdminCard({
  children,
  className = '',
  ...props
}: AdminCardProps) {
  return (
    <article
      className={`rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm ${className}`.trim()}
      {...props}
    >
      {children}
    </article>
  )
}

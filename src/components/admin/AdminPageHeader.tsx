import type { ReactNode } from 'react'

type AdminPageHeaderProps = {
  title: string
  description: string
  aside?: ReactNode
  className?: string
}

export default function AdminPageHeader({
  title,
  description,
  aside,
  className = '',
}: AdminPageHeaderProps) {
  return (
    <header className={`flex flex-col gap-3 md:flex-row md:items-end md:justify-between ${className}`.trim()}>
      <div>
        <h1 className="text-[25px] font-semibold text-slate-900">{title}</h1>
        <p className="mt-2 text-[17px] text-slate-500">{description}</p>
      </div>
      {aside ? aside : null}
    </header>
  )
}

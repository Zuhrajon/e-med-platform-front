import type { ReactNode } from 'react'

type AdminStatusMessageProps = {
  tone: 'error' | 'success'
  children: ReactNode
  className?: string
}

const toneClasses = {
  error: 'border-red-200 bg-red-50 text-red-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

export default function AdminStatusMessage({
  tone,
  children,
  className = '',
}: AdminStatusMessageProps) {
  return (
    <div
      className={`rounded-3xl border px-5 py-4 ${toneClasses[tone]} ${className}`.trim()}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {children}
    </div>
  )
}

import type { ReactNode } from 'react'
import { X } from 'lucide-react'

type ModalProps = {
  title: string
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export default function Modal({
  title,
  isOpen,
  onClose,
  children,
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-8 py-7">
          <h2 className="text-[24px] font-semibold text-slate-900">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 transition hover:text-slate-900"
          >
            <X className="h-8 w-8" />
          </button>
        </div>

        <div className="px-8 py-8">{children}</div>
      </div>
    </div>
  )
}
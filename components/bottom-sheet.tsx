'use client'

import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { usePrototypeCopy } from '@/lib/prototype-context'

type BottomSheetProps = {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  const copy = usePrototypeCopy()
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    panelRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [open])

  if (!open) return null
  const host = document.getElementById('app-frame')
  if (!host) return null

  return createPortal(
    <div className="absolute inset-0 z-50 flex items-end lg:items-center lg:justify-center lg:p-6">
      <button
        type="button"
        tabIndex={-1}
        aria-label={copy('Cerrar')}
        onClick={onClose}
        className="absolute inset-0 bg-foreground/45 animate-in fade-in duration-200"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative flex max-h-[88%] w-full flex-col rounded-t-[2rem] bg-background shadow-2xl outline-none animate-in slide-in-from-bottom duration-300 lg:max-h-full lg:max-w-xl lg:rounded-[2rem] lg:zoom-in-95 lg:fade-in lg:slide-in-from-bottom-0"
      >
        <div className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-border" aria-hidden="true" />
        <div className="flex items-start justify-between gap-3 px-5 pt-3 pb-2">
          <h2 id={titleId} className="font-serif text-[1.75rem] leading-tight text-balance">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-xs transition-colors hover:bg-muted"
          >
            <X className="size-5" aria-hidden="true" />
            <span className="sr-only">{copy('Cerrar')}</span>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-8">{children}</div>
      </div>
    </div>,
    host,
  )
}

'use client'

import { AtSign, Mail, RefreshCw } from 'lucide-react'
import { formatRelative, useIdentity } from '@/lib/identity-store'
import { usePrototypeCopy } from '@/lib/prototype-context'

export function ScanMeta() {
  const { state, update } = useIdentity()
  const copy = usePrototypeCopy()
  const { emails, instagram } = state.identity

  return (
    <div className="mx-5 mb-4 flex items-center gap-2">
      <ul className="flex min-w-0 flex-1 flex-wrap gap-1.5" aria-label={copy('Fuentes analizadas')}>
        {emails.map((email) => (
          <li
            key={email.address}
            className="inline-flex max-w-full items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
          >
            <Mail className="size-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{email.address}</span>
          </li>
        ))}
        {instagram ? (
          <li className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
            <AtSign className="size-3" aria-hidden="true" />
            {instagram}
          </li>
        ) : null}
      </ul>
      <button
        type="button"
        onClick={() => update((s) => ({ ...s, scannedAt: Date.now() }))}
        className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <RefreshCw className="size-3.5" aria-hidden="true" />
        {formatRelative(state.scannedAt, Date.now())}
        <span className="sr-only">. {copy('Volver a analizar')}</span>
      </button>
    </div>
  )
}

import { CIRCLE_SCOPES, initials, type CircleScope } from '@/lib/circle'
import { usePrototypeCopy } from '@/lib/prototype-context'
import { cn } from '@/lib/utils'

const SCOPE_SHORT: Record<CircleScope, string> = {
  resultados: 'Ve su puntuación',
  alertas: 'Recibe sus alertas',
  acciones: 'Hace limpieza',
}

export function Avatar({ name, size = 'md' }: { name: string; size?: 'md' | 'lg' }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-primary',
        size === 'lg' ? 'size-16 text-xl' : 'size-12 text-base',
      )}
    >
      {initials(name)}
    </span>
  )
}

export function ScopeChips({ scopes }: { scopes: CircleScope[] }) {
  const copy = usePrototypeCopy()
  return (
    <ul className="flex flex-wrap gap-1.5">
      {CIRCLE_SCOPES.filter((s) => scopes.includes(s.id)).map((s) => (
        <li key={s.id} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {copy(SCOPE_SHORT[s.id])}
        </li>
      ))}
    </ul>
  )
}

export function when(at: number) {
  const hours = Math.floor((Date.now() - at) / 3_600_000)
  if (hours < 1) return 'hace un momento'
  if (hours < 24) return `hace ${hours} h`
  const days = Math.floor(hours / 24)
  return days === 1 ? 'ayer' : `hace ${days} días`
}

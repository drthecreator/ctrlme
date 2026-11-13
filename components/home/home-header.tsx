'use client'

import { useRouter } from 'next/navigation'
import { ChevronDown, ClipboardCheck, Fingerprint, TrendingUp, UserRoundCog, Users } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const menu = [
  { href: '/huella', label: 'Tu huella digital', icon: Fingerprint },
  { href: '/evaluacion', label: 'Evaluación de huella', icon: ClipboardCheck },
  { href: '/plan', label: 'Plan para subir', icon: TrendingUp },
  { href: '/circulo', label: 'Mi círculo', icon: Users },
]

export function HomeHeader({ name, email = '' }: { name: string; email?: string }) {
  const router = useRouter()
  const initial = (name.trim()[0] ?? email[0] ?? '?').toUpperCase()

  return (
    <header className="flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),1rem)] pb-2 lg:hidden">
      <p className="flex items-center gap-2" aria-label="Ctrl+Me">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Fingerprint className="size-5" aria-hidden="true" />
        </span>
        <span className="font-serif text-[1.75rem] leading-none tracking-tight" aria-hidden="true">
          Ctrl<span className="text-muted-foreground">+</span>Me
        </span>
      </p>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex min-h-11 items-center gap-2 rounded-full border border-border bg-card py-1.5 pr-3 pl-1.5 text-sm font-medium shadow-xs transition-colors hover:bg-muted aria-expanded:bg-muted">
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
          >
            {initial}
          </span>
          Mi perfil
          <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 rounded-2xl p-1.5">
          <DropdownMenuItem
            className="min-h-12 gap-3 rounded-xl px-3 text-[0.9375rem]"
            onClick={() => router.push('/perfil')}
          >
            <UserRoundCog aria-hidden="true" />
            <span className="flex flex-col">
              <span className="font-medium">{name || 'Mi perfil'}</span>
              <span className="text-xs text-muted-foreground">Datos vigilados y ajustes</span>
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {menu.map((item) => (
            <DropdownMenuItem
              key={item.href}
              className="min-h-11 gap-3 rounded-xl px-3 text-[0.9375rem]"
              onClick={() => router.push(item.href)}
            >
              <item.icon aria-hidden="true" />
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

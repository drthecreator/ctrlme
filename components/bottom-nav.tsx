'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bell,
  BookOpen,
  Brush,
  ChevronRight,
  Fingerprint,
  House,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { hasOpenBreach, useIdentity } from '@/lib/identity-store'
import { cn } from '@/lib/utils'

type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  matches: string[]
  badge?: number
}

const isActive = (pathname: string, matches: string[]) =>
  matches.some((match) => (match === '/' ? pathname === '/' : pathname === match || pathname.startsWith(`${match}/`)))

export function BottomNav() {
  const pathname = usePathname()
  const { state } = useIdentity()

  if (pathname === '/' && !state.onboarded) return null

  const items: NavItem[] = [
    {
      href: '/',
      label: 'Principal',
      icon: House,
      matches: ['/', '/huella', '/evaluacion', '/perfil', '/plan', '/asistente', '/circulo'],
    },
    { href: '/limpieza', label: 'Limpieza', icon: Brush, matches: ['/limpieza'] },
    {
      href: '/alertas',
      label: 'Alertas',
      icon: Bell,
      matches: ['/alertas'],
      badge: hasOpenBreach(state) ? 1 : 0,
    },
    { href: '/guias', label: 'Guías', icon: BookOpen, matches: ['/guias'] },
  ]

  return (
    <nav
      aria-label="Navegación principal"
      className="border-t border-border/80 bg-card px-3 pt-2 pb-[max(env(safe-area-inset-bottom),0.75rem)] lg:hidden"
    >
      <ul className="grid grid-cols-4 gap-0.5">
        {items.map(({ href, label, icon: Icon, matches, badge }) => {
          const active = isActive(pathname, matches)
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs transition-colors',
                  active ? 'font-semibold text-primary' : 'font-medium text-muted-foreground hover:text-foreground',
                )}
              >
                <span
                  className={cn(
                    'relative flex h-8 w-14 items-center justify-center rounded-full transition-colors',
                    active ? 'bg-primary text-primary-foreground' : 'group-hover:bg-muted',
                  )}
                >
                  <Icon className="size-5" strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
                  {badge ? (
                    <span className="absolute top-0.5 right-2.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] leading-none font-bold text-white ring-2 ring-card">
                      {badge}
                      <span className="sr-only"> alerta nueva</span>
                    </span>
                  ) : null}
                </span>
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function SideLink({ href, label, icon: Icon, matches, badge, pathname }: NavItem & { pathname: string }) {
  const active = isActive(pathname, matches)
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'group relative flex min-h-12 items-center gap-3 rounded-2xl px-3 text-[0.9375rem] transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none',
          active
            ? 'bg-accent font-semibold text-accent-foreground'
            : 'font-medium text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground',
        )}
      >
        <span
          className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-xl transition-colors',
            active ? 'bg-accent-foreground/10' : 'bg-primary-foreground/8 group-hover:bg-primary-foreground/12',
          )}
        >
          <Icon className="size-[1.125rem]" strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
        </span>
        {label}
        {badge ? (
          <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-destructive text-[11px] leading-none font-bold text-white">
            {badge}
            <span className="sr-only"> pendiente</span>
          </span>
        ) : null}
      </Link>
    </li>
  )
}

export function SideNav() {
  const pathname = usePathname()
  const { state } = useIdentity()
  const name = state.identity.name.trim()
  const email = state.identity.emails[0]?.address
  const pendingRequests = state.circle.incoming.length

  const main: NavItem[] = [
    { href: '/', label: 'Principal', icon: House, matches: ['/', '/huella', '/evaluacion', '/plan'] },
    { href: '/limpieza', label: 'Limpieza', icon: Brush, matches: ['/limpieza'] },
    {
      href: '/alertas',
      label: 'Alertas',
      icon: Bell,
      matches: ['/alertas'],
      badge: hasOpenBreach(state) ? 1 : 0,
    },
    { href: '/guias', label: 'Guías', icon: BookOpen, matches: ['/guias'] },
  ]
  const trusted: NavItem[] = [
    { href: '/circulo', label: 'Mi círculo', icon: Users, matches: ['/circulo'], badge: pendingRequests },
  ]

  const assistantActive = isActive(pathname, ['/asistente'])
  const profileActive = isActive(pathname, ['/perfil'])

  return (
    <aside className="hidden w-64 shrink-0 flex-col overflow-y-auto bg-primary px-4 py-6 text-primary-foreground lg:flex xl:w-72">
      <Link
        href="/"
        className="flex items-center gap-3 rounded-2xl px-2 py-1 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        aria-label="Ctrl+Me, ir a Principal"
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Fingerprint className="size-5" aria-hidden="true" />
        </span>
        <span className="font-serif text-[1.75rem] leading-none tracking-tight" aria-hidden="true">
          Ctrl<span className="text-accent">+</span>Me
        </span>
      </Link>

      <nav aria-label="Navegación principal" className="mt-9 flex flex-col gap-6">
        <div>
          <p className="px-3 pb-2 text-xs font-semibold tracking-widest text-primary-foreground/75 uppercase">
            Tu identidad
          </p>
          <ul className="flex flex-col gap-1">
            {main.map((item) => (
              <SideLink key={item.href} {...item} pathname={pathname} />
            ))}
          </ul>
        </div>
        <div>
          <p className="px-3 pb-2 text-xs font-semibold tracking-widest text-primary-foreground/75 uppercase">
            Gente de confianza
          </p>
          <ul className="flex flex-col gap-1">
            {trusted.map((item) => (
              <SideLink key={item.href} {...item} pathname={pathname} />
            ))}
          </ul>
        </div>
      </nav>

      <Link
        href="/asistente"
        aria-current={assistantActive ? 'page' : undefined}
        className={cn(
          'group mt-8 flex items-center gap-3 rounded-3xl border p-3.5 transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none',
          assistantActive
            ? 'border-accent bg-accent text-accent-foreground'
            : 'border-primary-foreground/15 bg-primary-foreground/6 hover:bg-primary-foreground/12',
        )}
      >
        <span
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-xl',
            assistantActive ? 'bg-accent-foreground/10' : 'bg-accent text-accent-foreground',
          )}
        >
          <Sparkles className="size-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-serif text-xl leading-tight">Asistente</span>
          <span className={cn('block text-xs', assistantActive ? 'opacity-75' : 'text-primary-foreground/60')}>
            Escribe o habla con él
          </span>
        </span>
        <ChevronRight
          className="size-4 shrink-0 opacity-50 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <p className="flex items-center gap-2 px-2 text-xs leading-snug text-primary-foreground/55">
          <ShieldCheck className="size-4 shrink-0 text-accent" aria-hidden="true" />
          Tus datos están cifrados y son solo tuyos.
        </p>
        <Link
          href="/perfil"
          aria-current={profileActive ? 'page' : undefined}
          className={cn(
            'flex items-center gap-3 rounded-2xl border p-3 transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none',
            profileActive
              ? 'border-accent/60 bg-primary-foreground/12'
              : 'border-primary-foreground/15 hover:bg-primary-foreground/10',
          )}
        >
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-accent-foreground"
          >
            {(name[0] ?? email?.[0] ?? '?').toUpperCase()}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[0.9375rem] font-semibold">{name || 'Mi perfil'}</span>
            <span className="block truncate text-xs text-primary-foreground/60">{email}</span>
          </span>
        </Link>
      </div>
    </aside>
  )
}

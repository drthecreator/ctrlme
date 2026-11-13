'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Check,
  ExternalLink,
  Globe,
  LogOut,
  MapPin,
  Monitor,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TabletSmartphone,
  Trash2,
  type LucideIcon,
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { AppsPanel } from '@/components/limpieza/apps-panel'
import { ProfilesPanel } from '@/components/limpieza/profiles-panel'
import {
  INACTIVE_ACCOUNTS,
  SESSIONS,
  getPendingAccounts,
  getPendingApps,
  getPendingPosts,
  getPublicOtherProfiles,
  getSuspiciousSessions,
  useIdentity,
  type SessionKind,
} from '@/lib/identity-store'
import { cn } from '@/lib/utils'

export type Tab = 'sesiones' | 'inactivas' | 'perfiles' | 'apps'

const kindIcon: Record<SessionKind, LucideIcon> = {
  iphone: Smartphone,
  windows: Monitor,
  android: TabletSmartphone,
}

export function CleanupTabs({ defaultTab }: { defaultTab: Tab }) {
  const { state } = useIdentity()
  const [tab, setTab] = useState<Tab>(defaultTab)
  const suspicious = getSuspiciousSessions(state).length
  const pending = getPendingAccounts(state).length
  const profiles = getPublicOtherProfiles(state).length + getPendingPosts(state).length
  const apps = getPendingApps(state).length + (state.permissionsReviewed ? 0 : 1)

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'sesiones', label: 'Sesiones', count: suspicious },
    { id: 'inactivas', label: 'Cuentas', count: pending },
    { id: 'perfiles', label: 'Perfiles y posts', count: profiles },
    { id: 'apps', label: 'Apps y permisos', count: apps },
  ]

  return (
    <div className="px-5">
      <div role="tablist" aria-label="Tipo de limpieza" className="grid grid-cols-2 gap-1 rounded-3xl bg-muted p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex min-h-11 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-medium text-muted-foreground transition-all',
              tab === t.id && 'bg-card font-semibold text-foreground shadow-sm',
            )}
          >
            {t.label}
            {t.count > 0 ? (
              <span className="flex size-5 items-center justify-center rounded-full bg-warning text-[0.6875rem] font-bold text-white tabular-nums">
                {t.count}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-5">
        {tab === 'sesiones' ? <SessionsPanel /> : null}
        {tab === 'inactivas' ? <AccountsPanel /> : null}
        {tab === 'perfiles' ? <ProfilesPanel /> : null}
        {tab === 'apps' ? <AppsPanel /> : null}
      </div>
    </div>
  )
}

function SessionsPanel() {
  const { state, update } = useIdentity()
  const suspicious = getSuspiciousSessions(state)

  if (!state.identity.googleConnected) {
    return (
      <div className="surface flex flex-col items-center rounded-3xl p-6 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
          <Globe className="size-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-serif text-[1.625rem] leading-tight">Conecta tu cuenta de Google</h2>
        <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted-foreground">
          Te mostraremos los dispositivos con tu sesión abierta. Solo lectura.
        </p>
        <Button
          size="touch"
          className="mt-5 w-full"
          onClick={() => update((s) => ({ ...s, identity: { ...s.identity, googleConnected: true } }))}
        >
          Conectar Google
        </Button>
      </div>
    )
  }

  return (
    <>
      <p className="mb-3 text-sm text-muted-foreground">
        Cuenta de Google · <span className="font-medium text-foreground">{state.identity.emails[0]?.address}</span>
      </p>

      {suspicious.length > 0 ? (
        <Link
          href="/asistente/sesiones"
          className="mb-3 flex min-h-14 items-center gap-3 rounded-2xl bg-primary px-4 py-3 text-primary-foreground transition-transform active:scale-[0.99]"
        >
          <Sparkles className="size-5 shrink-0 text-accent" aria-hidden="true" />
          <span className="flex-1 text-[0.9375rem] font-semibold">Revisar todo con el asistente</span>
          <span className="text-sm text-primary-foreground/70">{suspicious.length}</span>
        </Link>
      ) : null}

      <ul className="flex flex-col gap-3" aria-label="Dispositivos conectados">
        {SESSIONS.map((session) => {
          const Icon = kindIcon[session.kind]
          const status = state.sessionStatus[session.id]
          const isSuspicious = !session.current && !status
          return (
            <li key={session.id} className={cn('surface rounded-3xl p-4', status === 'closed' && 'opacity-70')}>
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    'flex size-12 shrink-0 items-center justify-center rounded-2xl',
                    isSuspicious ? 'bg-warning-soft text-warning' : 'bg-secondary text-primary',
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-x-2 text-[0.9375rem] font-semibold">
                    {session.device}
                    {session.current ? (
                      <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs font-semibold text-success">
                        Este teléfono
                      </span>
                    ) : null}
                  </p>
                  <p className="text-sm text-muted-foreground">{session.browser}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                    {session.location} · {session.lastActive}
                  </p>
                </div>
              </div>

              {isSuspicious ? (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="touch-sm"
                    onClick={() => update((s) => ({ ...s, sessionStatus: { ...s.sessionStatus, [session.id]: 'trusted' } }))}
                  >
                    Es mío
                  </Button>
                  <Button
                    variant="destructive"
                    size="touch-sm"
                    onClick={() => update((s) => ({ ...s, sessionStatus: { ...s.sessionStatus, [session.id]: 'closed' } }))}
                  >
                    <LogOut aria-hidden="true" />
                    Cerrar sesión
                  </Button>
                </div>
              ) : status ? (
                <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl bg-muted/70 py-1 pr-1 pl-3">
                  <p className="flex items-center gap-1.5 text-sm font-medium">
                    {status === 'closed' ? (
                      <LogOut className="size-4 text-muted-foreground" aria-hidden="true" />
                    ) : (
                      <ShieldCheck className="size-4 text-success" aria-hidden="true" />
                    )}
                    {status === 'closed' ? 'Sesión cerrada' : 'Marcado como tuyo'}
                  </p>
                  <Button
                    variant="ghost"
                    size="touch-sm"
                    onClick={() =>
                      update((s) => {
                        const { [session.id]: _removed, ...rest } = s.sessionStatus
                        return { ...s, sessionStatus: rest }
                      })
                    }
                  >
                    <RotateCcw aria-hidden="true" />
                    Deshacer
                  </Button>
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>
    </>
  )
}

function AccountsPanel() {
  const { state, update } = useIdentity()
  const pending = getPendingAccounts(state)

  return (
    <>
      <h2 className="text-lg font-semibold tracking-tight">Cuentas en desuso encontradas</h2>
      <p className="mt-0.5 mb-4 text-sm text-muted-foreground">
        Asociadas a {state.identity.emails[0]?.address}. Borrarlas reduce los datos que pueden filtrarse.
      </p>

      {pending.length === 0 ? (
        <div className="surface flex items-center gap-3 rounded-3xl p-4">
          <span className="flex size-11 items-center justify-center rounded-full bg-success-soft text-success">
            <Check className="size-5" strokeWidth={3} aria-hidden="true" />
          </span>
          <p className="font-medium">No quedan cuentas inactivas.</p>
        </div>
      ) : null}

      <ul className="flex flex-col gap-3">
        {INACTIVE_ACCOUNTS.map((account) => {
          const deleted = state.deletedAccounts.includes(account.id)
          return (
            <li key={account.id} className={cn('surface rounded-3xl p-4', deleted && 'opacity-70')}>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary font-serif text-xl text-primary"
                >
                  {account.name[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.9375rem] font-semibold">{account.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Inactiva desde {account.since} · {account.foundVia}
                  </p>
                </div>
              </div>
              {deleted ? (
                <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl bg-success-soft py-1 pr-1 pl-3">
                  <p className="flex items-center gap-1.5 text-sm font-medium text-success">
                    <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                    Marcada como eliminada
                  </p>
                  <Button
                    variant="ghost"
                    size="touch-sm"
                    onClick={() =>
                      update((s) => ({ ...s, deletedAccounts: s.deletedAccounts.filter((id) => id !== account.id) }))
                    }
                  >
                    Deshacer
                  </Button>
                </div>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <a
                    href={account.deleteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({ variant: 'outline', size: 'touch-sm' })}
                  >
                    Abrir web
                    <ExternalLink aria-hidden="true" />
                    <span className="sr-only"> de {account.name} (pestaña nueva)</span>
                  </a>
                  <Button
                    variant="destructive"
                    size="touch-sm"
                    onClick={() => update((s) => ({ ...s, deletedAccounts: [...s.deletedAccounts, account.id] }))}
                  >
                    <Trash2 aria-hidden="true" />
                    Ya la eliminé
                    <span className="sr-only">: {account.name}</span>
                  </Button>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </>
  )
}

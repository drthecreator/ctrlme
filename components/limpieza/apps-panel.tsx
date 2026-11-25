'use client'

import Link from 'next/link'
import { BookOpen, ExternalLink, TriangleAlert } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { AllDone, DoneBar, PanelIntro } from '@/components/limpieza/cleanup-parts'
import { APP_PERMISSIONS, CONNECTED_APPS, getPendingApps, useIdentity } from '@/lib/identity-store'
import { cn } from '@/lib/utils'
import { usePrototypeCopy } from '@/lib/prototype-context'

const manageUrl: Record<string, string> = {
  Google: 'https://myaccount.google.com/connections',
  Facebook: 'https://www.facebook.com/settings?tab=applications',
}

const riskyPermissions = new Set(['maps', 'torch', 'weather'])

export function AppsPanel() {
  const { state, update } = useIdentity()
  const copy = usePrototypeCopy()
  const pending = getPendingApps(state)

  const setRemoved = (id: string, value: boolean) =>
    update((s) => ({ ...s, removedApps: value ? [...s.removedApps, id] : s.removedApps.filter((a) => a !== id) }))

  return (
    <>
      <PanelIntro title="Apps conectadas que no usas">
        Entraste con tu cuenta de Google o Facebook y siguen recibiendo tus datos básicos. Desconéctalas en los ajustes de
        esa cuenta.
      </PanelIntro>

      {pending.length === 0 ? <div className="mb-3"><AllDone message="No quedan apps sin usar conectadas." /></div> : null}

      <ul className="flex flex-col gap-3" aria-label={copy('Apps conectadas')}>
        {CONNECTED_APPS.map((app) => {
          const removed = state.removedApps.includes(app.id)
          return (
            <li key={app.id} className={cn('surface rounded-3xl p-4', removed && 'opacity-70')}>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary font-serif text-xl text-primary"
                >
                  {app.name[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.9375rem] font-semibold">{app.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {copy('Conectada con')} {app.via} · {copy('último uso')} {copy(app.lastUsed)}
                  </p>
                  <p className="text-sm text-muted-foreground">{copy('Ve:')} {copy(app.shares)}</p>
                </div>
              </div>
              {removed ? (
                <DoneBar label="Marcada como desconectada" onUndo={() => setRemoved(app.id, false)} />
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <a
                    href={manageUrl[app.via]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({ variant: 'outline', size: 'touch-sm' })}
                  >
                    {copy('Abrir ajustes')}
                    <ExternalLink aria-hidden="true" />
                    <span className="sr-only"> {copy('de')} {app.via} ({copy('pestaña nueva')})</span>
                  </a>
                  <Button variant="destructive" size="touch-sm" onClick={() => setRemoved(app.id, true)}>
                    {copy('Ya la desconecté')}
                    <span className="sr-only">: {app.name}</span>
                  </Button>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <div className="mt-8">
        <PanelIntro title="Permisos de tus apps">
          Ctrl+Me no cambia los permisos por ti. Te mostramos cuáles conviene revisar y una guía paso a paso.
        </PanelIntro>

        <ul className="surface divide-y divide-border/70 overflow-hidden rounded-3xl" aria-label={copy('Permisos')}>
          {APP_PERMISSIONS.map((item) => {
            const risky = riskyPermissions.has(item.id)
            return (
              <li key={item.id} className="flex items-start gap-3 p-4">
                <span
                  className={cn(
                    'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl',
                    risky ? 'bg-warning-soft text-warning' : 'bg-secondary text-primary',
                  )}
                >
                  {risky ? (
                    <TriangleAlert className="size-4" aria-hidden="true" />
                  ) : (
                    <span className="size-2 rounded-full bg-current" aria-hidden="true" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.9375rem] font-semibold">
                    {item.app} <span className="font-normal text-muted-foreground">· {item.permission}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{copy(item.access)}</p>
                </div>
                {risky ? <span className="sr-only">{copy('Conviene revisarlo')}</span> : null}
              </li>
            )
          })}
        </ul>

        <Link
          href="/guias#permisos"
          className={cn(buttonVariants({ variant: 'outline', size: 'touch-sm' }), 'mt-3 w-full')}
        >
          <BookOpen aria-hidden="true" />
          {copy('Guía: cómo revisar permisos')}
        </Link>

        {state.permissionsReviewed ? (
          <DoneBar
            label="Permisos revisados"
            onUndo={() => update((s) => ({ ...s, permissionsReviewed: false }))}
          />
        ) : (
          <Button
            className="mt-2 w-full"
            variant="ghost"
            size="touch-sm"
            onClick={() => update((s) => ({ ...s, permissionsReviewed: true }))}
          >
            {copy('Ya revisé mis permisos')}
          </Button>
        )}
      </div>
    </>
  )
}

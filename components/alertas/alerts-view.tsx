'use client'

import Link from 'next/link'
import { ChevronRight, Mail, ShieldCheck, TriangleAlert } from 'lucide-react'
import { BreachChecklist } from '@/components/alertas/breach-checklist'
import { BREACH, formatRelative, useIdentity } from '@/lib/identity-store'
import { localize, usePrototype } from '@/lib/prototype-context'

export function AlertsView() {
  const { state } = useIdentity()
  const { version, language } = usePrototype()
  const isV3 = version === 'v3'
  const copy = (text: string) => isV3 ? localize(text, language) : text
  const emails = state.identity.emails

  return (
    <>
      <Link
        href="/perfil"
        className="surface mx-5 mb-4 flex min-h-16 items-center gap-3 rounded-2xl px-4 py-3 transition-colors hover:bg-muted/40"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
          <Mail className="size-[1.125rem]" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs text-muted-foreground">
            {copy('Vigilando')} {emails.length} {copy(emails.length === 1 ? 'correo' : 'correos')} · {copy('revisado')}{' '}
            {copy(formatRelative(state.scannedAt, Date.now()))}
          </span>
          <span className="block truncate text-[0.9375rem] font-medium">{emails.map((e) => e.address).join(', ')}</span>
        </span>
        <span className="text-sm font-semibold text-primary">{copy('Gestionar')}</span>
        <ChevronRight className="-ml-2 size-4 text-primary" aria-hidden="true" />
      </Link>

      {state.breachResolved ? (
        <section className="mx-5 flex items-start gap-3 rounded-3xl border border-success/20 bg-success-soft p-5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-success text-success-foreground">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-serif text-[1.625rem] leading-tight">{copy('Sin filtraciones activas')}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {copy('Resolviste la filtración de')} {BREACH.service}. {copy('Te avisaremos al momento si aparece algo nuevo.')}
            </p>
          </div>
        </section>
      ) : (
        <section
          aria-labelledby="filtracion-title"
          className="mx-5 rounded-3xl border border-destructive/20 bg-destructive-soft p-5"
        >
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-destructive text-destructive-foreground">
              <TriangleAlert className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-destructive uppercase">{copy('Requiere acción')}</p>
              <h2 id="filtracion-title" className="mt-0.5 font-serif text-[1.625rem] leading-tight">
                {copy('1 filtración detectada')}
              </h2>
            </div>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 border-t border-destructive/15 pt-4 text-sm">
            <div>
              <dt className={isV3 ? 'font-medium text-destructive' : 'text-muted-foreground'}>{copy('Servicio')}</dt>
              <dd className="mt-0.5 font-semibold">
                {BREACH.service} ({BREACH.year})
              </dd>
            </div>
            <div>
              <dt className={isV3 ? 'font-medium text-destructive' : 'text-muted-foreground'}>{copy('Detectada')}</dt>
              <dd className="mt-0.5 font-semibold">{copy(BREACH.detectedOn)}</dd>
            </div>
            <div className="col-span-2">
              <dt className={isV3 ? 'font-medium text-destructive' : 'text-muted-foreground'}>{copy('Datos expuestos')}</dt>
              <dd className="mt-1.5 flex flex-wrap gap-1.5">
                {BREACH.data.map((item) => (
                  <span key={item} className="rounded-full bg-card px-2.5 py-1 text-xs font-semibold text-card-foreground">
                    {copy(item)}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
          <p className={`mt-3 text-xs ${isV3 ? 'font-medium text-destructive' : 'text-muted-foreground'}`}>
            {copy('Afectó a')} {copy(BREACH.affected)}. {copy('Correo')}: {emails[0]?.address}
          </p>
        </section>
      )}

      {state.breachResolved ? null : <BreachChecklist />}
    </>
  )
}

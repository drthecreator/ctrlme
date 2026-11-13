'use client'

import Link from 'next/link'
import { ArrowRight, Check, ExternalLink } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { BREACH_STEPS, useIdentity } from '@/lib/identity-store'
import { cn } from '@/lib/utils'

export function BreachChecklist() {
  const { state, update } = useIdentity()
  const completed = state.breachSteps
  const allDone = completed.length === BREACH_STEPS.length

  const toggle = (id: string) =>
    update((s) => ({
      ...s,
      breachSteps: s.breachSteps.includes(id) ? s.breachSteps.filter((x) => x !== id) : [...s.breachSteps, id],
    }))

  return (
    <section aria-labelledby="acciones-title" className="mt-7 px-5">
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 id="acciones-title" className="text-lg font-semibold tracking-tight">
          Acciones recomendadas
        </h2>
        <p className="text-sm font-medium text-muted-foreground tabular-nums" aria-live="polite">
          {completed.length} de {BREACH_STEPS.length}
          <span className="sr-only"> pasos completados</span>
        </p>
      </div>

      <ol className="surface overflow-hidden rounded-3xl">
        {BREACH_STEPS.map((step, index) => {
          const done = completed.includes(step.id)
          const link = 'link' in step ? step.link : undefined
          const external = link?.href.startsWith('http')
          return (
            <li key={step.id} className="border-b border-border/70 p-4 last:border-b-0">
              <label className="relative flex cursor-pointer items-start gap-3">
                <input type="checkbox" checked={done} onChange={() => toggle(step.id)} className="peer sr-only" />
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border-2 border-input bg-card transition-colors peer-checked:border-success peer-checked:bg-success peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50"
                >
                  <Check className={cn('size-4 text-white', !done && 'opacity-0')} strokeWidth={3} />
                </span>
                <span className="flex-1">
                  <span className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Paso {index + 1}
                  </span>
                  <span
                    className={cn(
                      'mt-0.5 block text-[0.9375rem] leading-snug font-medium',
                      done && 'text-muted-foreground line-through decoration-muted-foreground/40',
                    )}
                  >
                    {step.title}
                  </span>
                  {!done ? <span className="mt-0.5 block text-sm text-muted-foreground">{step.detail}</span> : null}
                </span>
              </label>
              {link && !done ? (
                external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: 'outline', size: 'touch-sm' }), 'mt-3 ml-10')}
                  >
                    {link.label}
                    <ExternalLink aria-hidden="true" />
                    <span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                ) : (
                  <Link href={link.href} className={cn(buttonVariants({ variant: 'outline', size: 'touch-sm' }), 'mt-3 ml-10')}>
                    {link.label}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                )
              ) : null}
            </li>
          )
        })}
      </ol>

      <Button
        size="touch"
        className="mt-5 w-full"
        disabled={!allDone}
        aria-describedby={allDone ? undefined : 'hecho-hint'}
        onClick={() => update((s) => ({ ...s, breachResolved: true }))}
      >
        Marcar como hecho
      </Button>
      {!allDone ? (
        <p id="hecho-hint" className="mt-2 text-center text-sm text-muted-foreground">
          Marca los {BREACH_STEPS.length} pasos para cerrar la alerta.
        </p>
      ) : null}
    </section>
  )
}

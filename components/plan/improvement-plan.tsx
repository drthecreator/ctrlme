'use client'

import Link from 'next/link'
import { ArrowRight, Check, PartyPopper } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { computeScore, getPlan, useIdentity } from '@/lib/identity-store'
import { getLevel, toneStyles } from '@/lib/score'
import { cn } from '@/lib/utils'

export function ImprovementPlan() {
  const { state, update } = useIdentity()
  const { total } = computeScore(state)
  const plan = getPlan(state)
  const potential = Math.min(100, total + plan.reduce((sum, item) => sum + item.gain, 0))
  const currentLevel = getLevel(total)
  const potentialLevel = getLevel(potential)

  return (
    <div className="px-5">
      <section aria-label="Progreso posible" className="surface flex items-center gap-4 rounded-3xl p-5">
        <ScoreBlock label="Ahora" score={total} levelLabel={currentLevel.label} tone={currentLevel.tone} />
        <ArrowRight className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <ScoreBlock label="Si completas el plan" score={potential} levelLabel={potentialLevel.label} tone={potentialLevel.tone} />
      </section>

      {plan.length === 0 ? (
        <div className="surface mt-4 flex flex-col items-center rounded-3xl p-6 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-success-soft text-success">
            <PartyPopper className="size-7" aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-serif text-[1.75rem] leading-tight">¡Plan completado!</h2>
          <p className="mt-1 text-[0.9375rem] text-muted-foreground">
            Seguiremos analizando tu huella cada semana.
          </p>
        </div>
      ) : (
        <ol className="mt-4 flex flex-col gap-3" aria-label="Acciones recomendadas">
          {plan.map((item, index) => (
            <li key={item.id} className="surface rounded-3xl p-4">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-primary"
                >
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-[0.9375rem] leading-snug font-semibold text-balance">{item.title}</h2>
                  <p className="mt-0.5 text-sm leading-snug text-muted-foreground">{item.description}</p>
                </div>
                <span className="shrink-0 rounded-full bg-success-soft px-2.5 py-1 text-xs font-bold text-success tabular-nums">
                  +{item.gain}
                  <span className="sr-only"> puntos</span>
                </span>
              </div>
              {item.href || item.selfFix ? (
                <div className="mt-3 flex gap-2 pl-11">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={cn(
                        buttonVariants({ variant: item.selfFix ? 'outline' : 'default', size: 'touch-sm' }),
                        'flex-1',
                      )}
                    >
                      {item.hrefLabel}
                    </Link>
                  ) : null}
                  {item.selfFix ? (
                    <Button
                      size="touch-sm"
                      variant={item.href ? 'ghost' : 'outline'}
                      className="flex-1"
                      onClick={() => update(item.selfFix!)}
                    >
                      <Check aria-hidden="true" />
                      Ya lo hice
                      <span className="sr-only">: {item.title}</span>
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

function ScoreBlock({
  label,
  score,
  levelLabel,
  tone,
}: {
  label: string
  score: number
  levelLabel: string
  tone: keyof typeof toneStyles
}) {
  return (
    <div className="min-w-0 flex-1">
      <p className="text-xs leading-tight text-muted-foreground">{label}</p>
      <p className="mt-1 font-serif text-[2.5rem] leading-none tabular-nums">{score}</p>
      <p className={cn('mt-1 text-sm font-semibold', toneStyles[tone].text)}>{levelLabel}</p>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { ArrowRight, Check, PartyPopper } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { computeScore, getPlan, useIdentity } from '@/lib/identity-store'
import { getLevel, toneStyles } from '@/lib/score'
import { cn } from '@/lib/utils'
import { localize, usePrototype } from '@/lib/prototype-context'
import { useEffect, useMemo, useState } from 'react'

export function ImprovementPlan() {
  const { state, update } = useIdentity()
  const { version, language } = usePrototype()
  const isV3 = version === 'v3'
  const copy = (text: string) => isV3 ? localize(text, language) : text
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [sort, setSort] = useState<'high' | 'low'>('high')
  const [completedItems, setCompletedItems] = useState<ReturnType<typeof getPlan>>([])
  useEffect(() => {
    if (!isV3) return
    try { setCompletedItems(JSON.parse(localStorage.getItem('ctrlme-v3-completed-plan') || '[]')) } catch { setCompletedItems([]) }
  }, [isV3])
  useEffect(() => {
    if (isV3) localStorage.setItem('ctrlme-v3-completed-plan', JSON.stringify(completedItems))
  }, [completedItems, isV3])
  const { total } = computeScore(state)
  const plan = getPlan(state)
  const potential = Math.min(100, total + plan.reduce((sum, item) => sum + item.gain, 0))
  const currentLevel = getLevel(total)
  const potentialLevel = getLevel(potential)
  const completedIds = new Set(completedItems.map((item) => item.id))
  const visibleItems = useMemo(() => {
    const uniqueCompleted = completedItems.filter((item) => !plan.some((pending) => pending.id === item.id))
    const items = filter === 'pending' ? plan : filter === 'completed' ? uniqueCompleted : [...plan, ...uniqueCompleted]
    return [...items].sort((a, b) => sort === 'high' ? b.gain - a.gain : a.gain - b.gain)
  }, [completedItems, filter, plan, sort])

  return (
    <div className="px-5">
      <section aria-label={copy('Progreso posible')} className="surface flex items-center gap-4 rounded-3xl p-5">
        <ScoreBlock label={copy('Ahora')} score={total} levelLabel={copy(currentLevel.label)} tone={currentLevel.tone} />
        <ArrowRight className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <ScoreBlock label={copy('Si completas el plan')} score={potential} levelLabel={copy(potentialLevel.label)} tone={potentialLevel.tone} />
      </section>

      {isV3 ? (
        <section aria-label={copy('Filtrar y ordenar acciones')} className="mt-4 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3">
          <div className="flex flex-wrap gap-2" role="group" aria-label={copy('Estado de las acciones')}>
            {([['all', 'Todas'], ['pending', 'Pendientes'], ['completed', 'Completadas']] as const).map(([value, label]) => (
              <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)} className={cn('min-h-10 rounded-full border px-3 text-sm font-medium transition-colors', filter === value ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-foreground hover:bg-muted')}>
                {copy(label)}
              </button>
            ))}
          </div>
          <label className="flex flex-wrap items-center justify-between gap-2 text-sm font-medium" htmlFor="plan-sort">
            {copy('Ordenar por impacto')}
            <select id="plan-sort" value={sort} onChange={(event) => setSort(event.target.value as 'high' | 'low')} className="min-h-11 max-w-48 rounded-xl border border-input bg-background px-3 text-sm text-foreground">
              <option value="high">{copy('Mayor impacto')}</option>
              <option value="low">{copy('Menor impacto')}</option>
            </select>
          </label>
        </section>
      ) : null}

      {plan.length === 0 && (!isV3 || (filter !== 'completed' && visibleItems.length === 0)) ? (
        <div className="surface mt-4 flex flex-col items-center rounded-3xl p-6 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-success-soft text-success">
            <PartyPopper className="size-7" aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-serif text-[1.75rem] leading-tight">{copy('¡Plan completado!')}</h2>
          <p className="mt-1 text-[0.9375rem] text-muted-foreground">
            {copy('Seguiremos analizando tu huella cada semana.')}
          </p>
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="surface mt-4 rounded-3xl p-6 text-center" role="status">
          <h2 className="font-semibold">{copy(filter === 'completed' ? 'Aún no hay acciones completadas' : 'No hay acciones pendientes')}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{copy('Tus cambios aparecerán aquí.')}</p>
        </div>
      ) : (
        <ol className="mt-4 flex flex-col gap-3" aria-label={copy('Acciones recomendadas')}>
          {(isV3 ? visibleItems : plan).map((item, index) => {
            const isCompleted = completedIds.has(item.id) && !plan.some((pending) => pending.id === item.id)
            return (
              <li key={item.id} className="surface rounded-3xl p-4">
                <div className="flex items-start gap-3">
                  <span aria-hidden="true" className={cn('flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold', isCompleted ? 'bg-success-soft text-success' : 'bg-secondary text-primary')}>
                    {isCompleted ? <Check className="size-4" aria-hidden="true" /> : index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[0.9375rem] leading-snug font-semibold text-balance">{copy(item.title)}</h2>
                    <p className="mt-0.5 text-sm leading-snug text-muted-foreground">{copy(item.description)}</p>
                  </div>
                  {isCompleted ? <span className="shrink-0 rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">{copy('Completada')}</span> : (
                    <span className="shrink-0 rounded-full bg-success-soft px-2.5 py-1 text-xs font-bold text-success tabular-nums">+{item.gain}<span className="sr-only"> {copy('puntos')}</span></span>
                  )}
                </div>
                {!isCompleted && (item.href || item.selfFix) ? (
                  <div className="mt-3 flex flex-wrap gap-2 sm:pl-11">
                    {item.href && item.hrefLabel ? (
                      <Link
                        href={item.href}
                        className={cn(
                          buttonVariants({ variant: isV3 ? 'outline' : item.selfFix ? 'outline' : 'default', size: 'touch-sm' }),
                          'h-auto min-h-11 min-w-[8.5rem] flex-1 py-2 text-center whitespace-normal',
                        )}
                      >
                        {copy(item.hrefLabel)}
                      </Link>
                    ) : null}
                    {item.selfFix ? (
                      <Button
                        size="touch-sm"
                        variant={isV3 ? 'outline' : item.href ? 'ghost' : 'outline'}
                        className={cn(
                          'h-auto min-h-11 min-w-[8.5rem] flex-1 py-2 text-center whitespace-normal',
                          isV3 && 'border-success/50 bg-success-soft text-success hover:bg-success/20',
                        )}
                        onClick={() => {
                          if (isV3) setCompletedItems((items) => items.some((done) => done.id === item.id) ? items : [item, ...items])
                          update(item.selfFix!)
                        }}
                      >
                        <Check aria-hidden="true" />{copy('Ya lo hice')}<span className="sr-only">: {copy(item.title)}</span>
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </li>
            )
          })}
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

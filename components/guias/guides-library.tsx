'use client'

import { useState } from 'react'
import { localize, useIsV3, usePrototype } from '@/lib/prototype-context'
import { Play } from 'lucide-react'
import { featuredPills, formatDuration, pillCategories, pills, type Pill, type PillCategory } from '@/lib/guides'
import { StoryViewer } from '@/components/guias/story-viewer'
import { PillGlyph, categoryTone } from '@/components/guias/pill-visuals'
import { cn } from '@/lib/utils'

type Filter = 'todas' | PillCategory

const categoryLabel = Object.fromEntries(pillCategories.map((c) => [c.id, c.label])) as Record<PillCategory, string>

export function GuidesLibrary() {
  const isV3 = useIsV3()
  const { language, version } = usePrototype()
  const copy = (text: string) => version === 'v3' ? localize(text, language) : text
  const [openPill, setOpenPill] = useState<Pill | null>(null)
  const [filter, setFilter] = useState<Filter>('todas')

  const visible = filter === 'todas' ? pills : pills.filter((pill) => pill.category === filter)

  return (
    <>
      <section aria-labelledby="empezar-title">
        <h2 id="empezar-title" className="mb-3 px-5 text-lg font-semibold tracking-tight">
          {isV3 && language === 'en' ? 'Start here' : 'Para empezar'}
        </h2>
        <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {featuredPills.map((pill) => (
            <li key={pill.id} className="w-[84%] shrink-0 snap-start sm:w-[22rem]">
              <article className="surface flex h-full flex-col overflow-hidden rounded-3xl">
                <div
                  aria-hidden="true"
                  className={cn('relative flex h-40 items-center justify-center overflow-hidden', isV3 ? 'bg-secondary text-secondary-foreground ring-1 ring-border' : categoryTone[pill.category])}
                >
                  <span className="absolute -bottom-10 -left-10 size-40 rounded-full border border-current opacity-15" />
                  <span className="absolute -top-12 -right-6 size-32 rounded-full border border-current opacity-15" />
                  <PillGlyph name={pill.icon} className="size-20" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg leading-snug font-semibold text-balance">{copy(pill.title)}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDuration(pill.seconds)} · {copy('Historia visual')} · {copy(categoryLabel[pill.category])}
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpenPill(pill)}
                    className="mt-4 flex min-h-12 items-center gap-3 self-start rounded-full pr-4 text-[0.9375rem] font-semibold text-primary transition-colors hover:bg-muted"
                  >
                    <span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Play className="size-4 translate-x-px fill-current" aria-hidden="true" />
                    </span>
                    {copy('Ver historia')}
                    <span className="sr-only">: {pill.title}</span>
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="todas-title" className="mt-7 px-5">
        <h2 id="todas-title" className="mb-3 text-lg font-semibold tracking-tight">
          {copy('Todas las píldoras')}
        </h2>

        <div role="group" aria-label={copy('Filtrar por tema')} className="-mx-5 mb-4 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[{ id: 'todas' as const, label: 'Todas' }, ...pillCategories].map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={filter === option.id}
              onClick={() => setFilter(option.id)}
              className={cn(
                'min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors',
                filter === option.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-foreground hover:bg-muted',
              )}
            >
              {copy(option.label)}
            </button>
          ))}
        </div>

        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((pill) => (
            <li key={pill.id} id={pill.id} className="scroll-mt-24">
              <button
                type="button"
                onClick={() => setOpenPill(pill)}
                className="surface group flex h-full w-full flex-col overflow-hidden rounded-3xl text-left transition-transform active:scale-[0.98]"
              >
                <span
                  aria-hidden="true"
                  className={cn('relative flex h-28 w-full items-center justify-center overflow-hidden', isV3 ? 'bg-secondary text-secondary-foreground ring-1 ring-border' : categoryTone[pill.category])}
                >
                  <span className="absolute -right-6 -bottom-8 size-24 rounded-full border border-current opacity-20" />
                  <PillGlyph name={pill.icon} className="size-11" />
                  <span className="absolute bottom-2 left-2 flex size-8 items-center justify-center rounded-full bg-background/90 text-primary">
                    <Play className="size-3.5 translate-x-px fill-current" />
                  </span>
                  <span className="absolute right-2 bottom-2 rounded-full bg-background/90 px-2 py-0.5 text-xs font-semibold text-primary">
                    {formatDuration(pill.seconds)}
                  </span>
                </span>
                <span className="flex flex-1 flex-col p-3.5">
                  <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {copy(categoryLabel[pill.category])}
                  </span>
                  <span className="mt-1 text-[0.9375rem] leading-snug font-semibold text-balance">{copy(pill.title)}</span>
                  <span className="mt-1.5 text-sm leading-snug text-muted-foreground">{copy(pill.summary)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <StoryViewer pill={openPill} onClose={() => setOpenPill(null)} />
    </>
  )
}

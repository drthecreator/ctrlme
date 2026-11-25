'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { localize, usePrototype } from '@/lib/prototype-context'

type ScreenProps = {
  children: React.ReactNode
  className?: string
  wide?: boolean
}

export function Screen({ children, className, wide }: ScreenProps) {
  return (
    <div className={cn('h-full overflow-y-auto overscroll-contain pb-8', className)}>
      <div className={cn('mx-auto w-full lg:pt-4 lg:pb-8', wide ? 'lg:max-w-6xl lg:px-6' : 'lg:max-w-3xl')}>
        {children}
      </div>
    </div>
  )
}

type ScreenHeaderProps = {
  title: string
  subtitle?: string
  backHref?: string
}

export function ScreenHeader({ title, subtitle, backHref = '/' }: ScreenHeaderProps) {
  const { version, language } = usePrototype()
  const v3 = version === 'v3'
  const displayedTitle = v3 && title === 'Plan para subir'
    ? language === 'en' ? 'Improve your score' : 'Mejora tu puntuación'
    : v3 && (title === 'Guías rápidas' || title === 'Aprende en 1 minuto' || title === 'Guías')
      ? language === 'en' ? 'Guides' : 'Guías'
      : title
  const displayedSubtitle = v3 && (title === 'Guías rápidas' || title === 'Aprende en 1 minuto' || title === 'Guías')
    ? language === 'en' ? 'Learn in 1 minute' : 'Aprende en 1 minuto'
    : v3 && title === 'Plan para subir'
      ? language === 'en' ? 'Actions ordered by their impact on your score.' : 'Acciones ordenadas por el impacto que tienen en tu puntuación.'
      : subtitle
  return (
    <>
      <div className="sticky top-0 z-10 bg-background px-3 pt-[max(env(safe-area-inset-top),0.75rem)] pb-1 lg:pt-3">
        <Link
          href={backHref}
          className="inline-flex min-h-12 items-center gap-1 rounded-xl pr-3 pl-1.5 text-[0.9375rem] font-medium text-primary transition-colors hover:bg-muted"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
          {v3 && language === 'en' ? 'Back' : 'Volver'}
        </Link>
      </div>
      <header className="px-5 pt-1 pb-5">
        <h1 tabIndex={-1} className="font-serif text-[2.25rem] leading-[1.05] tracking-tight text-balance lg:text-[2.75rem]">
          {v3 ? localize(displayedTitle, language) : displayedTitle}
        </h1>
        {displayedSubtitle ? (
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground lg:text-base">
            {v3 ? localize(displayedSubtitle, language) : displayedSubtitle}
          </p>
        ) : null}
      </header>
    </>
  )
}

export function SectionTitle({
  children,
  id,
  aside,
}: {
  children: React.ReactNode
  id?: string
  aside?: React.ReactNode
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3 px-5">
      <h2 id={id} className="text-lg font-semibold tracking-tight">
        {children}
      </h2>
      {aside}
    </div>
  )
}

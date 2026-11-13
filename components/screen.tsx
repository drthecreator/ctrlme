import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  return (
    <>
      <div className="sticky top-0 z-10 bg-background px-3 pt-[max(env(safe-area-inset-top),0.75rem)] pb-1 lg:pt-3">
        <Link
          href={backHref}
          className="inline-flex min-h-11 items-center gap-1 rounded-xl pr-3 pl-1.5 text-[0.9375rem] font-medium text-primary transition-colors hover:bg-muted"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
          Volver
        </Link>
      </div>
      <header className="px-5 pt-1 pb-5">
        <h1 className="font-serif text-[2.25rem] leading-[1.05] tracking-tight text-balance lg:text-[2.75rem]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground lg:text-base">
            {subtitle}
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

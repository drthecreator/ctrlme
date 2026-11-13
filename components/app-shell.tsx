'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { BottomNav, SideNav } from '@/components/bottom-nav'
import { IdentityProvider, useIdentity } from '@/lib/identity-store'
import { cn } from '@/lib/utils'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <IdentityProvider>
      <Frame>{children}</Frame>
    </IdentityProvider>
  )
}

function Frame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { state } = useIdentity()
  const bare = pathname === '/' && !state.onboarded
  const previousPageRef = useRef<string | null>(null)

  useEffect(() => {
    const heading = Array.from(document.querySelectorAll<HTMLElement>('#contenido h1')).find(
      (element) => element.getClientRects().length > 0,
    )
    if (!heading) return

    const title = heading.textContent?.replace(/\s+/g, ' ').trim()
    if (title) document.title = `${title} · Ctrl+Me`

    const page = `${pathname}:${state.onboarded}`
    const shouldMoveFocus = previousPageRef.current !== null && previousPageRef.current !== page
    previousPageRef.current = page
    if (shouldMoveFocus) heading.focus()
  }, [pathname, state.onboarded])

  return (
    <div
      className={cn('min-h-dvh', !bare && 'sm:flex sm:items-center sm:justify-center sm:py-8 lg:block lg:min-h-0 lg:py-0')}
    >
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-primary focus:px-4 focus:py-3 focus:text-primary-foreground"
      >
        Saltar al contenido
      </a>
      <div
        id="app-frame"
        className={cn(
          'relative mx-auto flex h-dvh w-full flex-col overflow-clip bg-background',
          bare
            ? 'max-w-none'
            : 'max-w-[430px] sm:h-[min(900px,calc(100dvh-4rem))] sm:rounded-[2.75rem] sm:border sm:border-border sm:shadow-[0_40px_80px_-30px_oklch(0.2_0.025_262/0.35)] lg:h-dvh lg:max-w-none lg:flex-row lg:rounded-none lg:border-0 lg:shadow-none',
        )}
      >
        {bare ? null : <SideNav />}
        <main id="contenido" tabIndex={-1} className="min-h-0 min-w-0 flex-1">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  )
}

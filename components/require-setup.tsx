'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { useIdentity } from '@/lib/identity-store'
import { cn } from '@/lib/utils'

export function RequireSetup({ children, reason }: { children: React.ReactNode; reason: string }) {
  const { state } = useIdentity()
  if (state.onboarded) return <>{children}</>

  return (
    <div className="surface mx-5 flex flex-col items-center rounded-3xl p-6 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
        <Mail className="size-6" aria-hidden="true" />
      </span>
      <h2 className="mt-4 font-serif text-[1.75rem] leading-tight">Añade tu correo primero</h2>
      <p className="mt-1 text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">{reason}</p>
      <Link href="/" className={cn(buttonVariants({ size: 'touch' }), 'mt-5 w-full')}>
        Configurar vigilancia
      </Link>
    </div>
  )
}

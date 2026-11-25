'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { useIdentity } from '@/lib/identity-store'
import { usePrototype } from '@/lib/prototype-context'
import { cn } from '@/lib/utils'

export function RequireSetup({ children, reason }: { children: React.ReactNode; reason: string }) {
  const { state } = useIdentity()
  const { version, language } = usePrototype()
  const isEnglishV3 = version === 'v3' && language === 'en'
  if (state.onboarded) return <>{children}</>

  return (
    <div className="surface mx-5 flex flex-col items-center rounded-3xl p-6 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
        <Mail className="size-6" aria-hidden="true" />
      </span>
      <h2 className="mt-4 font-serif text-[1.75rem] leading-tight">{isEnglishV3 ? 'Add your email first' : 'Añade tu correo primero'}</h2>
      <p className="mt-1 text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">
        {isEnglishV3 ? 'We need to analyze your digital footprint to prepare your plan.' : reason}
      </p>
      <Link href="/" className={cn(buttonVariants({ size: 'touch' }), 'mt-5 w-full')}>
        {isEnglishV3 ? 'Set up monitoring' : 'Configurar vigilancia'}
      </Link>
    </div>
  )
}

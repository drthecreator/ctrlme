'use client'

import Link from 'next/link'
import { ArrowRight, ArrowUpRight, CircleCheck, Radar, ShieldAlert, Sparkles, TrendingUp, Users } from 'lucide-react'
import { Screen } from '@/components/screen'
import { HomeHeader } from '@/components/home/home-header'
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow'
import { ScoreArc, ScoreLegend } from '@/components/score-gauge'
import { getLevel } from '@/lib/score'
import { buttonVariants } from '@/components/ui/button'
import {
  BREACH,
  computeScore,
  formatRelative,
  getPendingAccounts,
  getPlan,
  getSuspiciousSessions,
  hasOpenBreach,
  useIdentity,
  type IdentityState,
} from '@/lib/identity-store'
import { cn } from '@/lib/utils'
import { localize, t, usePrototype } from '@/lib/prototype-context'

export function HomeView() {
  const { state } = useIdentity()
  const prototype = usePrototype()
  const isV3 = prototype.version === 'v3'

  if (!state.onboarded) return <OnboardingFlow />

  const { total } = computeScore(state)
  const plan = getPlan(state)
  const potential = plan.reduce((sum, item) => sum + item.gain, 0)
  const pendingAccounts = getPendingAccounts(state).length
  const breachOpen = hasOpenBreach(state)
  const primaryEmail = state.identity.emails[0]?.address
  const protectionLabel = isV3 ? t(({ destructive: 'Protección escasa', warning: 'Protección media', success: 'Protección excelente' } as const)[getLevel(total).tone], prototype.language) : getLevel(total).label
  const scoreLinkLabel = prototype.language === 'en'
    ? `Your score is ${total} out of 100, ${protectionLabel.toLowerCase()}. View your digital footprint`
    : `Tu puntuación es ${total} de 100, ${protectionLabel.toLowerCase()}. Ver tu huella digital`

  const overviewTitle = isV3 ? t('Tu resumen', prototype.language) : 'Tu resumen'
  const overviewSubtitle = isV3 ? t('Así está hoy tu identidad digital.', prototype.language) : 'Así está hoy tu identidad digital.'
  const scannedRelative = formatRelative(state.scannedAt, Date.now())

  return (
    <Screen wide>
      <HomeHeader name={state.identity.name} email={state.identity.emails[0]?.address} />
      <h1 tabIndex={-1} className="px-5 pt-3 pb-2 text-lg font-semibold tracking-tight lg:hidden">
        {overviewTitle}
      </h1>
      <header className="hidden px-5 pt-2 pb-5 lg:block">
        <h1 tabIndex={-1} className="font-serif text-[2.75rem] leading-tight tracking-tight">
          {overviewTitle}
        </h1>
        <p className="mt-1 text-base text-muted-foreground">{overviewSubtitle}</p>
      </header>

      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-6">
      <div className="lg:col-span-7">
      <p
        className={cn(
          'mx-5 mt-1 flex items-center gap-2 bg-secondary/70 px-3 py-2 text-[0.8125rem] text-secondary-foreground',
          isV3 ? 'flex-wrap rounded-2xl' : 'rounded-full',
        )}
      >
        <span className="relative flex size-2 shrink-0" aria-hidden="true">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/60 motion-reduce:hidden" />
          <span className="relative inline-flex size-2 rounded-full bg-success" />
        </span>
        <span className={cn('min-w-0', isV3 ? 'break-all' : 'truncate')}>
              {isV3 ? t('Vigilando', prototype.language) : 'Vigilando'} <strong className="font-semibold">{primaryEmail}</strong>
              {state.identity.emails.length > 1 ? isV3 && prototype.language === 'en' ? ` and ${state.identity.emails.length - 1} more` : ` y ${state.identity.emails.length - 1} más` : ''}
        </span>
        <span className="ml-auto shrink-0 text-muted-foreground">
          {isV3 ? localize(scannedRelative, prototype.language) : scannedRelative}
        </span>
      </p>

      <section aria-labelledby="score-title" className="px-5 pt-5">
        <h2 id="score-title" className="sr-only">
          {isV3 ? t('Tu puntuación', prototype.language) : 'Tu puntuación'}
        </h2>
        {isV3 ? (
          <div className="surface flex flex-col gap-3 rounded-3xl px-4 pt-5 pb-4">
            <Link
              href="/huella"
              aria-label={scoreLinkLabel}
              className="rounded-2xl focus-visible:outline-none"
            >
              <div className="mx-auto w-full lg:max-w-md">
                <ScoreArc score={total} />
              </div>
            </Link>
            <ScoreLegend />
            <p className="text-center text-xs text-muted-foreground">
              {t('Cuanto más alta sea la puntuación, mejor protegida está tu identidad.', prototype.language)}
            </p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(8.75rem,1fr))] gap-2 pt-1">
              <Link
                href="/huella"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'touch-sm' }),
                  'h-auto min-h-12 min-w-0 px-3 py-2.5 text-center leading-snug whitespace-normal text-[0.8125rem] sm:text-sm',
                )}
              >
                {t('Ver mi huella digital', prototype.language)}
              </Link>
              <Link
                href="/plan"
                className={cn(
                  buttonVariants({ variant: 'default', size: 'touch-sm' }),
                  'h-auto min-h-12 min-w-0 px-3 py-2.5 text-center leading-snug whitespace-normal text-[0.8125rem] sm:text-sm',
                )}
              >
                {t('Mejora tu puntuación', prototype.language)}
              </Link>
            </div>
          </div>
        ) : (
          <Link
            href="/huella"
            aria-label={scoreLinkLabel}
            className="surface flex flex-col gap-3 rounded-3xl px-4 pt-5 pb-4 transition-transform active:scale-[0.99]"
          >
            <div className="mx-auto w-full lg:max-w-md">
              <ScoreArc score={total} cta="Ver mi huella digital" />
            </div>
            <ScoreLegend />
            <p className="text-center text-xs text-muted-foreground">
              Cuanto más alta sea la puntuación, mejor protegida está tu identidad.
            </p>
          </Link>
        )}
        <div className="mt-3 flex justify-center">
          <Link
            href="/evaluacion"
            className="inline-flex min-h-12 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-primary transition-colors hover:bg-muted"
          >
            {isV3 ? state.assessmentDone ? t('Ver cómo se calcula', prototype.language) : t('Afinar con la evaluación (4 min)', prototype.language) : state.assessmentDone ? 'Ver cómo se calcula' : 'Afinar con la evaluación (4 min)'}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      </div>
      <div className="lg:col-span-5">
      <section aria-labelledby="accion-title" className="px-5 pt-3 lg:pt-1">
        <ActionCard state={state} />
      </section>

      <div className="px-5 pt-3">
        <Link
          href="/asistente"
          className="surface flex min-h-16 items-center gap-3 rounded-3xl p-4 transition-transform active:scale-[0.99]"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[0.9375rem] font-semibold">{isV3 ? t('Habla con el asistente', prototype.language) : 'Habla con el asistente'}</span>
            <span className="block text-sm text-muted-foreground">{isV3 ? t('Escribe o usa tu voz para resolver dudas', prototype.language) : 'Escribe o usa tu voz para resolver dudas'}</span>
          </span>
          <ArrowRight className="size-5 text-muted-foreground" aria-hidden="true" />
        </Link>
      </div>

      <CircleCard />

      {!isV3 ? (
        <>
          <section aria-label="Resumen" className="grid grid-cols-2 gap-3 px-5 pt-3">
            <SummaryCard
              href="/limpieza?tab=inactivas"
              title="Limpiar cuentas"
              prefix={pendingAccounts > 0 ? 'Tienes' : undefined}
              value={pendingAccounts}
              caption={pendingAccounts === 1 ? 'cuenta inactiva' : 'cuentas inactivas'}
            />
            <SummaryCard
              href="/alertas"
              title="Alertas de filtraciones"
              value={breachOpen ? 1 : 0}
              caption={breachOpen ? 'filtración detectada' : 'filtraciones activas'}
              urgent={breachOpen}
            />
          </section>

          {plan.length > 0 ? (
            <div className="px-5 pt-3">
              <Link
                href="/plan"
                className="surface flex min-h-16 items-center gap-3 rounded-3xl p-4 transition-transform active:scale-[0.99]"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-success-soft text-success">
                  <TrendingUp className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.9375rem] font-semibold">Tu plan para subir</span>
                  <span className="block text-sm text-muted-foreground">
                    {plan.length} acciones · hasta +{potential} puntos
                  </span>
                </span>
                <ArrowRight className="size-5 text-muted-foreground" aria-hidden="true" />
              </Link>
            </div>
          ) : null}
        </>
      ) : null}
      </div>
      </div>
    </Screen>
  )
}

function CircleCard() {
  const { state } = useIdentity()
  const prototype = usePrototype()
  const isV3 = prototype.version === 'v3'
  const active = state.circle.members.filter((m) => m.status === 'activo').length
  const requests = state.circle.incoming.length
  const circleName = isV3 ? t('Mi círculo', prototype.language) : 'Mi círculo'
  const circleDescription = active > 0
    ? `${isV3 ? prototype.language === 'en' ? 'You care for the identity of' : 'Cuidas la identidad de' : 'Cuidas la identidad de'} ${active} ${isV3 ? t(active === 1 ? 'persona' : 'personas', prototype.language) : active === 1 ? 'persona' : 'personas'}`
    : isV3 ? t('Ayuda a quien te lo pida', prototype.language) : 'Ayuda a quien te lo pida'

  return (
    <div className="px-5 pt-3">
      <Link
        href="/circulo"
        className="surface flex min-h-16 items-center gap-3 rounded-3xl p-4 transition-transform active:scale-[0.99]"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
          <Users className="size-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[0.9375rem] font-semibold">{circleName}</span>
          <span className="block text-sm text-muted-foreground">{circleDescription}</span>
        </span>
        {requests > 0 ? (
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-bold text-destructive-foreground">
            {requests}
            <span className="sr-only"> {isV3 ? t(requests === 1 ? 'solicitud nueva' : 'solicitudes nuevas', prototype.language) : requests === 1 ? 'solicitud nueva' : 'solicitudes nuevas'}</span>
          </span>
        ) : (
          <ArrowRight className="size-5 text-muted-foreground" aria-hidden="true" />
        )}
      </Link>
    </div>
  )
}

function ActionCard({ state }: { state: IdentityState }) {
  const prototype = usePrototype()
  const isV3 = prototype.version === 'v3'
  const suspicious = getSuspiciousSessions(state)
  const plan = getPlan(state)

  let content: { eyebrow: string; title: string; body: string; href: string; cta: string; icon: typeof Sparkles }

  if (suspicious.length > 0) {
    content = {
      eyebrow: 'Acción recomendada',
      title: `${suspicious.length} ${suspicious.length === 1 ? 'sesión sospechosa' : 'sesiones sospechosas'}`,
      body: 'Dispositivos que no reconocemos siguen conectados a tu cuenta de Google.',
      href: '/asistente/sesiones',
      cta: 'Resolver con asistente',
      icon: Sparkles,
    }
  } else if (hasOpenBreach(state)) {
    content = {
      eyebrow: 'Acción recomendada',
      title: `Filtración en ${BREACH.service}`,
      body: 'Tu contraseña antigua aparece en una base de datos filtrada.',
      href: '/alertas',
      cta: 'Ver qué hacer',
      icon: ShieldAlert,
    }
  } else if (plan.length > 0) {
    content = {
      eyebrow: 'Siguiente paso',
      title: plan[0].title,
      body: plan[0].description,
      href: '/plan',
      cta: `Ver plan · +${plan[0].gain} pts`,
      icon: Radar,
    }
  } else {
    content = {
      eyebrow: 'Todo en orden',
      title: 'Tu identidad está protegida',
      body: 'Seguiremos vigilando y te avisaremos si detectamos algo nuevo.',
      href: '/huella',
      cta: 'Ver tu huella digital',
      icon: CircleCheck,
    }
  }

  const Icon = content.icon

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-brand-surface p-5 text-brand-surface-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-12 size-44 rounded-full bg-accent/25 blur-2xl"
      />
      <p className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] text-accent uppercase">
        <Icon className="size-3.5" aria-hidden="true" />
        {isV3 ? t(content.eyebrow as 'Acción recomendada' | 'Siguiente paso' | 'Todo en orden', prototype.language) : content.eyebrow}
      </p>
      <h2 id="accion-title" className="mt-2 font-serif text-[1.75rem] leading-tight text-balance">
        {isV3 && suspicious.length > 0
          ? `${suspicious.length} ${t(suspicious.length === 1 ? 'sesión sospechosa' : 'sesiones sospechosas', prototype.language)}`
          : isV3 && hasOpenBreach(state) ? `${t('Filtración en', prototype.language)} ${BREACH.service}`
            : isV3 && !plan.length ? t('Tu identidad está protegida', prototype.language) : isV3 ? localize(content.title, prototype.language) : content.title}
      </h2>
      <p className="mt-1 text-[0.9375rem] leading-relaxed text-brand-surface-foreground/85">
        {isV3 && suspicious.length > 0 ? t('Dispositivos que no reconocemos siguen conectados a tu cuenta de Google.', prototype.language)
          : isV3 && hasOpenBreach(state) ? t('Tu contraseña antigua aparece en una base de datos filtrada.', prototype.language)
            : isV3 && !plan.length ? t('Seguiremos vigilando y te avisaremos si detectamos algo nuevo.', prototype.language) : isV3 ? localize(content.body, prototype.language) : content.body}
      </p>
      <Link href={content.href} className={cn(buttonVariants({ variant: 'accent', size: 'touch' }), 'mt-4 w-full')}>
        {isV3 && suspicious.length > 0 ? t('Resolver con asistente', prototype.language)
          : isV3 && hasOpenBreach(state) ? t('Ver qué hacer', prototype.language)
            : isV3 && !plan.length ? t('Ver tu huella digital', prototype.language)
              : isV3 ? localize(content.cta, prototype.language) : content.cta}
        <ArrowRight aria-hidden="true" />
      </Link>
    </div>
  )
}

type SummaryCardProps = {
  href: string
  title: string
  prefix?: string
  value: number
  caption: string
  urgent?: boolean
}

function SummaryCard({ href, title, prefix, value, caption, urgent }: SummaryCardProps) {
  return (
    <Link
      href={href}
      className="surface group flex min-h-40 flex-col rounded-3xl p-4 transition-transform active:scale-[0.98]"
    >
      <span className="flex items-start justify-between gap-2">
        <span className="text-[0.9375rem] leading-snug font-semibold text-balance">{title}</span>
        <ArrowUpRight
          className="size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
          aria-hidden="true"
        />
      </span>
      <span className="mt-auto">
        {prefix ? <span className="block text-sm text-muted-foreground">{prefix}</span> : null}
        <span className="flex items-center gap-2">
          <span className={cn('font-serif text-5xl leading-none', urgent && 'text-destructive')}>{value}</span>
          {urgent ? (
            <span className="relative flex size-2.5" aria-hidden="true">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive/60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2.5 rounded-full bg-destructive" />
            </span>
          ) : null}
        </span>
        <span className="mt-1 block text-sm leading-snug text-muted-foreground">{caption}</span>
      </span>
    </Link>
  )
}

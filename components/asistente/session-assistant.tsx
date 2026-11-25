'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Check,
  Clock,
  ExternalLink,
  Globe,
  KeyRound,
  LogOut,
  MapPin,
  Monitor,
  ShieldCheck,
  Smartphone,
  TabletSmartphone,
  type LucideIcon,
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  computeScore,
  getSuspiciousSessions,
  SESSIONS,
  useIdentity,
  type SessionKind,
} from '@/lib/identity-store'
import { cn } from '@/lib/utils'
import { usePrototypeCopy } from '@/lib/prototype-context'

const kindIcon: Record<SessionKind, LucideIcon> = {
  iphone: Smartphone,
  windows: Monitor,
  android: TabletSmartphone,
}

type Phase = { type: 'intro' } | { type: 'session'; id: string } | { type: 'password' } | { type: 'done' }

export function SessionAssistant() {
  const { state, update } = useIdentity()
  const copy = usePrototypeCopy()
  const [queue] = useState(() => getSuspiciousSessions(state).map((s) => s.id))
  const [startScore] = useState(() => computeScore(state).total)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [passwordChanged, setPasswordChanged] = useState(false)

  const closedInFlow = queue.filter((id) => state.sessionStatus[id] === 'closed')
  const phases: Phase[] = [
    { type: 'intro' },
    ...queue.map((id) => ({ type: 'session' as const, id })),
    ...(closedInFlow.length > 0 ? [{ type: 'password' as const }] : []),
    { type: 'done' },
  ]
  const phase = phases[Math.min(phaseIndex, phases.length - 1)]
  const next = () => setPhaseIndex((i) => i + 1)

  if (!state.identity.googleConnected) {
    return (
      <Panel>
        <IconBadge icon={Globe} />
        <h2 className="mt-4 font-serif text-[1.75rem] leading-tight">{copy('Conecta tu cuenta de Google')}</h2>
        <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted-foreground">
          {copy('Así podremos ver qué dispositivos tienen tu sesión abierta. Acceso de solo lectura.')}
        </p>
        <Button
          size="touch"
          className="mt-5 w-full"
          onClick={() => update((s) => ({ ...s, identity: { ...s.identity, googleConnected: true } }))}
        >
          {copy('Conectar Google')}
        </Button>
      </Panel>
    )
  }

  if (queue.length === 0) {
    return (
      <Panel>
        <IconBadge icon={ShieldCheck} tone="success" />
        <h2 className="mt-4 font-serif text-[1.75rem] leading-tight">{copy('No hay sesiones sospechosas')}</h2>
        <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted-foreground">
          {copy('Todos los dispositivos conectados están revisados.')}
        </p>
        <Link href="/" className={cn(buttonVariants({ size: 'touch' }), 'mt-5 w-full')}>
          {copy('Volver al inicio')}
        </Link>
      </Panel>
    )
  }

  const stepNumber = Math.min(phaseIndex, phases.length - 2)
  const totalSteps = phases.length - 2

  return (
    <div className="px-5">
      {phase.type !== 'intro' && phase.type !== 'done' ? (
        <div className="mb-4">
          <div className="flex items-baseline justify-between text-sm">
            <p className="font-semibold">
              {copy('Paso')} {stepNumber} {copy('de')} {totalSteps}
            </p>
          </div>
          <div
            role="progressbar"
            aria-label={copy('Progreso del asistente')}
            aria-valuemin={0}
            aria-valuemax={totalSteps}
            aria-valuenow={stepNumber}
            className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
              style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      ) : null}

      <div role="status" aria-live="polite" aria-atomic="true">
        {phase.type === 'intro' ? (
          <Panel align="start">
            <IconBadge icon={ShieldCheck} />
            <h2 className="mt-4 font-serif text-[1.75rem] leading-tight text-balance">
              {copy(`Revisemos ${queue.length} ${queue.length === 1 ? 'dispositivo' : 'dispositivos'} juntos`)}
            </h2>
            <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted-foreground">
              {copy('Te mostraremos cada sesión abierta en tu cuenta de Google. Solo tienes que decirnos si la reconoces.')}
            </p>
            <ol className="mt-5 flex w-full flex-col gap-3 text-left text-[0.9375rem]">
              <IntroStep n={1} text={copy('Revisa cada dispositivo conectado')} />
              <IntroStep n={2} text={copy('Cierra los que no reconozcas')} />
              <IntroStep n={3} text={copy('Asegura tu cuenta con una clave nueva')} />
            </ol>
            <Button size="touch" className="mt-6 w-full" onClick={next}>
              {copy('Empezar revisión')}
              <ArrowRight aria-hidden="true" />
            </Button>
          </Panel>
        ) : null}

        {phase.type === 'session' ? <SessionReview key={phase.id} id={phase.id} onDecided={next} /> : null}

        {phase.type === 'password' ? (
          <Panel align="start">
            <IconBadge icon={KeyRound} tone="warning" />
            <h2 className="mt-4 font-serif text-[1.75rem] leading-tight text-balance">{copy('Cambia tu contraseña de Google')}</h2>
            <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted-foreground">
              {copy('Si alguien tenía tu sesión abierta, podría conocer tu clave. Cambiarla cierra cualquier acceso restante.')}
            </p>
            <a
              href="https://myaccount.google.com/signinoptions/password"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: 'outline', size: 'touch' }), 'mt-5 w-full')}
            >
              {copy('Abrir Google')}
              <ExternalLink aria-hidden="true" />
              <span className="sr-only"> ({copy('se abre en una pestaña nueva')})</span>
            </a>
            <div className="mt-3 grid w-full grid-cols-2 gap-2">
              <Button variant="ghost" size="touch" onClick={next}>
                {copy('Más tarde')}
              </Button>
              <Button
                size="touch"
                onClick={() => {
                  setPasswordChanged(true)
                  next()
                }}
              >
                {copy('Ya la cambié')}
              </Button>
            </div>
          </Panel>
        ) : null}

        {phase.type === 'done' ? (
          <Summary queue={queue} startScore={startScore} passwordChanged={passwordChanged} />
        ) : null}
      </div>
    </div>
  )
}

function SessionReview({ id, onDecided }: { id: string; onDecided: () => void }) {
  const { state, update } = useIdentity()
  const copy = usePrototypeCopy()
  const session = SESSIONS.find((s) => s.id === id)!
  const Icon = kindIcon[session.kind]
  const email = state.identity.emails[0]?.address

  const decide = (status: 'closed' | 'trusted') => {
    update((s) => ({ ...s, sessionStatus: { ...s.sessionStatus, [id]: status } }))
    onDecided()
  }

  return (
    <section aria-labelledby={`session-${id}`} className="surface rounded-3xl p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-warning-soft text-warning">
          <Icon className="size-6" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 id={`session-${id}`} className="text-lg leading-tight font-semibold">
            {copy(session.device)}
          </h2>
          <p className="text-sm text-muted-foreground">{copy(session.browser)}</p>
        </div>
      </div>

      <dl className="mt-5 flex flex-col divide-y divide-border/70 rounded-2xl bg-muted/60 px-4 text-sm">
        <Detail icon={MapPin} label={copy('Ubicación')} value={copy(session.location)} />
        <Detail icon={Globe} label={copy('Dirección IP')} value={session.ip} mono />
        <Detail icon={Clock} label={copy('Última actividad')} value={copy(session.lastActive)} />
        <Detail icon={Smartphone} label={copy('Primer acceso')} value={copy(session.firstSeen)} />
      </dl>
      <p className="mt-3 text-sm text-muted-foreground">
        {copy('Conectado a')} <span className="font-medium text-foreground">{email}</span>
      </p>

      <p className="mt-5 text-[1.0625rem] font-semibold">{copy('¿Reconoces este dispositivo?')}</p>
      <div className="mt-3 flex flex-col gap-2">
        <Button variant="destructive" size="touch" onClick={() => decide('closed')}>
          <LogOut aria-hidden="true" />
          {copy('No, cerrar sesión')}
        </Button>
        <Button variant="outline" size="touch" onClick={() => decide('trusted')}>
          <Check aria-hidden="true" />
          {copy('Sí, es mío')}
        </Button>
      </div>
    </section>
  )
}

function Summary({
  queue,
  startScore,
  passwordChanged,
}: {
  queue: string[]
  startScore: number
  passwordChanged: boolean
}) {
  const { state } = useIdentity()
  const copy = usePrototypeCopy()
  const score = computeScore(state).total
  const closed = queue.filter((id) => state.sessionStatus[id] === 'closed').length
  const trusted = queue.length - closed

  return (
    <Panel>
      <IconBadge icon={ShieldCheck} tone="success" />
      <h2 className="mt-4 font-serif text-[2rem] leading-tight">{copy('Cuenta asegurada')}</h2>
      <p className="mt-1 text-[0.9375rem] text-muted-foreground">
        {copy('Tu puntuación ha subido de')} {startScore} {copy('a')}{' '}
        <strong className="font-semibold text-success">{score}</strong>.
      </p>
      <ul className="mt-5 flex w-full flex-col gap-2 text-left text-[0.9375rem]">
        {closed > 0 ? <SummaryRow text={`${closed} ${closed === 1 ? 'sesión cerrada' : 'sesiones cerradas'}`} /> : null}
        {trusted > 0 ? (
          <SummaryRow text={`${trusted} ${trusted === 1 ? 'dispositivo marcado' : 'dispositivos marcados'} como tuyo`} />
        ) : null}
        {passwordChanged ? <SummaryRow text="Contraseña de Google actualizada" /> : null}
      </ul>
      <Link href="/plan" className={cn(buttonVariants({ size: 'touch' }), 'mt-6 w-full')}>
        {copy('Siguiente mejora')}
        <ArrowRight aria-hidden="true" />
      </Link>
      <Link href="/" className={cn(buttonVariants({ variant: 'ghost', size: 'touch' }), 'mt-2 w-full')}>
        {copy('Volver al inicio')}
      </Link>
    </Panel>
  )
}

function Panel({ children, align = 'center' }: { children: React.ReactNode; align?: 'center' | 'start' }) {
  return (
    <section
      className={cn(
        'surface flex flex-col rounded-3xl p-6',
        align === 'center' ? 'items-center text-center' : 'items-start',
      )}
    >
      {children}
    </section>
  )
}

function IconBadge({ icon: Icon, tone = 'primary' }: { icon: LucideIcon; tone?: 'primary' | 'success' | 'warning' }) {
  return (
    <span
      className={cn(
        'flex size-14 items-center justify-center rounded-full',
        tone === 'primary' && 'bg-secondary text-primary',
        tone === 'success' && 'bg-success-soft text-success',
        tone === 'warning' && 'bg-warning-soft text-warning',
      )}
    >
      <Icon className="size-7" aria-hidden="true" />
    </span>
  )
}

function IntroStep({ n, text }: { n: number; text: string }) {
  return (
    <li className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
      >
        {n}
      </span>
      {text}
    </li>
  )
}

function SummaryRow({ text }: { text: string }) {
  const copy = usePrototypeCopy()
  return (
    <li className="flex items-center gap-3 rounded-2xl bg-success-soft px-4 py-3 font-medium text-success">
      <Check className="size-4 shrink-0" strokeWidth={3} aria-hidden="true" />
      {copy(text)}
    </li>
  )
}

function Detail({ icon: Icon, label, value, mono }: { icon: LucideIcon; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn('ml-auto text-right font-medium', mono && 'font-mono text-[0.8125rem]')}>{value}</dd>
    </div>
  )
}

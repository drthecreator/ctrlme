'use client'

import { useEffect, useId, useRef, useState } from 'react'
import {
  ArrowRight,
  AtSign,
  Bell,
  BookOpen,
  Brush,
  Check,
  ChevronLeft,
  CircleAlert,
  Fingerprint,
  Loader2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Switch } from '@/components/ui/switch'
import { OnboardingLanguageSwitch, PrototypeVersionSwitch } from '@/components/prototype-controls'
import { useIdentity, type Identity } from '@/lib/identity-store'
import { useIsV3, usePrototype } from '@/lib/prototype-context'

function copyText(es: string, en: string, isV3: boolean, language: 'es' | 'en') {
  return isV3 && language === 'en' ? en : es
}
import { cn } from '@/lib/utils'

type Step = 'welcome' | 'email' | 'code' | 'connect' | 'scan'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const fieldClass =
  'h-13 w-full rounded-2xl border border-input bg-card px-4 text-base transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-3 focus:outline-offset-2 focus:outline-ring focus:ring-3 focus:ring-ring/35 aria-invalid:border-destructive aria-invalid:focus:border-destructive aria-invalid:focus:outline-ring'

export function OnboardingFlow() {
  const { completeOnboarding } = useIdentity()
  const [step, setStep] = useState<Step>('welcome')
  const [identity, setIdentity] = useState<Identity>({
    name: '',
    emails: [],
    phone: '',
    instagram: '',
    googleConnected: false,
  })
  const [verificationCode, setVerificationCode] = useState('')
  const previousStepRef = useRef<Step | null>(null)

  const email = identity.emails[0]?.address ?? ''

  useEffect(() => {
    const heading = Array.from(document.querySelectorAll<HTMLElement>('#contenido h1')).find(
      (element) => element.getClientRects().length > 0,
    )
    if (!heading) return

    const title = heading.textContent?.replace(/\s+/g, ' ').trim()
    if (title) document.title = `${title} · Ctrl+Me`

    const shouldMoveFocus = previousStepRef.current !== null && previousStepRef.current !== step
    previousStepRef.current = step
    if (shouldMoveFocus) heading.focus()
  }, [step])

  if (step === 'welcome') return <Welcome onStart={() => setStep('email')} />

  return (
    <div className="flex h-full flex-col overflow-y-auto overscroll-contain">
      {step !== 'scan' ? (
        <StepHeader
          index={{ email: 1, code: 2, connect: 3 }[step]}
          onBack={() => setStep(step === 'email' ? 'welcome' : step === 'code' ? 'email' : 'code')}
        />
      ) : null}

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col md:my-auto md:flex-none md:py-6">
      {step === 'email' ? (
        <EmailStep
          initialName={identity.name}
          initialEmail={email}
          onSubmit={(name, address) => {
            setIdentity((i) => ({ ...i, name, emails: [{ address, verified: false }] }))
            setStep('code')
          }}
        />
      ) : null}

      {step === 'code' ? (
        <CodeStep
          email={email}
          code={verificationCode}
          onCodeChange={setVerificationCode}
          onChangeEmail={() => {
            setVerificationCode('')
            setStep('email')
          }}
          onVerified={() => {
            setIdentity((i) => ({ ...i, emails: i.emails.map((e) => ({ ...e, verified: true })) }))
            setStep('connect')
          }}
        />
      ) : null}

      {step === 'connect' ? (
        <ConnectStep
          onSubmit={(extra) => {
            setIdentity((i) => ({ ...i, ...extra }))
            setStep('scan')
          }}
        />
      ) : null}

      {step === 'scan' ? (
        <ScanStep identity={identity} onDone={() => completeOnboarding(identity)} />
      ) : null}
      </div>
    </div>
  )
}

function Welcome({ onStart }: { onStart: () => void }) {
  const language = usePrototype().language
  const isV3 = useIsV3()
  const features = [
    { icon: Bell, title: copyText('Alertas de filtraciones', 'Breach alerts', isV3, language), text: copyText('Te avisamos si tu correo aparece en una brecha.', 'We alert you if your email appears in a data breach.', isV3, language) },
    { icon: Brush, title: copyText('Limpieza digital', 'Digital cleanup', isV3, language), text: copyText('Cierra sesiones y borra cuentas olvidadas.', 'Close sessions and remove forgotten accounts.', isV3, language) },
    { icon: BookOpen, title: copyText('Aprende en 1 minuto', 'Learn in 1 minute', isV3, language), text: copyText('Guías visuales para protegerte.', 'Visual guides to help keep you safe.', isV3, language) },
  ]
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="shrink-0 px-6 pt-[max(env(safe-area-inset-top),1rem)] lg:px-12">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2">
          <PrototypeVersionSwitch />
          <OnboardingLanguageSwitch className="ml-auto" />
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-6 pt-4 pb-[max(env(safe-area-inset-bottom),1.5rem)] md:justify-center md:py-10 lg:grid lg:max-w-6xl lg:grid-cols-2 lg:content-center lg:items-start lg:gap-x-20 lg:px-12">
        <div className="lg:col-start-1 lg:row-start-1">
          <div className="relative mt-4 flex size-16 items-center justify-center rounded-[1.25rem] bg-brand-surface text-brand-surface-foreground lg:mt-0 lg:size-20 lg:rounded-3xl">
            <Fingerprint className="size-8 lg:size-10" aria-hidden="true" />
            <span
              aria-hidden="true"
              className="absolute -right-1.5 -bottom-1.5 flex size-7 items-center justify-center rounded-full bg-accent text-accent-foreground ring-4 ring-background"
            >
              <ShieldCheck className="size-4" />
            </span>
          </div>
          <p className="mt-8 text-sm font-semibold tracking-[0.12em] text-muted-foreground uppercase">Ctrl+Me</p>
          <h1 tabIndex={-1} className="mt-2 font-serif text-[2.75rem] leading-[1.02] tracking-tight text-balance lg:text-6xl">
            {copyText('Tu identidad digital, bajo control.', 'Your digital identity, under control.', isV3, language)}
          </h1>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground lg:mt-5 lg:text-lg">
            {copyText('Descubre qué sabe internet de ti y arréglalo paso a paso, sin tecnicismos.', 'Find out what the internet knows about you and take it back step by step, no technical knowledge needed.', isV3, language)}
          </p>
        </div>

        <ul className="mt-8 flex flex-col gap-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:gap-6 lg:rounded-[2rem] lg:border lg:border-border lg:bg-card lg:p-10">
          {features.map((f) => (
            <li key={f.title} className="flex items-start gap-3 lg:gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary lg:size-12">
                <f.icon className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold lg:text-lg">{f.title}</span>
                <span className="block text-sm leading-snug text-muted-foreground lg:text-base">{f.text}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-10 md:mt-0 md:pt-10 lg:col-start-1 lg:row-start-2 lg:max-w-sm lg:pt-8">
          <Button size="touch" className="w-full" onClick={onStart}>
            {copyText('Empezar', 'Get started', isV3, language)}
            <ArrowRight aria-hidden="true" />
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <Lock className="size-3.5" aria-hidden="true" />
            {copyText('Nunca te pediremos contraseñas ni leeremos tus mensajes.', 'We will never ask for your passwords or read your messages.', isV3, language)}
          </p>
        </div>
      </div>
    </div>
  )
}

function StepHeader({ index, onBack }: { index: number; onBack: () => void }) {
  const language = usePrototype().language
  const isV3 = useIsV3()
  return (
    <div className="sticky top-0 z-10 bg-background px-3 pt-[max(env(safe-area-inset-top),0.75rem)] pb-2 md:px-6 md:pt-6">
      <div className="mx-auto flex w-full max-w-lg flex-wrap items-center gap-2 md:max-w-5xl">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex min-h-12 items-center gap-1 rounded-xl pr-3 pl-1.5 text-[0.9375rem] font-medium text-primary transition-colors hover:bg-muted"
      >
        <ChevronLeft className="size-5" aria-hidden="true" />
        {copyText('Volver', 'Back', isV3, language)}
      </button>
      <div className="ml-auto flex items-center gap-3 pr-1">
        <span className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground tabular-nums" aria-live="polite" aria-atomic="true">
            {isV3 && language === 'en' ? `Step ${index} of 3` : `Paso ${index} de 3`}
          </span>
          <span className="flex gap-1" aria-hidden="true">
            {[1, 2, 3].map((n) => (
              <span key={n} className={cn('h-1.5 w-5 rounded-full', n <= index ? 'bg-primary' : 'bg-muted')} />
            ))}
          </span>
        </span>
        <OnboardingLanguageSwitch />
      </div>
      </div>
    </div>
  )
}

function StepIntro({ title, text }: { title: string; text: React.ReactNode }) {
  return (
    <header className="px-6 pt-4 pb-6">
      <h1 tabIndex={-1} className="font-serif text-[2.25rem] leading-[1.05] tracking-tight text-balance">{title}</h1>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">{text}</p>
    </header>
  )
}

function EmailStep({
  initialName,
  initialEmail,
  onSubmit,
}: {
  initialName: string
  initialEmail: string
  onSubmit: (name: string, email: string) => void
}) {
  const id = useId()
  const language = usePrototype().language
  const isV3 = useIsV3()
  const [name, setName] = useState(initialName)
  const [email, setEmail] = useState(initialEmail)
  const [consent, setConsent] = useState(Boolean(initialEmail))
  const [errors, setErrors] = useState<{ email?: string; consent?: string }>({})
  const [submitSeq, setSubmitSeq] = useState(0)
  const emailRef = useRef<HTMLInputElement>(null)
  const consentRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (submitSeq === 0) return
    const target = errors.email ? emailRef.current : errors.consent ? consentRef.current : null
    if (!target) return
    target.scrollIntoView({ block: 'center', behavior: 'instant' })
    target.focus({ preventScroll: true })
  }, [errors, submitSeq])

  return (
    <form
      noValidate
      className="flex flex-1 flex-col px-6 pb-[max(env(safe-area-inset-bottom),1.5rem)]"
      onSubmit={(e) => {
        e.preventDefault()
        const next: typeof errors = {}
        if (!EMAIL_PATTERN.test(email.trim())) next.email = copyText('Escribe un correo válido, por ejemplo nombre@gmail.com', 'Enter a valid email address, such as name@gmail.com', isV3, language)
        if (!consent) next.consent = copyText('Necesitamos tu permiso para buscar este correo.', 'We need your permission to search for this email address.', isV3, language)
        setErrors(next)
        if (Object.keys(next).length > 0) {
          setSubmitSeq((n) => n + 1)
          return
        }
        onSubmit(name.trim(), email.trim().toLowerCase())
      }}
    >
      <div className="-mx-6">
        <StepIntro
          title={copyText('¿Qué correo vigilamos?', 'Which email should we monitor?', isV3, language)}
          text={copyText('Lo buscaremos en bases de datos de filtraciones conocidas y en cuentas vinculadas a él.', 'We will check known breach databases and accounts linked to it.', isV3, language)}
        />
      </div>

      <label htmlFor={`${id}-name`} className="text-sm font-semibold">
        {copyText('¿Cómo te llamas?', 'What is your name?', isV3, language)} <span className="font-normal text-muted-foreground">{copyText('(opcional)', '(optional)', isV3, language)}</span>
      </label>
      <input
        id={`${id}-name`}
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="given-name"
        placeholder="Lucía"
        className={cn(fieldClass, 'mt-2')}
      />

      <label htmlFor={`${id}-email`} className="mt-5 text-sm font-semibold">
        {copyText('Correo electrónico', 'Email address', isV3, language)}
      </label>
      <div className="relative mt-2">
        <Mail className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          id={`${id}-email`}
          ref={emailRef}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          autoCapitalize="none"
          spellCheck={false}
          value={email}
          onChange={(e) => {
            const val = e.target.value
            setEmail(val)
            if (errors.email && EMAIL_PATTERN.test(val.trim())) {
              setErrors((prev) => ({ ...prev, email: undefined }))
            }
          }}
          placeholder="nombre@gmail.com"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? `${id}-email-error` : `${id}-email-hint`}
          className={cn(fieldClass, 'pl-12')}
        />
      </div>
      {errors.email ? (
        <p id={`${id}-email-error`} className="mt-2 text-sm font-medium text-destructive">
          {errors.email}
        </p>
      ) : (
        <p id={`${id}-email-hint`} className="mt-2 text-sm text-muted-foreground">
          {copyText('Te enviaremos un código para confirmar que es tuyo.', 'We will send a code to verify it belongs to you.', isV3, language)}
        </p>
      )}

      <label
        className={cn(
          'relative mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border-2 bg-secondary/60 p-4 transition-colors has-focus:outline-3 has-focus:outline-offset-2 has-focus:outline-ring has-focus:ring-3 has-focus:ring-ring/35 has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring',
          errors.consent ? 'border-destructive bg-destructive-soft/40' : 'border-transparent',
        )}
      >
        <input
          ref={consentRef}
          type="checkbox"
          checked={consent}
          onChange={(e) => {
            const checked = e.target.checked
            setConsent(checked)
            if (errors.consent && checked) {
              setErrors((prev) => ({ ...prev, consent: undefined }))
            }
          }}
          required
          aria-invalid={errors.consent ? true : undefined}
          aria-describedby={errors.consent ? `${id}-consent-error` : undefined}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={cn(
            'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border-2 bg-card transition-colors peer-checked:border-primary peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-ring',
            errors.consent ? 'border-destructive' : 'border-input',
          )}
        >
          <Check className={cn('size-3.5 text-primary-foreground', !consent && 'opacity-0')} strokeWidth={3} />
        </span>
        <span className="text-sm leading-relaxed">
          {copyText('Autorizo a Ctrl+Me a buscar este correo en fuentes públicas y filtraciones conocidas.', 'I allow Ctrl+Me to search public sources and known data breaches for this email.', isV3, language)}
        </span>
      </label>
      {errors.consent ? (
        <p id={`${id}-consent-error`} className="mt-2 text-sm font-medium text-destructive">
          {errors.consent}
        </p>
      ) : null}

      <div className="mt-auto pt-8">
        <Button type="submit" size="touch" className="w-full">
          {copyText('Enviar código', 'Send code', isV3, language)}
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </form>
  )
}

function CodeStep({
  email,
  code,
  onCodeChange,
  onChangeEmail,
  onVerified,
}: {
  email: string
  code: string
  onCodeChange: (value: string) => void
  onChangeEmail: () => void
  onVerified: () => void
}) {
  const [resent, setResent] = useState(false)
  const [invalidCode, setInvalidCode] = useState(false)
  const isV3 = useIsV3()
  const language = usePrototype().language

  return (
    <div className="flex flex-1 flex-col px-6 pb-[max(env(safe-area-inset-bottom),1.5rem)]">
      <div className="-mx-6">
        <StepIntro
          title={copyText('Revisa tu correo', 'Check your email', isV3, language)}
          text={
            <>
              {copyText('Hemos enviado un código de 6 dígitos a', 'We sent a 6-digit code to', isV3, language)} <strong className="font-semibold text-foreground">{email}</strong>.
            </>
          }
        />
      </div>

      <InputOTP
        maxLength={6}
        value={code}
        onChange={(value) => {
          onCodeChange(value)
          setInvalidCode(isV3 && value === '000000')
        }}
        inputMode="numeric"
        pattern="^[0-9]*$"
        autoComplete="one-time-code"
        aria-label={copyText('Código de verificación de 6 dígitos', '6-digit verification code', isV3, language)}
        aria-invalid={isV3 && invalidCode ? true : undefined}
        aria-describedby={isV3 && invalidCode ? 'verification-code-hint verification-code-error' : 'verification-code-hint'}
        containerClassName="w-full max-w-xs mx-auto justify-center"
      >
        <InputOTPGroup className="grid w-full grid-cols-6 gap-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <InputOTPSlot
              key={i}
              index={i}
              className="h-14 w-full rounded-xl border border-input bg-card font-serif text-2xl first:rounded-xl last:rounded-xl"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <p id="verification-code-hint" className="mt-4 text-center text-sm text-muted-foreground">
        {isV3
          ? copyText('Prototipo: cualquier código de 6 dígitos funciona excepto 000000.', 'Test: any 6-digit code works except 000000.', true, language)
          : 'Prototipo: cualquier código de 6 dígitos funciona.'}
      </p>
      {isV3 && invalidCode ? (
        <div id="verification-code-error" role="alert" className="mt-3 flex items-start gap-2.5 rounded-2xl border-2 border-destructive bg-destructive-soft p-3.5 text-sm text-destructive">
          <CircleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">{copyText('Código no válido.', 'Invalid code.', isV3, language)}</p>
            <p className="mt-0.5">{copyText('Comprueba los seis dígitos e inténtalo de nuevo.', 'Check the six digits and try again.', isV3, language)}</p>
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex justify-center gap-2">
        <Button variant="ghost" size="touch-sm" onClick={() => setResent(true)} disabled={resent}>
          {resent ? copyText('Código reenviado', 'Code resent', isV3, language) : copyText('Reenviar código', 'Resend code', isV3, language)}
        </Button>
        <Button variant="ghost" size="touch-sm" onClick={onChangeEmail}>
          {copyText('Cambiar correo', 'Change email', isV3, language)}
        </Button>
      </div>
      <p className="sr-only" aria-live="polite">
        {resent ? copyText('Te hemos enviado un nuevo código.', 'We sent you a new code.', isV3, language) : ''}
      </p>

      <div className="mt-auto pt-8">
        <Button size="touch" className="w-full" disabled={code.length < 6 || (isV3 && invalidCode)} onClick={onVerified}>
          {copyText('Verificar', 'Verify', isV3, language)}
        </Button>
      </div>
    </div>
  )
}

function ConnectStep({ onSubmit }: { onSubmit: (extra: Pick<Identity, 'phone' | 'instagram' | 'googleConnected'>) => void }) {
  const id = useId()
  const language = usePrototype().language
  const isV3 = useIsV3()
  const [google, setGoogle] = useState(true)
  const [instagram, setInstagram] = useState('')
  const [phone, setPhone] = useState('')

  return (
    <form
      className="flex flex-1 flex-col px-6 pb-[max(env(safe-area-inset-bottom),1.5rem)]"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ googleConnected: google, instagram: instagram.replace(/^@/, '').trim(), phone: phone.trim() })
      }}
    >
      <div className="-mx-6">
        <StepIntro
          title={copyText('Amplía el análisis', 'Expand your scan', isV3, language)}
          text={copyText('Cuantos más datos nos indiques, más preciso será tu resultado. Todo es opcional.', 'The more details you share, the more accurate your results. Everything is optional.', isV3, language)}
        />
      </div>

      <div className="surface rounded-3xl p-4">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary font-semibold text-primary"
          >
            G
          </span>
          <div className="min-w-0 flex-1">
            <label htmlFor={`${id}-google`} className="block font-semibold">
              {copyText('Conectar cuenta de Google', 'Connect Google account', isV3, language)}
            </label>
            <p id={`${id}-google-hint`} className="mt-0.5 text-sm leading-snug text-muted-foreground">
              {copyText('Para ver qué dispositivos tienen tu sesión abierta. Solo lectura.', 'See which devices are signed in. Read-only access.', isV3, language)}
            </p>
          </div>
          <Switch
            id={`${id}-google`}
            checked={google}
            onCheckedChange={setGoogle}
            aria-describedby={`${id}-google-hint`}
            className="mt-1"
          />
        </div>
      </div>

      <label htmlFor={`${id}-ig`} className="mt-6 text-sm font-semibold">
        {copyText('Usuario de Instagram', 'Instagram username', isV3, language)}
      </label>
      <div className="relative mt-2">
        <AtSign className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          id={`${id}-ig`}
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          autoCapitalize="none"
          spellCheck={false}
          placeholder="tu.usuario"
          aria-describedby={`${id}-ig-hint`}
          className={cn(fieldClass, 'pl-12')}
        />
      </div>
      <p id={`${id}-ig-hint`} className="mt-2 text-sm text-muted-foreground">
        {copyText('Revisamos solo lo que cualquiera puede ver en tu perfil.', 'We only check information anyone can see on your profile.', isV3, language)}
      </p>

      <label htmlFor={`${id}-phone`} className="mt-5 text-sm font-semibold">
        {copyText('Teléfono móvil', 'Mobile phone', isV3, language)}
      </label>
      <div className="relative mt-2">
        <Phone className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          id={`${id}-phone`}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+34 600 000 000"
          aria-describedby={`${id}-phone-hint`}
          className={cn(fieldClass, 'pl-12')}
        />
      </div>
      <p id={`${id}-phone-hint`} className="mt-2 text-sm text-muted-foreground">
        {copyText('Lo buscaremos también en filtraciones.', 'We will also check it against known data breaches.', isV3, language)}
      </p>

      <div className="mt-auto pt-8">
        <Button type="submit" size="touch" className="w-full">
          {copyText('Iniciar análisis', 'Start scan', isV3, language)}
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </form>
  )
}

function ScanStep({ identity, onDone }: { identity: Identity; onDone: () => void }) {
  const language = usePrototype().language
  const isV3 = useIsV3()
  const checks = [
    { label: copyText('Buscando tu correo en filtraciones conocidas', 'Checking known data breaches for your email', isV3, language), result: copyText('1 filtración encontrada', '1 breach found', isV3, language) },
    identity.phone ? { label: copyText('Comprobando tu teléfono', 'Checking your phone number', isV3, language), result: copyText('Sin coincidencias', 'No matches', isV3, language) } : null,
    identity.instagram
      ? { label: copyText(`Revisando el perfil público @${identity.instagram}`, `Reviewing the public profile @${identity.instagram}`, isV3, language), result: copyText('Perfil público, 12 fotos', 'Public profile, 12 photos', isV3, language) }
      : { label: copyText('Buscando perfiles públicos con tu nombre', 'Searching public profiles for your name', isV3, language), result: copyText('4 plataformas', '4 platforms', isV3, language) },
    identity.googleConnected
      ? { label: copyText('Consultando sesiones de tu cuenta de Google', 'Checking sessions on your Google account', isV3, language), result: copyText('2 sesiones sospechosas', '2 suspicious sessions', isV3, language) }
      : null,
    { label: copyText('Detectando cuentas antiguas vinculadas', 'Finding old linked accounts', isV3, language), result: copyText('3 cuentas inactivas', '3 inactive accounts', isV3, language) },
  ].filter((c): c is { label: string; result: string } => c !== null)

  const [completed, setCompleted] = useState(0)
  const finished = completed >= checks.length

  useEffect(() => {
    if (finished) {
      document.title = `${copyText('Análisis completado', 'Scan complete', isV3, language)} · Ctrl+Me`
      return
    }
    const timer = setTimeout(() => setCompleted((c) => c + 1), 1100)
    return () => clearTimeout(timer)
  }, [completed, finished])

  return (
    <div className="flex flex-1 flex-col px-6 pt-[max(env(safe-area-inset-top),2.5rem)] pb-[max(env(safe-area-inset-bottom),1.5rem)]">
      <div className="relative mx-auto flex size-28 items-center justify-center">
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-0 rounded-full border-2 border-primary/15',
            !finished && 'animate-ping motion-reduce:animate-none',
          )}
        />
        <span
          className={cn(
            'relative flex size-20 items-center justify-center rounded-full transition-colors duration-500',
            finished ? 'bg-success text-success-foreground' : 'bg-primary text-primary-foreground',
          )}
        >
          {finished ? <Check className="size-9" strokeWidth={2.5} aria-hidden="true" /> : <Fingerprint className="size-9" aria-hidden="true" />}
        </span>
      </div>

      <h1 tabIndex={-1} className="mt-6 text-center font-serif text-[2.25rem] leading-tight tracking-tight">
        {finished ? copyText('Análisis completado', 'Scan complete', isV3, language) : copyText('Analizando tu huella', 'Analyzing your digital footprint', isV3, language)}
      </h1>
      <p
        className="mt-1 text-center text-[0.9375rem] text-muted-foreground"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {finished ? copyText('Ya tenemos tu primera puntuación.', 'Your first score is ready.', isV3, language) : isV3 && language === 'en' ? `${completed + 1} of ${checks.length} checks` : `${completed + 1} de ${checks.length} comprobaciones`}
        {!finished ? <span className="sr-only">: {checks[completed]?.label}</span> : null}
      </p>

      <ol className="surface mt-8 overflow-hidden rounded-3xl">
        {checks.map((check, index) => {
          const done = index < completed
          const active = index === completed
          return (
            <li
              key={check.label}
              aria-current={active ? 'step' : undefined}
              className={cn(
                'flex items-start gap-3 border-b border-border/70 p-4 transition-opacity last:border-b-0',
                !done && !active && 'opacity-45',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full',
                  done ? 'bg-success-soft text-success' : 'bg-muted text-muted-foreground',
                )}
              >
                {done ? (
                  <Check className="size-3.5" strokeWidth={3} />
                ) : active ? (
                  <Loader2 className="size-3.5 animate-spin motion-reduce:animate-none" />
                ) : null}
              </span>
              <span className="min-w-0">
                <span className="block text-[0.9375rem] leading-snug font-medium">{check.label}</span>
                {done ? <span className="mt-0.5 block text-sm text-muted-foreground">{check.result}</span> : null}
              </span>
            </li>
          )
        })}
      </ol>

      <div className="mt-auto pt-8">
        <Button size="touch" className="w-full" disabled={!finished} onClick={onDone}>
          {copyText('Ver mis resultados', 'View my results', isV3, language)}
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

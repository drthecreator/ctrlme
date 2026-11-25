'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Info, ScanSearch } from 'lucide-react'
import { ScoreRing } from '@/components/score-gauge'
import { Button } from '@/components/ui/button'
import { ReviewStep } from '@/components/evaluacion/review-step'
import { computeScore, hasAnyNetwork, useIdentity, type Answers } from '@/lib/identity-store'
import { getLevel, toneStyles } from '@/lib/score'
import { cn } from '@/lib/utils'
import { localize, usePrototype } from '@/lib/prototype-context'

type Option<V extends string> = { value: V; label: string; hint?: string }

const frequency: Option<Answers['instagram']>[] = [
  { value: 'nunca', label: 'No la uso' },
  { value: 'ocasional', label: 'Ocasional' },
  { value: 'diario', label: 'Diario' },
]

const STEPS = [
  { title: 'Redes y perfiles', short: 'Redes' },
  { title: 'Contraseñas y accesos', short: 'Accesos' },
  { title: 'Hábitos y engaños', short: 'Hábitos' },
  { title: 'IA y datos compartidos', short: 'IA y datos' },
  { title: 'Dispositivo y permisos', short: 'Dispositivo' },
  { title: 'Revisar respuestas', short: 'Revisar' },
]

export function AssessmentForm() {
  const router = useRouter()
  const { state, update } = useIdentity()
  const { version, language } = usePrototype()
  const isV3 = version === 'v3'
  const copy = (text: string) => isV3 ? localize(text, language) : text
  const [step, setStep] = useState(0)
  const topRef = useRef<HTMLDivElement>(null)
  const answers = state.answers
  const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
    update((s) => ({ ...s, answers: { ...s.answers, [key]: value } }))

  const { total, metrics } = computeScore(state)
  const level = getLevel(total)
  const isLast = step === STEPS.length - 1
  const progress = ((step + 1) / STEPS.length) * 100

  const goTo = (next: number) => {
    setStep(next)
    topRef.current?.scrollIntoView({ block: 'start' })
    topRef.current?.focus({ preventScroll: true })
  }

  return (
    <div className="px-5">
      <div ref={topRef} tabIndex={-1} className="scroll-mt-20 outline-none">
        {isV3 ? <p role="status" className="mb-3 flex items-center gap-1.5 text-xs font-medium text-success"><Check className="size-3.5" aria-hidden="true" />{copy('Guardado automático')}</p> : null}
        <div className="flex items-baseline justify-between text-sm">
          <p className="font-semibold">
            {copy('Paso')} {step + 1} {copy('de')} {STEPS.length}
            <span className="font-normal text-muted-foreground"> · {copy(STEPS[step].title)}</span>
          </p>
          <p className="text-muted-foreground tabular-nums" aria-hidden="true">
            {Math.round(progress)}%
          </p>
        </div>
        <div
          role="progressbar"
          aria-label={copy('Progreso de la evaluación')}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {step === 0 ? (
        <>
          <p className="mt-5 flex items-start gap-2.5 rounded-2xl bg-secondary/70 p-3.5 text-sm leading-relaxed text-secondary-foreground">
            <ScanSearch className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {copy('Hemos rellenado algunas respuestas con lo que encontró el análisis. Corrígelas si no son exactas.')}
          </p>
          <Question title="¿Qué redes utilizas habitualmente?">
            <Segmented
              label="Instagram"
              name="instagram"
              options={frequency}
              value={answers.instagram}
              onChange={(v) => set('instagram', v)}
              detected={state.identity.instagram ? `@${state.identity.instagram}` : undefined}
            />
            <Segmented label="TikTok" name="tiktok" options={frequency} value={answers.tiktok} onChange={(v) => set('tiktok', v)} />
          </Question>
          <Question title="¿Y otras redes como Facebook, X, LinkedIn o Snapchat?">
            <ChoiceList
              name="otherNetworks"
              value={answers.otherNetworks}
              onChange={(v) => set('otherNetworks', v)}
              options={[
                { value: 'ninguna', label: 'Ninguna más' },
                { value: 'una-dos', label: 'Una o dos' },
                { value: 'varias', label: 'Tres o más', hint: 'Cada perfil es un sitio más donde exponerte' },
              ]}
            />
          </Question>
          {hasAnyNetwork(answers) ? (
            <Question
              title="¿Cuántas publicaciones tienes, más o menos?"
              hint="Suma fotos, vídeos, historias destacadas y comentarios en todas tus redes."
            >
              <ChoiceList
                name="postCount"
                value={answers.postCount}
                onChange={(v) => set('postCount', v)}
                options={[
                  { value: 'pocas', label: 'Menos de 50' },
                  { value: 'algunas', label: 'Entre 50 y 300' },
                  { value: 'muchas', label: 'Más de 300', hint: 'Revisarlas una a una es mucho trabajo' },
                ]}
              />
            </Question>
          ) : null}
          {answers.instagram !== 'nunca' ? (
            <Question title="¿Tu perfil de Instagram es público?">
              <Segmented
                label="Visibilidad del perfil"
                hideLabel
                name="profile"
                options={[
                  { value: 'publico', label: 'Público' },
                  { value: 'privado', label: 'Privado' },
                ]}
                value={answers.profile}
                onChange={(v) => set('profile', v)}
              />
            </Question>
          ) : null}
          <Question
            title="¿Cuántos datos reales muestran tus perfiles?"
            hint="Nombre completo, ciudad, trabajo, colegio o universidad, pareja…"
          >
            <ChoiceList
              name="realInfo"
              value={answers.realInfo}
              onChange={(v) => set('realInfo', v)}
              options={[
                { value: 'poco', label: 'Casi ninguno', hint: 'Uso un apodo o solo mi nombre' },
                { value: 'algunos', label: 'Algunos', hint: 'Mi nombre y poco más' },
                { value: 'casi-todo', label: 'Casi todos', hint: 'Cualquiera podría saber dónde vivo o trabajo' },
              ]}
            />
          </Question>
          <Question title="¿Publicas fotos o historias con ubicación?">
            <OftenChoice name="geotag" value={answers.geotag} onChange={(v) => set('geotag', v)} />
          </Question>
        </>
      ) : null}

      {step === 1 ? (
        <>
          <Question title="¿Repites contraseñas entre cuentas?">
            <ChoiceList
              name="reuse"
              value={answers.reuse}
              onChange={(v) => set('reuse', v)}
              options={[
                { value: 'nunca', label: 'Nunca', hint: 'Cada cuenta tiene la suya' },
                { value: 'algunas', label: 'En algunas', hint: 'Uso 2 o 3 claves para todo' },
                { value: 'casi-todas', label: 'En casi todas', hint: 'Tengo una clave principal' },
              ]}
            />
          </Question>
          <Question title="¿Usas un gestor de contraseñas?">
            <Segmented
              label="Gestor de contraseñas"
              hideLabel
              name="manager"
              options={[
                { value: 'si', label: 'Sí' },
                { value: 'no', label: 'No' },
              ]}
              value={answers.manager}
              onChange={(v) => set('manager', v)}
            />
          </Question>
          <Question title="¿Tienes activada la verificación en dos pasos?" hint="Un código extra al iniciar sesión, por SMS o app.">
            <ChoiceList
              name="2fa"
              value={answers.twoFactor}
              onChange={(v) => set('twoFactor', v)}
              options={[
                { value: 'todas', label: 'En todas mis cuentas importantes' },
                { value: 'algunas', label: 'Solo en algunas' },
                { value: 'ninguna', label: 'En ninguna / No sé qué es' },
              ]}
            />
          </Question>
          <Question
            title="¿Tu correo y teléfono de recuperación están al día?"
            hint="Son lo que usas para recuperar una cuenta si te la roban o olvidas la clave."
          >
            <ChoiceList
              name="recovery"
              value={answers.recovery}
              onChange={(v) => set('recovery', v)}
              options={[
                { value: 'actualizado', label: 'Sí, los revisé hace poco' },
                { value: 'desactualizado', label: 'Creo que son antiguos' },
                { value: 'no-se', label: 'No sé si tengo alguno' },
              ]}
            />
          </Question>
        </>
      ) : null}

      {step === 2 ? (
        <>
          <Question
            title="Te llega un SMS de tu banco con un enlace urgente. ¿Qué haces?"
            hint="Es una de las estafas más comunes."
          >
            <ChoiceList
              name="phishing"
              value={answers.phishing}
              onChange={(v) => set('phishing', v)}
              options={[
                { value: 'verifico', label: 'No pulso, entro desde la app oficial' },
                { value: 'a-veces-clico', label: 'Depende, a veces pulso si parece real' },
                { value: 'clico', label: 'Pulso para ver qué ocurre' },
              ]}
            />
          </Question>
          <Question title="¿Envías fotos de tu DNI o documentos por chat o correo?">
            <OftenChoice name="docs" value={answers.docs} onChange={(v) => set('docs', v)} />
          </Question>
          <Question title="¿Te conectas a redes Wi-Fi abiertas?" hint="Cafeterías, aeropuertos, hoteles…">
            <OftenChoice name="wifi" value={answers.wifi} onChange={(v) => set('wifi', v)} />
          </Question>
          <Question title="¿Guardas tu tarjeta en tiendas online?">
            <ChoiceList
              name="payments"
              value={answers.payments}
              onChange={(v) => set('payments', v)}
              options={[
                { value: 'no', label: 'No, pago con móvil o tarjeta virtual' },
                { value: 'algunas', label: 'En algunas tiendas' },
                { value: 'muchas', label: 'En casi todas' },
              ]}
            />
          </Question>
        </>
      ) : null}

      {step === 3 ? (
        <>
          <Question
            title="¿Cuántas horas a la semana usas herramientas de IA?"
            hint="ChatGPT, Gemini, filtros con IA, generadores de imágenes…"
          >
            <ChoiceList
              name="aiHours"
              value={answers.aiHours}
              onChange={(v) => set('aiHours', v)}
              options={[
                { value: 'ninguna', label: 'No las uso' },
                { value: 'menos-2', label: 'Menos de 2 horas' },
                { value: 'de-2-a-7', label: 'Entre 2 y 7 horas' },
                { value: 'mas-7', label: 'Más de 7 horas' },
              ]}
            />
          </Question>
          <Question title="¿Subes fotos personales a herramientas de IA?">
            <ChoiceList
              name="ai"
              value={answers.aiPhotos}
              onChange={(v) => set('aiPhotos', v)}
              options={[
                { value: 'a-menudo', label: 'Sí, a menudo', hint: 'Selfies o fotos de otras personas' },
                { value: 'solo-texto', label: 'Solo texto / No subo fotos', hint: 'Únicamente escribo preguntas' },
              ]}
            />
          </Question>
          <Question
            title="¿Cuentas datos personales a chatbots de IA?"
            hint="Salud, dinero, trabajo o información de otras personas."
          >
            <OftenChoice name="aiData" value={answers.aiData} onChange={(v) => set('aiData', v)} />
          </Question>
          <Question
            title="¿Usas «Iniciar sesión con Google o Facebook» en otras apps?"
            hint="Cada app conectada recibe parte de tus datos de perfil."
          >
            <ChoiceList
              name="socialLogin"
              value={answers.socialLogin}
              onChange={(v) => set('socialLogin', v)}
              options={[
                { value: 'pocas', label: 'En muy pocas o ninguna' },
                { value: 'varias', label: 'En varias' },
                { value: 'muchas', label: 'En casi todas' },
              ]}
            />
          </Question>
          <Question title="¿Cuándo borraste por última vez cuentas que ya no usas?">
            <ChoiceList
              name="oldAccounts"
              value={answers.oldAccounts}
              onChange={(v) => set('oldAccounts', v)}
              options={[
                { value: 'reciente', label: 'Hace menos de un año' },
                { value: 'hace-tiempo', label: 'Hace más de un año' },
                { value: 'nunca', label: 'Nunca lo he hecho' },
              ]}
            />
          </Question>
        </>
      ) : null}

      {step === 4 ? (
        <>
          <Question title="¿Cuándo dejas que las apps usen tu ubicación?">
            <ChoiceList
              name="location"
              value={answers.location}
              onChange={(v) => set('location', v)}
              options={[
                { value: 'siempre', label: 'Siempre', hint: 'También en segundo plano' },
                { value: 'al-usar', label: 'Solo mientras las uso' },
                { value: 'nunca', label: 'Nunca o casi nunca' },
              ]}
            />
          </Question>
          <Question title="¿Mantienes tu móvil actualizado?">
            <ChoiceList
              name="updates"
              value={answers.updates}
              onChange={(v) => set('updates', v)}
              options={[
                { value: 'automaticas', label: 'Sí, actualizaciones automáticas' },
                { value: 'a-veces', label: 'Cuando me acuerdo' },
                { value: 'nunca', label: 'Casi nunca actualizo' },
              ]}
            />
          </Question>
          <Question title="¿Cómo bloqueas la pantalla del móvil?">
            <ChoiceList
              name="screenLock"
              value={answers.screenLock}
              onChange={(v) => set('screenLock', v)}
              options={[
                { value: 'biometria', label: 'Huella o reconocimiento facial' },
                { value: 'pin', label: 'PIN, patrón o contraseña' },
                { value: 'ninguno', label: 'No lo bloqueo' },
              ]}
            />
          </Question>
          <Question title="¿Tienes copia de seguridad del móvil?" hint="En iCloud, Google u otro servicio.">
            <Segmented
              label="Copia de seguridad"
              hideLabel
              name="backup"
              options={[
                { value: 'si', label: 'Sí' },
                { value: 'no', label: 'No' },
              ]}
              value={answers.backup}
              onChange={(v) => set('backup', v)}
            />
          </Question>
        </>
      ) : null}

      {step === 5 ? <ReviewStep answers={answers} onEdit={goTo} /> : null}

      <section aria-labelledby="resultado-title" className="surface mt-8 rounded-3xl p-5">
        <h2 id="resultado-title" className="sr-only">
          {copy(isLast ? 'Resultado final' : 'Resultado provisional')}
        </h2>
        <div className="flex items-center gap-4">
          <ScoreRing score={total} />
          <div role="status" aria-live="polite" aria-atomic="true">
            <p className="text-sm text-muted-foreground">{copy('Tu puntuación')}</p>
            <p className="sr-only">{total} {copy('de 100')}.</p>
            <p className={cn('mt-0.5 font-serif text-[1.75rem] leading-tight', toneStyles[level.tone].text)}>
              {level.label}
            </p>
          </div>
        </div>

        <dl className="mt-5 flex flex-col gap-4">
          {metrics.map((metric) => {
            const tone = toneStyles[getLevel(metric.value).tone]
            return (
              <div key={metric.label}>
                <div className="flex items-baseline justify-between text-sm">
                  <dt className="font-medium">{metric.label}</dt>
                  <dd className="font-semibold tabular-nums">{metric.value}%</dd>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                  <div
                    className={cn('h-full rounded-full transition-[width] duration-500 ease-out', tone.bar)}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            )
          })}
        </dl>
        <p className="mt-4 flex items-start gap-2 border-t border-border/70 pt-4 text-xs leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          {copy('Combina tus respuestas con el análisis automático de filtraciones, sesiones y cuentas inactivas.')}
        </p>
      </section>

      <div className="mt-5 flex gap-2">
        {step > 0 ? (
          <Button variant="outline" size="touch" className="shrink-0" onClick={() => goTo(step - 1)}>
            <ArrowLeft aria-hidden="true" />
            <span className="sr-only">{copy('Paso anterior')}</span>
          </Button>
        ) : null}
        <Button
          size="touch"
          className="flex-1"
          onClick={() => {
            if (!isLast) return goTo(step + 1)
            update((s) => ({ ...s, assessmentDone: true }))
            router.push('/plan')
          }}
        >
          {isLast ? copy('Confirmar y ver mi plan') : `${copy('Siguiente:')} ${copy(STEPS[step + 1].short)}`}
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

function OftenChoice({
  name,
  value,
  onChange,
}: {
  name: string
  value: Answers['geotag']
  onChange: (value: Answers['geotag']) => void
}) {
  return (
    <ChoiceList
      name={name}
      value={value}
      onChange={onChange}
      options={[
        { value: 'nunca', label: 'Nunca' },
        { value: 'a-veces', label: 'A veces' },
        { value: 'a-menudo', label: 'A menudo' },
      ]}
    />
  )
}

function Question({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  const { version, language } = usePrototype()
  const copyQuestion = (text: string) => version === 'v3' ? localize(text, language) : text
  return (
    <fieldset className="mt-7">
      <legend className="text-lg font-semibold tracking-tight text-balance">{copyQuestion(title)}</legend>
      {hint ? <p className="mt-1 text-sm text-muted-foreground">{copyQuestion(hint)}</p> : null}
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </fieldset>
  )
}

function Segmented<V extends string>({
  label,
  hideLabel,
  name,
  options,
  value,
  onChange,
  detected,
}: {
  label: string
  hideLabel?: boolean
  name: string
  options: Option<V>[]
  value: V
  onChange: (value: V) => void
  detected?: string
}) {
  const labelId = `${name}-label`
  const { version, language } = usePrototype()
  const isV3 = version === 'v3'
  const copy = (text: string) => isV3 ? localize(text, language) : text
  return (
    <div role="radiogroup" aria-labelledby={labelId}>
      <div className={cn('mb-2 flex items-center justify-between gap-2', hideLabel && 'sr-only')}>
        <p id={labelId} className="text-[0.9375rem] font-medium">
          {copy(label)}
        </p>
        {detected ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
            <ScanSearch className="size-3" aria-hidden="true" />
            {copy('Detectado:')} {detected}
          </span>
        ) : null}
      </div>
      <div className={cn('grid auto-cols-fr grid-flow-col gap-1 rounded-2xl p-1', isV3 ? 'bg-card ring-1 ring-border' : 'bg-muted')}>
        {options.map((option) => (
          <label
            key={option.value}
            className={cn('relative flex min-h-11 cursor-pointer items-center justify-center rounded-xl px-2 text-sm font-medium transition-all has-checked:font-semibold has-focus-visible:ring-3 has-focus-visible:ring-ring/50', isV3 ? 'text-foreground has-checked:bg-primary has-checked:text-primary-foreground' : 'text-muted-foreground has-checked:bg-card has-checked:text-foreground has-checked:shadow-sm')}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {copy(option.label)}
          </label>
        ))}
      </div>
    </div>
  )
}

function ChoiceList<V extends string>({
  name,
  options,
  value,
  onChange,
}: {
  name: string
  options: Option<V>[]
  value: V
  onChange: (value: V) => void
}) {
  const { version, language } = usePrototype()
  const isV3 = version === 'v3'
  const copy = (text: string) => isV3 ? localize(text, language) : text
  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => (
        <label
          key={option.value}
          className={cn('relative flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 transition-colors has-checked:border-primary has-focus-visible:ring-3 has-focus-visible:ring-ring/50', isV3 ? 'has-checked:bg-primary/10' : 'has-checked:bg-primary/[0.04]')}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-input transition-colors peer-checked:border-primary peer-checked:bg-primary"
          >
            <Check className="size-3.5 text-primary-foreground" strokeWidth={3} />
          </span>
          <span className="flex flex-col">
            <span className="text-[0.9375rem] font-medium">{copy(option.label)}</span>
            {option.hint ? <span className="text-sm text-muted-foreground">{copy(option.hint)}</span> : null}
          </span>
        </label>
      ))}
    </div>
  )
}

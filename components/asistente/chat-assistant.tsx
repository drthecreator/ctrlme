'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ListChecks, Mic, SendHorizontal, Sparkles, Square, Volume2, X } from 'lucide-react'
import { RequireSetup } from '@/components/require-setup'
import { Screen, ScreenHeader } from '@/components/screen'
import {
  computeScore,
  getPendingAccounts,
  getPlan,
  getSuspiciousSessions,
  hasOpenBreach,
  useIdentity,
  type ChatMessage,
  type IdentityState,
} from '@/lib/identity-store'
import { cn } from '@/lib/utils'
import { localize, usePrototypeCopy, usePrototype } from '@/lib/prototype-context'

type Reply = { text: string; actions?: ChatMessage['actions'] }
type VoicePhase = 'idle' | 'listening' | 'thinking' | 'speaking'

const SUGGESTIONS = [
  '¿Cómo puedo subir mi puntuación?',
  '¿Tengo sesiones que no reconozco?',
  '¿Qué hago si me llega un SMS sospechoso?',
  '¿Qué cuentas debería borrar?',
  '¿Es seguro subir fotos a una IA?',
]

const VOICE_PHRASES = [
  '¿Cómo puedo subir mi puntuación?',
  '¿Tengo alguna sesión abierta que no reconozco?',
  '¿Qué hago si me llega un SMS sospechoso del banco?',
]

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

function buildEnglishReply(input: string, state: IdentityState): Reply {
  const text = normalize(input)
  const { total } = computeScore(state)
  const plan = getPlan(state)
  const suspicious = getSuspiciousSessions(state).length
  const pending = getPendingAccounts(state).length

  if (/session|device|unknown|unrecognized/.test(text)) {
    return suspicious > 0
      ? { text: `You have ${suspicious} suspicious session${suspicious === 1 ? '' : 's'} open. I recommend closing ${suspicious === 1 ? 'it' : 'them'} now and changing the password if you do not recognize ${suspicious === 1 ? 'it' : 'them'}.`, actions: [{ label: 'Review sessions', href: '/asistente/sesiones' }] }
      : { text: 'I do not see any suspicious sessions open right now. I will keep monitoring them.' }
  }
  if (/breach|hack|stolen|compromised|alert/.test(text)) {
    return hasOpenBreach(state)
      ? { text: 'Your email appears in a breach you have not resolved yet. Follow the steps: change the affected password, turn on two-step verification, and review your sessions.', actions: [{ label: 'View breach', href: '/alertas' }] }
      : { text: 'You have no unresolved breaches. I will email you if your data appears in a new one.', actions: [{ label: 'View alerts', href: '/alertas' }] }
  }
  if (/two.step|2fa|verification/.test(text)) {
    return { text: 'Two-step verification adds an extra sign-in code, so a stolen password is not enough. Turn it on for your email and bank first; an authenticator app is safer than text messages.', actions: [{ label: 'View guides', href: '/guias' }] }
  }
  if (/password|passphrase|manager/.test(text)) {
    return { text: 'Use a unique, long password for every account. A password manager can remember them for you, so you only need to remember one master password.', actions: [{ label: 'Password guide', href: '/guias' }] }
  }
  if (/text|sms|phishing|scam|link|bank|fraud/.test(text)) {
    return { text: 'Do not tap the link or reply. Banks do not ask for personal information by text. Open the official app to check for a real alert, then report the message to your bank. If you already tapped it, change your password and contact the bank.' }
  }
  if (/account|delete|remove|cleanup|old|inactive/.test(text)) {
    return pending > 0
      ? { text: `We found ${pending} inactive account${pending === 1 ? '' : 's'} in your name. Each one is another place where your data could be exposed, so it is best to delete them.`, actions: [{ label: 'Go to Cleanup', href: '/limpieza' }] }
      : { text: 'You have no inactive accounts waiting to be cleaned up. Great job keeping your footprint up to date.' }
  }
  if (/\bai\b|artificial intelligence|chatgpt|photo|selfie/.test(text)) {
    return { text: 'Be cautious. Anything you upload to an AI tool may be stored and used to train models. Avoid uploading photos of yourself, documents, or other people, and do not share health or financial details.' }
  }
  if (/wi.?fi|cafe|airport|public network/.test(text)) {
    return { text: 'On an open Wi-Fi network, other people may be able to spy on what you send. Use mobile data for banking or shopping; if you have no alternative, a VPN can reduce the risk.' }
  }
  if (/score|improve|level|plan|footprint/.test(text)) {
    const top = plan.slice(0, 3)
    if (!top.length) return { text: `Your score is ${total}/100 and there are no improvements waiting. Keep it up.` }
    return { text: `Your score is ${total}/100. The actions that would help most right now: ${top.map((item, i) => `${i + 1}) ${localize(item.title, 'en')} (+${item.gain})`).join('; ')}.`, actions: [{ label: 'View full plan', href: '/plan' }, { label: 'Your digital footprint', href: '/huella' }] }
  }
  if (/hello|hi|hey|how are you/.test(text)) return { text: `Hello${state.identity.name ? `, ${state.identity.name}` : ''}. How can I help you stay safer online today?` }
  return { text: 'I am not sure I understood. I can help with passwords, breaches, open sessions, old accounts, text message scams, and ways to improve your score.' }
}

function buildReply(input: string, state: IdentityState, language: 'es' | 'en' = 'es'): Reply {
  if (language === 'en') return buildEnglishReply(input, state)
  const text = normalize(input)
  const { total } = computeScore(state)
  const plan = getPlan(state)
  const suspicious = getSuspiciousSessions(state).length
  const pending = getPendingAccounts(state).length

  if (/sesion|dispositivo|desconocid|extran/.test(text)) {
    return suspicious > 0
      ? {
          text: `Sí. Tienes ${suspicious} ${suspicious === 1 ? 'sesión sospechosa abierta' : 'sesiones sospechosas abiertas'} en tus cuentas. Te recomiendo cerrarlas ahora y, si no las reconoces, cambiar también la contraseña.`,
          actions: [{ label: 'Revisar sesiones', href: '/asistente/sesiones' }],
        }
      : { text: 'Ahora mismo no veo sesiones sospechosas abiertas en tus cuentas. Seguiré vigilándolas.' }
  }
  if (/filtra|hack|brecha|robad|comprometid|alerta/.test(text)) {
    return hasOpenBreach(state)
      ? {
          text: 'Tu correo aparece en una filtración que aún no has resuelto. Sigue la lista de pasos: cambia la contraseña afectada, activa la verificación en dos pasos y revisa tus sesiones.',
          actions: [{ label: 'Ver filtración', href: '/alertas' }],
        }
      : {
          text: 'No tienes filtraciones pendientes. Te avisaré por correo si tus datos aparecen en una nueva.',
          actions: [{ label: 'Ver alertas', href: '/alertas' }],
        }
  }
  if (/dos pasos|2fa|verificacion/.test(text)) {
    return {
      text: 'La verificación en dos pasos añade un código extra al iniciar sesión, así que una contraseña robada no basta. Actívala primero en tu correo y en tu banco; usa una app de autenticación mejor que SMS.',
      actions: [{ label: 'Ver guías', href: '/guias' }],
    }
  }
  if (/contrasena|clave|gestor/.test(text)) {
    return {
      text: 'Usa una contraseña distinta y larga para cada cuenta. Un gestor de contraseñas las recuerda por ti, y así solo tienes que memorizar una clave maestra.',
      actions: [{ label: 'Guía de contraseñas', href: '/guias' }],
    }
  }
  if (/sms|phishing|estafa|enlace|banco|fraude/.test(text)) {
    return {
      text: 'No pulses el enlace ni respondas. Los bancos no piden datos por SMS. Entra desde la app oficial para comprobar si hay algún aviso real, y reenvía el mensaje al servicio de reporte de tu banco. Si ya pulsaste, cambia tu contraseña y avisa al banco.',
    }
  }
  if (/cuenta|borrar|eliminar|limpi|antigu|inactiv/.test(text)) {
    return pending > 0
      ? {
          text: `Hemos encontrado ${pending} ${pending === 1 ? 'cuenta inactiva' : 'cuentas inactivas'} a tu nombre. Cada una es un sitio más donde pueden filtrarse tus datos, así que lo mejor es borrarlas.`,
          actions: [{ label: 'Ir a Limpieza', href: '/limpieza' }],
        }
      : { text: 'No tienes cuentas inactivas pendientes. Buen trabajo manteniendo tu huella al día.' }
  }
  if (/\bia\b|inteligencia|chatgpt|foto|selfie/.test(text)) {
    return {
      text: 'Con cautela. Lo que subes a una herramienta de IA puede guardarse y usarse para entrenar modelos. Evita fotos de tu cara, documentos o de otras personas, y no cuentes datos de salud o dinero.',
    }
  }
  if (/wifi|wi-fi|cafeteria|aeropuerto|publica/.test(text)) {
    return {
      text: 'En una red Wi-Fi abierta otras personas pueden espiar lo que envías. Para el banco o las compras usa tus datos móviles; si no queda otra, una VPN reduce el riesgo.',
    }
  }
  if (/puntu|subir|mejor|nivel|plan|huella|score/.test(text)) {
    const top = plan.slice(0, 3)
    if (top.length === 0) {
      return { text: `Tu puntuación es ${total}/100 y no tengo mejoras pendientes. Sigue así.` }
    }
    return {
      text: `Tu puntuación es ${total}/100. Lo que más te ayudaría ahora: ${top
        .map((item, i) => `${i + 1}) ${item.title.toLowerCase()} (+${item.gain})`)
        .join('; ')}.`,
      actions: [
        { label: 'Ver plan completo', href: '/plan' },
        { label: 'Tu huella digital', href: '/huella' },
      ],
    }
  }
  if (/hola|buenas|hey|que tal/.test(text)) {
    return { text: `Hola, ${state.identity.name || 'qué tal'}. ¿En qué te puedo ayudar con tu seguridad hoy?` }
  }
  return {
    text: 'No estoy seguro de haberte entendido bien. Puedo ayudarte con tus contraseñas, filtraciones, sesiones abiertas, cuentas antiguas, estafas por SMS o con cómo subir tu puntuación.',
  }
}

function speak(text: string, onDone: () => void, language: 'es' | 'en' = 'es'): () => void {
  let finished = false
  const finish = () => {
    if (finished) return
    finished = true
    window.clearTimeout(fallback)
    onDone()
  }
  const fallback = window.setTimeout(finish, Math.min(12000, text.length * 75 + 2500))
  const synth = 'speechSynthesis' in window ? window.speechSynthesis : null
  if (synth) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language === 'en' ? 'en-US' : 'es-ES'
    utterance.onend = finish
    utterance.onerror = finish
    synth.cancel()
    synth.speak(utterance)
  }
  return () => {
    finished = true
    window.clearTimeout(fallback)
    synth?.cancel()
  }
}

let messageCounter = 0
const nextId = () => `msg-${Date.now()}-${messageCounter++}`

export function ChatAssistant() {
  const { state, update } = useIdentity()
  const { language, version } = usePrototype()
  const copy = usePrototypeCopy()
  const activeLanguage = version === 'v3' ? language : 'es'
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const [phase, setPhase] = useState<VoicePhase>('idle')
  const [transcript, setTranscript] = useState('')
  const [readingId, setReadingId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])
  const cancelSpeech = useRef<(() => void) | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])

  const stopAll = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
    cancelSpeech.current?.()
    cancelSpeech.current = null
  }, [])

  useEffect(() => stopAll, [stopAll])

  useEffect(() => {
    const node = scrollRef.current
    if (!node) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    node.scrollTo({ top: node.scrollHeight, behavior: reduce ? 'auto' : 'smooth' })
  }, [state.chat.length, typing, phase, transcript])

  const addMessage = useCallback(
    (message: Omit<ChatMessage, 'id'>) => {
      update((s) => ({ ...s, chat: [...s.chat, { ...message, id: nextId() }] }))
    },
    [update],
  )

  if (!state.onboarded) {
    return (
      <Screen>
        <ScreenHeader title="Asistente" subtitle="Pregúntame lo que quieras sobre tu seguridad." />
        <RequireSetup reason="El asistente necesita conocer tu correo para darte consejos sobre tu identidad digital.">
          {null}
        </RequireSetup>
      </Screen>
    )
  }

  const busy = typing || phase !== 'idle'

  const sendText = (raw: string) => {
    const text = raw.trim()
    if (!text || busy) return
    setDraft('')
    addMessage({ role: 'user', text })
    setTyping(true)
    later(() => {
      const reply = buildReply(text, stateRef.current, activeLanguage)
      setTyping(false)
      addMessage({ role: 'assistant', ...reply })
    }, 1100)
  }

  const startVoice = () => {
    if (busy) return
    stopAll()
    setReadingId(null)
    const voicePhrases = activeLanguage === 'en'
      ? ['How can I improve my score?', 'Do I have an open session I do not recognize?', 'What should I do if I get a suspicious text from my bank?']
      : VOICE_PHRASES
    const phrase = voicePhrases[state.chat.filter((m) => m.voice).length % voicePhrases.length]
    const words = phrase.split(' ')
    setTranscript('')
    setPhase('listening')
    words.forEach((_, i) => {
      later(() => setTranscript(words.slice(0, i + 1).join(' ')), 700 + i * 300)
    })
    later(() => {
      addMessage({ role: 'user', text: phrase, voice: true })
      setPhase('thinking')
    }, 700 + words.length * 300 + 700)
    later(
      () => {
        const reply = buildReply(phrase, stateRef.current, activeLanguage)
        addMessage({ role: 'assistant', ...reply, voice: true })
        setPhase('speaking')
        cancelSpeech.current = speak(reply.text, () => {
          cancelSpeech.current = null
          setPhase('idle')
          setTranscript('')
        }, activeLanguage)
      },
      700 + words.length * 300 + 700 + 1300,
    )
  }

  const stopVoice = () => {
    stopAll()
    setPhase('idle')
    setTranscript('')
  }

  const toggleReading = (message: ChatMessage) => {
    if (readingId === message.id) {
      cancelSpeech.current?.()
      cancelSpeech.current = null
      setReadingId(null)
      return
    }
    cancelSpeech.current?.()
    setReadingId(message.id)
    cancelSpeech.current = speak(message.text, () => {
      cancelSpeech.current = null
      setReadingId(null)
    }, activeLanguage)
  }

  const firstName = state.identity.name.trim().split(' ')[0]

  return (
    <div className="mx-auto flex h-full w-full flex-col lg:max-w-3xl">
      <header className="flex items-center gap-2 border-b border-border/70 bg-background px-3 pt-[max(env(safe-area-inset-top),0.75rem)] pb-3">
        <Link
          href="/"
          aria-label={copy('Volver al inicio')}
          className="flex size-11 shrink-0 items-center justify-center rounded-xl text-primary transition-colors hover:bg-muted"
        >
          <ChevronLeft className="size-6" aria-hidden="true" />
        </Link>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Sparkles className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 tabIndex={-1} className="font-serif text-[1.5rem] leading-none tracking-tight">{copy('Asistente')}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
            {copy('En línea')} · {copy('Escribe o habla')}
          </p>
        </div>
        <Link
          href="/asistente/sesiones"
          className="flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm font-medium transition-colors hover:bg-muted"
        >
          <ListChecks className="size-4 text-primary" aria-hidden="true" />
          {copy('Revisión guiada')}
        </Link>
      </header>

      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label={copy('Conversación con el asistente')}
        className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
      >
        <p className="mx-auto w-fit rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
          {copy('Demo: las respuestas son simuladas')}
        </p>
        <AssistantBubble
          message={{
            id: 'intro',
            role: 'assistant',
            text: activeLanguage === 'en'
              ? `Hello${firstName ? `, ${firstName}` : ''}. I am your digital identity assistant. Type to me or tap the microphone to speak, and I can reply out loud if you prefer.`
              : `Hola${firstName ? `, ${firstName}` : ''}. Soy tu asistente de identidad digital. Puedes escribirme o pulsar el micrófono para hablar conmigo, y yo te respondo en voz alta si lo prefieres.`,

          }}
          reading={false}
          onToggleReading={undefined}
        />
        {state.chat.map((message) =>
          message.role === 'user' ? (
            <UserBubble key={message.id} message={message} />
          ) : (
            <AssistantBubble
              key={message.id}
              message={message}
              reading={readingId === message.id}
              onToggleReading={() => toggleReading(message)}
            />
          ),
        )}
        {typing || phase === 'thinking' ? <TypingBubble /> : null}
      </div>

      <div className="border-t border-border/70 bg-card pt-2 pb-3">
        {phase === 'idle' ? (
          <>
            <ul className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2" aria-label={copy('Preguntas sugeridas')}>
              {SUGGESTIONS.map((suggestion) => (
                <li key={suggestion} className="shrink-0">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => sendText(copy(suggestion))}
                    className="min-h-10 rounded-full border border-border bg-background px-3.5 text-sm font-medium whitespace-nowrap transition-colors hover:bg-muted disabled:opacity-50"
                  >
                    {copy(suggestion)}
                  </button>
                </li>
              ))}
            </ul>
            <form
              className="flex items-center gap-2 px-4"
              onSubmit={(event) => {
                event.preventDefault()
                sendText(draft)
              }}
            >
              <label htmlFor="chat-input" className="sr-only">
                {copy('Escribe tu pregunta')}
              </label>
              <input
                id="chat-input"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={copy('Escribe tu pregunta…')}
                autoComplete="off"
                className="min-h-12 min-w-0 flex-1 rounded-full border border-input bg-background px-4 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
              />
              {draft.trim() ? (
                <button
                  type="submit"
                  disabled={busy}
                  aria-label={copy('Enviar mensaje')}
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-50"
                >
                  <SendHorizontal className="size-5" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startVoice}
                  disabled={busy}
                  aria-label={copy('Hablar con el asistente')}
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-50"
                >
                  <Mic className="size-5" aria-hidden="true" />
                </button>
              )}
            </form>
          </>
        ) : (
          <VoicePanel phase={phase} transcript={transcript} onStop={stopVoice} />
        )}
      </div>
    </div>
  )
}

function UserBubble({ message }: { message: ChatMessage }) {
  const copy = usePrototypeCopy()
  return (
    <div className="flex flex-col items-end gap-1">
      <p className="max-w-[85%] rounded-3xl rounded-br-lg bg-primary px-4 py-2.5 text-[0.9375rem] leading-relaxed text-primary-foreground">
        {message.text}
      </p>
      {message.voice ? (
        <span className="flex items-center gap-1 pr-1 text-xs text-muted-foreground">
          <Mic className="size-3" aria-hidden="true" />
          {copy('Mensaje de voz')}
        </span>
      ) : null}
    </div>
  )
}

function AssistantBubble({
  message,
  reading,
  onToggleReading,
}: {
  message: ChatMessage
  reading: boolean
  onToggleReading: (() => void) | undefined
}) {
  const copy = usePrototypeCopy()
  return (
    <div className="flex items-start gap-2">
      <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
        <Sparkles className="size-4" aria-hidden="true" />
      </span>
      <div className="max-w-[85%] space-y-2">
        <div className="surface rounded-3xl rounded-tl-lg px-4 py-3">
          <p className="text-[0.9375rem] leading-relaxed text-pretty">{copy(message.text)}</p>
          {message.actions?.length ? (
            <div className="mt-3 flex flex-col gap-2">
              {message.actions.map((action) => (
                <Link
                  key={action.href + action.label}
                  href={action.href}
                  className="flex min-h-11 items-center justify-between gap-2 rounded-xl bg-secondary px-3.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/70"
                >
                  {copy(action.label)}
                  <ChevronRight className="size-4" aria-hidden="true" />
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        {onToggleReading ? (
          <button
            type="button"
            onClick={onToggleReading}
            className="flex min-h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {reading ? <Square className="size-3.5" aria-hidden="true" /> : <Volume2 className="size-3.5" aria-hidden="true" />}
            {copy(reading ? 'Detener lectura' : 'Escuchar respuesta')}
          </button>
        ) : null}
      </div>
    </div>
  )
}

function TypingBubble() {
  const copy = usePrototypeCopy()
  return (
    <div className="flex items-start gap-2" role="status">
      <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
        <Sparkles className="size-4" aria-hidden="true" />
      </span>
      <div className="surface flex items-center gap-1.5 rounded-3xl rounded-tl-lg px-4 py-4">
        <span className="sr-only">{copy('El asistente está escribiendo')}</span>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            aria-hidden="true"
            className="size-2 animate-bounce rounded-full bg-muted-foreground/60"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

const phaseLabel: Record<Exclude<VoicePhase, 'idle'>, string> = {
  listening: 'Escuchando…',
  thinking: 'Pensando…',
  speaking: 'Respondiendo en voz alta…',
}

function VoicePanel({
  phase,
  transcript,
  onStop,
}: {
  phase: Exclude<VoicePhase, 'idle'>
  transcript: string
  onStop: () => void
}) {
  const copy = usePrototypeCopy()
  const active = phase === 'listening' || phase === 'speaking'
  return (
    <div className="flex items-center gap-3 px-4 py-1">
      <div
        aria-hidden="true"
        className={cn(
          'flex h-14 w-20 shrink-0 items-center justify-center gap-1 rounded-full',
          phase === 'speaking' ? 'bg-secondary text-primary' : 'bg-primary text-primary-foreground',
        )}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn('h-8 w-1 origin-center rounded-full bg-current', active ? 'animate-voice-bar' : 'scale-y-[0.25]')}
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
      <div className="min-w-0 flex-1" role="status" aria-live="polite">
        <p className="text-sm font-semibold">{copy(phaseLabel[phase])}</p>
        <p className="min-h-5 truncate text-sm text-muted-foreground">
          {phase === 'listening' && !transcript ? copy('Habla con normalidad') : transcript ? `«${transcript}»` : ''}
        </p>
      </div>
      <button
        type="button"
        onClick={onStop}
        aria-label={copy(phase === 'speaking' ? 'Detener respuesta' : 'Cancelar mensaje de voz')}
        className="flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted"
      >
        {phase === 'speaking' ? <Square className="size-4" aria-hidden="true" /> : <X className="size-5" aria-hidden="true" />}
      </button>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { CircleAlert, Keyboard, Languages, RotateCcw, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { usePrototype } from '@/lib/prototype-context'
import { cn } from '@/lib/utils'

const sections = ['/', '/limpieza', '/alertas', '/guias', '/perfil']

export function PrototypeVersionSwitch({
  variant = 'surface',
  className,
}: {
  variant?: 'surface' | 'sidebar'
  className?: string
}) {
  const { version, setVersion, language } = usePrototype()
  const isV3 = version === 'v3'
  const label = isV3 && language === 'en' ? 'Prototype' : 'Prototipo'

  if (variant === 'sidebar') {
    return (
      <div
        role="group"
        aria-label={isV3 && language === 'en' ? 'Prototype version' : 'Versión del prototipo'}
        className={cn('rounded-2xl border border-brand-surface-foreground/15 bg-brand-surface-foreground/8 p-2.5', className)}
      >
        <p className="px-1 pb-1.5 text-[11px] font-semibold tracking-widest text-brand-surface-foreground/75 uppercase">
          {label}
        </p>
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-brand-surface-foreground/10 p-1">
          {([
            ['v2', 'v1.0 & v2.0'],
            ['v3', 'v3.0'],
          ] as const).map(([id, text]) => {
            const active = version === id
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => setVersion(id)}
                className={cn(
                  'min-h-9 rounded-lg px-2 text-xs font-semibold transition-colors',
                  active
                    ? 'bg-accent text-accent-foreground shadow-xs'
                    : 'text-brand-surface-foreground/80 hover:bg-brand-surface-foreground/10 hover:text-brand-surface-foreground',
                )}
              >
                {text}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div
      role="group"
      aria-label={isV3 && language === 'en' ? 'Prototype version' : 'Versión del prototipo'}
      className={cn('inline-flex items-center gap-2', className)}
    >
      <span className="text-xs font-semibold text-muted-foreground">{label}:</span>
      <div className="inline-flex items-center rounded-full border border-border bg-muted/70 p-0.5">
        {([
          ['v2', 'v1.0 & v2.0'],
          ['v3', 'v3.0'],
        ] as const).map(([id, text]) => {
          const active = version === id
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => setVersion(id)}
              className={cn(
                'min-h-7 rounded-full px-2.5 text-xs font-semibold whitespace-nowrap transition-colors',
                active
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-foreground/80 hover:text-foreground',
              )}
            >
              {text}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function OnboardingLanguageSwitch({ className }: { className?: string }) {
  const { version, language, setLanguage } = usePrototype()
  if (version !== 'v3') return null

  return (
    <div
      role="group"
      aria-label={language === 'en' ? 'Language' : 'Idioma'}
      className={cn('inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-card p-0.5 shadow-xs', className)}
    >
      <Languages className="ml-1.5 size-3.5 text-muted-foreground" aria-hidden="true" />
      {(['es', 'en'] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          aria-pressed={language === lang}
          onClick={() => setLanguage(lang)}
          className={cn(
            'min-h-7 rounded-full px-2.5 text-xs font-semibold transition-colors',
            language === lang ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted',
          )}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

export function PrototypeMobileBar() {
  return (
    <div className="flex shrink-0 items-center justify-center border-b border-border/70 bg-card/90 px-3 py-1.5 lg:hidden">
      <PrototypeVersionSwitch />
    </div>
  )
}

export function PrototypeShortcutsButton() {
  const { version, language, setShowShortcuts } = usePrototype()
  if (version !== 'v3') return null

  return (
    <button
      type="button"
      onClick={() => setShowShortcuts(true)}
      className="flex min-h-10 w-full items-center gap-2.5 rounded-2xl border border-brand-surface-foreground/15 bg-brand-surface-foreground/6 px-3 text-xs font-semibold text-brand-surface-foreground/90 transition-colors hover:bg-brand-surface-foreground/14 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
    >
      <Keyboard className="size-4 shrink-0 text-accent" aria-hidden="true" />
      <span className="truncate">{language === 'en' ? 'Keyboard shortcuts' : 'Atajos de teclado'}</span>
      <kbd className="ml-auto border-brand-surface-foreground/35 bg-brand-surface-foreground/20 px-1.5 py-0.5 text-[11px] font-bold text-brand-surface-foreground">
        ?
      </kbd>
    </button>
  )
}

export function PrototypeControls() {
  const { version, setVersion, language, showPicker, setShowPicker, showShortcuts, setShowShortcuts } = usePrototype()
  const [networkError, setNetworkError] = useState(false)
  const [retryComplete, setRetryComplete] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!retryComplete) return
    const timer = window.setTimeout(() => setRetryComplete(false), 4000)
    return () => window.clearTimeout(timer)
  }, [retryComplete])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing = !!target?.closest('input, textarea, select, [contenteditable="true"]')
      if (event.key === 'Escape') {
        if (showShortcuts) setShowShortcuts(false)
        else if (showPicker) setShowPicker(false)
        else if (version === 'v3') {
          const dialogs = Array.from(
            document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"], [role="alertdialog"][aria-modal="true"]'),
          )
          const activeDialog = dialogs.at(-1)
          activeDialog
            ?.querySelector<HTMLButtonElement>('button[aria-label="Cerrar"], button[aria-label="Close"], button[id$="-cancel"]')
            ?.click()
        }
        return
      }
      if (version !== 'v3' || typing || event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key === '?' || (event.shiftKey && event.key === '/')) {
        event.preventDefault()
        setShowShortcuts(true)
        return
      }
      const codeMatch = event.code.match(/^(?:Digit|Numpad)([1-5])$/)
      const digit = codeMatch?.[1] ?? (/^[1-5]$/.test(event.key) ? event.key : null)
      if (event.shiftKey && digit) {
        event.preventDefault()
        router.push(sections[Number(digit) - 1])
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [version, pathname, router, showPicker, setShowPicker, showShortcuts, setShowShortcuts])

  useEffect(() => {
    const dialog = showShortcuts
      ? document.querySelector<HTMLElement>('#shortcuts-title')?.closest<HTMLElement>('[role="dialog"]')
      : showPicker
        ? document.querySelector<HTMLElement>('#version-title')?.closest<HTMLElement>('[role="dialog"]')
        : null
    if (!dialog) return
    const previousFocus = document.activeElement as HTMLElement | null
    const getFocusable = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )
    getFocusable()[0]?.focus()
    const trapTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const items = getFocusable()
      if (items.length === 0) {
        event.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    dialog.addEventListener('keydown', trapTab)
    return () => {
      dialog.removeEventListener('keydown', trapTab)
      if (previousFocus?.isConnected) previousFocus.focus()
    }
  }, [showPicker, showShortcuts])

  const isEn = version === 'v3' && language === 'en'

  return (
    <>
      {networkError ? (
        <div
          role="alert"
          className="fixed top-3 left-1/2 z-50 flex w-[min(28rem,calc(100vw-1.5rem))] -translate-x-1/2 items-start gap-3 rounded-2xl border-2 border-destructive bg-destructive-soft p-4 text-destructive shadow-xl"
        >
          <CircleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{isEn ? 'Connection problem' : 'Problema de conexión'}</p>
            <p className="mt-0.5 text-sm">
              {isEn
                ? 'We could not refresh your data. Check your connection and try again.'
                : 'No se pudieron actualizar tus datos. Comprueba la conexión e inténtalo de nuevo.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setNetworkError(false)
                setRetryComplete(true)
              }}
              className="mt-2 inline-flex min-h-10 items-center gap-2 rounded-xl border border-destructive bg-card px-3 text-sm font-semibold text-destructive hover:bg-destructive-soft"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              {isEn ? 'Retry' : 'Reintentar'}
            </button>
          </div>
          <button
            type="button"
            aria-label={isEn ? 'Dismiss alert' : 'Cerrar aviso'}
            onClick={() => setNetworkError(false)}
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-destructive bg-card text-destructive hover:bg-destructive-soft"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      {retryComplete ? (
        <p
          role="status"
          className="fixed top-3 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-success bg-success-soft px-4 py-2 text-sm font-semibold text-success shadow-lg"
        >
          {isEn ? 'Connection restored.' : 'Conexión restablecida.'}
        </p>
      ) : null}

      {showPicker ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/45 p-5"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowPicker(false)
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="version-title"
            className="w-full max-w-md rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-2xl"
          >
            <h2 id="version-title" className="font-serif text-3xl">
              {isEn ? 'Choose a prototype version' : 'Elige una versión del prototipo'}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {isEn
                ? 'Compare the original experience with the Ctrl+Me v3.0 prototype. You can change versions anytime on the welcome screen.'
                : 'Compara la experiencia original con las mejoras del prototipo v3.0. Puedes cambiar de versión en cualquier momento desde la pantalla de bienvenida.'}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setVersion('v2')
                  setShowPicker(false)
                }}
                className="flex min-h-16 flex-col justify-center rounded-2xl border border-border bg-background px-4 py-3 text-left transition-colors hover:bg-muted"
              >
                <span className="font-semibold">{isEn ? 'Prototype v1.0 & v2.0' : 'Prototipo v1.0 & v2.0'}</span>
                <span className="mt-0.5 text-xs text-muted-foreground">
                  {isEn ? 'Original baseline prototype' : 'Versión base original'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setVersion('v3')
                  setShowPicker(false)
                }}
                className="flex min-h-16 flex-col justify-center rounded-2xl bg-primary px-4 py-3 text-left text-primary-foreground transition-opacity hover:opacity-90"
              >
                <span className="font-semibold">{isEn ? 'Prototype v3.0' : 'Prototipo v3.0'}</span>
                <span className="mt-0.5 text-xs opacity-85">
                  {isEn
                    ? 'Usability, accessibility, bilingual ES/EN, dark mode & high contrast'
                    : 'Mejoras de usabilidad, accesibilidad, idioma ES/EN, modo oscuro y alto contraste'}
                </span>
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {showShortcuts ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/45 p-5"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowShortcuts(false)
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-title"
            className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-widest text-primary uppercase">Ctrl+Me v3.0</p>
                <h2 id="shortcuts-title" className="mt-1 font-serif text-3xl">
                  {isEn ? 'Keyboard shortcuts' : 'Atajos de teclado'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowShortcuts(false)}
                aria-label={isEn ? 'Close' : 'Cerrar'}
                className="flex size-10 items-center justify-center rounded-full border border-border bg-muted text-foreground hover:bg-border"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <h3 className="mt-6 text-sm font-semibold">{isEn ? 'Quick shortcuts' : 'Atajos rápidos'}</h3>
            <dl className="mt-2 grid grid-cols-[1fr_auto] items-center gap-2 text-sm">
              <dt>{isEn ? 'Home / Cleanup / Alerts / Guides / Profile' : 'Principal / Limpieza / Alertas / Guías / Mi perfil'}</dt>
              <dd>
                <kbd>Shift+1…5</kbd>
              </dd>
              <dt>{isEn ? 'Open this guide' : 'Abrir esta guía'}</dt>
              <dd>
                <kbd>?</kbd>
              </dd>
              <dt>{isEn ? 'Close window' : 'Cerrar ventana'}</dt>
              <dd>
                <kbd>Esc</kbd>
              </dd>
            </dl>
            <h3 className="mt-6 text-sm font-semibold">{isEn ? 'Standard navigation' : 'Navegación estándar'}</h3>
            <dl className="mt-2 grid grid-cols-[1fr_auto] items-center gap-2 text-sm">
              <dt>{isEn ? 'Move through controls' : 'Avanzar por controles'}</dt>
              <dd>
                <kbd>Tab</kbd>
              </dd>
              <dt>{isEn ? 'Move backwards' : 'Retroceder'}</dt>
              <dd>
                <kbd>Shift+Tab</kbd>
              </dd>
              <dt>{isEn ? 'Activate' : 'Activar'}</dt>
              <dd>
                <kbd>Enter</kbd> / <kbd>{isEn ? 'Space' : 'Espacio'}</kbd>
              </dd>
            </dl>
            <button
              type="button"
              onClick={() => {
                setShowShortcuts(false)
                setRetryComplete(false)
                setNetworkError(true)
              }}
              className="mt-6 min-h-10 rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-muted"
            >
              {isEn ? 'Test connection alert' : 'Probar aviso de conexión'}
            </button>
          </section>
        </div>
      ) : null}
    </>
  )
}

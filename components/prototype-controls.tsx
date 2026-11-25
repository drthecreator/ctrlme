'use client'

import { useEffect, useState } from 'react'
import { CircleAlert, Keyboard, Languages, RotateCcw, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { usePrototype } from '@/lib/prototype-context'
import { cn } from '@/lib/utils'

const sections = ['/', '/limpieza', '/alertas', '/guias', '/perfil']

export function PrototypeControls() {
  const { version, setVersion, language, setLanguage, ready } = usePrototype()
  const [showPicker, setShowPicker] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [networkError, setNetworkError] = useState(false)
  const [retryComplete, setRetryComplete] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (ready && !localStorage.getItem('ctrlme-prototype-settings-v3')) setShowPicker(true)
  }, [ready])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing = !!target?.closest('input, textarea, select, [contenteditable="true"]')
      if (event.key === 'Escape') {
        if (showShortcuts) setShowShortcuts(false)
        else if (showPicker) setShowPicker(false)
        else {
          if (version === 'v3') {
            const dialogs = Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"], [role="alertdialog"][aria-modal="true"]'))
            const activeDialog = dialogs.at(-1)
            activeDialog?.querySelector<HTMLButtonElement>('button[aria-label="Cerrar"], button[aria-label="Close"], button[id$="-cancel"]')?.click()
          }
        }
        return
      }
      if (version !== 'v3' || typing || event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key === '?' || (event.shiftKey && event.key === '/')) {
        event.preventDefault()
        setShowShortcuts(true)
      } else if (event.shiftKey && /^[1-5]$/.test(event.key)) {
        event.preventDefault()
        router.push(sections[Number(event.key) - 1])
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [version, pathname, router, showPicker, showShortcuts])

  useEffect(() => {
    const dialog = showShortcuts
      ? document.querySelector<HTMLElement>('#shortcuts-title')?.closest<HTMLElement>('[role="dialog"]')
      : showPicker
        ? document.querySelector<HTMLElement>('#version-title')?.closest<HTMLElement>('[role="dialog"]')
        : null
    if (!dialog) return
    const previousFocus = document.activeElement as HTMLElement | null
    const getFocusable = () => Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
    getFocusable()[0]?.focus()
    const trapTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const items = getFocusable()
      if (items.length === 0) { event.preventDefault(); return }
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    dialog.addEventListener('keydown', trapTab)
    return () => {
      dialog.removeEventListener('keydown', trapTab)
      if (previousFocus?.isConnected) previousFocus.focus()
    }
  }, [showPicker, showShortcuts])

  return (
    <>
      <div className="prototype-tools" aria-label={language === 'en' ? 'Prototype settings' : 'Ajustes del prototipo'}>
        {pathname === '/' && version === 'v3' ? (
          <div className="flex items-center gap-1 rounded-full border border-border bg-card/95 p-1 shadow-sm" aria-label={language === 'en' ? 'Language' : 'Idioma'}>
            <Languages className="ml-1 size-4 text-muted-foreground" aria-hidden="true" />
            {(['es', 'en'] as const).map((lang) => (
              <button key={lang} type="button" aria-pressed={language === lang} onClick={() => setLanguage(lang)} className={cn('min-h-8 rounded-full px-2.5 text-xs font-semibold', language === lang ? 'bg-primary text-primary-foreground' : 'text-foreground')}>
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        ) : null}
        <button type="button" onClick={() => setShowPicker(true)} className="rounded-full border border-border bg-card/95 px-3 py-2 text-xs font-semibold shadow-sm" aria-label={language === 'en' ? 'Change prototype version' : 'Cambiar versión del prototipo'}>
          {version === 'v2' ? 'v1.0 & v2.0' : 'v3.0'}
        </button>
        {version === 'v3' ? <button type="button" onClick={() => setShowShortcuts(true)} className="flex size-9 items-center justify-center rounded-full border border-border bg-card/95 shadow-sm" aria-label={language === 'en' ? 'Keyboard shortcuts' : 'Atajos de teclado'}><Keyboard className="size-4" aria-hidden="true" /></button> : null}
      </div>

      {networkError ? (
        <div role="alert" className="fixed top-16 right-3 z-40 flex max-w-[min(26rem,calc(100vw-1.5rem))] items-start gap-3 rounded-2xl border-2 border-destructive bg-destructive-soft p-4 text-destructive shadow-lg">
          <CircleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{language === 'en' ? 'Connection problem' : 'Problema de conexión'}</p>
            <p className="mt-0.5 text-sm">{language === 'en' ? 'We could not refresh your data. Check your connection and try again.' : 'No se pudieron actualizar tus datos. Comprueba la conexión e inténtalo de nuevo.'}</p>
            <button type="button" onClick={() => { setNetworkError(false); setRetryComplete(true) }} className="mt-2 inline-flex min-h-10 items-center gap-2 rounded-xl border border-destructive bg-card px-3 text-sm font-semibold text-destructive hover:bg-destructive-soft">
              <RotateCcw className="size-4" aria-hidden="true" />{language === 'en' ? 'Retry' : 'Reintentar'}
            </button>
          </div>
          <button type="button" aria-label={language === 'en' ? 'Dismiss alert' : 'Cerrar aviso'} onClick={() => setNetworkError(false)} className="flex size-9 shrink-0 items-center justify-center rounded-full border border-destructive bg-card text-destructive hover:bg-destructive-soft"><X aria-hidden="true" /></button>
        </div>
      ) : null}
      {retryComplete ? <p role="status" className="fixed top-16 right-3 z-40 rounded-xl border border-success bg-success-soft px-3 py-2 text-sm font-medium text-success">{language === 'en' ? 'Connection restored.' : 'Conexión restablecida.'}</p> : null}

      {showPicker ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/45 p-5" role="presentation">
        <section role="dialog" aria-modal="true" aria-labelledby="version-title" className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
          <h2 id="version-title" className="font-serif text-3xl">{language === 'en' ? 'Choose a version' : 'Elige una versión'}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{language === 'en' ? 'Compare the current experience with the Ctrl+Me v3.0 prototype.' : 'Compara la experiencia actual con las mejoras del prototipo v3.0.'}</p>
          <div className="mt-6 flex flex-col gap-3">
            <button type="button" onClick={() => { setVersion('v2'); setShowPicker(false) }} className="min-h-14 rounded-2xl border border-border px-4 text-left font-semibold hover:bg-muted">{language === 'en' ? 'Prototype v1.0 & v2.0' : 'Prototipo v1.0 & v2.0'}</button>
            <button type="button" onClick={() => { setVersion('v3'); setShowPicker(false) }} className="min-h-14 rounded-2xl bg-primary px-4 text-left font-semibold text-primary-foreground hover:opacity-90">{language === 'en' ? 'Prototype v3.0' : 'Prototipo v3.0'}</button>
          </div>
          {version === 'v3' ? <button type="button" onClick={() => setShowPicker(false)} className="mt-4 min-h-11 w-full rounded-xl text-sm font-medium text-muted-foreground">{language === 'en' ? 'Continue with v3.0' : 'Continuar en v3.0'}</button> : null}
        </section>
      </div> : null}

      {showShortcuts ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/45 p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowShortcuts(false) }}>
        <section role="dialog" aria-modal="true" aria-labelledby="shortcuts-title" className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl">
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-primary">Ctrl+Me v3.0</p><h2 id="shortcuts-title" className="mt-1 font-serif text-3xl">{language === 'en' ? 'Keyboard shortcuts' : 'Atajos de teclado'}</h2></div><button type="button" onClick={() => setShowShortcuts(false)} aria-label={language === 'en' ? 'Close' : 'Cerrar'} className="flex size-10 items-center justify-center rounded-full border border-border bg-muted text-foreground"><X aria-hidden="true" /></button></div>
          <h3 className="mt-6 text-sm font-semibold">{language === 'en' ? 'Quick shortcuts' : 'Atajos rápidos'}</h3>
          <dl className="mt-2 grid grid-cols-[1fr_auto] gap-2 text-sm"><dt>{language === 'en' ? 'Home / Cleanup / Alerts / Guides / Profile' : 'Principal / Limpieza / Alertas / Guías / Mi perfil'}</dt><dd><kbd>Shift+1…5</kbd></dd><dt>{language === 'en' ? 'Open this guide' : 'Abrir esta guía'}</dt><dd><kbd>?</kbd></dd><dt>{language === 'en' ? 'Close window' : 'Cerrar ventana'}</dt><dd><kbd>Esc</kbd></dd></dl>
          <h3 className="mt-6 text-sm font-semibold">{language === 'en' ? 'Standard navigation' : 'Navegación estándar'}</h3>
          <dl className="mt-2 grid grid-cols-[1fr_auto] gap-2 text-sm"><dt>{language === 'en' ? 'Move through controls' : 'Avanzar por controles'}</dt><dd><kbd>Tab</kbd></dd><dt>{language === 'en' ? 'Move backwards' : 'Retroceder'}</dt><dd><kbd>Shift+Tab</kbd></dd><dt>{language === 'en' ? 'Activate' : 'Activar'}</dt><dd><kbd>Enter</kbd> / <kbd>{language === 'en' ? 'Space' : 'Espacio'}</kbd></dd></dl>
          <button type="button" onClick={() => { setShowShortcuts(false); setRetryComplete(false); setNetworkError(true) }} className="mt-6 min-h-10 rounded-xl border border-border px-3 text-sm font-medium text-muted-foreground hover:bg-muted">{language === 'en' ? 'Test connection alert' : 'Probar aviso de conexión'}</button>
        </section>
      </div> : null}
    </>
  )
}

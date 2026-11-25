'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type PrototypeVersion = 'v2' | 'v3'
type Language = 'es' | 'en'
type Theme = 'light' | 'dark'
type Contrast = 'normal' | 'high'
type PrototypeSettings = { version: PrototypeVersion; language: Language; theme: Theme; contrast: Contrast; fontScale: 100 | 125 | 150 }
type PrototypeContextValue = PrototypeSettings & {
  ready: boolean
  setVersion: (version: PrototypeVersion) => void
  setLanguage: (language: Language) => void
  setTheme: (theme: Theme) => void
  setContrast: (contrast: Contrast) => void
  setFontScale: (scale: 100 | 125 | 150) => void
}

const defaults: PrototypeSettings = { version: 'v2', language: 'es', theme: 'light', contrast: 'normal', fontScale: 100 }
const PrototypeContext = createContext<PrototypeContextValue | null>(null)

export function PrototypeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(defaults)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('ctrlme-prototype-settings-v3')
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PrototypeSettings>
        setSettings({ ...defaults, ...parsed })
      }
    } catch {
      localStorage.removeItem('ctrlme-prototype-settings-v3')
    } finally {
      setReady(true)
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem('ctrlme-prototype-settings-v3', JSON.stringify(settings))
    document.documentElement.dataset.version = settings.version
    document.documentElement.dataset.theme = settings.theme
    document.documentElement.dataset.contrast = settings.contrast
    document.documentElement.lang = settings.language
    document.documentElement.style.setProperty('--prototype-font-scale', `${settings.fontScale / 100}`)
  }, [ready, settings])

  const change = useCallback(<K extends keyof PrototypeSettings>(key: K, value: PrototypeSettings[K]) => {
    setSettings((current) => ({ ...current, [key]: value }))
  }, [])

  const value = useMemo<PrototypeContextValue>(() => ({
    ...settings,
    ready,
    setVersion: (version) => change('version', version),
    setLanguage: (language) => change('language', language),
    setTheme: (theme) => change('theme', theme),
    setContrast: (contrast) => change('contrast', contrast),
    setFontScale: (fontScale) => change('fontScale', fontScale),
  }), [settings, ready, change])

  return <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>
}

export function usePrototype() {
  const context = useContext(PrototypeContext)
  if (!context) throw new Error('usePrototype must be used within PrototypeProvider')
  return context
}

export const useIsV3 = () => usePrototype().version === 'v3'

export const messages = {
  es: {
    'Tu resumen': 'Tu resumen', 'Tu puntuación': 'Tu puntuación', 'Ver mi huella digital': 'Ver mi huella digital',
    'Plan para subir': 'Mejora tu puntuación', 'Guías rápidas': 'Guías', 'Aprende en 1 minuto': 'Aprende en 1 minuto',
    'Atajos de teclado': 'Atajos de teclado', 'Pendientes': 'Pendientes', 'Completadas': 'Completadas', 'Todas': 'Todas',
    'Mayor impacto': 'Mayor impacto', 'Menor impacto': 'Menor impacto', 'Guardado automático': 'Guardado automático',
    'Tu identidad digital': 'Tu identidad digital', 'Así está hoy tu identidad digital.': 'Así está hoy tu identidad digital.',
    'Cuanto más alta sea la puntuación, mejor protegida está tu identidad.': 'Cuanto más alta sea la puntuación, mejor protegida está tu identidad.',
    'Protección escasa': 'Protección escasa', 'Protección media': 'Protección media', 'Protección excelente': 'Protección excelente',
    'de 100': 'de 100', 'Ver cómo se calcula': 'Ver cómo se calcula', 'Afinar con la evaluación (4 min)': 'Afinar con la evaluación (4 min)',
    'Habla con el asistente': 'Habla con el asistente', 'Escribe o usa tu voz para resolver dudas': 'Escribe o usa tu voz para resolver dudas',
    'Mi círculo': 'Mi círculo', 'Ayuda a quien te lo pida': 'Ayuda a quien te lo pida', 'Mejora tu puntuación': 'Mejora tu puntuación', 'Vigilando': 'Vigilando', 'y': 'y', 'más': 'más',
    'Acción recomendada': 'Acción recomendada', 'Siguiente paso': 'Siguiente paso', 'Todo en orden': 'Todo en orden',
    'sesión sospechosa': 'sesión sospechosa', 'sesiones sospechosas': 'sesiones sospechosas',
    'Dispositivos que no reconocemos siguen conectados a tu cuenta de Google.': 'Dispositivos que no reconocemos siguen conectados a tu cuenta de Google.',
    'Filtración en': 'Filtración en', 'Tu contraseña antigua aparece en una base de datos filtrada.': 'Tu contraseña antigua aparece en una base de datos filtrada.',
    'Ver plan': 'Ver plan', 'Tu identidad está protegida': 'Tu identidad está protegida',
    'Seguiremos vigilando y te avisaremos si detectamos algo nuevo.': 'Seguiremos vigilando y te avisaremos si detectamos algo nuevo.',
    'Ver tu huella digital': 'Ver tu huella digital', 'persona': 'persona', 'personas': 'personas', 'solicitud nueva': 'solicitud nueva', 'solicitudes nuevas': 'solicitudes nuevas',
    'Resolver con asistente': 'Resolver con asistente', 'Ver qué hacer': 'Ver qué hacer',
  },
  en: {
    'Tu resumen': 'Your overview', 'Tu puntuación': 'Your score', 'Ver mi huella digital': 'View my digital footprint',
    'Plan para subir': 'Improve your score', 'Guías rápidas': 'Guides', 'Aprende en 1 minuto': 'Learn in 1 minute',
    'Atajos de teclado': 'Keyboard shortcuts', 'Pendientes': 'Pending', 'Completadas': 'Completed', 'Todas': 'All',
    'Mayor impacto': 'Highest impact', 'Menor impacto': 'Lowest impact', 'Guardado automático': 'Saved automatically',
    'Tu identidad digital': 'Your digital identity', 'Así está hoy tu identidad digital.': 'Your digital identity today.',
    'Cuanto más alta sea la puntuación, mejor protegida está tu identidad.': 'A higher score means your identity is better protected.',
    'Protección escasa': 'Low protection', 'Protección media': 'Moderate protection', 'Protección excelente': 'Excellent protection',
    'de 100': 'out of 100', 'Ver cómo se calcula': 'See how it is calculated', 'Afinar con la evaluación (4 min)': 'Refine with the assessment (4 min)',
    'Habla con el asistente': 'Talk to the assistant', 'Escribe o usa tu voz para resolver dudas': 'Type or use your voice to ask a question',
    'Mi círculo': 'My circle', 'Ayuda a quien te lo pida': 'Help someone who asks', 'Mejora tu puntuación': 'Improve your score', 'Vigilando': 'Monitoring', 'y': 'and', 'más': 'more',
    'Acción recomendada': 'Recommended action', 'Siguiente paso': 'Next step', 'Todo en orden': 'All clear',
    'sesión sospechosa': 'suspicious session', 'sesiones sospechosas': 'suspicious sessions',
    'Dispositivos que no reconocemos siguen conectados a tu cuenta de Google.': 'Unrecognized devices are still connected to your Google account.',
    'Filtración en': 'Breach at', 'Tu contraseña antigua aparece en una base de datos filtrada.': 'Your old password appears in a breached database.',
    'Ver plan': 'View plan', 'Tu identidad está protegida': 'Your identity is protected',
    'Seguiremos vigilando y te avisaremos si detectamos algo nuevo.': 'We will keep monitoring and let you know if we detect anything new.',
    'Ver tu huella digital': 'View your digital footprint', 'persona': 'person', 'personas': 'people', 'solicitud nueva': 'new request', 'solicitudes nuevas': 'new requests',
    'Resolver con asistente': 'Resolve with assistant', 'Ver qué hacer': 'See what to do',
  },
} as const

export function t(key: keyof typeof messages.es, language: Language) {
  return messages[language][key]
}

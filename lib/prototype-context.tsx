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

const englishText: Record<string, string> = {
  'Guardado automático': 'Saved automatically', 'Paso': 'Step', 'de': 'of',
  'Redes y perfiles': 'Social networks and profiles', 'Redes': 'Networks',
  'Contraseñas y accesos': 'Passwords and access', 'Accesos': 'Access',
  'Hábitos y engaños': 'Habits and scams', 'Hábitos': 'Habits',
  'IA y datos compartidos': 'AI and shared data', 'IA y datos': 'AI and data',
  'Dispositivo y permisos': 'Device and permissions', 'Dispositivo': 'Device',
  'Revisar respuestas': 'Review answers', 'Revisar': 'Review',
  'Progreso de la evaluación': 'Assessment progress',
  'Hemos rellenado algunas respuestas con lo que encontró el análisis. Corrígelas si no son exactas.': 'We filled in some answers based on the scan. Correct them if they are not accurate.',
  '¿Qué redes utilizas habitualmente?': 'Which social networks do you use regularly?',
  'No la uso': 'I do not use it', 'Ocasional': 'Occasionally', 'Diario': 'Daily',
  '¿Y otras redes como Facebook, X, LinkedIn o Snapchat?': 'What about other networks like Facebook, X, LinkedIn, or Snapchat?',
  'Ninguna más': 'None', 'Una o dos': 'One or two', 'Tres o más': 'Three or more',
  'Cada perfil es un sitio más donde exponerte': 'Each profile is another place where your information is exposed',
  '¿Cuántas publicaciones tienes, más o menos?': 'About how many posts do you have?',
  'Suma fotos, vídeos, historias destacadas y comentarios en todas tus redes.': 'Count photos, videos, highlights, and comments across all your networks.',
  'Menos de 50': 'Fewer than 50', 'Entre 50 y 300': 'Between 50 and 300', 'Más de 300': 'More than 300',
  'Revisarlas una a una es mucho trabajo': 'Reviewing them one by one takes a lot of work',
  '¿Tu perfil de Instagram es público?': 'Is your Instagram profile public?', 'Visibilidad del perfil': 'Profile visibility',
  'Público': 'Public', 'Privado': 'Private', '¿Cuántos datos reales muestran tus perfiles?': 'How much real-world information do your profiles reveal?',
  'Nombre completo, ciudad, trabajo, colegio o universidad, pareja…': 'Full name, city, job, school or university, partner…',
  'Casi ninguno': 'Almost none', 'Uso un apodo o solo mi nombre': 'I use a nickname or just my first name',
  'Algunos': 'Some', 'Mi nombre y poco más': 'My name and little else', 'Casi todos': 'Almost everything',
  'Cualquiera podría saber dónde vivo o trabajo': 'Anyone could find out where I live or work',
  '¿Publicas fotos o historias con ubicación?': 'Do you post photos or stories with your location?',
  'Nunca': 'Never', 'A veces': 'Sometimes', 'A menudo': 'Often',
  '¿Repites contraseñas entre cuentas?': 'Do you reuse passwords across accounts?', 'En algunas': 'For some',
  'Cada cuenta tiene la suya': 'Every account has its own password', 'Uso 2 o 3 claves para todo': 'I use two or three passwords for everything',
  'En casi todas': 'For almost all', 'Tengo una clave principal': 'I have one main password',
  '¿Usas un gestor de contraseñas?': 'Do you use a password manager?', 'Gestor de contraseñas': 'Password manager',
  'Sí': 'Yes', 'No': 'No', '¿Tienes activada la verificación en dos pasos?': 'Do you have two-step verification enabled?',
  'Un código extra al iniciar sesión, por SMS o app.': 'An extra sign-in code, by text message or app.',
  'En todas mis cuentas importantes': 'On all my important accounts', 'Solo en algunas': 'Only on some',
  'En ninguna / No sé qué es': 'On none / I do not know what it is',
  '¿Tu correo y teléfono de recuperación están al día?': 'Are your recovery email and phone number up to date?',
  'Son lo que usas para recuperar una cuenta si te la roban o olvidas la clave.': 'You use them to recover an account if it is stolen or you forget your password.',
  'Sí, los revisé hace poco': 'Yes, I checked them recently', 'Creo que son antiguos': 'I think they are outdated', 'No sé si tengo alguno': 'I do not know if I have one',
  'Te llega un SMS de tu banco con un enlace urgente. ¿Qué haces?': 'You receive an urgent text from your bank with a link. What do you do?',
  'Es una de las estafas más comunes.': 'This is one of the most common scams.',
  'No pulso, entro desde la app oficial': 'I do not tap it; I open the official app',
  'Depende, a veces pulso si parece real': 'It depends; sometimes I tap if it looks real', 'Pulso para ver qué ocurre': 'I tap to see what happens',
  '¿Envías fotos de tu DNI o documentos por chat o correo?': 'Do you send ID photos or documents over chat or email?',
  '¿Te conectas a redes Wi-Fi abiertas?': 'Do you connect to open Wi-Fi networks?', 'Cafeterías, aeropuertos, hoteles…': 'Cafes, airports, hotels…',
  '¿Guardas tu tarjeta en tiendas online?': 'Do you save your card details in online stores?',
  'No, pago con móvil o tarjeta virtual': 'No, I use mobile pay or a virtual card', 'En algunas tiendas': 'In some stores',
  '¿Cuántas horas a la semana usas herramientas de IA?': 'How many hours per week do you use AI tools?',
  'ChatGPT, Gemini, filtros con IA, generadores de imágenes…': 'ChatGPT, Gemini, AI filters, image generators…',
  'No las uso': 'I do not use them', 'Menos de 2 horas': 'Fewer than 2 hours', 'Entre 2 y 7 horas': 'Between 2 and 7 hours', 'Más de 7 horas': 'More than 7 hours',
  '¿Subes fotos personales a herramientas de IA?': 'Do you upload personal photos to AI tools?',
  'Sí, a menudo': 'Yes, often', 'Selfies o fotos de otras personas': 'Selfies or photos of other people',
  'Solo texto / No subo fotos': 'Text only / I do not upload photos', 'Únicamente escribo preguntas': 'I only type questions',
  '¿Cuentas datos personales a chatbots de IA?': 'Do you share personal information with AI chatbots?',
  'Salud, dinero, trabajo o información de otras personas.': 'Health, money, work, or information about other people.',
  '¿Usas «Iniciar sesión con Google o Facebook» en otras apps?': 'Do you use “Sign in with Google or Facebook” in other apps?',
  'Cada app conectada recibe parte de tus datos de perfil.': 'Each connected app gets some of your profile information.',
  'En muy pocas o ninguna': 'In very few or none', 'En varias': 'In several',
  '¿Cuándo borraste por última vez cuentas que ya no usas?': 'When did you last delete accounts you no longer use?',
  'Hace menos de un año': 'Less than a year ago', 'Hace más de un año': 'More than a year ago', 'Nunca lo he hecho': 'I have never done it',
  '¿Cuándo dejas que las apps usen tu ubicación?': 'When do you allow apps to use your location?', 'Siempre': 'Always',
  'También en segundo plano': 'Even in the background', 'Solo mientras las uso': 'Only while using them', 'Nunca o casi nunca': 'Never or almost never',
  '¿Mantienes tu móvil actualizado?': 'Do you keep your phone up to date?', 'Sí, actualizaciones automáticas': 'Yes, automatic updates', 'Cuando me acuerdo': 'When I remember', 'Casi nunca actualizo': 'I rarely update',
  '¿Cómo bloqueas la pantalla del móvil?': 'How do you lock your phone screen?', 'Huella o reconocimiento facial': 'Fingerprint or face recognition',
  'PIN, patrón o contraseña': 'PIN, pattern, or password', 'No lo bloqueo': 'I do not lock it',
  '¿Tienes copia de seguridad del móvil?': 'Do you back up your phone?', 'En iCloud, Google u otro servicio.': 'With iCloud, Google, or another service.', 'Copia de seguridad': 'Backup',
  'Resultado final': 'Final result', 'Resultado provisional': 'Provisional result', 'Tu puntuación': 'Your score', 'de 100': 'out of 100',
  'Combina tus respuestas con el análisis automático de filtraciones, sesiones y cuentas inactivas.': 'Your answers are combined with the automatic scan for breaches, sessions, and inactive accounts.',
  'Paso anterior': 'Previous step', 'Confirmar y ver mi plan': 'Confirm and view my plan', 'Siguiente:': 'Next:',
  'Comprueba tus respuestas antes de calcular la puntuación. Puedes cambiar cualquier apartado.': 'Review your answers before calculating your score. You can change any section.',
  'Editar': 'Edit', 'Detectado:': 'Detected:',
  'Instagram': 'Instagram', 'TikTok': 'TikTok', 'Otras redes': 'Other networks',
  'Publicaciones': 'Posts', 'Perfil de Instagram': 'Instagram profile', 'Datos reales': 'Real-world information',
  'Fotos con ubicación': 'Photos with location', 'Contraseñas repetidas': 'Reused passwords',
  'Verificación en dos pasos': 'Two-step verification',
  'Recuperación': 'Recovery details', 'SMS urgente del banco': 'Urgent bank text', 'DNI por chat o correo': 'ID by chat or email',
  'Wi-Fi abiertas': 'Open Wi-Fi', 'Tarjeta en tiendas': 'Card details in stores', 'Horas de IA por semana': 'AI hours per week',
  'Fotos personales a IA': 'Personal photos uploaded to AI', 'Datos personales a chatbots': 'Personal data shared with chatbots',
  'Acceso con Google o Facebook': 'Sign-in with Google or Facebook', 'Última limpieza de cuentas': 'Last account cleanup',
  'Ubicación': 'Location', 'Actualizaciones': 'Updates', 'Bloqueo de pantalla': 'Screen lock',
  'En todas': 'On all', 'Al día': 'Up to date', 'Antigua': 'Outdated', 'No lo sé': 'I do not know',
  'Entro desde la app': 'I open the app', 'A veces pulso': 'I sometimes tap', 'Pulso el enlace': 'I tap the link',
  'No la guardo': 'I do not save it', 'No uso IA': 'I do not use AI', 'Menos de 2 h': 'Fewer than 2 hours',
  'De 2 a 7 h': '2 to 7 hours', 'Más de 7 h': 'More than 7 hours', 'Solo texto': 'Text only',
  'Muy pocas': 'Very few', 'Casi todas': 'Almost all', 'Hace menos de 1 año': 'Less than a year ago',
  'Hace más de 1 año': 'More than a year ago', 'Automáticas': 'Automatic', 'Sin bloqueo': 'No screen lock',
  'Huella o cara': 'Fingerprint or face', 'PIN o patrón': 'PIN or pattern',
  'Progreso posible': 'Potential progress', 'Ahora': 'Now', 'Si completas el plan': 'If you complete the plan',
  'Filtrar y ordenar acciones': 'Filter and sort actions', 'Estado de las acciones': 'Action status',
  'Ordenar por impacto': 'Sort by impact', 'Mayor impacto': 'Highest impact', 'Menor impacto': 'Lowest impact',
  'Todas': 'All', 'Pendientes': 'Pending', 'Completadas': 'Completed', 'Completada': 'Completed', 'Ya lo hice': 'I have done it',
  'Aún no hay acciones completadas': 'No actions completed yet', 'No hay acciones pendientes': 'No pending actions',
  'Tus cambios aparecerán aquí.': 'Your changes will appear here.', 'Acciones recomendadas': 'Recommended actions',
  '¡Plan completado!': 'Plan complete!', 'Seguiremos analizando tu huella cada semana.': 'We will continue scanning your digital footprint each week.',
}

export function localize(text: string, language: Language) {
  return language === 'en' ? englishText[text] ?? text : text
}

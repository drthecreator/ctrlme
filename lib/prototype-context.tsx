'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type PrototypeVersion = 'v2' | 'v3'
type Language = 'es' | 'en'
type Theme = 'light' | 'dark'
type Contrast = 'normal' | 'high'
type PrototypeSettings = { version: PrototypeVersion; language: Language; theme: Theme; contrast: Contrast; fontScale: 100 | 125 | 150 }
type PrototypeContextValue = PrototypeSettings & {
  ready: boolean
  showPicker: boolean
  setShowPicker: (open: boolean) => void
  showShortcuts: boolean
  setShowShortcuts: (open: boolean) => void
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
  const [showPicker, setShowPicker] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('ctrlme-prototype-settings-v3')
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PrototypeSettings>
        setSettings({ ...defaults, ...parsed })
      } else {
        setShowPicker(true)
      }
    } catch {
      localStorage.removeItem('ctrlme-prototype-settings-v3')
      setShowPicker(true)
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
    document.documentElement.lang = settings.version === 'v3' ? settings.language : 'es'
    document.documentElement.style.setProperty('--prototype-font-scale', `${settings.fontScale / 100}`)
  }, [ready, settings])

  const change = useCallback(<K extends keyof PrototypeSettings>(key: K, value: PrototypeSettings[K]) => {
    setSettings((current) => ({ ...current, [key]: value }))
  }, [])

  const value = useMemo<PrototypeContextValue>(() => ({
    ...settings,
    ready,
    showPicker,
    setShowPicker,
    showShortcuts,
    setShowShortcuts,
    setVersion: (version) => change('version', version),
    setLanguage: (language) => change('language', language),
    setTheme: (theme) => change('theme', theme),
    setContrast: (contrast) => change('contrast', contrast),
    setFontScale: (fontScale) => change('fontScale', fontScale),
  }), [settings, ready, showPicker, showShortcuts, change])

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
  'Principal': 'Home', 'Limpieza': 'Cleanup', 'Alertas': 'Alerts', 'Guías': 'Guides',
  'Navegación principal': 'Main navigation', 'Tu identidad': 'Your identity', 'Gente de confianza': 'Trusted people',
  'Asistente': 'Assistant', 'Escribe o habla con él': 'Type or talk to it', 'Tus datos están cifrados y son solo tuyos.': 'Your data is encrypted and belongs only to you.',
  'Mi perfil': 'My profile', 'Datos vigilados y ajustes': 'Monitored data and settings',
  'correo': 'email', 'correos': 'emails', 'revisado': 'checked', 'Gestionar': 'Manage',
  'Sin filtraciones activas': 'No active breaches', 'Resolviste la filtración de': 'You resolved the breach at', 'Te avisaremos al momento si aparece algo nuevo.': 'We will let you know right away if anything new appears.',
  'Requiere acción': 'Action required', '1 filtración detectada': '1 breach detected', 'Servicio': 'Service', 'Detectada': 'Detected', 'Datos expuestos': 'Exposed data', 'Afectó a': 'Affected',
  'Start here': 'Start here', 'Para empezar': 'Start here', 'Todas las píldoras': 'All guides', 'Filtrar por tema': 'Filter by topic', 'Historia visual': 'Visual story', 'Ver historia': 'View story',
  'Cuentas y claves': 'Accounts and passwords', 'IA y fraude': 'AI and scams', 'Privacidad': 'Privacy',
  'Tus datos y fotos en la Inteligencia Artificial': 'Your data and photos in AI', 'Qué pasa con lo que subes a un chat o generador de imágenes.': 'What happens to what you upload to a chat or image generator.',
  'Lo que subes, se queda': 'What you upload stays there', 'Muchas herramientas de IA guardan tus fotos y textos para entrenar sus modelos.': 'Many AI tools keep your photos and text to train their models.',
  'Revisa la configuración': 'Review the settings', 'Busca la opción “No usar mis datos para entrenar” y actívala en cada servicio.': 'Look for “Do not use my data for training” and enable it in each service.',
  'Fotos de otras personas, no': 'Do not upload other people’s photos', 'Si subes la foto de alguien sin su permiso, su cara también acaba en la IA.': 'If you upload someone’s photo without permission, their face ends up in the AI too.',
  'Documentos y salud, nunca': 'Never upload documents or health data', 'No pegues DNI, contratos ni informes médicos en un chat de IA.': 'Never paste ID documents, contracts, or medical reports into an AI chat.',
  'Pregúntate antes de subir': 'Ask yourself before uploading', '¿Me importaría que esto lo viera un desconocido? Si la respuesta es sí, no lo subas.': 'Would I mind if a stranger saw this? If yes, do not upload it.',
  'Cómo detectar un mensaje fraudulento': 'How to spot a scam message', 'Cuatro señales para frenar el phishing por correo, SMS o WhatsApp.': 'Four signs to help stop phishing by email, text, or WhatsApp.',
  'Urgencia sospechosa': 'Suspicious urgency', 'Si un mensaje te mete prisa para actuar, desconfía. Quien estafa necesita que no pienses.': 'Be wary of messages that pressure you to act quickly. Scammers rely on you not thinking it through.',
  'Mira el remitente': 'Check the sender', 'Comprueba la dirección completa, no solo el nombre visible.': 'Check the full address, not just the display name.',
  'No pulses enlaces': 'Do not tap links', 'Entra siempre desde la app oficial o escribiendo tú la dirección.': 'Always use the official app or type the address yourself.',
  'Nadie serio pide códigos': 'Legitimate services never ask for codes', 'Ningún banco ni servicio te pedirá contraseñas ni códigos por mensaje.': 'No bank or legitimate service will ask you for passwords or codes by message.',
  'Si dudas, comprueba': 'When in doubt, verify', 'Llama al número oficial de la empresa. Después, reenvía el aviso y bloquea al remitente.': 'Call the company using its official number. Then report the message and block the sender.',
  'Verificación en dos pasos, explicada': 'Two-step verification, explained', 'Una segunda llave que protege tus cuentas aunque se filtre la contraseña.': 'A second key that protects your accounts even if your password is exposed.',
  'Una segunda llave': 'A second key', 'Además de tu contraseña, se pide un código que solo tú recibes.': 'In addition to your password, you need a code only you can receive.',
  'Mejor con una app': 'An app is safer', 'Las apps de autenticación son más seguras que los SMS, que pueden interceptarse.': 'Authenticator apps are safer than text messages, which can be intercepted.',
  'El código no se comparte': 'Never share the code', 'Si alguien te lo pide, es un intento de acceso a tu cuenta.': 'If someone asks for it, they may be trying to access your account.',
  'Guarda los códigos de recuperación': 'Save your recovery codes', 'Anótalos en un lugar seguro. Te salvarán si pierdes el teléfono.': 'Keep them somewhere safe. They can help if you lose your phone.',
  'Empieza por lo importante': 'Start with what matters', 'Actívala primero en tu correo y en tu banco. Son la puerta de entrada al resto.': 'Enable it first for your email and bank. They are gateways to your other accounts.',
  'Deepfakes: voces y vídeos falsos': 'Deepfakes: fake voices and videos', 'Cómo comprobar que quien te llama o te escribe es quien dice ser.': 'How to check that the person calling or messaging you is who they say they are.',
  'Una voz se copia en segundos': 'A voice can be copied in seconds', 'Con unos pocos segundos de audio, la IA puede imitar la voz de cualquier persona.': 'With just a few seconds of audio, AI can imitate anyone’s voice.',
  'La llamada de un familiar': 'A call from a relative', 'Una voz conocida, una emergencia y dinero urgente: es una estafa muy habitual.': 'A familiar voice, an emergency, and urgent money: this is a common scam.',
  'Acordad una palabra clave': 'Agree on a code word', 'Elegid en familia una palabra secreta para confirmar identidades en una emergencia real.': 'Choose a family code word to confirm identities during a real emergency.',
  'Fíjate en los detalles': 'Look for the details', 'Parpadeo raro, labios que no encajan, voz demasiado plana o poca calidad de imagen.': 'Watch for unusual blinking, mismatched lips, a flat voice, or poor image quality.',
  'Verifica por otro canal': 'Verify through another channel', 'Cuelga y llama tú al número de siempre antes de enviar dinero o datos.': 'Hang up and call their usual number before sending money or personal information.',
  'Cuida tus audios y vídeos': 'Protect your audio and video', 'Cuanto más público es tu contenido, más fácil es imitarte.': 'The more public your content is, the easier it is to imitate you.',
  'Cuentas y apps que ya no usas': 'Accounts and apps you no longer use', 'Cada cuenta olvidada es una puerta abierta. Aprende a cerrarlas.': 'Every forgotten account is an open door. Learn how to close them.',
  'Cuentas olvidadas, riesgo real': 'Forgotten accounts are a real risk', 'Si un servicio que ya no usas sufre una filtración, tus datos siguen ahí.': 'If a service you no longer use has a breach, your data may still be there.',
  'Haz un inventario': 'Make an inventory', 'Busca en tu correo mensajes antiguos de bienvenida para recordar dónde te registraste.': 'Search your inbox for old welcome messages to remember where you signed up.',
  'Elimina, no solo desinstales': 'Delete the account, not just the app', 'Borrar la app no borra tu cuenta. Busca “Eliminar cuenta” en los ajustes del servicio.': 'Deleting the app does not delete your account. Look for “Delete account” in the service settings.',
  'Revisa los accesos con Google': 'Review your Google sign-ins', 'Entra en los ajustes de seguridad de tu cuenta y retira las apps conectadas que ya no uses.': 'Open your account security settings and remove connected apps you no longer use.',
  'Repite cada seis meses': 'Repeat every six months', 'Una revisión corta cada medio año evita que el problema vuelva a crecer.': 'A quick check every six months helps keep the problem from growing again.',
  'Contraseñas seguras: 5 reglas fundamentales': 'Secure passwords: 5 essential rules', 'Cinco hábitos que evitan la mayoría de accesos no autorizados.': 'Five habits that prevent most unauthorized access.',
  'Largas mejor que raras': 'Longer is better than stranger', 'Usa frases de cuatro o más palabras: son fáciles de recordar y difíciles de adivinar.': 'Use phrases with four or more words: they are easy to remember and hard to guess.',
  'Una por cuenta': 'One per account', 'Nunca repitas contraseñas. Si una se filtra, el resto sigue a salvo.': 'Never reuse passwords. If one is exposed, the others stay safe.',
  'Usa un gestor': 'Use a password manager', 'Un gestor de contraseñas las crea y las recuerda por ti.': 'A password manager creates and remembers passwords for you.',
  'Activa la verificación': 'Enable verification', 'La verificación en dos pasos frena casi todos los accesos no autorizados.': 'Two-step verification blocks most unauthorized access.',
  'Cámbiala tras una filtración': 'Change it after a breach', 'Si recibes una alerta, cambia la clave de inmediato y las que se parezcan.': 'If you get an alert, change that password right away, along with any similar ones.',
  'Si tus datos aparecen en una filtración': 'If your data appears in a breach', 'Qué hacer paso a paso cuando te llega una alerta de brecha de datos.': 'What to do step by step when you receive a data breach alert.',
  'No es culpa tuya': 'It is not your fault', 'Las filtraciones las sufren las empresas. Lo importante es reaccionar pronto.': 'Companies are responsible for breaches. The important thing is to respond quickly.',
  'Mira qué datos se filtraron': 'Check which data was exposed', 'No es lo mismo un correo que una contraseña o un teléfono. Cada dato pide una medida.': 'An email address is different from a password or phone number. Each needs a different response.',
  'Cambia las claves': 'Change your passwords', 'Cambia la contraseña de ese servicio y de cualquier otro donde la repitieras.': 'Change the password for that service and any other account where you reused it.',
  'Activa la verificación en dos pasos': 'Turn on two-step verification', 'Así, aunque alguien tenga tu clave, no podrá entrar.': 'That way, even if someone has your password, they cannot get in.',
  'Cuidado en los próximos meses': 'Stay alert over the coming months', 'Tras una filtración aumentan los mensajes fraudulentos que usan tus datos reales.': 'After a breach, scam messages using your real information become more common.',
  'Permisos de apps y localización': 'App permissions and location', 'Decide qué ve cada app de tu cámara, micrófono y ubicación.': 'Choose which apps can access your camera, microphone, and location.',
  'Solo mientras se usa': 'Only while in use', 'Concede la ubicación únicamente cuando la app esté abierta.': 'Allow location access only while the app is open.',
  'Revisa cada mes': 'Review every month', 'En Ajustes › Privacidad verás qué apps acceden a tu cámara, micrófono y ubicación.': 'In Settings › Privacy, you can see which apps access your camera, microphone, and location.',
  'Ubicación aproximada': 'Approximate location', 'Para el tiempo o las noticias no hace falta tu ubicación exacta.': 'Weather or news apps do not need your precise location.',
  'Cámara y micrófono, con motivo': 'Camera and microphone access should make sense', 'Una linterna o un juego no necesitan tu micrófono. Si lo piden, deniégalo.': 'A flashlight or game does not need your microphone. Deny access if it asks.',
  'Quita lo que no uses': 'Remove what you do not use', 'Una app sin uso con permisos concedidos sigue recogiendo información.': 'An unused app with permissions can still collect information.',
  'Entender una política de privacidad': 'Understand a privacy policy', 'Cómo leer las condiciones en un minuto y detectar lo importante.': 'How to read terms in a minute and spot what matters.',
  'Casi nadie las lee': 'Almost no one reads them', 'Son largas y técnicas, y por eso aceptamos cosas sin saber a qué.': 'They are long and technical, so we accept things without knowing what they mean.',
  'Busca cuatro palabras': 'Search for four words', 'Usa el buscador del texto: “terceros”, “publicidad”, “conservamos” y “compartimos”.': 'Search the text for “third parties,” “advertising,” “retain,” and “share.”',
  'Quién más recibe tus datos': 'Who else receives your data', 'Si se comparten con terceros o socios publicitarios, tu información sale de la app.': 'If data is shared with third parties or advertising partners, your information leaves the app.',
  'Cuánto tiempo los guardan': 'How long they keep your data', 'Busca si se borran al eliminar tu cuenta o si se conservan durante años.': 'Check whether your data is deleted when you close your account or kept for years.',
  'Pide que te lo expliquen': 'Ask for a plain-language explanation', 'Pega el texto en el asistente y te lo resumirá con palabras sencillas.': 'Paste the text into the assistant and it will summarize it in plain language.',
  'WhatsApp y Telegram: privacidad básica': 'WhatsApp and Telegram: basic privacy', 'Quién puede ver tu foto, tu estado y añadirte a grupos.': 'Who can see your photo and status, and add you to groups.',
  'Tu foto de perfil': 'Your profile photo', 'Déjala visible solo para tus contactos. Cualquiera podría guardarla o usarla.': 'Show it only to your contacts. Anyone else could save or use it.',
  'Quién puede añadirte a grupos': 'Who can add you to groups', 'Limítalo a tus contactos para evitar grupos de estafas o spam.': 'Limit this to your contacts to avoid scam or spam groups.',
  'Hora de conexión y estado': 'Last seen and status', 'Ocultar tu última conexión reduce lo que otros saben de tus rutinas.': 'Hiding your last seen reduces what others know about your routine.',
  'Dispositivos vinculados': 'Linked devices', 'Revisa en Ajustes qué ordenadores tienen abierta tu sesión y cierra los que no reconozcas.': 'Check Settings for computers where you are signed in and log out of any you do not recognize.',
  'Enlaces y códigos QR': 'Links and QR codes', 'No escanees códigos que te lleguen sin pedirlos: pueden vincular tu cuenta a otro dispositivo.': 'Do not scan unsolicited codes: they could link your account to another device.',
  'Lo que publicas deja huella': 'What you post leaves a footprint', 'Fotos, comentarios y perfiles públicos: qué ve cualquiera de ti.': 'Photos, comments, and public profiles: what anyone can see about you.',
  'Casi nada se borra del todo': 'Almost nothing is fully erased', 'Lo que publicas puede copiarse o archivarse, incluso si luego lo eliminas.': 'What you post can be copied or archived, even if you later delete it.',
  'Las fotos cuentan más de lo que ves': 'Photos reveal more than you think', 'Pueden mostrar tu casa, tu rutina o tu ubicación exacta.': 'They can reveal your home, routine, or exact location.',
  'Perfil público o privado': 'Public or private profile', 'Si no necesitas que te vea todo el mundo, pásalo a privado.': 'If you do not need everyone to see your profile, make it private.',
  'Búscate a ti mismo': 'Search for yourself', 'Escribe tu nombre en un buscador y mira qué aparece: es lo que verá un desconocido.': 'Search for your name and see what appears: that is what a stranger can find.',
  'Limpia publicaciones antiguas': 'Clean up old posts', 'Elimina o archiva lo que ya no te represente.': 'Delete or archive anything that no longer represents you.',
  'Ir a Limpieza': 'Go to Cleanup', 'Ver mis alertas': 'View my alerts', 'Preguntar al asistente': 'Ask the assistant', 'Revisar sesiones': 'Review sessions',
  'Ejemplo de riesgo': 'Risk example', 'Así sí': 'A safer choice', 'Anterior': 'Previous', 'Terminar': 'Finish', 'Siguiente': 'Next',
  'Pausar': 'Pause', 'Reproducir': 'Play', 'Desactivar narración': 'Turn narration off', 'Activar narración en voz alta': 'Turn on narration', 'Cerrar historia': 'Close story', 'Diapositiva': 'Slide',
  'Solicitudes recibidas': 'Received requests', 'Añadir persona': 'Add a person', 'Personas que cuido': 'People I care for', 'Quién cuida de mí': 'Who cares for me',
  'Aún no cuidas la identidad de nadie. Invita a un familiar: solo verás lo que te permita compartir.': 'You are not looking after anyone’s identity yet. Invite a family member; you will only see what they choose to share.',
  'Nadie tiene acceso a tu identidad digital. Tú decides si eso cambia.': 'No one has access to your digital identity. You decide whether that changes.',
  'Nadie ve tus contraseñas ni tus mensajes. Puedes retirar un permiso cuando quieras.': 'No one can see your passwords or messages. You can revoke access at any time.',
  '¿Retirar el acceso?': 'Revoke access?', 'dejará de ver la información que compartes. Puedes volver a invitarle más adelante.': 'will no longer see the information you share. You can invite them again later.', 'Cancelar': 'Cancel', 'Retirar acceso': 'Revoke access', 'Retirar su acceso': 'Revoke their access',
  'Quiere poder cuidar de tu identidad digital. Si aceptas, esta persona podrá:': 'They want to help care for your digital identity. If you accept, they will be able to:', 'Rechazar': 'Decline', 'Aceptar': 'Accept', 'Esperando su aprobación': 'Waiting for their approval', 'Todo al día': 'All up to date',
  'Añadir persona a mi círculo': 'Add a person to my circle', 'Le enviaremos una solicitud. No verás nada suyo hasta que la acepte.': 'We will send them a request. You will not see anything until they accept.', 'Nombre': 'Name', 'Su correo electrónico': 'Their email address', '¿Qué es para ti?': 'How are they related to you?', '¿Qué le pedirás poder hacer?': 'What would you like to let them do?', 'Confirmo que esta persona me ha dado permiso para pedirle acceso.': 'I confirm this person has given me permission to request access.',   'Enviar solicitud': 'Send request', 'Correo': 'Email', 'pendiente': 'pending', 'alerta nueva': 'new alert', 'Ctrl+Me, ir a Principal': 'Ctrl+Me, go to Home',
  'Añade tu correo primero': 'Add your email first', 'Configurar vigilancia': 'Set up monitoring', 'Saltar al contenido': 'Skip to content',
  '1 min': '1 min', '55 s': '55 sec', '60 s': '60 sec', '2 min': '2 min',
  'Buscar: “Bienvenido”, “Confirma tu cuenta”, “Gracias por registrarte”': 'Search: “Welcome,” “Confirm your account,” “Thanks for signing up”',
  'caracol-azul-bicicleta-nube': 'blue-snail-bicycle-cloud', 'Hola Lucía, detectamos un acceso a tu cuenta. Confirma tu identidad aquí.': 'Hi Lucia, we detected a sign-in to your account. Confirm your identity here.',
  'Linterna LED quiere acceder a tus contactos y a tu micrófono.': 'LED Flashlight wants to access your contacts and microphone.',
  'Podremos compartir tus datos con empresas colaboradoras con fines comerciales.': 'We may share your data with partner companies for commercial purposes.',
  'Hola, te enviamos un código por error, ¿me lo puedes reenviar?': 'Hi, we sent you a code by mistake. Can you forward it to me?',
  'Soporte Banco <atencion@banc0-seguro.com>': 'Bank Support <help@banc0-secure.com>', 'URGENTE: tu cuenta será bloqueada en 24 h. Verifica ahora.': 'URGENT: your account will be locked in 24 hours. Verify now.',
  'Tu paquete está retenido: bit.ly/ver-paquete': 'Your package is on hold: bit.ly/check-package', 'Dime el código que te acaba de llegar por SMS.': 'Tell me the code you just received by text.',
  'Mamá, he tenido un accidente. Necesito dinero ya. No se lo digas a nadie.': 'Mom, I had an accident. I need money now. Do not tell anyone.',
  'Resume este informe médico de mi madre: nombre, DNI, diagnóstico…': 'Summarize my mother’s medical report: name, ID, diagnosis…',
  'Ajustes › Datos › Mejorar el modelo para todos: Desactivado': 'Settings › Data › Improve the model for everyone: Off',
  'Filtración detectada': 'Breach detected', '1 persona': '1 person',
  '¿Cuánto tiempo los guardan?': 'How long do they keep your data?', 'En línea': 'Online', 'Escribe o habla': 'Type or talk',
  'Revisión guiada': 'Guided review', 'Demo: las respuestas son simuladas': 'Demo: responses are simulated', 'Conversación con el asistente': 'Conversation with the assistant',
  'Preguntas sugeridas': 'Suggested questions', 'Escribe tu pregunta': 'Type your question', 'Escribe tu pregunta…': 'Type your question…',
  'Enviar mensaje': 'Send message', 'Hablar con el asistente': 'Talk to the assistant', 'Mensaje de voz': 'Voice message',
  'Detener lectura': 'Stop reading', 'Escuchar respuesta': 'Listen to response', '¿Cómo puedo subir mi puntuación?': 'How can I improve my score?',
  '¿Tengo sesiones que no reconozco?': 'Do I have sessions I do not recognize?', '¿Qué hago si me llega un SMS sospechoso?': 'What should I do if I get a suspicious text?',
  '¿Qué cuentas debería borrar?': 'Which accounts should I delete?', '¿Es seguro subir fotos a una IA?': 'Is it safe to upload photos to AI?',
  '¿Tengo alguna sesión abierta que no reconozco?': 'Do I have an open session I do not recognize?',
  '¿Qué hago si me llega un SMS sospechoso del banco?': 'What should I do if I get a suspicious text from my bank?',
  'Volver al inicio': 'Back to Home', 'Pregúntame lo que quieras sobre tu seguridad.': 'Ask me anything about your security.',
  'El asistente necesita conocer tu correo para darte consejos sobre tu identidad digital.': 'The assistant needs your email to give you advice about your digital identity.',
  'Hola': 'Hello',
  'Alertas de filtraciones': 'Breach alerts', 'Los datos que vigilamos por ti y cómo te avisamos.': 'The data we monitor for you and how we notify you.',
  'Limpieza digital': 'Digital cleanup', 'Tu huella digital': 'Your digital footprint',
  'Clasificación de tu presencia y tus datos en internet.': 'An overview of your presence and data on the internet.',
  'Cuida la identidad digital de quien te lo pida, siempre con su permiso.': 'Help care for someone’s digital identity when they ask, always with their permission.',
  'Aprende en 1 minuto': 'Learn in 1 minute',
  'Plan para subir': 'Improve your score', 'Acciones ordenadas por el impacto que tienen en tu puntuación.': 'Actions ordered by their impact on your score.',
  'Seguro:': 'Safe:', 'no tenemos acceso a tu información privada. Solo analizamos datos públicos.': 'we do not access your private information. We only analyze public data.',
  'Para avisarte de filtraciones necesitamos saber qué correo vigilar.': 'To alert you about breaches, we need to know which email to monitor.',
  'Configura la vigilancia para gestionar tus datos.': 'Set up monitoring to manage your data.',
  'Para cuidar de otras personas primero necesitamos conocer tu propia identidad digital.': 'Before helping care for someone else, we need to know your own digital identity.',
  'Buscamos sesiones abiertas y cuentas olvidadas vinculadas a tu correo.': 'We look for open sessions and forgotten accounts linked to your email.',
  'Analizamos dónde aparecen tus datos a partir de tu correo y tus redes.': 'We check where your data appears using your email and social profiles.',
  'Necesitamos analizar tu huella para preparar tu plan.': 'We need to scan your digital footprint to prepare your plan.',
  'Sin nombre': 'No name provided', 'Gestiona la identidad de otras personas con su permiso, y decide quién ve la tuya.': 'Manage other people’s identities with their permission, and choose who can see yours.',
  'Datos vigilados': 'Monitored data', 'Los buscamos en filtraciones y fuentes públicas.': 'We look for them in breaches and public sources.',
  'Verificado · Vigilancia activa': 'Verified · Monitoring active', 'Revisa tu bandeja para verificarlo': 'Check your inbox to verify it', 'Verificado': 'Verified', 'Verificar': 'Verify',
  'Nuevo correo': 'New email', 'trabajo@empresa.com': 'work@company.com', 'Añadir otro correo': 'Add another email', 'Añadir': 'Add', 'Teléfono': 'Phone', 'Vigilancia activa': 'Monitoring active', 'No añadido': 'Not added', 'Perfil público analizado': 'Public profile analyzed',
  'Cuentas conectadas': 'Connected accounts', 'Solo lectura de sesiones': 'Read-only session access', 'Desconectada': 'Disconnected', 'Cuenta de Google conectada': 'Google account connected',
  'Avisos': 'Notifications', 'Notificaciones de filtraciones': 'Breach notifications', 'Al momento, en este teléfono': 'As soon as they happen, on this phone', 'Análisis semanal': 'Weekly scan', 'Cada lunes a las 9:00': 'Every Monday at 9:00 AM',
  'Quién más recibe tus avisos': 'Who else receives your alerts', 'Solo las personas a las que diste permiso en Mi círculo. Tú decides qué les llega.': 'Only people you have authorized in My circle. You decide what they receive.',
  'Nadie recibe tus avisos. Puedes dar permiso a alguien de confianza desde': 'No one receives your alerts. You can give someone you trust permission from',
  'Tus datos en Ctrl+Me': 'Your data in Ctrl+Me', 'Guardamos solo los datos que ves aquí, cifrados. Puedes borrarlos cuando quieras.': 'We only store the data shown here, encrypted. You can delete it at any time.',
  'Borrar todos tus datos': 'Delete all your data', 'Esta acción no se puede deshacer. Se eliminarán tu perfil, preferencias y acciones guardadas.': 'This action cannot be undone. Your profile, preferences, and saved actions will be deleted.',
  'Sí, borrar todo': 'Yes, delete everything', 'Confirmar eliminación': 'Confirm deletion', 'Borrar mis datos y cuenta': 'Delete my data and account',
  'Escribe un correo válido.': 'Enter a valid email address.', 'Ya estás vigilando este correo.': 'This email is already being monitored.',
  'desde': 'since', 'tarea pendiente': 'task pending', 'tareas pendientes': 'tasks pending',
  'Madre o padre': 'Parent', 'Hijo o hija': 'Child', 'Pareja': 'Partner', 'Abuela o abuelo': 'Grandparent', 'Amistad': 'Friend', 'Otro': 'Other',
  'Ver su puntuación y huella': 'View their score and footprint', 'Verás su nivel y un resumen. Nunca sus contraseñas ni sus mensajes.': 'You will see their level and a summary, never their passwords or messages.',
  'Recibir sus alertas': 'Receive their alerts', 'Te avisamos si sus datos aparecen en una filtración.': 'We will alert you if their data appears in a breach.',
  'Hacer limpieza en su nombre': 'Clean up on their behalf', 'Podrás cerrar sesiones y borrar cuentas inactivas por esa persona.': 'You can close sessions and delete inactive accounts for them.',

  'Dispositivos que no reconocemos siguen conectados a tu cuenta de Google.': 'Unrecognized devices are still connected to your Google account.',
  'Tu contraseña antigua circula en una base de datos filtrada.': 'Your old password is circulating in a breached database.',
  'Cuentas olvidadas que siguen guardando tus datos.': 'Forgotten accounts that still store your data.',
  'Un perfil público lo puede ver cualquiera, también quien quiera suplantarte.': 'Anyone can see a public profile, including someone trying to impersonate you.',
  'Fotos y comentarios de hace años que ya no te representan y siguen visibles.': 'Photos and comments from years ago that are still visible but no longer represent you.',
  'Siguen recibiendo tus datos básicos desde tu cuenta de Google o Facebook.': 'They still receive basic data from your Google or Facebook account.',
  'Ajustes › Privacidad de la cuenta › Cuenta privada.': 'Settings › Account privacy › Private account.',
  'Empieza por tu correo, banco y redes sociales.': 'Start with your email, bank, and social accounts.',
  'Una clave filtrada abre todas las cuentas que la comparten.': 'One exposed password can unlock every account that reuses it.',
  'El de tu móvil (iCloud o Google) es gratuito y suficiente.': 'Your phone’s password manager (iCloud or Google) is free and works well.',
  '6 apps pueden ver dónde estás en segundo plano.': 'Six apps can see your location in the background.',
  'Corrigen fallos de seguridad conocidos.': 'They fix known security issues.',
  'Sin ellos no podrás recuperar tu cuenta si te la roban.': 'Without them, you may not be able to recover your account if it is stolen.',
  'Entra siempre desde la app oficial, nunca desde un SMS o correo inesperado.': 'Always open the official app, never follow a link from an unexpected text or email.',
  'Las fotos de documentos quedan guardadas en chats y copias de seguridad.': 'Photos of documents remain in chats and backups.',
  'Usa tus datos móviles para operaciones sensibles como el banco.': 'Use mobile data for sensitive tasks like banking.',
  'Paga con Apple Pay, Google Pay o una tarjeta virtual.': 'Pay with Apple Pay, Google Pay, or a virtual card.',
  'Evita contar datos de salud, finanzas o de otras personas.': 'Avoid sharing health, financial, or other people’s information.',
  'Pueden guardarse y usarse para entrenar modelos.': 'They may be stored and used to train models.',
  'Cada app conectada recibe tus datos básicos de perfil.': 'Every connected app receives basic profile information.',
  'Desactiva la etiqueta de lugar en fotos e historias.': 'Turn off location tagging for photos and stories.',
  'Oculta ciudad, trabajo o colegio de tu biografía.': 'Remove your city, workplace, or school from your bio.',
  'Es más seguro que un PIN que otros pueden ver.': 'It is safer than a PIN someone else could see.',
  'Podrás recuperar tus datos si lo pierdes o te lo roban.': 'You can recover your data if your phone is lost or stolen.',
  'Ver alerta': 'View alert', 'Ir a limpieza': 'Go to Cleanup', 'Revisar perfiles': 'Review profiles',
  'Revisar publicaciones': 'Review posts', 'Ir a apps': 'Go to Apps', 'Ver guía': 'View guide',
  'Revisa permisos': 'Review permissions', 'Revisar permisos': 'Review permissions',
  'Ver plan completo': 'View full plan', 'Ver filtración': 'View breach', 'Ver alertas': 'View alerts',
  'Tipo de limpieza': 'Cleanup type', 'Sesiones': 'Sessions', 'Cuentas': 'Accounts', 'Perfiles y posts': 'Profiles and posts', 'Apps y permisos': 'Apps and permissions',
  'Conecta tu cuenta de Google': 'Connect your Google account', 'Te mostraremos los dispositivos con tu sesión abierta. Solo lectura.': 'We will show you the devices where you are signed in. Read-only.',
  'Conectar Google': 'Connect Google', 'Cuenta de Google': 'Google account', 'Revisar todo con el asistente': 'Review everything with the assistant', 'Dispositivos conectados': 'Connected devices',
  'Este teléfono': 'This phone', 'Es mío': 'This is mine', 'Cerrar sesión': 'Sign out', 'Sesión cerrada': 'Session closed', 'Marcado como tuyo': 'Marked as yours',
  'Cuentas en desuso encontradas': 'Unused accounts found', 'Asociadas a': 'Associated with', 'Borrarlas reduce los datos que pueden filtrarse.': 'Deleting them reduces the data that could be exposed.',
  'No quedan cuentas inactivas.': 'No inactive accounts remain.', 'Inactiva desde': 'Inactive since', 'Marcada como eliminada': 'Marked as deleted', 'Abrir web': 'Open website', 'pestaña nueva': 'opens in a new tab', 'Ya la eliminé': 'I deleted it', 'Cuentas inactivas': 'Inactive accounts',
  'Apps conectadas que no usas': 'Connected apps you no longer use', 'Entraste con tu cuenta de Google o Facebook y siguen recibiendo tus datos básicos. Desconéctalas en los ajustes de esa cuenta.': 'You signed in with your Google or Facebook account, and these apps still receive your basic data. Disconnect them in that account’s settings.',
  'No quedan apps sin usar conectadas.': 'No unused apps remain connected.', 'Apps conectadas': 'Connected apps', 'Conectada con': 'Connected with', 'último uso': 'last used', 'Ve:': 'Can access:',
  'Marcada como desconectada': 'Marked as disconnected', 'Abrir ajustes': 'Open settings', 'Ya la desconecté': 'I disconnected it', 'Permisos de tus apps': 'App permissions',
  'Ctrl+Me no cambia los permisos por ti. Te mostramos cuáles conviene revisar y una guía paso a paso.': 'Ctrl+Me does not change permissions for you. We show you which ones to review and provide a step-by-step guide.',
  'Permisos': 'Permissions', 'Conviene revisarlo': 'Worth reviewing', 'Guía: cómo revisar permisos': 'Guide: how to review permissions', 'Permisos revisados': 'Permissions reviewed', 'Ya revisé mis permisos': 'I reviewed my permissions',
  'Perfiles y publicaciones': 'Profiles and posts', 'Dijiste que no usas redes sociales, así que no hay perfiles que revisar.': 'You said you do not use social networks, so there are no profiles to review.', 'Nada que limpiar aquí.': 'Nothing to clean up here.',
  'Perfiles públicos': 'Public profiles', 'Cualquiera puede ver un perfil público: fotos, amistades y dónde estuviste. Ponlo en privado en los ajustes de cada red.': 'Anyone can see a public profile: photos, friends, and where you have been. Make it private in each network’s settings.',
  'Perfiles': 'Profiles', 'Perfil público: lo ve cualquiera': 'Public profile: visible to everyone', 'Perfil privado': 'Private profile', 'Ya lo puse en privado': 'I made it private', 'Perfil en privado': 'Profile is private',
  'Publicaciones antiguas': 'Older posts', 'Tienes pocas publicaciones, así que no hace falta una revisión. Aun así, mira las más antiguas.': 'You have few posts, so a full review is not needed. Still, check the oldest ones.',
  'Las fotos y comentarios de hace años siguen visibles. Estas son las cifras aproximadas según tus respuestas.': 'Photos and comments from years ago are still visible. These are approximate numbers based on your answers.',
  'Pocas publicaciones antiguas': 'Few older posts', 'Ya las revisé': 'I reviewed them', 'Publicaciones revisadas': 'Posts reviewed', 'Cómo revisar lo que publicas': 'How to review what you post',
  'Conectada': 'Connected', 'La semana pasada': 'Last week',
  'Vigilando': 'Monitoring', 'Seguimiento': 'Monitoring',
  'Pausa': 'Pause', 'Sin verificar': 'Unverified', 'Correo no verificado': 'Unverified email', 'Aún no está verificado': 'Not verified yet',
  'Carmen': 'Carmen', 'Lola': 'Lola', 'Marta': 'Marta',
  'Ve su puntuación': 'View their score', 'Recibe sus alertas': 'Receive their alerts', 'Hace limpieza': 'Clean up',
  'Evaluación de huella': 'Footprint assessment',
  'Pestaña nueva': 'New tab',
  'Datos personales': 'Personal data', 'Redes sociales': 'Social networks', 'Permisos y comportamiento': 'Permissions and behavior', 'Información profesional': 'Professional information',
  'Nombre y correo visibles en 4 plataformas.': 'Name and email visible on 4 platforms.', 'Perfil público en Instagram, 12 fotos encontradas.': 'Public Instagram profile, 12 photos found.',
  '6 apps con permiso de ubicación en segundo plano.': '6 apps have background location access.', 'LinkedIn activo, datos académicos públicos.': 'Active LinkedIn profile, public education details.',
  'Exposición media': 'Moderate exposure', 'Exposición alta': 'High exposure', 'Exposición baja': 'Low exposure',
  'plataformas muestran tus datos': 'platforms display your data', 'fotos accesibles sin iniciar sesión': 'photos visible without signing in',
  'apps te localizan en segundo plano': 'apps can track your location in the background', 'perfil profesional público': 'public professional profile',
  'Buscamos tu nombre y ${email} en directorios públicos, buscadores de personas y listas de contacto.': 'We search for your name and ${email} in public directories, people search sites, and contact lists.',
  'Analizamos qué puede ver cualquier persona sin seguirte ni tener cuenta.': 'We analyze what anyone can see without following you or having an account.',
  'Estimamos qué permisos suelen pedir las apps más habituales y los cruzamos con tu perfil de uso.': 'We estimate which permissions common apps request and compare them with your usage profile.',
  'Es una exposición normal y casi siempre deseada, pero conviene vigilar lo que contiene.': 'This level of exposure is normal and often intentional, but it is worth reviewing what the profile contains.',
  'Nombre completo': 'Full name', 'Aparece en 3 directorios públicos de personas.': 'Appears in 3 public people directories.',
  'Correo electrónico': 'Email address', 'Visible en 2 listas de contacto de eventos y comunidades.': 'Visible in 2 event and community contact lists.',
  'Ciudad y edad aproximada': 'City and approximate age', 'Deducibles a partir de un perfil público.': 'Can be inferred from a public profile.',
  'Teléfono y dirección': 'Phone number and address', 'No hemos encontrado ninguno de los dos.': 'We did not find either one.',
  'Solicita la baja en los 3 directorios; suele tardar unos días.': 'Request removal from the 3 directories; it usually takes a few days.',
  'Usa un alias de correo para registrarte en eventos y newsletters.': 'Use an email alias to sign up for events and newsletters.',
  'Revisa que tus perfiles no muestren la ciudad completa.': 'Check that your profiles do not show your full city.',
  'Instagram público': 'Public Instagram profile', 'Cualquiera puede ver tus publicaciones y a quién sigues.': 'Anyone can see your posts and who you follow.',
  'Ubicación en publicaciones': 'Location in posts', '5 fotos incluyen una etiqueta de lugar identificable.': '5 photos include an identifiable location tag.',
  'Cuenta antigua de X': 'Old X account', 'Perfil de 2019 sin actividad, pero aún indexado.': 'A 2019 profile with no activity that is still indexed.',
  'TikTok privado': 'Private TikTok profile', 'Solo tus seguidores aprobados ven tus vídeos.': 'Only approved followers can see your videos.',
  'Pasa Instagram a privado: es el cambio que más puntos te da.': 'Make your Instagram profile private: this change gives you the most points.',
  'Quita la ubicación de las 5 fotos señaladas.': 'Remove location tags from the 5 flagged photos.', 'Elimina o desactiva la cuenta de X que ya no usas.': 'Delete or deactivate the X account you no longer use.',
  'Ubicación siempre activa': 'Location always on', 'Mapas, clima, reparto, un juego, una linterna y una red social.': 'Maps, weather, delivery, a game, a flashlight, and a social network.',
  'Micrófono': 'Microphone', '2 apps pueden usarlo mientras no las estás mirando.': '2 apps can use it when you are not looking at them.',
  'Contactos': 'Contacts', '3 apps tienen acceso completo a tu agenda.': '3 apps have full access to your contacts.',
  'Cámara': 'Camera', 'Solo las apps que realmente la necesitan.': 'Only apps that really need it.',
  'Cambia la ubicación a "solo mientras se usa" en 5 de las 6 apps.': 'Set location access to “only while using” for 5 of the 6 apps.',
  'Retira el micrófono a las apps que no sean de llamadas o mensajes.': 'Remove microphone access from apps that are not for calls or messages.',
  'Una linterna no necesita saber dónde estás: revoca ese permiso.': 'A flashlight does not need to know where you are: revoke that permission.',
  'LinkedIn': 'LinkedIn', 'Perfil activo con empresa, cargo y formación visibles.': 'Active profile with company, job title, and education visible.',
  'Datos académicos': 'Education details', 'Tu nombre figura en un listado de graduados de tu universidad.': 'Your name appears in a list of graduates from your university.',
  'Correo laboral': 'Work email', 'No aparece en ninguna fuente pública.': 'It does not appear in any public source.',
  'Oculta tu correo y teléfono en la sección de contacto de LinkedIn.': 'Hide your email and phone number in LinkedIn’s contact section.',
  'Pide a tu universidad que retire tu nombre del listado público.': 'Ask your university to remove your name from the public list.',
  'Ver detalles': 'View details', 'Nivel de exposición:': 'Exposure level:', 'Lo que encontramos': 'What we found', 'Qué puedes hacer': 'What you can do',
  'Limpiar cuentas': 'Clean up accounts', 'Ver guías': 'View guides',
  'Así podremos ver qué dispositivos tienen tu sesión abierta. Acceso de solo lectura.': 'This lets us see which devices are signed in to your account. Read-only access.',
  'No hay sesiones sospechosas': 'No suspicious sessions',
  'Todos los dispositivos conectados están revisados.': 'All connected devices have been reviewed.',
  'Progreso del asistente': 'Assistant progress',
  'Revisemos 1 dispositivo juntos': 'Let’s review 1 device together',
  'Revisa cada dispositivo conectado': 'Review each connected device',
  'Cierra los que no reconozcas': 'Close the ones you do not recognize',
  'Asegura tu cuenta con una clave nueva': 'Secure your account with a new password',
  'Te mostraremos cada sesión abierta en tu cuenta de Google. Solo tienes que decirnos si la reconoces.': 'We will show you each open session on your Google account. Just tell us whether you recognize it.',
  'Empezar revisión': 'Start review', 'Cambia tu contraseña de Google': 'Change your Google password',
  'Si alguien tenía tu sesión abierta, podría conocer tu clave. Cambiarla cierra cualquier acceso restante.': 'If someone had your session open, they may know your password. Changing it closes any remaining access.',
  'Abrir Google': 'Open Google', 'se abre en una pestaña nueva': 'opens in a new tab',
  'Más tarde': 'Later', 'Ya la cambié': 'I changed it', 'Dirección IP': 'IP address',
  'Última actividad': 'Last active', 'Primer acceso': 'First sign-in', 'Conectado a': 'Signed in as',
  '¿Reconoces este dispositivo?': 'Do you recognize this device?', 'No, cerrar sesión': 'No, sign out',
  'Sí, es mío': 'Yes, it is mine', 'Cuenta asegurada': 'Account secured',
  'Tu puntuación ha subido de': 'Your score increased from', 'a': 'to',
  'Siguiente mejora': 'Next improvement',
  'Revisemos 2 dispositivos juntos': 'Let’s review 2 devices together',
  'Revisemos 3 dispositivos juntos': 'Let’s review 3 devices together',
  'Revisemos 4 dispositivos juntos': 'Let’s review 4 devices together',
  'Revisemos 5 dispositivos juntos': 'Let’s review 5 devices together',
  'Revisemos 6 dispositivos juntos': 'Let’s review 6 devices together',
  'Revisemos 7 dispositivos juntos': 'Let’s review 7 devices together',
  'Revisemos 8 dispositivos juntos': 'Let’s review 8 devices together',
  'Activo ahora': 'Active now',
  'marzo de 2025': 'March 2025', 'septiembre de 2026': 'September 2026',
  'Madrid, España': 'Madrid, Spain', 'Sevilla, España': 'Seville, Spain',
  'Oporto, Portugal (aprox.)': 'Porto, Portugal (approx.)',
  'Contraseña de Google actualizada': 'Google password updated',
  'Cerrar': 'Close', 'Fuentes analizadas': 'Sources analyzed', 'Volver a analizar': 'Scan again',
  'Puntuación': 'Score', 'Resumen': 'Overview', 'El asistente está escribiendo': 'The assistant is typing',
  'Deshacer': 'Undo',
  'Correos de pedidos': 'Order emails',
  'Registro con tu correo': 'Signed up with your email',
  'Inicio de sesión con Google': 'Signed in with Google',
  'Nombre, correo y foto': 'Name, email, and photo',
  'Nombre y correo': 'Name and email',
  'Nombre, correo y amistades': 'Name, email, and friends',
  'Linterna Plus': 'Flashlight Plus',
  'El Tiempo': 'Weather',
  'Micrófono y cámara': 'Microphone and camera',
  'Siempre, también en segundo plano': 'Always, including in the background',
  'Una linterna no lo necesita': 'A flashlight does not need this',
  'Solo mientras la usas': 'Only while in use',
  '12 oct 2026': 'Oct 12, 2026',
  '700 millones de cuentas': '700 million accounts',
  'Contraseña antigua': 'Old password',
  'Nombre y cargo': 'Name and job title',
  'Comprueba si sigues usando esa clave': 'Check if you still use that password',
  'Revisa si la usas en otras cuentas.': 'Check whether you reuse it on other accounts.',
  'Cambia la clave en las cuentas donde se repita': 'Change the password wherever it is reused',
  'Empieza por tu correo y tu banco.': 'Start with your email and bank.',
  'Abrir web oficial': 'Open official website',
  'Así nadie entra aunque tenga tu clave.': 'That way nobody can get in even with your password.',
  'Ver guía rápida': 'View quick guide',
  'pasos completados': 'steps completed',
  'Marcar como hecho': 'Mark as done',
  '(se abre en una pestaña nueva)': '(opens in a new tab)',
  'Nivel bajo': 'Low level',
  'Nivel medio': 'Moderate level',
  'Nivel alto': 'High level',
  'Seguridad de accesos': 'Access security',
  'Exposición pública': 'Public exposure',
  'Hábitos y prevención': 'Habits and prevention',
  'Avisos de filtraciones': 'Breach alerts',
  'Revisa tus publicaciones antiguas': 'Review your older posts',
  'Haz privado tu perfil de Instagram': 'Make your Instagram profile private',
  'Deja de repetir contraseñas': 'Stop reusing passwords',
  'Usa un gestor de contraseñas': 'Use a password manager',
  'Revisa los permisos de ubicación': 'Review location permissions',
  'Activa las actualizaciones automáticas': 'Turn on automatic updates',
  'Actualiza tu correo y teléfono de recuperación': 'Update your recovery email and phone',
  'Verifica los enlaces antes de pulsarlos': 'Verify links before tapping them',
  'Deja de enviar tu DNI por chat': 'Stop sending your ID over chat',
  'Evita las redes Wi-Fi abiertas': 'Avoid open Wi-Fi networks',
  'Quita tu tarjeta de las tiendas online': 'Remove your saved card from online stores',
  'No compartas datos personales con chatbots de IA': 'Do not share personal data with AI chatbots',
  'Evita subir fotos personales a herramientas de IA': 'Avoid uploading personal photos to AI tools',
  'Reduce los accesos con Google o Facebook': 'Reduce sign-ins with Google or Facebook',
  'Publica fotos sin ubicación': 'Post photos without location tags',
  'Quita datos reales de tus perfiles públicos': 'Remove personal details from public profiles',
  'Bloquea el móvil con huella o Face ID': 'Lock your phone with fingerprint or Face ID',
  'Activa la copia de seguridad del móvil': 'Turn on phone backup',
  'puntos': 'points',
  'Por ejemplo, Carmen': 'For example, Carmen',
  'Esta persona ya no está en tu círculo.': 'This person is no longer in your circle.',
  'Cancelar solicitud': 'Cancel request',
  'El botón de simulación solo existe en este prototipo.': 'The simulation button only exists in this prototype.',
  'Ha llegado al máximo que podemos medir.': 'Reached the highest score we can measure.',
  'Cambiar su contraseña ahora': 'Change their password now',
  'Qué se puede mejorar': 'What can be improved',
  'Actividad': 'Activity',
  'Dejar de gestionar': 'Stop managing',
  'Cerrar una sesión desconocida': 'Sign out of an unrecognized session',
  'Hay un dispositivo que no reconoce conectado a su cuenta de Google.': 'An unrecognized device is connected to their Google account.',
  'Borrar una cuenta que ya no usa': 'Delete an unused account',
  'Un foro antiguo sigue guardando su correo y su fecha de nacimiento.': 'An old forum still stores their email and date of birth.',
  'Su correo principal se puede abrir solo con la contraseña.': 'Their main email can still be opened with only a password.',
  'Activar la verificación en dos pasos': 'Turn on two-step verification',
  'Gmail para Android': 'Gmail for Android',
  'App Ctrl+Me': 'Ctrl+Me App',
  'Poner su perfil de Instagram en privado': 'Make their Instagram profile private',
  'Ahora mismo cualquiera puede ver sus fotos y dónde las hizo.': 'Right now anyone can see their photos and where they were taken.',
  'Cambiar una contraseña repetida': 'Change a reused password',
  'Usa la misma clave en su correo y en una tienda online.': 'They use the same password for their email and an online store.',
  'Carmen te dio permiso para hacer limpieza en su nombre': 'Carmen gave you permission to clean up on her behalf',
  'Detectamos una filtración de Canva en su correo': 'We detected a Canva breach involving their email',
  'Escuchando…': 'Listening…',
  'Pensando…': 'Thinking…',
  'Respondiendo en voz alta…': 'Speaking out loud…',
  'Habla con normalidad': 'Speak naturally',
  'Detener respuesta': 'Stop response',
  'Cancelar mensaje de voz': 'Cancel voice message',
  'Guía de contraseñas': 'Password guide',
  'Combinamos tus respuestas con el análisis de tu correo para calcular la puntuación.': 'We combine your answers with your email scan to calculate your score.',
  'El asistente necesita conocer tus cuentas para revisar sus sesiones.': 'The assistant needs access to your accounts to review open sessions.',
  'datos personales': 'personal data',
  'redes sociales': 'social networks',
  'permisos y comportamiento': 'permissions and behavior',
  'información profesional': 'professional information',
}

const v3SpanishOverrides: Record<string, string> = {
  'Plan para subir': 'Mejora tu puntuación',
  'Guías rápidas': 'Guías',
}

export function localize(text: string, language: Language) {
  if (language !== 'en') return v3SpanishOverrides[text] ?? text
  const exact = englishText[text] ?? (messages.en as Record<string, string>)[text]
  if (exact) return exact
  const closedSessions = text.match(/^(\d+) (sesión cerrada|sesiones cerradas)$/)
  if (closedSessions) return `${closedSessions[1]} session${closedSessions[1] === '1' ? '' : 's'} closed`
  const trustedDevices = text.match(/^(\d+) (dispositivo marcado|dispositivos marcados) como tuyo$/)
  if (trustedDevices) return `${trustedDevices[1]} device${trustedDevices[1] === '1' ? '' : 's'} marked as yours`
  const relative = text.match(/^hace (\d+) (min|h|día|días|mes|meses|año|años)$/)
  if (relative) {
    const unitMap: Record<string, string> = {
      min: 'min',
      h: 'hr',
      día: 'day',
      días: 'days',
      mes: 'month',
      meses: 'months',
      año: 'year',
      años: 'years',
    }
    return `${relative[1]} ${unitMap[relative[2]] ?? relative[2]} ago`
  }
  if (text === 'hace un momento') return 'Just now'
  if (text === 'un momento') return 'a moment ago'
  if (text === 'ayer') return 'yesterday'
  if (text === 'nunca') return 'Never'
  const breachStepsHint = text.match(/^Marca los (\d+) pasos para cerrar la alerta\.$/)
  if (breachStepsHint) return `Complete all ${breachStepsHint[1]} steps to dismiss the alert.`
  const tellByEmail = text.match(/^Se lo contamos a (.+) por correo$/)
  if (tellByEmail) return `We notify ${tellByEmail[1]} by email`
  const alertsForPerson = text.match(/^Avisos de filtraciones para (.+)$/)
  if (alertsForPerson) return `Breach alerts for ${alertsForPerson[1]}`
  const waitingApproval = text.match(/^Esperando la aprobación de (.+)$/)
  if (waitingApproval) return `Waiting for ${waitingApproval[1]}’s approval`
  const requestSentTo = text.match(/^Hemos enviado la solicitud a (.+)\. Hasta que la acepte no podrás ver nada suyo\.$/)
  if (requestSentTo) return `We sent the request to ${requestSentTo[1]}. Until they accept, you will not be able to see any of their data.`
  const simulateAccept = text.match(/^Simular que (.+) acepta$/)
  if (simulateAccept) return `Simulate ${simulateAccept[1]} accepting`
  const couldReach = text.match(/^Podría llegar a (\d+) si resuelves lo pendiente\.$/)
  if (couldReach) return `Could reach ${couldReach[1]} if you resolve pending items.`
  const breachResolvedMember = text.match(/^Filtración de (.+) resuelta$/)
  if (breachResolvedMember) return `${breachResolvedMember[1]} breach resolved`
  const breachBodyMember = text.match(/^El correo de (.+) apareció en esta filtración\. Hay que cambiar su contraseña de (.+) y de cualquier sitio donde la repita\.$/)
  if (breachBodyMember) return `${breachBodyMember[1]}’s email appeared in this breach. Change their ${breachBodyMember[2]} password and any other account where it is reused.`
  const noActPerm = text.match(/^Avísale: no tienes permiso para actuar por (.+)\.$/)
  if (noActPerm) return `Let them know: you do not have permission to act for ${noActPerm[1]}.`
  const doFor = text.match(/^Hacerlo por (.+)$/)
  if (doFor) return `Do it for ${doFor[1]}`
  const notGivenPerm = text.match(/^(.+) no te ha dado permiso para actuar por ella o él\.$/)
  if (notGivenPerm) return `${notGivenPerm[1]} has not given you permission to act on their behalf.`
  const whatAllows = text.match(/^Lo que (.+) te permite$/)
  if (whatAllows) return `What ${whatAllows[1]} allows you to do`
  const neverSeeMember = text.match(/^Nunca ves sus contraseñas ni sus mensajes\. (.+) puede retirar el permiso cuando quiera\.$/)
  if (neverSeeMember) return `You never see their passwords or messages. ${neverSeeMember[1]} can revoke access at any time.`
  const stopManagingDesc = text.match(/^Dejarás de ver y gestionar la identidad de (.+)\. Sus datos no se borran\.$/)
  if (stopManagingDesc) return `You will stop seeing and managing ${stopManagingDesc[1]}’s identity. Their data will not be deleted.`
  const stopManagingBtn = text.match(/^Dejar de gestionar a (.+)$/)
  if (stopManagingBtn) return `Stop managing ${stopManagingBtn[1]}`
  const sentRequestTo = text.match(/^Enviaste la solicitud a (.+)$/)
  if (sentRequestTo) return `You sent the request to ${sentRequestTo[1]}`
  const acceptedRequest = text.match(/^(.+) aceptó tu solicitud$/)
  if (acceptedRequest) return `${acceptedRequest[1]} accepted your request`
  const didFor = text.match(/^Hiciste por ([^:]+): (.+)$/)
  if (didFor) return `Completed for ${didFor[1]}: ${didFor[2]}`
  const changedPassMember = text.match(/^Cambiaste la contraseña de (.+) tras la filtración de (.+)$/)
  if (changedPassMember) return `Changed ${changedPassMember[1]}’s password after the ${changedPassMember[2]} breach`
  const oldPosts = text.match(/^Unas (\d+) publicaciones de hace más de 2 años$/)
  if (oldPosts) return `About ${oldPosts[1]} posts from over 2 years ago`
  const sessions = text.match(/^Revisa (\d+) (sesión sospechosa|sesiones sospechosas)$/)
  if (sessions) return sessions[1] === '1' ? 'Review the suspicious session' : `Review ${sessions[1]} suspicious sessions`
  const breach = text.match(/^Resuelve la filtración de (.+)$/)
  if (breach) return `Resolve the breach at ${breach[1]}`
  const accounts = text.match(/^Elimina (\d+) (cuenta inactiva|cuentas inactivas)$/)
  if (accounts) return accounts[1] === '1' ? 'Delete the inactive account' : `Delete ${accounts[1]} inactive accounts`
  const apps = text.match(/^Desconecta (\d+) (app que no usas|apps que no usas)$/)
  if (apps) return apps[1] === '1' ? 'Disconnect the unused app' : `Disconnect ${apps[1]} unused apps`
  const profiles = text.match(/^Pon en privado (tu perfil|tus perfiles) de (.+)$/)
  if (profiles) return profiles[1] === 'tu perfil' ? `Make ${profiles[2]}’s profile private` : `Make ${profiles[2]}’s profiles private`
  const assistantSessions = text.match(/^Sí\. Tienes (\d+) (sesión sospechosa abierta|sesiones sospechosas abiertas) en tus cuentas\. Te recomiendo cerrarlas ahora y, si no las reconoces, cambiar también la contraseña\.$/)
  if (assistantSessions) return `You have ${assistantSessions[1]} suspicious session${assistantSessions[1] === '1' ? '' : 's'} open. I recommend closing ${assistantSessions[1] === '1' ? 'it' : 'them'} now and changing the password if you do not recognize ${assistantSessions[1] === '1' ? 'it' : 'them'}.`
  const inactiveAccounts = text.match(/^Hemos encontrado (\d+) (cuenta inactiva|cuentas inactivas) a tu nombre\. Cada una es un sitio más donde pueden filtrarse tus datos, así que lo mejor es borrarlas\.$/)
  if (inactiveAccounts) return `We found ${inactiveAccounts[1]} inactive account${inactiveAccounts[1] === '1' ? '' : 's'} in your name. Each one is another place where your data could be exposed, so it is best to delete them.`
  const scoreReply = text.match(/^Tu puntuación es (\d+)\/100 y no tengo mejoras pendientes\. Sigue así\.$/)
  if (scoreReply) return `Your score is ${scoreReply[1]}/100 and there are no improvements waiting. Keep it up.`
  const greeting = text.match(/^Hola, (.+)\. ¿En qué te puedo ayudar con tu seguridad hoy\?$/)
  if (greeting) return `Hello, ${greeting[1]}. How can I help you stay safer online today?`
  const staticReplies: Record<string, string> = {
    'Ahora mismo no veo sesiones sospechosas abiertas en tus cuentas. Seguiré vigilándolas.': 'I do not see any suspicious sessions open right now. I will keep monitoring them.',
    'Tu correo aparece en una filtración que aún no has resuelto. Sigue la lista de pasos: cambia la contraseña afectada, activa la verificación en dos pasos y revisa tus sesiones.': 'Your email appears in a breach you have not resolved yet. Follow the steps: change the affected password, turn on two-step verification, and review your sessions.',
    'No tienes filtraciones pendientes. Te avisaré por correo si tus datos aparecen en una nueva.': 'You have no unresolved breaches. I will email you if your data appears in a new one.',
    'La verificación en dos pasos añade un código extra al iniciar sesión, así que una contraseña robada no basta. Actívala primero en tu correo y en tu banco; usa una app de autenticación mejor que SMS.': 'Two-step verification adds an extra sign-in code, so a stolen password is not enough. Turn it on for your email and bank first; an authenticator app is safer than text messages.',
    'Usa una contraseña distinta y larga para cada cuenta. Un gestor de contraseñas las recuerda por ti, y así solo tienes que memorizar una clave maestra.': 'Use a unique, long password for every account. A password manager can remember them for you, so you only need to remember one master password.',
    'No pulses el enlace ni respondas. Los bancos no piden datos por SMS. Entra desde la app oficial para comprobar si hay algún aviso real, y reenvía el mensaje al servicio de reporte de tu banco. Si ya pulsaste, cambia tu contraseña y avisa al banco.': 'Do not tap the link or reply. Banks do not ask for personal information by text. Open the official app to check for a real alert, then report the message to your bank. If you already tapped it, change your password and contact the bank.',
    'No tienes cuentas inactivas pendientes. Buen trabajo manteniendo tu huella al día.': 'You have no inactive accounts waiting to be cleaned up. Great job keeping your footprint up to date.',
    'Con cautela. Lo que subes a una herramienta de IA puede guardarse y usarse para entrenar modelos. Evita fotos de tu cara, documentos o de otras personas, y no cuentes datos de salud o dinero.': 'Be cautious. Anything you upload to an AI tool may be stored and used to train models. Avoid uploading photos of yourself, documents, or other people, and do not share health or financial details.',
    'En una red Wi-Fi abierta otras personas pueden espiar lo que envías. Para el banco o las compras usa tus datos móviles; si no queda otra, una VPN reduce el riesgo.': 'On an open Wi-Fi network, other people may be able to spy on what you send. Use mobile data for banking or shopping; if you have no alternative, a VPN can reduce the risk.',
    'No estoy seguro de haberte entendido bien. Puedo ayudarte con tus contraseñas, filtraciones, sesiones abiertas, cuentas antiguas, estafas por SMS o con cómo subir tu puntuación.': 'I am not sure I understood. I can help with passwords, breaches, open sessions, old accounts, text message scams, and ways to improve your score.',
  }
  return staticReplies[text] ?? text
}

export function usePrototypeCopy() {
  const { version, language } = usePrototype()
  return useCallback((text: string) => (version === 'v3' ? localize(text, language) : text), [version, language])
}

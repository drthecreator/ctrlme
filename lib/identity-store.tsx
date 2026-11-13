'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { createSeedCircle, type CircleState } from '@/lib/circle'

export type Frequency = 'nunca' | 'ocasional' | 'diario'

export type NetworkId = 'instagram' | 'tiktok'

export const NETWORKS: { id: NetworkId; name: string }[] = [
  { id: 'instagram', name: 'Instagram' },
  { id: 'tiktok', name: 'TikTok' },
]

export type Often = 'nunca' | 'a-veces' | 'a-menudo'

export type Answers = {
  // Redes y perfiles
  instagram: Frequency
  tiktok: Frequency
  otherNetworks: 'ninguna' | 'una-dos' | 'varias'
  postCount: 'pocas' | 'algunas' | 'muchas'
  profile: 'publico' | 'privado'
  realInfo: 'poco' | 'algunos' | 'casi-todo'
  geotag: Often
  // Contraseñas y accesos
  reuse: 'nunca' | 'algunas' | 'casi-todas'
  manager: 'si' | 'no'
  twoFactor: 'todas' | 'algunas' | 'ninguna'
  recovery: 'actualizado' | 'desactualizado' | 'no-se'
  // Hábitos y engaños
  phishing: 'verifico' | 'a-veces-clico' | 'clico'
  docs: Often
  wifi: Often
  payments: 'no' | 'algunas' | 'muchas'
  // IA y datos compartidos
  aiHours: 'ninguna' | 'menos-2' | 'de-2-a-7' | 'mas-7'
  aiPhotos: 'a-menudo' | 'solo-texto'
  aiData: Often
  socialLogin: 'pocas' | 'varias' | 'muchas'
  oldAccounts: 'reciente' | 'hace-tiempo' | 'nunca'
  // Dispositivo y permisos
  location: 'siempre' | 'al-usar' | 'nunca'
  updates: 'automaticas' | 'a-veces' | 'nunca'
  screenLock: 'biometria' | 'pin' | 'ninguno'
  backup: 'si' | 'no'
}

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string
  voice?: boolean
  actions?: { label: string; href: string }[]
}

export type MonitoredEmail = { address: string; verified: boolean }

export type Identity = {
  name: string
  emails: MonitoredEmail[]
  phone: string
  instagram: string
  googleConnected: boolean
}

export type SessionKind = 'iphone' | 'windows' | 'android'

export type SessionInfo = {
  id: string
  device: string
  browser: string
  kind: SessionKind
  location: string
  ip: string
  lastActive: string
  firstSeen: string
  current?: boolean
}

export type SessionStatus = 'closed' | 'trusted'

export const SESSIONS: SessionInfo[] = [
  {
    id: 'iphone',
    device: 'iPhone 15',
    browser: 'App Ctrl+Me',
    kind: 'iphone',
    location: 'Madrid, España',
    ip: '83.45.•••.•••',
    lastActive: 'Activo ahora',
    firstSeen: 'Este teléfono',
    current: true,
  },
  {
    id: 'windows',
    device: 'Windows 10',
    browser: 'Chrome 118',
    kind: 'windows',
    location: 'Sevilla, España',
    ip: '176.84.•••.•••',
    lastActive: 'hace 4 meses',
    firstSeen: 'marzo de 2025',
  },
  {
    id: 'android',
    device: 'Android (Samsung)',
    browser: 'Gmail para Android',
    kind: 'android',
    location: 'Oporto, Portugal (aprox.)',
    ip: '85.240.•••.•••',
    lastActive: 'hace 6 días',
    firstSeen: 'septiembre de 2026',
  },
]

export type InactiveAccount = {
  id: string
  name: string
  since: string
  foundVia: string
  deleteUrl: string
}

export const INACTIVE_ACCOUNTS: InactiveAccount[] = [
  {
    id: 'shein',
    name: 'Shein',
    since: '2024',
    foundVia: 'Correos de pedidos',
    deleteUrl: 'https://www.shein.com/user/auth/login',
  },
  {
    id: 'wish',
    name: 'Wish',
    since: '2023',
    foundVia: 'Registro con tu correo',
    deleteUrl: 'https://www.wish.com/help',
  },
  {
    id: 'tumblr',
    name: 'Tumblr',
    since: '2021',
    foundVia: 'Inicio de sesión con Google',
    deleteUrl: 'https://www.tumblr.com/settings/account',
  },
]

export type ConnectedApp = { id: string; name: string; via: string; lastUsed: string; shares: string }

export const CONNECTED_APPS: ConnectedApp[] = [
  { id: 'canva', name: 'Canva', via: 'Google', lastUsed: 'hace 2 años', shares: 'Nombre, correo y foto' },
  { id: 'kahoot', name: 'Kahoot', via: 'Google', lastUsed: 'hace 14 meses', shares: 'Nombre y correo' },
  { id: 'pinterest', name: 'Pinterest', via: 'Facebook', lastUsed: 'hace 18 meses', shares: 'Nombre, correo y amistades' },
]

export type AppPermission = { id: string; app: string; permission: string; access: string }

export const APP_PERMISSIONS: AppPermission[] = [
  { id: 'maps', app: 'Instagram', permission: 'Ubicación', access: 'Siempre, también en segundo plano' },
  { id: 'torch', app: 'Linterna Plus', permission: 'Contactos', access: 'Una linterna no lo necesita' },
  { id: 'weather', app: 'El Tiempo', permission: 'Ubicación', access: 'Siempre, también en segundo plano' },
  { id: 'chat', app: 'WhatsApp', permission: 'Micrófono y cámara', access: 'Solo mientras la usas' },
]

export const POST_ESTIMATE = { pocas: 20, algunas: 90, muchas: 240 } as const

export const BREACH = {
  service: 'LinkedIn',
  year: 2021,
  detectedOn: '12 oct 2026',
  affected: '700 millones de cuentas',
  data: ['Correo electrónico', 'Contraseña antigua', 'Nombre y cargo'],
}

export const BREACH_STEPS = [
  { id: 'check', title: 'Comprueba si sigues usando esa clave', detail: 'Revisa si la usas en otras cuentas.' },
  {
    id: 'change',
    title: 'Cambia la clave en las cuentas donde se repita',
    detail: 'Empieza por tu correo y tu banco.',
    link: { label: 'Abrir web oficial', href: 'https://www.linkedin.com/psettings/change-password' },
  },
  {
    id: '2fa',
    title: 'Activa la verificación en dos pasos',
    detail: 'Así nadie entra aunque tenga tu clave.',
    link: { label: 'Ver guía rápida', href: '/guias#2fa' },
  },
] as const

export type AlertPrefs = { breaches: boolean; summary: boolean; simple: boolean }

export const defaultAlertPrefs = (id: string): AlertPrefs =>
  id === 'me' ? { breaches: true, summary: true, simple: false } : { breaches: true, summary: false, simple: true }

export type IdentityState = {
  fixedProfiles: NetworkId[]
  reviewedPosts: NetworkId[]
  removedApps: string[]
  alertRouting: Record<string, AlertPrefs>
  onboarded: boolean
  identity: Identity
  scannedAt: number | null
  sessionStatus: Record<string, SessionStatus>
  deletedAccounts: string[]
  breachSteps: string[]
  breachResolved: boolean
  permissionsReviewed: boolean
  assessmentDone: boolean
  answers: Answers
  chat: ChatMessage[]
  circle: CircleState
}

const initialState: IdentityState = {
  fixedProfiles: [],
  reviewedPosts: [],
  removedApps: [],
  alertRouting: {},
  onboarded: false,
  identity: { name: '', emails: [], phone: '', instagram: '', googleConnected: false },
  scannedAt: null,
  sessionStatus: {},
  deletedAccounts: [],
  breachSteps: [],
  breachResolved: false,
  permissionsReviewed: false,
  assessmentDone: false,
  answers: {
    instagram: 'diario',
    tiktok: 'ocasional',
    otherNetworks: 'una-dos',
    postCount: 'algunas',
    profile: 'publico',
    realInfo: 'algunos',
    geotag: 'a-veces',
    reuse: 'algunas',
    manager: 'no',
    twoFactor: 'algunas',
    recovery: 'desactualizado',
    phishing: 'verifico',
    docs: 'a-veces',
    wifi: 'a-veces',
    payments: 'algunas',
    aiHours: 'menos-2',
    aiPhotos: 'solo-texto',
    aiData: 'a-veces',
    socialLogin: 'varias',
    oldAccounts: 'hace-tiempo',
    location: 'al-usar',
    updates: 'automaticas',
    screenLock: 'pin',
    backup: 'no',
  },
  chat: [],
  circle: createSeedCircle(),
}

export function getSuspiciousSessions(state: IdentityState) {
  if (!state.identity.googleConnected) return []
  return SESSIONS.filter((s) => !s.current && !state.sessionStatus[s.id])
}

export function getPendingAccounts(state: IdentityState) {
  if (state.identity.emails.length === 0) return []
  return INACTIVE_ACCOUNTS.filter((a) => !state.deletedAccounts.includes(a.id))
}

export const hasAnyNetwork = (a: Answers) =>
  a.instagram !== 'nunca' || a.tiktok !== 'nunca' || a.otherNetworks !== 'ninguna'

export function getUsedNetworks(state: IdentityState) {
  return NETWORKS.filter((n) => state.answers[n.id] !== 'nunca')
}

export function isProfilePublic(state: IdentityState, id: NetworkId) {
  if (state.answers[id] === 'nunca') return false
  return id === 'instagram' ? state.answers.profile === 'publico' : !state.fixedProfiles.includes(id)
}

export function getPublicOtherProfiles(state: IdentityState) {
  return NETWORKS.filter((n) => n.id !== 'instagram' && isProfilePublic(state, n.id))
}

export function oldPostsEstimate(state: IdentityState, id: NetworkId) {
  const share = { nunca: 0, ocasional: 0.4, diario: 0.7 }[state.answers[id]]
  return Math.max(0, Math.round((POST_ESTIMATE[state.answers.postCount] * share) / 5) * 5)
}

export function getPendingPosts(state: IdentityState) {
  if (state.answers.postCount === 'pocas') return []
  return getUsedNetworks(state).filter((n) => !state.reviewedPosts.includes(n.id))
}

export function getPendingApps(state: IdentityState) {
  if (!state.identity.googleConnected && state.identity.emails.length === 0) return []
  return CONNECTED_APPS.filter((app) => !state.removedApps.includes(app.id))
}

export function getCleanupCount(state: IdentityState) {
  return (
    getSuspiciousSessions(state).length +
    getPendingAccounts(state).length +
    getPublicOtherProfiles(state).length +
    getPendingPosts(state).length +
    getPendingApps(state).length +
    (state.permissionsReviewed ? 0 : 1)
  )
}

export function hasOpenBreach(state: IdentityState) {
  return state.identity.emails.length > 0 && !state.breachResolved
}

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)))

export type Metric = {
  key: 'access' | 'exposure' | 'habits' | 'permissions'
  label: string
  value: number
}

const oftenPenalty = (weights: [number, number]) => ({ nunca: 0, 'a-veces': weights[0], 'a-menudo': weights[1] })

export function computeScore(state: IdentityState): { total: number; metrics: Metric[] } {
  const a = state.answers
  const pending = getPendingAccounts(state).length

  const access = clamp(
    100 -
      { nunca: 0, algunas: 6, 'casi-todas': 14 }[a.reuse] -
      (a.manager === 'no' ? 3 : 0) -
      { todas: 0, algunas: 5, ninguna: 12 }[a.twoFactor] -
      { actualizado: 0, desactualizado: 6, 'no-se': 4 }[a.recovery] -
      (hasOpenBreach(state) ? 5 : 0) -
      getSuspiciousSessions(state).length * 3,
  )
  const usesInstagram = a.instagram !== 'nunca'
  const exposure = clamp(
    100 -
      { nunca: 0, ocasional: 4, diario: 8 }[a.instagram] -
      { nunca: 0, ocasional: 4, diario: 8 }[a.tiktok] -
      { ninguna: 0, 'una-dos': 3, varias: 6 }[a.otherNetworks] -
      (hasAnyNetwork(a) ? { pocas: 0, algunas: 3, muchas: 6 }[a.postCount] : 0) -
      (usesInstagram && a.profile === 'publico' ? 10 : 0) -
      getPublicOtherProfiles(state).length * 2 -
      getPendingPosts(state).length * 1.5 -
      getPendingApps(state).length * 1.5 -
      { poco: 0, algunos: 4, 'casi-todo': 9 }[a.realInfo] -
      oftenPenalty([3, 7])[a.geotag] -
      { ninguna: 0, 'menos-2': 2, 'de-2-a-7': 5, 'mas-7': 8 }[a.aiHours] -
      (a.aiPhotos === 'a-menudo' ? 10 : 0) -
      oftenPenalty([3, 8])[a.aiData] -
      { pocas: 0, varias: 3, muchas: 7 }[a.socialLogin] -
      pending * 2 -
      (pending > 0 ? { reciente: 0, 'hace-tiempo': 3, nunca: 6 }[a.oldAccounts] : 0),
  )
  const habits = clamp(
    100 -
      { verifico: 0, 'a-veces-clico': 15, clico: 30 }[a.phishing] -
      oftenPenalty([6, 14])[a.docs] -
      oftenPenalty([5, 12])[a.wifi] -
      { no: 0, algunas: 4, muchas: 9 }[a.payments],
  )
  const permissions = clamp(
    100 -
      { siempre: 10, 'al-usar': 5, nunca: 0 }[a.location] -
      { automaticas: 0, 'a-veces': 5, nunca: 12 }[a.updates] -
      { biometria: 0, pin: 3, ninguno: 15 }[a.screenLock] -
      (a.backup === 'no' ? 5 : 0) -
      (state.permissionsReviewed ? 0 : 6),
  )
  return {
    total: clamp(access * 0.3 + exposure * 0.3 + habits * 0.2 + permissions * 0.2),
    metrics: [
      { key: 'access', label: 'Seguridad de accesos', value: access },
      { key: 'exposure', label: 'Exposición pública', value: exposure },
      { key: 'habits', label: 'Hábitos y prevención', value: habits },
      { key: 'permissions', label: 'Dispositivo y permisos', value: permissions },
    ],
  }
}

export type PlanItem = {
  id: string
  title: string
  description: string
  gain: number
  href?: string
  hrefLabel?: string
  selfFix?: (state: IdentityState) => IdentityState
}

const withAnswers = (patch: Partial<Answers>) => (s: IdentityState) => ({ ...s, answers: { ...s.answers, ...patch } })

export function getPlan(state: IdentityState): PlanItem[] {
  const current = computeScore(state).total
  const gainOf = (fix: (s: IdentityState) => IdentityState) =>
    Math.max(1, computeScore(fix(state)).total - current)

  const suspicious = getSuspiciousSessions(state)
  const pending = getPendingAccounts(state)
  const a = state.answers
  const items: PlanItem[] = []

  if (suspicious.length > 0) {
    items.push({
      id: 'sessions',
      title: `Revisa ${suspicious.length} ${suspicious.length === 1 ? 'sesión sospechosa' : 'sesiones sospechosas'}`,
      description: 'Dispositivos que no reconocemos siguen conectados a tu cuenta de Google.',
      gain: gainOf((s) => ({
        ...s,
        sessionStatus: Object.fromEntries(suspicious.map((x) => [x.id, 'closed' as const])),
      })),
      href: '/asistente/sesiones',
      hrefLabel: 'Resolver con asistente',
    })
  }
  if (hasOpenBreach(state)) {
    items.push({
      id: 'breach',
      title: `Resuelve la filtración de ${BREACH.service}`,
      description: 'Tu contraseña antigua circula en una base de datos filtrada.',
      gain: gainOf((s) => ({ ...s, breachResolved: true })),
      href: '/alertas',
      hrefLabel: 'Ver alerta',
    })
  }
  if (pending.length > 0) {
    items.push({
      id: 'accounts',
      title: `Elimina ${pending.length} ${pending.length === 1 ? 'cuenta inactiva' : 'cuentas inactivas'}`,
      description: 'Cuentas olvidadas que siguen guardando tus datos.',
      gain: gainOf((s) => ({ ...s, deletedAccounts: INACTIVE_ACCOUNTS.map((x) => x.id) })),
      href: '/limpieza?tab=inactivas',
      hrefLabel: 'Ir a limpieza',
    })
  }
  const publicOthers = getPublicOtherProfiles(state)
  if (publicOthers.length > 0) {
    items.push({
      id: 'public-profiles',
      title: `Pon en privado ${publicOthers.length === 1 ? 'tu perfil' : 'tus perfiles'} de ${publicOthers.map((n) => n.name).join(', ')}`,
      description: 'Un perfil público lo puede ver cualquiera, también quien quiera suplantarte.',
      gain: gainOf((s) => ({ ...s, fixedProfiles: publicOthers.map((n) => n.id) })),
      href: '/limpieza?tab=perfiles',
      hrefLabel: 'Revisar perfiles',
    })
  }
  const pendingPosts = getPendingPosts(state)
  if (pendingPosts.length > 0) {
    items.push({
      id: 'old-posts',
      title: 'Revisa tus publicaciones antiguas',
      description: 'Fotos y comentarios de hace años que ya no te representan y siguen visibles.',
      gain: gainOf((s) => ({ ...s, reviewedPosts: pendingPosts.map((n) => n.id) })),
      href: '/limpieza?tab=perfiles',
      hrefLabel: 'Revisar publicaciones',
    })
  }
  const pendingApps = getPendingApps(state)
  if (pendingApps.length > 0) {
    items.push({
      id: 'apps',
      title: `Desconecta ${pendingApps.length} ${pendingApps.length === 1 ? 'app que no usas' : 'apps que no usas'}`,
      description: 'Siguen recibiendo tus datos básicos desde tu cuenta de Google o Facebook.',
      gain: gainOf((s) => ({ ...s, removedApps: CONNECTED_APPS.map((x) => x.id) })),
      href: '/limpieza?tab=apps',
      hrefLabel: 'Ir a apps',
    })
  }
  if (a.instagram !== 'nunca' && a.profile === 'publico') {
    const fix = withAnswers({ profile: 'privado' })
    items.push({
      id: 'profile',
      title: 'Haz privado tu perfil de Instagram',
      description: 'Ajustes › Privacidad de la cuenta › Cuenta privada.',
      gain: gainOf(fix),
      selfFix: fix,
    })
  }
  if (a.twoFactor !== 'todas') {
    const fix = withAnswers({ twoFactor: 'todas' })
    items.push({
      id: '2fa',
      title: 'Activa la verificación en dos pasos',
      description: 'Empieza por tu correo, banco y redes sociales.',
      gain: gainOf(fix),
      href: '/guias#2fa',
      hrefLabel: 'Ver guía',
      selfFix: fix,
    })
  }
  if (a.reuse !== 'nunca') {
    const fix = withAnswers({ reuse: 'nunca' })
    items.push({
      id: 'reuse',
      title: 'Deja de repetir contraseñas',
      description: 'Una clave filtrada abre todas las cuentas que la comparten.',
      gain: gainOf(fix),
      href: '/guias#contrasenas',
      hrefLabel: 'Ver guía',
      selfFix: fix,
    })
  }
  if (a.manager === 'no') {
    const fix = withAnswers({ manager: 'si' })
    items.push({
      id: 'manager',
      title: 'Usa un gestor de contraseñas',
      description: 'El de tu móvil (iCloud o Google) es gratuito y suficiente.',
      gain: gainOf(fix),
      selfFix: fix,
    })
  }
  if (!state.permissionsReviewed) {
    const fix = (s: IdentityState) => ({ ...s, permissionsReviewed: true })
    items.push({
      id: 'permissions',
      title: 'Revisa los permisos de ubicación',
      description: '6 apps pueden ver dónde estás en segundo plano.',
      gain: gainOf(fix),
      href: '/limpieza?tab=apps',
      hrefLabel: 'Revisar permisos',
      selfFix: fix,
    })
  }
  if (a.updates !== 'automaticas') {
    const fix = withAnswers({ updates: 'automaticas' })
    items.push({
      id: 'updates',
      title: 'Activa las actualizaciones automáticas',
      description: 'Corrigen fallos de seguridad conocidos.',
      gain: gainOf(fix),
      selfFix: fix,
    })
  }

  const habitFixes: { id: string; when: boolean; title: string; description: string; patch: Partial<Answers> }[] = [
    {
      id: 'recovery',
      when: a.recovery !== 'actualizado',
      title: 'Actualiza tu correo y teléfono de recuperación',
      description: 'Sin ellos no podrás recuperar tu cuenta si te la roban.',
      patch: { recovery: 'actualizado' },
    },
    {
      id: 'phishing',
      when: a.phishing !== 'verifico',
      title: 'Verifica los enlaces antes de pulsarlos',
      description: 'Entra siempre desde la app oficial, nunca desde un SMS o correo inesperado.',
      patch: { phishing: 'verifico' },
    },
    {
      id: 'docs',
      when: a.docs !== 'nunca',
      title: 'Deja de enviar tu DNI por chat',
      description: 'Las fotos de documentos quedan guardadas en chats y copias de seguridad.',
      patch: { docs: 'nunca' },
    },
    {
      id: 'wifi',
      when: a.wifi !== 'nunca',
      title: 'Evita las redes Wi-Fi abiertas',
      description: 'Usa tus datos móviles para operaciones sensibles como el banco.',
      patch: { wifi: 'nunca' },
    },
    {
      id: 'payments',
      when: a.payments !== 'no',
      title: 'Quita tu tarjeta de las tiendas online',
      description: 'Paga con Apple Pay, Google Pay o una tarjeta virtual.',
      patch: { payments: 'no' },
    },
    {
      id: 'aiData',
      when: a.aiData !== 'nunca',
      title: 'No compartas datos personales con chatbots de IA',
      description: 'Evita contar datos de salud, finanzas o de otras personas.',
      patch: { aiData: 'nunca' },
    },
    {
      id: 'aiPhotos',
      when: a.aiPhotos === 'a-menudo',
      title: 'Evita subir fotos personales a herramientas de IA',
      description: 'Pueden guardarse y usarse para entrenar modelos.',
      patch: { aiPhotos: 'solo-texto' },
    },
    {
      id: 'socialLogin',
      when: a.socialLogin !== 'pocas',
      title: 'Reduce los accesos con Google o Facebook',
      description: 'Cada app conectada recibe tus datos básicos de perfil.',
      patch: { socialLogin: 'pocas' },
    },
    {
      id: 'geotag',
      when: a.geotag !== 'nunca',
      title: 'Publica fotos sin ubicación',
      description: 'Desactiva la etiqueta de lugar en fotos e historias.',
      patch: { geotag: 'nunca' },
    },
    {
      id: 'realInfo',
      when: a.realInfo === 'casi-todo',
      title: 'Quita datos reales de tus perfiles públicos',
      description: 'Oculta ciudad, trabajo o colegio de tu biografía.',
      patch: { realInfo: 'algunos' },
    },
    {
      id: 'screenLock',
      when: a.screenLock !== 'biometria',
      title: 'Bloquea el móvil con huella o Face ID',
      description: 'Es más seguro que un PIN que otros pueden ver.',
      patch: { screenLock: 'biometria' },
    },
    {
      id: 'backup',
      when: a.backup === 'no',
      title: 'Activa la copia de seguridad del móvil',
      description: 'Podrás recuperar tus datos si lo pierdes o te lo roban.',
      patch: { backup: 'si' },
    },
  ]
  for (const habit of habitFixes) {
    if (!habit.when) continue
    const fix = withAnswers(habit.patch)
    items.push({ id: habit.id, title: habit.title, description: habit.description, gain: gainOf(fix), selfFix: fix })
  }
  return items.sort((x, y) => y.gain - x.gain)
}

type IdentityContextValue = {
  state: IdentityState
  update: (fn: (state: IdentityState) => IdentityState) => void
  completeOnboarding: (identity: Identity) => void
  reset: () => void
}

const IdentityContext = createContext<IdentityContextValue | null>(null)

export function IdentityProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<IdentityState>(initialState)

  const update = useCallback((fn: (state: IdentityState) => IdentityState) => setState(fn), [])
  const completeOnboarding = useCallback(
    (identity: Identity) => setState((s) => ({ ...s, identity, onboarded: true, scannedAt: Date.now() })),
    [],
  )
  const reset = useCallback(() => setState(initialState), [])

  const value = useMemo(() => ({ state, update, completeOnboarding, reset }), [state, update, completeOnboarding, reset])

  return <IdentityContext.Provider value={value}>{children}</IdentityContext.Provider>
}

export function useIdentity() {
  const context = useContext(IdentityContext)
  if (!context) throw new Error('useIdentity must be used within IdentityProvider')
  return context
}

export function formatRelative(timestamp: number | null, now: number) {
  if (!timestamp) return 'nunca'
  const minutes = Math.floor((now - timestamp) / 60000)
  if (minutes < 1) return 'hace un momento'
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  return `hace ${hours} h`
}

export type CircleScope = 'resultados' | 'alertas' | 'acciones'

export const CIRCLE_SCOPES: { id: CircleScope; label: string; description: string }[] = [
  {
    id: 'resultados',
    label: 'Ver su puntuación y huella',
    description: 'Verás su nivel y un resumen. Nunca sus contraseñas ni sus mensajes.',
  },
  {
    id: 'alertas',
    label: 'Recibir sus alertas',
    description: 'Te avisamos si sus datos aparecen en una filtración.',
  },
  {
    id: 'acciones',
    label: 'Hacer limpieza en su nombre',
    description: 'Podrás cerrar sesiones y borrar cuentas inactivas por esa persona.',
  },
]

export const RELATIONS = ['Madre o padre', 'Hijo o hija', 'Pareja', 'Abuela o abuelo', 'Amistad', 'Otro'] as const

export type MemberTask = { id: string; title: string; detail: string; gain: number; done: boolean }
export type LogEntry = { id: string; text: string; at: number }

export type CircleMember = {
  id: string
  name: string
  relation: string
  email: string
  status: 'pendiente' | 'activo'
  scopes: CircleScope[]
  since: number
  baseScore: number
  breach: string | null
  breachResolved: boolean
  tasks: MemberTask[]
  log: LogEntry[]
}

export type IncomingRequest = {
  id: string
  name: string
  relation: string
  email: string
  scopes: CircleScope[]
  at: number
}

export type Grant = {
  id: string
  name: string
  relation: string
  email: string
  scopes: CircleScope[]
  since: number
}

export type CircleState = {
  members: CircleMember[]
  incoming: IncomingRequest[]
  grants: Grant[]
}

const TASK_POOL: Omit<MemberTask, 'id' | 'done'>[] = [
  { title: 'Cerrar una sesión desconocida', detail: 'Hay un dispositivo que no reconoce conectado a su cuenta de Google.', gain: 6 },
  { title: 'Borrar una cuenta que ya no usa', detail: 'Un foro antiguo sigue guardando su correo y su fecha de nacimiento.', gain: 4 },
  { title: 'Activar la verificación en dos pasos', detail: 'Su correo principal se puede abrir solo con la contraseña.', gain: 8 },
  { title: 'Poner su perfil de Instagram en privado', detail: 'Ahora mismo cualquiera puede ver sus fotos y dónde las hizo.', gain: 5 },
  { title: 'Cambiar una contraseña repetida', detail: 'Usa la misma clave en su correo y en una tienda online.', gain: 7 },
]

const hash = (text: string) => Array.from(text).reduce((sum, char) => sum + char.charCodeAt(0), 0)

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)))

export function buildTasks(seed: string): MemberTask[] {
  const start = hash(seed) % TASK_POOL.length
  return [0, 1, 2].map((offset) => {
    const task = TASK_POOL[(start + offset * 2) % TASK_POOL.length]
    return { ...task, id: `${seed}-task-${offset}`, done: false }
  })
}

export function memberScore(member: CircleMember) {
  const gained = member.tasks.filter((t) => t.done).reduce((sum, t) => sum + t.gain, 0)
  return clamp(member.baseScore + gained + (member.breach && member.breachResolved ? 6 : 0))
}

export function memberPotential(member: CircleMember) {
  const pending = member.tasks.filter((t) => !t.done).reduce((sum, t) => sum + t.gain, 0)
  return clamp(memberScore(member) + pending + (member.breach && !member.breachResolved ? 6 : 0))
}

export function createPendingMember(input: {
  name: string
  email: string
  relation: string
  scopes: CircleScope[]
}): CircleMember {
  const now = Date.now()
  return {
    id: `m-${now.toString(36)}`,
    name: input.name,
    relation: input.relation,
    email: input.email,
    status: 'pendiente',
    scopes: input.scopes,
    since: now,
    baseScore: 0,
    breach: null,
    breachResolved: false,
    tasks: [],
    log: [{ id: `l-${now}`, text: `Enviaste la solicitud a ${input.email}`, at: now }],
  }
}

export function acceptMember(member: CircleMember): CircleMember {
  const now = Date.now()
  const seed = hash(member.email)
  return {
    ...member,
    status: 'activo',
    since: now,
    baseScore: 38 + (seed % 36),
    breach: seed % 2 === 0 ? 'LinkedIn' : null,
    tasks: buildTasks(member.id),
    log: [{ id: `l-${now}`, text: `${member.name} aceptó tu solicitud`, at: now }, ...member.log],
  }
}

export function memberFromRequest(request: IncomingRequest): CircleMember {
  return acceptMember({
    id: request.id,
    name: request.name,
    relation: request.relation,
    email: request.email,
    status: 'pendiente',
    scopes: request.scopes,
    since: request.at,
    baseScore: 0,
    breach: null,
    breachResolved: false,
    tasks: [],
    log: [],
  })
}

export function createSeedCircle(): CircleState {
  const now = Date.now()
  const day = 86_400_000
  return {
    members: [
      {
        id: 'carmen',
        name: 'Carmen Martín',
        relation: 'Madre o padre',
        email: 'carmen.martin@hotmail.es',
        status: 'activo',
        scopes: ['resultados', 'alertas', 'acciones'],
        since: now - 12 * day,
        baseScore: 41,
        breach: 'Canva',
        breachResolved: false,
        tasks: buildTasks('carmen'),
        log: [
          { id: 'c1', text: 'Carmen te dio permiso para hacer limpieza en su nombre', at: now - 12 * day },
          { id: 'c2', text: 'Detectamos una filtración de Canva en su correo', at: now - 2 * day },
        ],
      },
    ],
    incoming: [
      {
        id: 'lola',
        name: 'Lola Ruiz',
        relation: 'Abuela o abuelo',
        email: 'lola.ruiz@hotmail.es',
        scopes: ['resultados', 'alertas'],
        at: now - 3_600_000,
      },
    ],
    grants: [
      {
        id: 'marta',
        name: 'Marta Ruiz',
        relation: 'Pareja',
        email: 'marta.ruiz@gmail.com',
        scopes: ['resultados', 'alertas'],
        since: now - 40 * day,
      },
    ],
  }
}

export function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || '?'
  )
}

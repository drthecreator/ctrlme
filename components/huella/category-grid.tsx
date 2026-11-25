'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useIsV3, usePrototypeCopy } from '@/lib/prototype-context'
import { ArrowRight, Briefcase, Lock, MapPin, Share2, UserRound, type LucideIcon } from 'lucide-react'
import { BottomSheet } from '@/components/bottom-sheet'
import { buttonVariants } from '@/components/ui/button'
import { useIdentity } from '@/lib/identity-store'
import { toneStyles, type Tone } from '@/lib/score'
import { cn } from '@/lib/utils'

type Finding = { title: string; text: string; tone: Tone }

type Category = {
  id: string
  title: string
  description: string
  icon: LucideIcon
  exposure: { label: string; tone: Tone }
  stat: { value: string; label: string }
  summary: string
  findings: Finding[]
  advice: string[]
  action: { label: string; href: string }
}

function buildCategories(email: string): Category[] {
  return [
    {
      id: 'datos',
      title: 'Datos personales',
      description: 'Nombre y correo visibles en 4 plataformas.',
      icon: UserRound,
      exposure: { label: 'Exposición media', tone: 'warning' },
      stat: { value: '4', label: 'plataformas muestran tus datos' },
      summary: `Buscamos tu nombre y ${email} en directorios públicos, buscadores de personas y listas de contacto.`,
      findings: [
        { title: 'Nombre completo', text: 'Aparece en 3 directorios públicos de personas.', tone: 'warning' },
        { title: 'Correo electrónico', text: 'Visible en 2 listas de contacto de eventos y comunidades.', tone: 'warning' },
        { title: 'Ciudad y edad aproximada', text: 'Deducibles a partir de un perfil público.', tone: 'warning' },
        { title: 'Teléfono y dirección', text: 'No hemos encontrado ninguno de los dos.', tone: 'success' },
      ],
      advice: [
        'Solicita la baja en los 3 directorios; suele tardar unos días.',
        'Usa un alias de correo para registrarte en eventos y newsletters.',
        'Revisa que tus perfiles no muestren la ciudad completa.',
      ],
      action: { label: 'Ir a limpieza', href: '/limpieza' },
    },
    {
      id: 'redes',
      title: 'Redes sociales',
      description: 'Perfil público en Instagram, 12 fotos encontradas.',
      icon: Share2,
      exposure: { label: 'Exposición alta', tone: 'destructive' },
      stat: { value: '12', label: 'fotos accesibles sin iniciar sesión' },
      summary: 'Analizamos qué puede ver cualquier persona sin seguirte ni tener cuenta.',
      findings: [
        { title: 'Instagram público', text: 'Cualquiera puede ver tus publicaciones y a quién sigues.', tone: 'destructive' },
        { title: 'Ubicación en publicaciones', text: '5 fotos incluyen una etiqueta de lugar identificable.', tone: 'destructive' },
        { title: 'Cuenta antigua de X', text: 'Perfil de 2019 sin actividad, pero aún indexado.', tone: 'warning' },
        { title: 'TikTok privado', text: 'Solo tus seguidores aprobados ven tus vídeos.', tone: 'success' },
      ],
      advice: [
        'Pasa Instagram a privado: es el cambio que más puntos te da.',
        'Quita la ubicación de las 5 fotos señaladas.',
        'Elimina o desactiva la cuenta de X que ya no usas.',
      ],
      action: { label: 'Limpiar cuentas', href: '/limpieza?tab=inactivas' },
    },
    {
      id: 'permisos',
      title: 'Permisos y comportamiento',
      description: '6 apps con permiso de ubicación en segundo plano.',
      icon: MapPin,
      exposure: { label: 'Exposición alta', tone: 'destructive' },
      stat: { value: '6', label: 'apps te localizan en segundo plano' },
      summary: 'Estimamos qué permisos suelen pedir las apps más habituales y los cruzamos con tu perfil de uso.',
      findings: [
        { title: 'Ubicación siempre activa', text: 'Mapas, clima, reparto, un juego, una linterna y una red social.', tone: 'destructive' },
        { title: 'Micrófono', text: '2 apps pueden usarlo mientras no las estás mirando.', tone: 'warning' },
        { title: 'Contactos', text: '3 apps tienen acceso completo a tu agenda.', tone: 'warning' },
        { title: 'Cámara', text: 'Solo las apps que realmente la necesitan.', tone: 'success' },
      ],
      advice: [
        'Cambia la ubicación a "solo mientras se usa" en 5 de las 6 apps.',
        'Retira el micrófono a las apps que no sean de llamadas o mensajes.',
        'Una linterna no necesita saber dónde estás: revoca ese permiso.',
      ],
      action: { label: 'Revisar permisos', href: '/guias#permisos' },
    },
    {
      id: 'profesional',
      title: 'Información profesional',
      description: 'LinkedIn activo, datos académicos públicos.',
      icon: Briefcase,
      exposure: { label: 'Exposición baja', tone: 'success' },
      stat: { value: '1', label: 'perfil profesional público' },
      summary: 'Es una exposición normal y casi siempre deseada, pero conviene vigilar lo que contiene.',
      findings: [
        { title: 'LinkedIn', text: 'Perfil activo con empresa, cargo y formación visibles.', tone: 'success' },
        { title: 'Datos académicos', text: 'Tu nombre figura en un listado de graduados de tu universidad.', tone: 'warning' },
        { title: 'Correo laboral', text: 'No aparece en ninguna fuente pública.', tone: 'success' },
      ],
      advice: [
        'Oculta tu correo y teléfono en la sección de contacto de LinkedIn.',
        'Pide a tu universidad que retire tu nombre del listado público.',
      ],
      action: { label: 'Ver guías', href: '/guias' },
    },
  ]
}

export function CategoryGrid() {
  const { state } = useIdentity()
  const isV3 = useIsV3()
  const copy = usePrototypeCopy()
  const [openId, setOpenId] = useState<string | null>(null)
  const categories = buildCategories(state.identity.emails[0]?.address ?? 'tu correo')
  const current = categories.find((category) => category.id === openId) ?? null

  return (
    <>
      <ul className="grid grid-cols-1 gap-3 px-5 min-[420px]:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <li key={category.id} className="surface flex flex-col rounded-3xl p-4">
            <span className="flex flex-wrap items-center justify-between gap-2">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                <category.icon className="size-5" aria-hidden="true" />
              </span>
              <ExposureBadge exposure={category.exposure} />
            </span>
            <h2 className="mt-4 text-[0.9375rem] leading-snug font-semibold text-balance">{copy(category.title)}</h2>
            <p className="mt-1 flex-1 text-sm leading-snug text-pretty text-muted-foreground">{copy(category.description)}</p>
            <button
              type="button"
              onClick={() => setOpenId(category.id)}
              aria-haspopup="dialog"
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'touch-sm' }),
                'mt-4 h-auto min-h-11 w-full py-2 text-center whitespace-normal',
              )}
            >
              {copy('Ver detalles')}
              <span className="sr-only"> {copy('de')} {copy(category.title.toLowerCase())}</span>
            </button>
          </li>
        ))}
      </ul>

      <p className="mx-5 mt-5 flex items-start gap-3 rounded-2xl bg-success-soft p-4 text-sm leading-relaxed text-success">
        <Lock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>
          <strong className="font-semibold">{copy('Seguro:')}</strong>{' '}
          {copy('no tenemos acceso a tu información privada. Solo analizamos datos públicos.')}
        </span>
      </p>

      <BottomSheet open={current !== null} onClose={() => setOpenId(null)} title={current ? copy(current.title) : ''}>
        {current ? <CategoryDetail category={current} isV3={isV3} /> : null}
      </BottomSheet>
    </>
  )
}

function ExposureBadge({ exposure }: { exposure: { label: string; tone: Tone } }) {
  const copy = usePrototypeCopy()
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        toneStyles[exposure.tone].soft,
      )}
    >
      <span className={cn('size-1.5 rounded-full', toneStyles[exposure.tone].dot)} aria-hidden="true" />
      <span className="sr-only">{copy('Nivel de exposición:')} </span>
      {copy(exposure.label)}
    </span>
  )
}

function CategoryDetail({ category, isV3 }: { category: Category; isV3: boolean }) {
  const copy = usePrototypeCopy()
  return (
    <div>
      <div className="flex items-center gap-4 rounded-3xl bg-card p-4 shadow-xs ring-1 ring-border">
        <p className="font-serif text-[3rem] leading-none tabular-nums">{category.stat.value}</p>
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-snug font-medium text-pretty">{copy(category.stat.label)}</p>
          <div className="mt-1.5">
            <ExposureBadge exposure={category.exposure} />
          </div>
        </div>
      </div>

      <p className="mt-4 text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">{copy(category.summary)}</p>

      <h3 className="mt-6 mb-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">{copy('Lo que encontramos')}</h3>
      <ul className="overflow-hidden rounded-3xl bg-card ring-1 ring-border">
        {category.findings.map((finding) => (
          <li key={finding.title} className="flex gap-3 border-b border-border/70 p-4 last:border-b-0">
            <span
              className={cn('mt-1.5 size-2.5 shrink-0 rounded-full', toneStyles[finding.tone].dot)}
              aria-hidden="true"
            />
            <span>
              <span className="block text-[0.9375rem] font-semibold">{copy(finding.title)}</span>
              <span className="block text-sm leading-snug text-pretty text-muted-foreground">{copy(finding.text)}</span>
            </span>
          </li>
        ))}
      </ul>

      <h3 className="mt-6 mb-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">{copy('Qué puedes hacer')}</h3>
      <ol className="flex flex-col gap-2">
        {category.advice.map((tip, index) => (
          <li key={tip} className={cn('flex gap-3 rounded-2xl p-3.5 text-[0.9375rem] leading-snug', isV3 ? 'bg-background ring-1 ring-border' : 'bg-secondary/60')}>
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <span className="text-pretty">{copy(tip)}</span>
          </li>
        ))}
      </ol>

      <Link href={category.action.href} className={cn(buttonVariants({ size: 'touch' }), 'mt-6 w-full')}>
        {copy(category.action.label)}
        <ArrowRight aria-hidden="true" />
      </Link>
    </div>
  )
}

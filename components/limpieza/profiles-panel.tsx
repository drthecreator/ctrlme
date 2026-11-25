'use client'

import Link from 'next/link'
import { BookOpen, Eye, EyeOff, History } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { AllDone, DoneBar, PanelIntro } from '@/components/limpieza/cleanup-parts'
import {
  getUsedNetworks,
  isProfilePublic,
  oldPostsEstimate,
  useIdentity,
  type NetworkId,
} from '@/lib/identity-store'
import { cn } from '@/lib/utils'
import { usePrototypeCopy } from '@/lib/prototype-context'

export function ProfilesPanel() {
  const { state, update } = useIdentity()
  const copy = usePrototypeCopy()
  const networks = getUsedNetworks(state)

  const setPrivate = (id: NetworkId, value: boolean) =>
    update((s) =>
      id === 'instagram'
        ? { ...s, answers: { ...s.answers, profile: value ? 'privado' : 'publico' } }
        : { ...s, fixedProfiles: value ? [...s.fixedProfiles, id] : s.fixedProfiles.filter((n) => n !== id) },
    )

  const setReviewed = (id: NetworkId, value: boolean) =>
    update((s) => ({
      ...s,
      reviewedPosts: value ? [...s.reviewedPosts, id] : s.reviewedPosts.filter((n) => n !== id),
    }))

  if (networks.length === 0) {
    return (
      <>
        <PanelIntro title="Perfiles y publicaciones">
          Dijiste que no usas redes sociales, así que no hay perfiles que revisar.
        </PanelIntro>
        <AllDone message="Nada que limpiar aquí." />
      </>
    )
  }

  return (
    <>
      <PanelIntro title="Perfiles públicos">
        Cualquiera puede ver un perfil público: fotos, amistades y dónde estuviste. Ponlo en privado en los ajustes de cada
        red.
      </PanelIntro>

      <ul className="flex flex-col gap-3" aria-label="Perfiles">
        {networks.map((network) => {
          const isPublic = isProfilePublic(state, network.id)
          return (
            <li key={network.id} className="surface rounded-3xl p-4">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex size-12 shrink-0 items-center justify-center rounded-2xl',
                    isPublic ? 'bg-warning-soft text-warning' : 'bg-secondary text-primary',
                  )}
                >
                  {isPublic ? <Eye className="size-5" aria-hidden="true" /> : <EyeOff className="size-5" aria-hidden="true" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.9375rem] font-semibold">{network.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {copy(isPublic ? 'Perfil público: lo ve cualquiera' : 'Perfil privado')}
                  </p>
                </div>
              </div>
              {isPublic ? (
                <Button className="mt-3 w-full" variant="outline" size="touch-sm" onClick={() => setPrivate(network.id, true)}>
                  {copy('Ya lo puse en privado')}
                  <span className="sr-only">: {network.name}</span>
                </Button>
              ) : (
                <DoneBar label="Perfil en privado" onUndo={() => setPrivate(network.id, false)} />
              )}
            </li>
          )
        })}
      </ul>

      <div className="mt-8">
        <PanelIntro title="Publicaciones antiguas">
          {state.answers.postCount === 'pocas'
            ? copy('Tienes pocas publicaciones, así que no hace falta una revisión. Aun así, mira las más antiguas.')
            : copy('Las fotos y comentarios de hace años siguen visibles. Estas son las cifras aproximadas según tus respuestas.')}
        </PanelIntro>

        <ul className="flex flex-col gap-3" aria-label={copy('Publicaciones antiguas')}>
          {networks.map((network) => {
            const reviewed = state.reviewedPosts.includes(network.id)
            const estimate = oldPostsEstimate(state, network.id)
            return (
              <li key={network.id} className="surface rounded-3xl p-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <History className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.9375rem] font-semibold">{network.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {estimate > 0
                        ? copy(`Unas ${estimate} publicaciones de hace más de 2 años`)
                        : copy('Pocas publicaciones antiguas')}
                    </p>
                  </div>
                </div>
                {reviewed ? (
                  <DoneBar label="Publicaciones revisadas" onUndo={() => setReviewed(network.id, false)} />
                ) : (
                  <Button className="mt-3 w-full" variant="outline" size="touch-sm" onClick={() => setReviewed(network.id, true)}>
                    {copy('Ya las revisé')}
                    <span className="sr-only">: {network.name}</span>
                  </Button>
                )}
              </li>
            )
          })}
        </ul>

        <Link
          href="/guias#huella-publica"
          className={cn(buttonVariants({ variant: 'ghost', size: 'touch-sm' }), 'mt-3 w-full')}
        >
          <BookOpen aria-hidden="true" />
          {copy('Cómo revisar lo que publicas')}
        </Link>
      </div>
    </>
  )
}

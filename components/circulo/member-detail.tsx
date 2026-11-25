'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, ChevronLeft, Clock, Lock, ShieldAlert } from 'lucide-react'
import { Avatar, ScopeChips, when } from '@/components/circulo/circle-parts'
import { ScoreRing } from '@/components/score-gauge'
import { SectionTitle } from '@/components/screen'
import { getLevel, toneStyles } from '@/lib/score'
import {
  acceptMember,
  memberPotential,
  memberScore,
  type CircleMember,
} from '@/lib/circle'
import { useIdentity } from '@/lib/identity-store'
import { usePrototypeCopy } from '@/lib/prototype-context'
import { cn } from '@/lib/utils'

export function MemberDetail({ id }: { id: string }) {
  const router = useRouter()
  const { state, update } = useIdentity()
  const copy = usePrototypeCopy()
  const [confirmingRemove, setConfirmingRemove] = useState(false)
  const member = state.circle.members.find((m) => m.id === id)

  if (!member) {
    return (
      <div className="px-5 pt-6">
        <BackLink />
        <p className="surface mt-4 rounded-3xl p-6 text-center">{copy('Esta persona ya no está en tu círculo.')}</p>
      </div>
    )
  }

  const patch = (fn: (m: CircleMember) => CircleMember) =>
    update((s) => ({
      ...s,
      circle: { ...s.circle, members: s.circle.members.map((m) => (m.id === id ? fn(m) : m)) },
    }))

  const log = (text: string) => ({ id: `l-${Date.now()}`, text, at: Date.now() })
  const canAct = member.scopes.includes('acciones')
  const canSeeAlerts = member.scopes.includes('alertas')

  const completeTask = (taskId: string, title: string) =>
    patch((m) => ({
      ...m,
      tasks: m.tasks.map((t) => (t.id === taskId ? { ...t, done: true } : t)),
      log: [log(`Hiciste por ${m.name.split(' ')[0]}: ${copy(title).toLowerCase()}`), ...m.log],
    }))

  const resolveBreach = () =>
    patch((m) => ({
      ...m,
      breachResolved: true,
      log: [log(`Cambiaste la contraseña de ${m.name.split(' ')[0]} tras la filtración de ${m.breach}`), ...m.log],
    }))

  const simulateAccept = () => patch((m) => acceptMember(m))

  const remove = () => {
    update((s) => ({ ...s, circle: { ...s.circle, members: s.circle.members.filter((m) => m.id !== id) } }))
    router.push('/circulo')
  }

  const first = member.name.split(' ')[0]
  const score = memberScore(member)
  const potential = memberPotential(member)
  const level = getLevel(score)
  const pending = member.status === 'pendiente'

  return (
    <div className="pb-6">
      <div className="px-3 pt-[max(env(safe-area-inset-top),0.75rem)] lg:pt-3">
        <BackLink />
      </div>

      <header className="flex items-center gap-4 px-5 pt-2 pb-5">
        <Avatar name={member.name} size="lg" />
        <div className="min-w-0">
          <h1 tabIndex={-1} className="font-serif text-[2rem] leading-tight tracking-tight lg:text-4xl">{member.name}</h1>
          <p className="text-sm text-muted-foreground">
            {copy(member.relation)} · {member.email}
          </p>
        </div>
      </header>

      {pending ? (
        <section className="mx-5 rounded-3xl bg-warning-soft p-5">
          <p className="flex items-center gap-2 font-semibold text-warning">
            <Clock className="size-5" aria-hidden="true" />
            {copy(`Esperando la aprobación de ${first}`)}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/85">
            {copy(`Hemos enviado la solicitud a ${member.email}. Hasta que la acepte no podrás ver nada suyo.`)}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={simulateAccept}
              className="min-h-12 flex-1 rounded-2xl bg-primary px-4 text-[0.9375rem] font-semibold text-primary-foreground"
            >
              {copy(`Simular que ${first} acepta`)}
            </button>
            <button
              type="button"
              onClick={remove}
              className="min-h-12 flex-1 rounded-2xl border border-border bg-card px-4 text-[0.9375rem] font-semibold"
            >
              {copy('Cancelar solicitud')}
            </button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{copy('El botón de simulación solo existe en este prototipo.')}</p>
        </section>
      ) : (
        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-6">
          <div className="space-y-5 lg:col-span-7">
            <section className="surface mx-5 flex items-center gap-5 rounded-3xl p-5" aria-label={copy('Puntuación')}>
              <ScoreRing score={score} />
              <div>
                <p className={cn('text-lg font-semibold', toneStyles[level.tone].text)}>{copy(level.label)}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {potential > score
                    ? copy(`Podría llegar a ${potential} si resuelves lo pendiente.`)
                    : copy('Ha llegado al máximo que podemos medir.')}
                </p>
              </div>
            </section>

            {canSeeAlerts && member.breach ? (
              <section
                className={cn(
                  'mx-5 rounded-3xl p-5',
                  member.breachResolved ? 'bg-success-soft' : 'bg-destructive-soft',
                )}
              >
                <p
                  className={cn(
                    'flex items-center gap-2 font-semibold',
                    member.breachResolved ? 'text-success' : 'text-destructive',
                  )}
                >
                  {member.breachResolved ? (
                    <Check className="size-5" aria-hidden="true" />
                  ) : (
                    <ShieldAlert className="size-5" aria-hidden="true" />
                  )}
                  {member.breachResolved ? copy(`Filtración de ${member.breach} resuelta`) : `${copy('Filtración en')} ${member.breach}`}
                </p>
                {member.breachResolved ? null : (
                  <>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                      {copy(`El correo de ${first} apareció en esta filtración. Hay que cambiar su contraseña de ${member.breach} y de cualquier sitio donde la repita.`)}
                    </p>
                    {canAct ? (
                      <button
                        type="button"
                        onClick={resolveBreach}
                        className="mt-4 min-h-12 w-full rounded-2xl bg-destructive px-4 text-[0.9375rem] font-semibold text-destructive-foreground"
                      >
                        {copy('Cambiar su contraseña ahora')}
                      </button>
                    ) : (
                      <p className="mt-3 flex items-center gap-2 text-sm font-medium">
                        <Lock className="size-4" aria-hidden="true" />
                        {copy(`Avísale: no tienes permiso para actuar por ${first}.`)}
                      </p>
                    )}
                  </>
                )}
              </section>
            ) : null}

            <section aria-labelledby="tareas">
              <SectionTitle id="tareas">{copy('Qué se puede mejorar')}</SectionTitle>
              <ul className="space-y-3 px-5">
                {member.tasks.map((task) => (
                  <li key={task.id} className="surface rounded-3xl p-4">
                    <div className="flex items-start gap-3">
                      <span
                        className={cn(
                          'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full',
                          task.done ? 'bg-success text-success-foreground' : 'border-2 border-border',
                        )}
                      >
                        {task.done ? <Check className="size-3.5" aria-hidden="true" /> : null}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={cn('font-semibold', task.done && 'text-muted-foreground line-through')}>
                          {copy(task.title)}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{copy(task.detail)}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-success-soft px-2.5 py-1 text-xs font-bold text-success">
                        +{task.gain}
                      </span>
                    </div>
                    {task.done ? null : canAct ? (
                      <button
                        type="button"
                        onClick={() => completeTask(task.id, task.title)}
                        className="mt-3 min-h-11 w-full rounded-2xl bg-primary text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
                      >
                        {copy(`Hacerlo por ${first}`)}
                      </button>
                    ) : (
                      <p className="mt-3 flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
                        <Lock className="size-3.5" aria-hidden="true" />
                        {copy(`${first} no te ha dado permiso para actuar por ella o él.`)}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="mt-5 space-y-5 lg:col-span-5 lg:mt-0">
            <section aria-labelledby="permisos" className="surface mx-5 rounded-3xl p-5">
              <h2 id="permisos" className="font-semibold">
                {copy(`Lo que ${first} te permite`)}
              </h2>
              <div className="mt-3">
                <ScopeChips scopes={member.scopes} />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {copy(`Nunca ves sus contraseñas ni sus mensajes. ${first} puede retirar el permiso cuando quiera.`)}
              </p>
            </section>

            <section aria-labelledby="actividad">
              <SectionTitle id="actividad">{copy('Actividad')}</SectionTitle>
              <ol className="mx-5 space-y-3 border-l-2 border-border pl-4">
                {member.log.map((entry) => (
                  <li key={entry.id} className="relative text-sm leading-relaxed">
                    <span
                      aria-hidden="true"
                      className="absolute top-1.5 -left-[1.4rem] size-2.5 rounded-full bg-primary"
                    />
                    {copy(entry.text)}
                    <span className="block text-xs text-muted-foreground">{copy(when(entry.at))}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      )}

      {pending ? null : (
        <div className="mx-5 mt-6">
          {confirmingRemove ? (
            <div className="rounded-3xl border border-border p-4">
              <p className="text-sm leading-relaxed">
                {copy(`Dejarás de ver y gestionar la identidad de ${first}. Sus datos no se borran.`)}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmingRemove(false)}
                  className="min-h-12 rounded-2xl border border-border font-semibold"
                >
                  {copy('Cancelar')}
                </button>
                <button
                  type="button"
                  onClick={remove}
                  className="min-h-12 rounded-2xl bg-destructive font-semibold text-destructive-foreground"
                >
                  {copy('Dejar de gestionar')}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingRemove(true)}
              className="min-h-12 w-full rounded-2xl border border-border text-sm font-semibold text-destructive transition-colors hover:bg-destructive-soft lg:w-auto lg:px-6"
            >
              {copy(`Dejar de gestionar a ${first}`)}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function BackLink() {
  const copy = usePrototypeCopy()
  return (
    <Link
      href="/circulo"
      className="inline-flex min-h-11 items-center gap-1 rounded-xl pr-3 pl-1.5 text-[0.9375rem] font-medium text-primary transition-colors hover:bg-muted"
    >
      <ChevronLeft className="size-5" aria-hidden="true" />
      {copy('Mi círculo')}
    </Link>
  )
}

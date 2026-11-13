'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Clock, ShieldAlert, ShieldCheck, UserPlus } from 'lucide-react'
import { BottomSheet } from '@/components/bottom-sheet'
import { Avatar, ScopeChips, when } from '@/components/circulo/circle-parts'
import { fieldClass } from '@/components/onboarding/onboarding-flow'
import { SectionTitle } from '@/components/screen'
import { getLevel, toneStyles } from '@/lib/score'
import {
  CIRCLE_SCOPES,
  RELATIONS,
  createPendingMember,
  memberFromRequest,
  memberScore,
  type CircleMember,
  type CircleScope,
  type Grant,
  type IncomingRequest,
} from '@/lib/circle'
import { useIdentity } from '@/lib/identity-store'
import { cn } from '@/lib/utils'

export function CircleHome() {
  const { state, update } = useIdentity()
  const [inviting, setInviting] = useState(false)
  const { members, incoming, grants } = state.circle

  const accept = (request: IncomingRequest) =>
    update((s) => ({
      ...s,
      circle: {
        ...s.circle,
        incoming: s.circle.incoming.filter((r) => r.id !== request.id),
        grants: [
          ...s.circle.grants,
          {
            id: request.id,
            name: request.name,
            relation: request.relation,
            email: request.email,
            scopes: request.scopes,
            since: Date.now(),
          },
        ],
      },
    }))

  const decline = (id: string) =>
    update((s) => ({ ...s, circle: { ...s.circle, incoming: s.circle.incoming.filter((r) => r.id !== id) } }))

  const revoke = (id: string) =>
    update((s) => ({ ...s, circle: { ...s.circle, grants: s.circle.grants.filter((g) => g.id !== id) } }))

  return (
    <div className="space-y-7 pb-4">
      {incoming.length > 0 ? (
        <section aria-labelledby="solicitudes">
          <SectionTitle id="solicitudes">Solicitudes recibidas</SectionTitle>
          <ul className="space-y-3 px-5">
            {incoming.map((request) => (
              <li key={request.id}>
                <RequestCard request={request} onAccept={() => accept(request)} onDecline={() => decline(request.id)} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="cuido">
        <SectionTitle
          id="cuido"
          aside={
            <button
              type="button"
              onClick={() => setInviting(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform active:scale-95"
            >
              <UserPlus className="size-4" aria-hidden="true" />
              Añadir persona
            </button>
          }
        >
          Personas que cuido
        </SectionTitle>
        {members.length === 0 ? (
          <p className="mx-5 rounded-3xl border border-dashed border-border p-6 text-center text-sm leading-relaxed text-muted-foreground">
            Aún no cuidas la identidad de nadie. Invita a un familiar: solo verás lo que te permita compartir.
          </p>
        ) : (
          <ul className="grid gap-3 px-5 lg:grid-cols-2">
            {members.map((member) => (
              <li key={member.id}>
                <MemberCard member={member} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="cuidan">
        <SectionTitle id="cuidan">Quién cuida de mí</SectionTitle>
        {grants.length === 0 ? (
          <p className="mx-5 rounded-3xl border border-dashed border-border p-6 text-center text-sm leading-relaxed text-muted-foreground">
            Nadie tiene acceso a tu identidad digital. Tú decides si eso cambia.
          </p>
        ) : (
          <ul className="grid gap-3 px-5 lg:grid-cols-2">
            {grants.map((grant) => (
              <li key={grant.id}>
                <GrantCard grant={grant} onRevoke={() => revoke(grant.id)} />
              </li>
            ))}
          </ul>
        )}
        <p className="mx-5 mt-3 flex items-start gap-3 rounded-2xl bg-success-soft p-4 text-sm leading-relaxed text-success">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>
            Nadie ve tus contraseñas ni tus mensajes. Puedes retirar un permiso cuando quieras.
          </span>
        </p>
      </section>

      <InviteSheet open={inviting} onClose={() => setInviting(false)} />
    </div>
  )
}

function RequestCard({
  request,
  onAccept,
  onDecline,
}: {
  request: IncomingRequest
  onAccept: () => void
  onDecline: () => void
}) {
  return (
    <div className="surface rounded-3xl border-l-4 border-accent p-4">
      <div className="flex items-center gap-3">
        <Avatar name={request.name} />
        <div className="min-w-0">
          <p className="font-semibold">{request.name}</p>
          <p className="text-sm text-muted-foreground">
            {request.relation} · {when(request.at)}
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed">
        Quiere poder cuidar de tu identidad digital. Si aceptas, esta persona podrá:
      </p>
      <div className="mt-2">
        <ScopeChips scopes={request.scopes} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onDecline}
          className="min-h-12 rounded-2xl border border-border text-[0.9375rem] font-semibold transition-colors hover:bg-muted"
        >
          Rechazar
        </button>
        <button
          type="button"
          onClick={onAccept}
          className="min-h-12 rounded-2xl bg-primary text-[0.9375rem] font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
        >
          Aceptar
        </button>
      </div>
    </div>
  )
}

function MemberCard({ member }: { member: CircleMember }) {
  const pending = member.status === 'pendiente'
  const score = memberScore(member)
  const level = getLevel(score)
  const open = !pending && member.breach && !member.breachResolved
  const todo = member.tasks.filter((t) => !t.done).length

  return (
    <Link
      href={`/circulo/${member.id}`}
      className="surface flex min-h-24 items-center gap-3 rounded-3xl p-4 transition-colors hover:bg-muted/40"
    >
      <Avatar name={member.name} />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold">{member.name}</span>
        <span className="block text-sm text-muted-foreground">{member.relation}</span>
        {pending ? (
          <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-warning-soft px-2.5 py-1 text-xs font-semibold text-warning">
            <Clock className="size-3.5" aria-hidden="true" />
            Esperando su aprobación
          </span>
        ) : open ? (
          <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-destructive-soft px-2.5 py-1 text-xs font-semibold text-destructive">
            <ShieldAlert className="size-3.5" aria-hidden="true" />
            Filtración en {member.breach}
          </span>
        ) : (
          <span className="mt-1.5 block text-xs text-muted-foreground">
            {todo > 0 ? `${todo} ${todo === 1 ? 'tarea pendiente' : 'tareas pendientes'}` : 'Todo al día'}
          </span>
        )}
      </span>
      {pending ? null : (
        <span className="flex shrink-0 flex-col items-center">
          <span className="font-serif text-3xl leading-none">{score}</span>
          <span className={cn('mt-1 text-xs font-semibold', toneStyles[level.tone].text)}>{level.label}</span>
        </span>
      )}
      <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
    </Link>
  )
}

function GrantCard({ grant, onRevoke }: { grant: Grant; onRevoke: () => void }) {
  return (
    <div className="surface rounded-3xl p-4">
      <div className="flex items-center gap-3">
        <Avatar name={grant.name} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{grant.name}</p>
          <p className="text-sm text-muted-foreground">
            {grant.relation} · desde {when(grant.since).replace('hace ', '')}
          </p>
        </div>
      </div>
      <div className="mt-3">
        <ScopeChips scopes={grant.scopes} />
      </div>
      <button
        type="button"
        onClick={onRevoke}
        className="mt-3 min-h-11 w-full rounded-2xl border border-border text-sm font-semibold text-destructive transition-colors hover:bg-destructive-soft"
      >
        Retirar su acceso
      </button>
    </div>
  )
}

function InviteSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { update } = useIdentity()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [relation, setRelation] = useState<string>(RELATIONS[0])
  const [scopes, setScopes] = useState<CircleScope[]>(['resultados', 'alertas'])
  const [agreed, setAgreed] = useState(false)

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
  const ready = name.trim().length > 1 && validEmail && scopes.length > 0 && agreed

  const toggle = (scope: CircleScope) =>
    setScopes((current) => (current.includes(scope) ? current.filter((s) => s !== scope) : [...current, scope]))

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!ready) return
    const member = createPendingMember({ name: name.trim(), email: email.trim(), relation, scopes })
    update((s) => ({ ...s, circle: { ...s.circle, members: [...s.circle.members, member] } }))
    setName('')
    setEmail('')
    setAgreed(false)
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Añadir persona a mi círculo">
      <form onSubmit={submit} className="space-y-4 pb-2">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Le enviaremos una solicitud. No verás nada suyo hasta que la acepte.
        </p>

        <div>
          <label htmlFor="c-name" className="text-sm font-semibold">
            Nombre
          </label>
          <input
            id="c-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            placeholder="Por ejemplo, Carmen"
            className={cn(fieldClass, 'mt-2')}
          />
        </div>

        <div>
          <label htmlFor="c-email" className="text-sm font-semibold">
            Su correo electrónico
          </label>
          <input
            id="c-email"
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            placeholder="carmen@correo.com"
            className={cn(fieldClass, 'mt-2')}
          />
        </div>

        <div>
          <label htmlFor="c-rel" className="text-sm font-semibold">
            ¿Qué es para ti?
          </label>
          <select
            id="c-rel"
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            className={cn(fieldClass, 'mt-2 appearance-none')}
          >
            {RELATIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className="text-sm font-semibold">¿Qué le pedirás poder hacer?</legend>
          <div className="mt-2 space-y-2">
            {CIRCLE_SCOPES.map((scope) => (
              <label
                key={scope.id}
                className="relative flex min-h-14 cursor-pointer items-start gap-3 rounded-2xl border border-border bg-card p-3.5"
              >
                <input
                  type="checkbox"
                  checked={scopes.includes(scope.id)}
                  onChange={() => toggle(scope.id)}
                  className="mt-0.5 size-5 shrink-0 accent-primary"
                />
                <span>
                  <span className="block text-[0.9375rem] font-semibold">{scope.label}</span>
                  <span className="block text-sm leading-snug text-muted-foreground">{scope.description}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="relative flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 size-5 shrink-0 accent-primary"
          />
          <span>Confirmo que esta persona me ha dado permiso para pedirle acceso.</span>
        </label>

        <button
          type="submit"
          disabled={!ready}
          className="min-h-14 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
        >
          Enviar solicitud
        </button>
      </form>
    </BottomSheet>
  )
}

export { memberFromRequest }

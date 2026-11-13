'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  AtSign,
  BadgeCheck,
  ChevronRight,
  Clock,
  Globe,
  Mail,
  Phone,
  Plus,
  Trash2,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { fieldClass } from '@/components/onboarding/onboarding-flow'
import { initials } from '@/lib/circle'
import { defaultAlertPrefs, useIdentity, type AlertPrefs } from '@/lib/identity-store'
import { cn } from '@/lib/utils'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function ProfileSettings() {
  const id = useId()
  const router = useRouter()
  const { state, update, reset } = useIdentity()
  const { identity } = state
  const [adding, setAdding] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const prefsFor = (key: string): AlertPrefs => state.alertRouting[key] ?? defaultAlertPrefs(key)
  const setPref = (key: string, patch: Partial<AlertPrefs>) =>
    update((s) => ({
      ...s,
      alertRouting: { ...s.alertRouting, [key]: { ...(s.alertRouting[key] ?? defaultAlertPrefs(key)), ...patch } },
    }))
  const mine = prefsFor('me')
  const recipients = state.circle.grants.filter((g) => g.scopes.includes('alertas'))

  const addEmail = () => {
    const address = newEmail.trim().toLowerCase()
    if (!EMAIL_PATTERN.test(address)) return setError('Escribe un correo válido.')
    if (identity.emails.some((e) => e.address === address)) return setError('Ya estás vigilando este correo.')
    update((s) => ({ ...s, identity: { ...s.identity, emails: [...s.identity.emails, { address, verified: false }] } }))
    setNewEmail('')
    setError('')
    setAdding(false)
  }

  return (
    <div className="flex flex-col gap-6 px-5">
      <section aria-labelledby={`${id}-identity`} className="surface flex items-center gap-4 rounded-3xl p-5">
        <span
          aria-hidden="true"
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-2xl text-primary-foreground"
        >
          {(identity.name.trim()[0] ?? identity.emails[0]?.address[0] ?? '?').toUpperCase()}
        </span>
        <div className="min-w-0">
          <h2 id={`${id}-identity`} className="text-lg font-semibold">
            {identity.name || 'Sin nombre'}
          </h2>
          <p className="truncate text-sm text-muted-foreground">{identity.emails[0]?.address}</p>
        </div>
      </section>

      <Link
        href="/circulo"
        className="surface flex min-h-16 items-center gap-3 rounded-3xl p-4 transition-colors hover:bg-muted/40"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
          <Users className="size-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[0.9375rem] font-semibold">Mi círculo</span>
          <span className="block text-sm text-muted-foreground">
            Gestiona la identidad de otras personas con su permiso, y decide quién ve la tuya.
          </span>
        </span>
        <ChevronRight className="size-5 text-muted-foreground" aria-hidden="true" />
      </Link>

      <Group title="Datos vigilados" hint="Los buscamos en filtraciones y fuentes públicas.">
        {identity.emails.map((email) => (
          <Row
            key={email.address}
            icon={Mail}
            title={email.address}
            subtitle={email.verified ? 'Verificado · Vigilancia activa' : 'Revisa tu bandeja para verificarlo'}
            aside={
              email.verified ? (
                <BadgeCheck className="size-5 text-success" aria-label="Verificado" />
              ) : (
                <Button
                  size="touch-sm"
                  variant="outline"
                  onClick={() =>
                    update((s) => ({
                      ...s,
                      identity: {
                        ...s.identity,
                        emails: s.identity.emails.map((e) => (e.address === email.address ? { ...e, verified: true } : e)),
                      },
                    }))
                  }
                >
                  Verificar
                </Button>
              )
            }
          />
        ))}
        {adding ? (
          <div className="p-4">
            <label htmlFor={`${id}-new`} className="text-sm font-semibold">
              Nuevo correo
            </label>
            <input
              id={`${id}-new`}
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              autoFocus
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) addEmail()
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${id}-new-error` : undefined}
              placeholder="trabajo@empresa.com"
              className={cn(fieldClass, 'mt-2')}
            />
            {error ? (
              <p id={`${id}-new-error`} className="mt-2 text-sm font-medium text-destructive">
                {error}
              </p>
            ) : null}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="ghost" size="touch-sm" onClick={() => setAdding(false)}>
                Cancelar
              </Button>
              <Button size="touch-sm" onClick={addEmail}>
                Añadir
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex min-h-14 w-full items-center gap-3 px-4 text-left text-[0.9375rem] font-semibold text-primary transition-colors hover:bg-muted/60"
          >
            <span className="flex size-10 items-center justify-center rounded-xl border border-dashed border-primary/40">
              <Plus className="size-4" aria-hidden="true" />
            </span>
            Añadir otro correo
          </button>
        )}
        <Row icon={Phone} title={identity.phone || 'Teléfono'} subtitle={identity.phone ? 'Vigilancia activa' : 'No añadido'} />
        <Row
          icon={AtSign}
          title={identity.instagram ? `@${identity.instagram}` : 'Instagram'}
          subtitle={identity.instagram ? 'Perfil público analizado' : 'No añadido'}
        />
      </Group>

      <Group title="Cuentas conectadas">
        <Row
          icon={Globe}
          title="Google"
          subtitle={identity.googleConnected ? 'Solo lectura de sesiones' : 'Desconectada'}
          aside={
            <Switch
              checked={identity.googleConnected}
              onCheckedChange={(checked) =>
                update((s) => ({ ...s, identity: { ...s.identity, googleConnected: checked } }))
              }
              aria-label="Cuenta de Google conectada"
            />
          }
        />
      </Group>

      <Group title="Avisos">
        <Row
          icon={Mail}
          title="Notificaciones de filtraciones"
          subtitle="Al momento, en este teléfono"
          aside={
            <Switch
              checked={mine.breaches}
              onCheckedChange={(checked) => setPref('me', { breaches: checked })}
              aria-label="Notificaciones de filtraciones"
            />
          }
        />
        <Row
          icon={Clock}
          title="Análisis semanal"
          subtitle="Cada lunes a las 9:00"
          aside={
            <Switch
              checked={mine.summary}
              onCheckedChange={(checked) => setPref('me', { summary: checked })}
              aria-label="Análisis semanal"
            />
          }
        />
      </Group>

      <Group
        title="Quién más recibe tus avisos"
        hint="Solo las personas a las que diste permiso en Mi círculo. Tú decides qué les llega."
      >
        {recipients.length === 0 ? (
          <p className="p-4 text-sm leading-relaxed text-muted-foreground">
            Nadie recibe tus avisos. Puedes dar permiso a alguien de confianza desde{' '}
            <Link href="/circulo" className="font-semibold text-primary underline-offset-4 hover:underline">
              Mi círculo
            </Link>
            .
          </p>
        ) : (
          recipients.map((person) => {
            const prefs = prefsFor(person.id)
            const first = person.name.split(' ')[0]
            return (
              <div key={person.id}>
                <div className="flex items-center gap-3 px-4 pt-4">
                  <span
                    aria-hidden="true"
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-primary"
                  >
                    {initials(person.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[0.9375rem] font-semibold">{person.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{person.relation}</p>
                  </div>
                </div>
                <Row
                  icon={Mail}
                  title="Avisos de filtraciones"
                  subtitle={`Se lo contamos a ${first} por correo`}
                  aside={
                    <Switch
                      checked={prefs.breaches}
                      onCheckedChange={(checked) => setPref(person.id, { breaches: checked })}
                      aria-label={`Avisos de filtraciones para ${person.name}`}
                    />
                  }
                />
              </div>
            )
          })
        )}
      </Group>

      <section aria-labelledby={`${id}-privacy`} className="rounded-3xl border border-destructive/20 p-4">
        <h2 id={`${id}-privacy`} className="font-semibold">
          Tus datos en Ctrl+Me
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Guardamos solo los datos que ves aquí, cifrados. Puedes borrarlos cuando quieras.
        </p>
        {confirmDelete ? (
          <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label="Confirmar eliminación">
            <Button variant="ghost" size="touch-sm" onClick={() => setConfirmDelete(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              size="touch-sm"
              onClick={() => {
                reset()
                router.push('/')
              }}
            >
              Sí, borrar todo
            </Button>
          </div>
        ) : (
          <Button variant="destructive" size="touch-sm" className="mt-3 w-full" onClick={() => setConfirmDelete(true)}>
            <Trash2 aria-hidden="true" />
            Borrar mis datos y cuenta
          </Button>
        )}
      </section>
    </div>
  )
}

function Group({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  const id = useId()
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="px-1 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      {hint ? <p className="mt-0.5 px-1 text-sm text-muted-foreground">{hint}</p> : null}
      <div className="surface mt-2 divide-y divide-border/70 overflow-hidden rounded-3xl">{children}</div>
    </section>
  )
}

function Row({
  icon: Icon,
  title,
  subtitle,
  aside,
}: {
  icon: LucideIcon
  title: string
  subtitle: string
  aside?: React.ReactNode
}) {
  return (
    <div className="flex min-h-16 items-center gap-3 px-4 py-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
        <Icon className="size-[1.125rem]" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.9375rem] font-medium">{title}</p>
        <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {aside}
    </div>
  )
}

import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Answers, Often } from '@/lib/identity-store'

const often: Record<Often, string> = { nunca: 'Nunca', 'a-veces': 'A veces', 'a-menudo': 'A menudo' }
const yesNo = { si: 'Sí', no: 'No' }
const usage = { nunca: 'No la uso', ocasional: 'Ocasional', diario: 'Diario' }

type Row = { label: string; value: string }
type Group = { title: string; step: number; rows: Row[] }

function buildGroups(a: Answers): Group[] {
  return [
    {
      title: 'Redes y perfiles',
      step: 0,
      rows: [
        { label: 'Instagram', value: usage[a.instagram] },
        { label: 'TikTok', value: usage[a.tiktok] },
        { label: 'Otras redes', value: { ninguna: 'Ninguna más', 'una-dos': 'Una o dos', varias: 'Tres o más' }[a.otherNetworks] },
        {
          label: 'Publicaciones',
          value: { pocas: 'Menos de 50', algunas: 'Entre 50 y 300', muchas: 'Más de 300' }[a.postCount],
        },
        { label: 'Perfil de Instagram', value: { publico: 'Público', privado: 'Privado' }[a.profile] },
        { label: 'Datos reales', value: { poco: 'Casi ninguno', algunos: 'Algunos', 'casi-todo': 'Casi todos' }[a.realInfo] },
        { label: 'Fotos con ubicación', value: often[a.geotag] },
      ],
    },
    {
      title: 'Contraseñas y accesos',
      step: 1,
      rows: [
        { label: 'Contraseñas repetidas', value: { nunca: 'Nunca', algunas: 'En algunas', 'casi-todas': 'En casi todas' }[a.reuse] },
        { label: 'Gestor de contraseñas', value: yesNo[a.manager] },
        { label: 'Verificación en dos pasos', value: { todas: 'En todas', algunas: 'En algunas', ninguna: 'En ninguna' }[a.twoFactor] },
        { label: 'Recuperación', value: { actualizado: 'Al día', desactualizado: 'Antigua', 'no-se': 'No lo sé' }[a.recovery] },
      ],
    },
    {
      title: 'Hábitos y engaños',
      step: 2,
      rows: [
        {
          label: 'SMS urgente del banco',
          value: { verifico: 'Entro desde la app', 'a-veces-clico': 'A veces pulso', clico: 'Pulso el enlace' }[a.phishing],
        },
        { label: 'DNI por chat o correo', value: often[a.docs] },
        { label: 'Wi-Fi abiertas', value: often[a.wifi] },
        { label: 'Tarjeta en tiendas', value: { no: 'No la guardo', algunas: 'En algunas', muchas: 'En casi todas' }[a.payments] },
      ],
    },
    {
      title: 'IA y datos compartidos',
      step: 3,
      rows: [
        {
          label: 'Horas de IA por semana',
          value: { ninguna: 'No uso IA', 'menos-2': 'Menos de 2 h', 'de-2-a-7': 'De 2 a 7 h', 'mas-7': 'Más de 7 h' }[a.aiHours],
        },
        { label: 'Fotos personales a IA', value: { 'a-menudo': 'Sí, a menudo', 'solo-texto': 'Solo texto' }[a.aiPhotos] },
        { label: 'Datos personales a chatbots', value: often[a.aiData] },
        { label: 'Acceso con Google o Facebook', value: { pocas: 'Muy pocas', varias: 'Varias', muchas: 'Casi todas' }[a.socialLogin] },
        {
          label: 'Última limpieza de cuentas',
          value: { reciente: 'Hace menos de 1 año', 'hace-tiempo': 'Hace más de 1 año', nunca: 'Nunca' }[a.oldAccounts],
        },
      ],
    },
    {
      title: 'Dispositivo y permisos',
      step: 4,
      rows: [
        { label: 'Ubicación', value: { siempre: 'Siempre', 'al-usar': 'Solo al usar', nunca: 'Nunca' }[a.location] },
        { label: 'Actualizaciones', value: { automaticas: 'Automáticas', 'a-veces': 'Cuando me acuerdo', nunca: 'Casi nunca' }[a.updates] },
        { label: 'Bloqueo de pantalla', value: { biometria: 'Huella o cara', pin: 'PIN o patrón', ninguno: 'Sin bloqueo' }[a.screenLock] },
        { label: 'Copia de seguridad', value: yesNo[a.backup] },
      ],
    },
  ]
}

export function ReviewStep({ answers, onEdit }: { answers: Answers; onEdit: (step: number) => void }) {
  return (
    <div className="mt-5">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Comprueba tus respuestas antes de calcular la puntuación. Puedes cambiar cualquier apartado.
      </p>
      <div className="mt-4 flex flex-col gap-3">
        {buildGroups(answers).map((group) => (
          <section key={group.title} aria-label={group.title} className="surface rounded-3xl p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[0.9375rem] font-semibold">{group.title}</h3>
              <Button variant="ghost" size="touch-sm" onClick={() => onEdit(group.step)}>
                <Pencil aria-hidden="true" />
                Editar
                <span className="sr-only"> {group.title}</span>
              </Button>
            </div>
            <dl className="mt-1 divide-y divide-border/60">
              {group.rows.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-4 py-2 text-sm">
                  <dt className="text-muted-foreground">{row.label}</dt>
                  <dd className="text-right font-medium">{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  )
}

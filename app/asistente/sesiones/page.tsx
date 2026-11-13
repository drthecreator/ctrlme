import type { Metadata } from 'next'
import { RequireSetup } from '@/components/require-setup'
import { Screen, ScreenHeader } from '@/components/screen'
import { SessionAssistant } from '@/components/asistente/session-assistant'

export const metadata: Metadata = { title: 'Revisión guiada de sesiones · Ctrl+Me' }

export default function SesionesPage() {
  return (
    <Screen>
      <ScreenHeader
        title="Revisión guiada"
        subtitle="Te guiamos paso a paso para cerrar sesiones que no reconoces."
        backHref="/asistente"
      />
      <RequireSetup reason="El asistente necesita conocer tus cuentas para revisar sus sesiones.">
        <SessionAssistant />
      </RequireSetup>
    </Screen>
  )
}

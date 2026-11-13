import type { Metadata } from 'next'
import { Screen, ScreenHeader } from '@/components/screen'
import { ProfileSettings } from '@/components/perfil/profile-settings'
import { RequireSetup } from '@/components/require-setup'

export const metadata: Metadata = { title: 'Mi perfil · Ctrl+Me' }

export default function PerfilPage() {
  return (
    <Screen>
      <ScreenHeader title="Mi perfil" subtitle="Los datos que vigilamos por ti y cómo te avisamos." />
      <RequireSetup reason="Configura la vigilancia para gestionar tus datos.">
        <ProfileSettings />
      </RequireSetup>
    </Screen>
  )
}

import type { Metadata } from 'next'
import { Screen, ScreenHeader } from '@/components/screen'
import { RequireSetup } from '@/components/require-setup'
import { CircleHome } from '@/components/circulo/circle-home'

export const metadata: Metadata = { title: 'Mi círculo · Ctrl+Me' }

export default function CirculoPage() {
  return (
    <Screen wide>
      <ScreenHeader
        title="Mi círculo"
        subtitle="Cuida la identidad digital de quien te lo pida, siempre con su permiso."
      />
      <RequireSetup reason="Para cuidar de otras personas primero necesitamos conocer tu propia identidad digital.">
        <CircleHome />
      </RequireSetup>
    </Screen>
  )
}

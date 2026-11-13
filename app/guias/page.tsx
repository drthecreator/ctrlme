import type { Metadata } from 'next'
import { Screen, ScreenHeader } from '@/components/screen'
import { GuidesLibrary } from '@/components/guias/guides-library'

export const metadata: Metadata = { title: 'Guías rápidas · Ctrl+Me' }

export default function GuiasPage() {
  return (
    <Screen wide>
      <ScreenHeader title="Aprende en 1 minuto" />
      <GuidesLibrary />
    </Screen>
  )
}

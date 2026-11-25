import type { Metadata } from 'next'
import { Screen, ScreenHeader } from '@/components/screen'
import { RequireSetup } from '@/components/require-setup'
import { ScanMeta } from '@/components/huella/scan-meta'
import { CategoryGrid } from '@/components/huella/category-grid'

export const metadata: Metadata = { title: 'Tu huella digital · Ctrl+Me' }

export default function HuellaPage() {
  return (
    <Screen wide>
      <ScreenHeader
        title="Tu huella digital"
        subtitle="Clasificación de tu presencia y tus datos en internet."
      />

      <RequireSetup reason="Analizamos dónde aparecen tus datos a partir de tu correo y tus redes.">
        <ScanMeta />
        <CategoryGrid />
      </RequireSetup>
    </Screen>
  )
}

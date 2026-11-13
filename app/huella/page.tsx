import type { Metadata } from 'next'
import { Lock } from 'lucide-react'
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

        <p className="mx-5 mt-5 flex items-start gap-3 rounded-2xl bg-success-soft p-4 text-sm leading-relaxed text-success">
          <Lock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>
            <strong className="font-semibold">Seguro:</strong> no tenemos acceso a tu información privada.
            Solo analizamos datos públicos.
          </span>
        </p>
      </RequireSetup>
    </Screen>
  )
}

import type { Metadata } from 'next'
import { Screen, ScreenHeader } from '@/components/screen'
import { ImprovementPlan } from '@/components/plan/improvement-plan'
import { RequireSetup } from '@/components/require-setup'

export const metadata: Metadata = { title: 'Plan para subir · Ctrl+Me' }

export default function PlanPage() {
  return (
    <Screen>
      <ScreenHeader title="Plan para subir" subtitle="Acciones ordenadas por el impacto que tienen en tu puntuación." />
      <RequireSetup reason="Necesitamos analizar tu huella para preparar tu plan.">
        <ImprovementPlan />
      </RequireSetup>
    </Screen>
  )
}

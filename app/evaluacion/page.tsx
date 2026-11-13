import type { Metadata } from 'next'
import { Screen, ScreenHeader } from '@/components/screen'
import { AssessmentForm } from '@/components/evaluacion/assessment-form'
import { RequireSetup } from '@/components/require-setup'

export const metadata: Metadata = { title: 'Evaluación de huella · Ctrl+Me' }

export default function EvaluacionPage() {
  return (
    <Screen>
      <ScreenHeader title="Evaluación de huella" />
      <RequireSetup reason="Combinamos tus respuestas con el análisis de tu correo para calcular la puntuación.">
        <AssessmentForm />
      </RequireSetup>
    </Screen>
  )
}

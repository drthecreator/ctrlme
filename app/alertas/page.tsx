import type { Metadata } from 'next'
import { Screen, ScreenHeader } from '@/components/screen'
import { AlertsView } from '@/components/alertas/alerts-view'
import { RequireSetup } from '@/components/require-setup'

export const metadata: Metadata = { title: 'Alertas de filtraciones · Ctrl+Me' }

export default function AlertasPage() {
  return (
    <Screen>
      <ScreenHeader title="Alertas de filtraciones" />
      <RequireSetup reason="Para avisarte de filtraciones necesitamos saber qué correo vigilar.">
        <AlertsView />
      </RequireSetup>
    </Screen>
  )
}

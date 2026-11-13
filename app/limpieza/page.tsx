import type { Metadata } from 'next'
import { Screen, ScreenHeader } from '@/components/screen'
import { CleanupTabs, type Tab } from '@/components/limpieza/cleanup-tabs'
import { RequireSetup } from '@/components/require-setup'

export const metadata: Metadata = { title: 'Limpieza digital · Ctrl+Me' }

export default async function LimpiezaPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams
  return (
    <Screen>
      <ScreenHeader title="Limpieza digital" />
      <RequireSetup reason="Buscamos sesiones abiertas y cuentas olvidadas vinculadas a tu correo.">
        <CleanupTabs defaultTab={(['inactivas', 'perfiles', 'apps'] as const).find((t) => t === tab) ?? ('sesiones' satisfies Tab)} />
      </RequireSetup>
    </Screen>
  )
}

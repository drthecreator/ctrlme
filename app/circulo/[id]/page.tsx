import type { Metadata } from 'next'
import { Screen } from '@/components/screen'
import { RequireSetup } from '@/components/require-setup'
import { MemberDetail } from '@/components/circulo/member-detail'

export const metadata: Metadata = { title: 'Persona de mi círculo · Ctrl+Me' }

export default async function MemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <Screen wide>
      <RequireSetup reason="Para cuidar de otras personas primero necesitamos conocer tu propia identidad digital.">
        <MemberDetail id={id} />
      </RequireSetup>
    </Screen>
  )
}

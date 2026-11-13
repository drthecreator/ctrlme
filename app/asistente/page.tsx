import type { Metadata } from 'next'
import { ChatAssistant } from '@/components/asistente/chat-assistant'

export const metadata: Metadata = { title: 'Asistente · Ctrl+Me' }

export default function AsistentePage() {
  return <ChatAssistant />
}

import {
  AudioLines,
  Bell,
  Bot,
  CalendarClock,
  Camera,
  Check,
  Clock,
  Cloud,
  CircleHelp,
  Eye,
  Fingerprint,
  FileText,
  KeyRound,
  Link2,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ScanFace,
  Search,
  Settings,
  ShieldCheck,
  Smartphone,
  Trash2,
  TriangleAlert,
  UserX,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { PillCategory, PillIcon } from '@/lib/guides'

const pillIcons: Record<PillIcon, LucideIcon> = {
  cloud: Cloud,
  settings: Settings,
  users: Users,
  shield: ShieldCheck,
  help: CircleHelp,
  mail: Mail,
  link: Link2,
  alert: TriangleAlert,
  key: KeyRound,
  smartphone: Smartphone,
  lock: Lock,
  eye: Eye,
  trash: Trash2,
  camera: Camera,
  bell: Bell,
  file: FileText,
  face: ScanFace,
  clock: Clock,
  userx: UserX,
  pin: MapPin,
  message: MessageCircle,
  bot: Bot,
  fingerprint: Fingerprint,
  check: Check,
  calendar: CalendarClock,
  phone: Phone,
  audio: AudioLines,
  search: Search,
}

export function PillGlyph({ name, className }: { name: PillIcon; className?: string }) {
  const Icon = pillIcons[name]
  return <Icon className={className} aria-hidden="true" />
}

export const categoryTone: Record<PillCategory, string> = {
  cuentas: 'bg-primary text-primary-foreground',
  'ia-fraude': 'bg-accent text-accent-foreground',
  privacidad: 'bg-secondary text-primary',
}

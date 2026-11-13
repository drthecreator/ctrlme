export type Tone = 'success' | 'warning' | 'destructive'

export function getLevel(score: number): { label: string; tone: Tone } {
  if (score >= 85) return { label: 'Nivel alto', tone: 'success' }
  if (score >= 60) return { label: 'Nivel medio', tone: 'warning' }
  return { label: 'Nivel bajo', tone: 'destructive' }
}

export const toneStyles: Record<Tone, { text: string; soft: string; bar: string; dot: string }> = {
  success: { text: 'text-success', soft: 'bg-success-soft text-success', bar: 'bg-success', dot: 'bg-success' },
  warning: { text: 'text-warning', soft: 'bg-warning-soft text-warning', bar: 'bg-warning', dot: 'bg-warning' },
  destructive: {
    text: 'text-destructive',
    soft: 'bg-destructive-soft text-destructive',
    bar: 'bg-destructive',
    dot: 'bg-destructive',
  },
}

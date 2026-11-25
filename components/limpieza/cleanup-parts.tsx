import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePrototypeCopy } from '@/lib/prototype-context'

export function DoneBar({ label, onUndo }: { label: string; onUndo: () => void }) {
  const copy = usePrototypeCopy()
  return (
    <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl bg-success-soft py-1 pr-1 pl-3">
      <p className="flex items-center gap-1.5 text-sm font-medium text-success">
        <Check className="size-4" strokeWidth={3} aria-hidden="true" />
        {copy(label)}
      </p>
      <Button variant="ghost" size="touch-sm" onClick={onUndo}>
        {copy('Deshacer')}
      </Button>
    </div>
  )
}

export function AllDone({ message }: { message: string }) {
  const copy = usePrototypeCopy()
  return (
    <div className="surface flex items-center gap-3 rounded-3xl p-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
        <Check className="size-5" strokeWidth={3} aria-hidden="true" />
      </span>
      <p className="font-medium">{copy(message)}</p>
    </div>
  )
}

export function PanelIntro({ title, children }: { title: string; children: React.ReactNode }) {
  const copy = usePrototypeCopy()
  return (
    <>
      <h2 className="text-lg font-semibold tracking-tight">{copy(title)}</h2>
      <p className="mt-0.5 mb-4 text-sm leading-relaxed text-muted-foreground">{typeof children === 'string' ? copy(children) : children}</p>
    </>
  )
}

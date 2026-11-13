import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DoneBar({ label, onUndo }: { label: string; onUndo: () => void }) {
  return (
    <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl bg-success-soft py-1 pr-1 pl-3">
      <p className="flex items-center gap-1.5 text-sm font-medium text-success">
        <Check className="size-4" strokeWidth={3} aria-hidden="true" />
        {label}
      </p>
      <Button variant="ghost" size="touch-sm" onClick={onUndo}>
        Deshacer
      </Button>
    </div>
  )
}

export function AllDone({ message }: { message: string }) {
  return (
    <div className="surface flex items-center gap-3 rounded-3xl p-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
        <Check className="size-5" strokeWidth={3} aria-hidden="true" />
      </span>
      <p className="font-medium">{message}</p>
    </div>
  )
}

export function PanelIntro({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-0.5 mb-4 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </>
  )
}

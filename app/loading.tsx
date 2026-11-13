export default function Loading() {
  return (
    <div className="h-full space-y-4 p-5" role="status" aria-label="Cargando">
      <div className="h-10 w-24 animate-pulse rounded-xl bg-muted" />
      <div className="h-10 w-3/4 animate-pulse rounded-xl bg-muted" />
      <div className="h-40 animate-pulse rounded-3xl bg-muted/70" />
      <div className="h-28 animate-pulse rounded-3xl bg-muted/70" />
      <span className="sr-only">Cargando…</span>
    </div>
  )
}

'use client'

import { useEffect, useEffectEvent, useRef, useState } from 'react'
import Link from 'next/link'
import { Check, Pause, Play, TriangleAlert, Volume2, VolumeX, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDuration, type Pill } from '@/lib/guides'
import { PillGlyph } from '@/components/guias/pill-visuals'
import { cn } from '@/lib/utils'

const WORDS_PER_SECOND = 2.6

export function StoryViewer({ pill, onClose }: { pill: Pill | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [narrate, setNarrate] = useState(false)
  const [canSpeak, setCanSpeak] = useState(false)
  const [prevPillId, setPrevPillId] = useState<string | null>(null)

  if ((pill?.id ?? null) !== prevPillId) {
    setPrevPillId(pill?.id ?? null)
    setIndex(0)
    setPlaying(true)
  }

  useEffect(() => {
    setCanSpeak(typeof window !== 'undefined' && 'speechSynthesis' in window)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(false)
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (pill && !dialog.open) dialog.showModal()
    if (!pill && dialog.open) dialog.close()
  }, [pill])

  const slides = pill?.slides ?? []
  const slide = slides[index]
  const isLast = index === slides.length - 1

  const advance = useEffectEvent(() => {
    if (isLast) setPlaying(false)
    else setIndex((i) => i + 1)
  })

  useEffect(() => {
    if (!pill || !slide || !narrate || !playing || !canSpeak) return
    const utterance = new SpeechSynthesisUtterance(`${slide.heading}. ${slide.body}`)
    utterance.lang = 'es-ES'
    utterance.onend = () => advance()
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    return () => {
      utterance.onend = null
      window.speechSynthesis.cancel()
    }
  }, [pill, slide, narrate, playing, canSpeak])

  const wordCount = slide ? `${slide.heading} ${slide.body}`.split(/\s+/).length : 0
  const narratedMs = Math.max(6000, (wordCount / WORDS_PER_SECOND) * 1000 + 1500)
  const slideMs = pill ? (pill.seconds * 1000) / pill.slides.length : 0
  const durationMs = narrate && canSpeak ? narratedMs : slideMs

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="story-title"
      className="m-auto h-dvh max-h-none w-full max-w-[430px] bg-primary p-0 text-primary-foreground backdrop:bg-foreground/60 backdrop:backdrop-blur-sm sm:h-[min(900px,calc(100dvh-4rem))] sm:rounded-[2.75rem]"
    >
      {pill && slide ? (
        <div className="flex h-full flex-col px-5 pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1.25rem)]">
          <div className="flex gap-1.5" aria-hidden="true">
            {slides.map((_, i) => (
              <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-primary-foreground/25">
                {i < index ? (
                  <span className="block h-full w-full bg-primary-foreground" />
                ) : i === index ? (
                  <span
                    key={`${pill.id}-${index}-${durationMs}`}
                    className="block h-full w-full origin-left bg-primary-foreground"
                    style={{
                      animation: `story-fill ${durationMs}ms linear forwards`,
                      animationPlayState: playing ? 'running' : 'paused',
                    }}
                    onAnimationEnd={() => {
                      if (!(narrate && canSpeak)) advance()
                    }}
                  />
                ) : null}
              </span>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-1">
            <p id="story-title" className="mr-auto min-w-0 truncate text-sm font-medium text-primary-foreground/75">
              {pill.title}
            </p>
            <Button
              variant="ghost"
              size="icon-lg"
              onClick={() => setPlaying((p) => !p)}
              className="size-11 rounded-full text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              aria-label={playing ? 'Pausar' : 'Reproducir'}
            >
              {playing ? <Pause className="size-5" aria-hidden="true" /> : <Play className="size-5" aria-hidden="true" />}
            </Button>
            {canSpeak ? (
              <Button
                variant="ghost"
                size="icon-lg"
                onClick={() => {
                  setNarrate((n) => !n)
                  setPlaying(true)
                }}
                aria-pressed={narrate}
                className={cn(
                  'size-11 rounded-full text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground',
                  narrate && 'bg-primary-foreground/15',
                )}
                aria-label={narrate ? 'Desactivar narración' : 'Activar narración en voz alta'}
              >
                {narrate ? <Volume2 className="size-5" aria-hidden="true" /> : <VolumeX className="size-5" aria-hidden="true" />}
              </Button>
            ) : null}
            <Button
              variant="ghost"
              size="icon-lg"
              onClick={onClose}
              className="size-11 rounded-full text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              aria-label="Cerrar historia"
            >
              <X className="size-5" aria-hidden="true" />
            </Button>
          </div>

          <div key={`${pill.id}-${index}`} className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto py-4" aria-live="polite">
            <div
              aria-hidden="true"
              className="relative mb-6 flex size-28 shrink-0 items-center justify-center self-start rounded-full bg-primary-foreground/10 motion-safe:animate-in motion-safe:zoom-in-75 motion-safe:fade-in motion-safe:duration-500"
            >
              <span className="absolute -inset-3 rounded-full border border-primary-foreground/15" />
              <span className="absolute -inset-7 rounded-full border border-primary-foreground/10" />
              <PillGlyph name={slide.icon} className="size-12 text-accent" />
            </div>

            <p className="text-sm font-semibold tracking-[0.12em] text-accent uppercase">
              {index + 1} de {slides.length} · {formatDuration(pill.seconds)}
            </p>
            <h2 className="mt-2 font-serif text-4xl leading-[1.08] text-balance motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500">
              {slide.heading}
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-pretty text-primary-foreground/80">{slide.body}</p>

            {slide.example ? (
              <figure
                className={cn(
                  'mt-5 rounded-2xl border-l-4 bg-primary-foreground/10 p-4',
                  slide.example.tone === 'bad' ? 'border-l-destructive' : 'border-l-accent',
                )}
              >
                <figcaption className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                  {slide.example.tone === 'bad' ? (
                    <>
                      <TriangleAlert className="size-4 text-destructive" aria-hidden="true" />
                      Ejemplo de riesgo
                    </>
                  ) : (
                    <>
                      <Check className="size-4 text-accent" aria-hidden="true" />
                      Así sí
                    </>
                  )}
                </figcaption>
                <blockquote className="mt-1.5 text-base leading-snug font-medium">{slide.example.text}</blockquote>
              </figure>
            ) : null}
          </div>

          <div className="flex flex-col gap-3">
            {isLast && pill.next ? (
              <Link
                href={pill.next.href}
                className="flex h-12 items-center justify-center rounded-2xl bg-accent px-5 text-base font-semibold text-accent-foreground hover:bg-accent/85"
              >
                {pill.next.label}
              </Link>
            ) : null}
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="touch"
                disabled={index === 0}
                onClick={() => setIndex((i) => i - 1)}
                className="flex-1 border border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Anterior
              </Button>
              {isLast && pill.next ? (
                <Button
                  variant="ghost"
                  size="touch"
                  onClick={onClose}
                  className="flex-1 border border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  Terminar
                </Button>
              ) : (
                <Button
                  variant="accent"
                  size="touch"
                  onClick={() => (isLast ? onClose() : setIndex((i) => i + 1))}
                  className="flex-[2]"
                >
                  {isLast ? 'Terminar' : 'Siguiente'}
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  )
}

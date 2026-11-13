'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { ChevronRight, Fingerprint } from 'lucide-react'
import { getLevel, toneStyles, type Tone } from '@/lib/score'
import { cn } from '@/lib/utils'

const CX = 130
const CY = 130
const RADIUS = 100
const STROKE = 16
const START_ANGLE = 150
const SWEEP = 240
const ZONE_GAP = 1.1

const ZONES: { from: number; to: number; tone: Tone }[] = [
  { from: 0, to: 60, tone: 'destructive' },
  { from: 60, to: 85, tone: 'warning' },
  { from: 85, to: 100, tone: 'success' },
]

const zoneStroke: Record<Tone, string> = {
  success: 'stroke-success',
  warning: 'stroke-warning',
  destructive: 'stroke-destructive',
}

function pointAt(value: number, radius = RADIUS) {
  const angle = ((START_ANGLE + (SWEEP * value) / 100) * Math.PI) / 180
  return { x: CX + radius * Math.cos(angle), y: CY + radius * Math.sin(angle) }
}

function arcPath(from: number, to: number) {
  const start = pointAt(from)
  const end = pointAt(to)
  const largeArc = ((to - from) * SWEEP) / 100 > 180 ? 1 : 0
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`
}

function useAnimatedNumber(target: number) {
  const [shown, setShown] = useState(0)
  const current = useRef(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      current.current = target
      setShown(target)
      return
    }
    const from = current.current
    const startedAt = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / 1100)
      const eased = 1 - Math.pow(1 - progress, 3)
      current.current = from + (target - from) * eased
      setShown(current.current)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target])

  return shown
}

export function ScoreArc({ score, cta }: { score: number; cta?: string }) {
  const maskId = useId()
  const level = getLevel(score)
  const shown = useAnimatedNumber(score)
  const knob = pointAt(shown)
  const knobTone = getLevel(shown).tone

  return (
    <div className="mx-auto flex w-full max-w-[300px] flex-col items-center">
      <div className="relative w-full">
        <svg viewBox="0 0 260 208" className="w-full overflow-visible" aria-hidden="true">
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="260" height="208">
              <path
                d={arcPath(0, 100)}
                fill="none"
                stroke="white"
                strokeWidth={STROKE + 6}
                pathLength={100}
                strokeDasharray={`${shown} 200`}
              />
            </mask>
          </defs>

          <g fill="none" strokeWidth={STROKE}>
            {ZONES.map((zone) => (
              <path
                key={zone.tone}
                d={arcPath(zone.from === 0 ? 0 : zone.from + ZONE_GAP, zone.to === 100 ? 100 : zone.to - ZONE_GAP)}
                className={cn(zoneStroke[zone.tone], 'opacity-[0.16]')}
              />
            ))}
          </g>
          <g fill="none" strokeWidth={STROKE} mask={`url(#${maskId})`}>
            {ZONES.map((zone) => (
              <path
                key={zone.tone}
                d={arcPath(zone.from === 0 ? 0 : zone.from + ZONE_GAP, zone.to === 100 ? 100 : zone.to - ZONE_GAP)}
                className={zoneStroke[zone.tone]}
              />
            ))}
          </g>

          {shown > 0.5 ? (
            <circle
              cx={knob.x}
              cy={knob.y}
              r={STROKE / 2 + 4}
              strokeWidth={4}
              className={cn('fill-card drop-shadow-md', zoneStroke[knobTone])}
            />
          ) : null}

          <text x={pointAt(0).x} y={pointAt(0).y + 26} textAnchor="middle" className="fill-muted-foreground text-[11px] font-medium">
            0
          </text>
          <text x={pointAt(100).x} y={pointAt(100).y + 26} textAnchor="middle" className="fill-muted-foreground text-[11px] font-medium">
            100
          </text>
        </svg>

        <div className="absolute inset-x-0 top-[61%] flex -translate-y-1/2 flex-col items-center">
          <p className="font-serif text-[4.5rem] leading-none tracking-tight tabular-nums">{Math.round(shown)}</p>
          <p className="mt-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">de 100</p>
          <span className={cn('mt-2.5 rounded-full px-3 py-1 text-sm font-semibold', toneStyles[level.tone].soft)}>
            {level.label}
          </span>
        </div>
      </div>

      {cta ? (
        <span
          aria-hidden="true"
          className="mt-1 flex w-fit items-center gap-1.5 rounded-full bg-primary py-2.5 pr-3 pl-4 text-sm font-semibold text-primary-foreground shadow-md"
        >
          <Fingerprint className="size-4" />
          {cta}
          <ChevronRight className="size-4" />
        </span>
      ) : null}
    </div>
  )
}

export function ScoreLegend() {
  const zones: { tone: Tone; label: string; range: string }[] = [
    { tone: 'destructive', label: 'Bajo', range: '0–59' },
    { tone: 'warning', label: 'Medio', range: '60–84' },
    { tone: 'success', label: 'Alto', range: '85–100' },
  ]
  return (
    <ul className="flex items-center justify-center gap-4 text-xs text-muted-foreground" aria-hidden="true">
      {zones.map((zone) => (
        <li key={zone.tone} className="flex items-center gap-1.5">
          <span className={cn('size-2 rounded-full', toneStyles[zone.tone].dot)} />
          {zone.label} <span className="tabular-nums opacity-70">{zone.range}</span>
        </li>
      ))}
    </ul>
  )
}

export function ScoreRing({ score, size = 104 }: { score: number; size?: number }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--muted)" strokeWidth="9" />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="9"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${score} 100`}
          className="transition-[stroke-dasharray] duration-700 ease-out"
        />
      </svg>
      <p className="absolute inset-0 flex items-center justify-center font-serif text-[2rem] leading-none">
        {score}
        <span className="mt-2 font-sans text-xs font-medium text-muted-foreground">/100</span>
      </p>
    </div>
  )
}

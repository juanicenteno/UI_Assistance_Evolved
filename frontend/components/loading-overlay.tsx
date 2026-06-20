"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { LOADING_STEPS } from "@/lib/brief-data"

export function LoadingOverlay() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStep((s) => (s + 1) % LOADING_STEPS.length)
    }, 900)
    return () => clearInterval(stepTimer)
  }, [])

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-5 backdrop-blur-md"
    >
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-2xl shadow-black/40">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary">
          Generando tu propuesta
        </span>

        <h2 className="mt-5 font-heading text-2xl font-bold tracking-tight text-balance">
          Tu brief se está construyendo
        </h2>

        <p className="mt-2 min-h-5 text-sm text-muted-foreground transition-opacity">
          {LOADING_STEPS[step]}
        </p>

        <div className="mt-7 flex justify-center" style={{ animation: "brief-float 2.4s ease-in-out infinite" }}>
          <Image
            src="/mascot-robot.png"
            alt="Mascota asistente generando tu brief"
            width={150}
            height={150}
            className="size-36 object-contain"
            priority
          />
        </div>

        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full w-full animate-pulse rounded-full bg-gradient-brand"
          />
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Suele tardar entre 15 y 40 segundos.
        </p>
      </div>
    </div>
  )
}

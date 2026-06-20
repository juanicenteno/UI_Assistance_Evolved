"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { LandingView } from "@/components/landing-view"
import { BriefForm } from "@/components/brief-form"
import { LoadingOverlay } from "@/components/loading-overlay"
import type { FormState } from "@/lib/brief-data"
import { generateBrief } from "@/lib/api"
import { saveBriefToHistory } from "@/lib/storage"

type Stage = "landing" | "form" | "loading" | "error"

export default function Page() {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>("landing")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (data: FormState) => {
    setStage("loading")
    setErrorMsg("")
    try {
      const result = await generateBrief(data)
      saveBriefToHistory({
        id: result.id,
        name: result.brief.name || "Brief sin nombre",
        date: new Date().toISOString()
      })
      router.push(`/result?id=${result.id}`)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error desconocido")
      setStage("error")
    }
  }

  const reset = () => {
    setStage("landing")
    setErrorMsg("")
  }

  return (
    <main className="min-h-screen">
      <SiteHeader onReset={reset} />

      {stage === "landing" && <LandingView onStart={() => setStage("form")} />}

      {(stage === "form" || stage === "loading") && (
        <BriefForm onBack={reset} onSubmit={handleSubmit} />
      )}

      {stage === "loading" && <LoadingOverlay />}

      {stage === "error" && (
        <div className="mx-auto max-w-lg px-5 py-20 text-center">
          <p className="text-destructive font-semibold">Error al generar el brief</p>
          <p className="mt-2 text-sm text-muted-foreground">{errorMsg}</p>
          <button
            onClick={reset}
            className="mt-6 rounded-xl bg-gradient-brand px-6 py-3 font-semibold text-primary-foreground"
          >
            Volver a intentar
          </button>
        </div>
      )}
    </main>
  )
}

"use client"

import { Suspense, useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { BriefResult } from "@/components/brief-result"
import { fetchBrief } from "@/lib/api"
import type { BriefResult as BriefResultType } from "@/lib/brief-data"

function ResultContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  const [brief, setBrief] = useState<BriefResultType | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (!id) {
      setLoading(false)
      setErrorMsg("No se proporcionó un ID de brief")
      return
    }

    setLoading(true)
    setErrorMsg("")

    fetchBrief(id)
      .then(setBrief)
      .catch((err) => setErrorMsg(err instanceof Error ? err.message : "Error al cargar el brief"))
      .finally(() => setLoading(false))
  }, [id])

  const handleReset = useCallback(() => {
    router.push("/")
  }, [router])

  if (loading) {
    return (
      <main className="min-h-screen">
        <SiteHeader onReset={() => router.push("/")} />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Cargando brief...</p>
          </div>
        </div>
      </main>
    )
  }

  if (errorMsg || !brief) {
    return (
      <main className="min-h-screen">
        <SiteHeader onReset={() => router.push("/")} />
        <div className="mx-auto max-w-lg px-5 py-20 text-center">
          <p className="text-destructive font-semibold">
            {errorMsg || "No se pudo cargar el brief"}
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 rounded-xl bg-gradient-brand px-6 py-3 font-semibold text-primary-foreground"
          >
            Volver al inicio
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <SiteHeader onReset={handleReset} />
      <BriefResult brief={brief} briefId={id} onReset={handleReset} />
    </main>
  )
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen">
          <SiteHeader onReset={() => {}} />
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </main>
      }
    >
      <ResultContent />
    </Suspense>
  )
}

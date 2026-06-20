"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Trash2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { getBriefHistory, removeBriefFromHistory, type BriefHistoryItem } from "@/lib/storage"

export default function MisBriefsPage() {
  const [briefs, setBriefs] = useState<BriefHistoryItem[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setBriefs(getBriefHistory())
  }, [])

  const handleRemove = (id: string) => {
    removeBriefFromHistory(id)
    setBriefs(getBriefHistory())
  }

  if (!isMounted) return null

  return (
    <main className="min-h-screen">
      <SiteHeader />

      <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-gradient-brand sm:text-4xl">
          Mis Briefs
        </h1>

        {briefs.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-border bg-card p-16 text-center">
            <p className="text-muted-foreground">
              Todavía no generaste ningún brief.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-brand px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-accent/20 transition-transform hover:-translate-y-0.5"
            >
              Crear mi primer brief
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {briefs.map((brief) => (
              <div
                key={brief.id}
                className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 transition-transform hover:-translate-y-0.5"
              >
                <div>
                  <h2
                    className="font-heading text-lg font-bold tracking-tight line-clamp-1"
                    title={brief.name}
                  >
                    {brief.name}
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(brief.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <Link
                    href={`/result?id=${brief.id}`}
                    className="flex-1 rounded-2xl bg-gradient-brand px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground shadow-lg shadow-accent/20 transition-transform hover:-translate-y-0.5"
                  >
                    Ver brief
                  </Link>
                  <button
                    onClick={() => handleRemove(brief.id)}
                    className="rounded-2xl border border-border bg-secondary/40 p-2.5 text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
                    aria-label="Borrar brief"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

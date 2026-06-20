"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Briefcase,
  Check,
  Copy,
  Download,
  GraduationCap,
  Heart,
  MapPin,
  RotateCcw,
  Sparkles,
  Type,
  Users,
  MessageSquare,
  Send,
  Loader2,
  X,
} from "lucide-react"
import type { BriefResult } from "@/lib/brief-data"
import { API_URL, getPdfUrl, refineBrief } from "@/lib/api"
import { saveBriefToHistory } from "@/lib/storage"

function SectionCard({
  title,
  children,
  className,
}: {
  title?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-3xl border border-border bg-card p-6 sm:p-8 ${className ?? ""}`}
    >
      {title && (
        <h2 className="mb-5 font-heading text-xl font-bold tracking-tight text-primary">
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}

function ColorCard({ name, hex }: { name: string; hex: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(hex)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      // clipboard not available
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="group overflow-hidden rounded-2xl border border-border text-left transition-transform hover:-translate-y-0.5"
    >
      <div className="h-24 w-full" style={{ backgroundColor: hex }} />
      <div className="flex items-center justify-between gap-2 bg-secondary/40 px-3 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="font-mono text-xs uppercase text-muted-foreground">
            {hex}
          </p>
        </div>
        {copied ? (
          <Check className="size-4 shrink-0 text-primary" />
        ) : (
          <Copy className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </div>
    </button>
  )
}

function ImageSkeleton() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-xl bg-secondary/40">
      <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="text-xs text-muted-foreground">Generando imagen...</p>
    </div>
  )
}

export function BriefResult({
  brief: initialBrief,
  briefId,
  onReset,
}: {
  brief: BriefResult
  briefId: string | null
  onReset: () => void
}) {
  const [brief, setBrief] = useState(initialBrief)
  const [imagesReady, setImagesReady] = useState(false)
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    {
      sender: "bot",
      text: "¡Hola! Soy tu asistente de marca. Puedo modificar cualquier parte de este brief (colores, tipografías, el nombre, la descripción, la personalidad, etc.). Dime qué cambio te gustaría hacer.",
    },
  ])
  const [input, setInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false)

  useEffect(() => {
    if (!briefId || imagesReady) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/brief/${briefId}`)
        const data = await res.json()

        if (data.status === "ready") {
          setBrief((prev) => ({
            ...prev,
            logo: data.logo_url ? `${API_URL}${data.logo_url}` : prev.logo,
            mockup: data.mockup_url ? `${API_URL}${data.mockup_url}` : prev.mockup,
          }))
          setImagesReady(true)
          clearInterval(interval)
        }
      } catch (e) {
        console.error("Polling error:", e)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [briefId, imagesReady])

  const p = brief.persona

  const handleDownload = () => {
    if (briefId) {
      window.open(getPdfUrl(briefId), "_blank")
    } else {
      window.print()
    }
  }

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input
    if (!messageText.trim() || isSending || !briefId) return

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: messageText }])
    if (!textToSend) setInput("")
    setIsSending(true)

    try {
      const response = await refineBrief(briefId, messageText)
      
      // Update local state with the new brief
      setBrief(response.brief)

      // Save to history (updating name if it changed)
      saveBriefToHistory({
        id: briefId,
        name: response.brief.name || "Brief sin nombre",
        date: new Date().toISOString(),
      })

      // If the status is pending, we need to start polling for images again!
      if (response.status === "pending") {
        setImagesReady(false)
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "¡Hecho! He actualizado tu brief de marca. Dado que los cambios afectan a la identidad visual, estoy regenerando el logo y el mockup en segundo plano. Se actualizarán automáticamente aquí en unos momentos.",
          },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `¡Listo! He aplicado los cambios solicitados (ahora la marca se llama '${response.brief.name}').`,
          },
        ])
      }
    } catch (err) {
      console.error(err)
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Lo siento, ocurrió un error al intentar refinar el brief: ${err instanceof Error ? err.message : "Error desconocido"}.`,
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  const renderChatBody = (onCloseMobile?: () => void) => {
    return (
      <div className="flex h-full flex-col bg-card overflow-hidden">
        {/* Header */}
        <div className="border-b border-border bg-secondary/20 p-4 flex items-center justify-between shrink-0">
          <div>
            <h3 className="flex items-center gap-2 font-heading font-bold text-foreground">
              <MessageSquare className="size-5 text-primary animate-bounce-subtle" />
              Asistente de Marca 🤖
            </h3>
            <p className="text-xs text-muted-foreground">
              Conversa con la IA para modificar tu brief en vivo
            </p>
          </div>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="rounded-xl border border-border bg-secondary/40 p-2 text-muted-foreground hover:bg-secondary/70 hover:text-foreground transition-colors"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.sender === "user"
                    ? "bg-gradient-brand text-primary-foreground font-medium"
                    : "bg-secondary/60 text-foreground animate-slide-in-left"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl bg-secondary/60 px-4 py-2.5 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin text-primary" />
                Analizando e implementando cambios...
              </div>
            </div>
          )}
        </div>

        {/* Quick chips (pills) */}
        <div className="px-4 py-3 border-t border-border bg-secondary/10 shrink-0">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2">Sugerencias:</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              "🎨 Tonos pastel",
              "💼 Nombre corporativo",
              "👶 Persona más joven",
              "🔥 Tono más atrevido",
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                disabled={isSending}
                onClick={() => handleSendMessage(chip.substring(2))}
                className="text-xs rounded-full border border-border bg-card px-2.5 py-1 text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Input field */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="border-t border-border p-3 bg-secondary/20 flex gap-2 shrink-0"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSending}
            placeholder="Ej. 'Cambia los colores a azul y oro'..."
            className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isSending || !input.trim()}
            className="inline-flex size-9 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-sm transition-transform active:scale-95 disabled:opacity-50"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>
    )
  }

  return (
    <>
      {/* Main spacious brief layout (full width, centered) */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 animate-fade-in flex flex-col gap-5">
        {/* Header */}
        <SectionCard className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-accent/20 blur-3xl"
          />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" />
              Brief generado con IA
            </span>
            <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-gradient-brand sm:text-4xl">
              {brief.name}
            </h1>
            {brief.tagline && (
              <p className="mt-1 text-sm font-medium text-brand-yellow">
                {brief.tagline}
              </p>
            )}
            <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
              {brief.description}
            </p>
          </div>
        </SectionCard>

        {/* Identidad visual */}
        <SectionCard title="Identidad visual">
          <div className="grid gap-5 lg:grid-cols-2">
            {[
              { label: "Logo", src: brief.logo },
              { label: "Mockup", src: brief.mockup },
            ].map((item) => (
              <figure
                key={item.label}
                className="overflow-hidden rounded-2xl border border-border bg-secondary/20"
              >
                <div className="flex aspect-video items-center justify-center p-6">
                  {!imagesReady ? (
                    <ImageSkeleton />
                  ) : (
                    <Image
                      src={item.src || "/placeholder.png"}
                      alt={`${item.label} de la propuesta de marca ${brief.name}`}
                      width={640}
                      height={400}
                      className="max-h-full w-auto rounded-xl object-contain"
                    />
                  )}
                </div>
                <figcaption className="border-t border-border/60 px-4 py-3 text-sm text-muted-foreground">
                  {item.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </SectionCard>

        {/* Paleta + tipografía */}
        <div className="grid gap-5 lg:grid-cols-2">
          <SectionCard title="Paleta de colores">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
              {brief.colors.map((c) => (
                <ColorCard key={c.hex} name={c.name} hex={c.hex} />
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Tocá un color para copiar el código HEX.
            </p>
          </SectionCard>

          <SectionCard title="Tipografías">
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-secondary/20 p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                  <Type className="size-3.5" />
                  Títulos · {brief.typography.heading}
                </div>
                <p className="mt-2 font-heading text-2xl font-bold leading-snug">
                  {brief.typography.sample}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-secondary/20 p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                  <Type className="size-3.5" />
                  Cuerpo · {brief.typography.body}
                </div>
                <p className="mt-2 text-base leading-relaxed">
                  {brief.typography.sample}
                </p>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Tono de voz */}
        <SectionCard title="Tono de voz">
          <div className="flex flex-wrap gap-2.5">
            {brief.voice.map((v) => (
              <span
                key={v}
                className="rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
              >
                {v}
              </span>
            ))}
          </div>
        </SectionCard>

        {/* User Persona */}
        <SectionCard title="User Persona">
          <div className="grid gap-6 md:grid-cols-[auto_1fr]">
            <div className="flex flex-col items-center gap-3 md:items-start">
              <Image
                src={p.avatar || "/placeholder.svg"}
                alt={`Avatar de la user persona ${p.name}`}
                width={120}
                height={120}
                className="size-28 rounded-2xl border border-border object-cover"
              />
              <p className="font-heading text-xl font-bold text-brand-yellow">
                {p.name}
              </p>
            </div>

            <div>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm sm:grid-cols-3">
                <Detail icon={Users} label="Edad" value={`${p.age} años`} />
                <Detail icon={GraduationCap} label="Estudios" value={p.education} />
                <Detail icon={Heart} label="Situación" value={p.status} />
                <Detail icon={Briefcase} label="Ocupación" value={p.occupation} />
                <Detail icon={MapPin} label="País" value={p.country} />
                <Detail icon={Users} label="Hijos" value={String(p.children)} />
              </dl>

              <p className="mt-4 leading-relaxed text-muted-foreground">{p.bio}</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border-l-2 border-primary bg-secondary/20 p-4">
                  <h3 className="font-semibold">Motivaciones</h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {p.motivations.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border-l-2 border-accent bg-secondary/20 p-4">
                  <h3 className="font-semibold">Frustraciones</h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {p.frustrations.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row print:hidden">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-brand px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-accent/20 transition-transform hover:-translate-y-0.5 animate-pulse-subtle"
          >
            <Download className="size-4" />
            Descargar PDF
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-secondary/40 px-6 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-secondary/70"
          >
            <RotateCcw className="size-4" />
            Crear otro brief
          </button>
        </div>
      </div>

      {/* Global Floating Chatbot Trigger Button (visible on all screens) */}
      <div className="fixed bottom-6 right-6 z-50 print:hidden">
        <button
          type="button"
          onClick={() => setIsMobileChatOpen(!isMobileChatOpen)}
          className="flex items-center gap-2.5 rounded-full bg-gradient-brand px-5 py-4 font-heading text-sm font-semibold text-primary-foreground shadow-xl shadow-accent/30 hover:scale-105 active:scale-95 transition-all"
        >
          {isMobileChatOpen ? (
            <>
              <X className="size-4" />
              <span>Cerrar Asistente</span>
            </>
          ) : (
            <>
              <MessageSquare className="size-4 animate-bounce-subtle" />
              <span>Preguntale a la IA 🤖</span>
            </>
          )}
        </button>
      </div>

      {/* Desktop Chatbot Widget Window (visible on lg+) */}
      {isMobileChatOpen && (
        <div className="hidden lg:flex fixed bottom-24 right-6 w-[380px] h-[550px] z-50 flex-col rounded-3xl border border-border bg-card shadow-2xl overflow-hidden print:hidden animate-fade-in">
          {renderChatBody(() => setIsMobileChatOpen(false))}
        </div>
      )}

      {/* Mobile Chat Drawer Overlay (visible on <lg) */}
      {isMobileChatOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm lg:hidden print:hidden animate-fade-in">
          {/* Backdrop click to close */}
          <div
            className="absolute inset-0 bg-transparent"
            onClick={() => setIsMobileChatOpen(false)}
          />
          {/* Chat Drawer container */}
          <div className="relative w-full max-w-md rounded-t-3xl border-t border-x border-border bg-card shadow-2xl flex flex-col h-[85vh] animate-slide-in-up overflow-hidden">
            {/* Drawer drag indicator line */}
            <div className="mx-auto my-3 h-1.5 w-12 rounded-full bg-muted-foreground/30 shrink-0" />
            
            <div className="flex-1 overflow-hidden">
              {renderChatBody(() => setIsMobileChatOpen(false))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
      <div>
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="font-medium">{value}</dd>
      </div>
    </div>
  )
}

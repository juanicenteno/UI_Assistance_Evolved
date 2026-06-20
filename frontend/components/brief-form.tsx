"use client"

import { useMemo, useState } from "react"
import { ArrowLeft, Check, Sparkles } from "lucide-react"
import {
  AUDIENCES,
  EMPTY_FORM,
  INDUSTRIES,
  PERSONALITIES,
  STYLES,
  TONES,
  type FormState,
} from "@/lib/brief-data"

type ChipGroupProps = {
  options: readonly string[]
  selected: string[]
  onToggle: (value: string) => void
  multi?: boolean
}

function ChipGroup({ options, selected, onToggle }: ChipGroupProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((option) => {
        const active = selected.includes(option)
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(option)}
            className={[
              "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "border-transparent bg-gradient-brand text-primary-foreground"
                : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/40 hover:text-foreground",
            ].join(" ")}
          >
            {active && <Check className="size-3.5" />}
            {option}
          </button>
        )
      })}
    </div>
  )
}

function Section({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="border-t border-border/60 py-7 first:border-t-0 first:pt-0">
      <div className="mb-4">
        <h3 className="font-heading text-base font-semibold uppercase tracking-wide text-primary">
          {title}
        </h3>
        {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

export function BriefForm({
  onBack,
  onSubmit,
}: {
  onBack: () => void
  onSubmit: (data: FormState) => void
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  const toggleMulti = (key: keyof FormState, value: string) => {
    setForm((prev) => {
      const list = prev[key] as string[]
      return {
        ...prev,
        [key]: list.includes(value)
          ? list.filter((v) => v !== value)
          : [...list, value],
      }
    })
  }

  const isValid = useMemo(
    () =>
      form.idea.trim().length > 5 &&
      form.industry !== "" &&
      form.personalities.length > 0 &&
      form.audience.length > 0,
    [form],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver
      </button>

      <div className="rounded-3xl border border-border bg-card p-6 sm:p-9">
        <Section title="¿Qué creamos hoy?" hint="Describí tu idea o producto en una o dos frases.">
          <textarea
            value={form.idea}
            onChange={(e) => setForm((p) => ({ ...p, idea: e.target.value }))}
            rows={4}
            placeholder="Ej: Una plataforma de IA que genera planes de marketing personalizados…"
            className="w-full resize-none rounded-2xl border border-input bg-secondary/30 px-4 py-3.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </Section>

        <Section title="¿A qué industria perteneces?">
          <ChipGroup
            options={INDUSTRIES}
            selected={form.industry ? [form.industry] : []}
            onToggle={(v) =>
              setForm((p) => ({ ...p, industry: p.industry === v ? "" : v }))
            }
          />
        </Section>

        <Section title="Personalidad de tu marca" hint="Elegí una o varias.">
          <ChipGroup
            options={PERSONALITIES}
            selected={form.personalities}
            onToggle={(v) => toggleMulti("personalities", v)}
          />
        </Section>

        <Section title="¿Qué querés comunicar?">
          <ChipGroup
            options={TONES}
            selected={form.tone}
            onToggle={(v) => toggleMulti("tone", v)}
          />
        </Section>

        <Section title="Elegí tu estilo">
          <ChipGroup
            options={STYLES}
            selected={form.styles}
            onToggle={(v) => toggleMulti("styles", v)}
          />
        </Section>

        <Section title="Elegí tu público">
          <ChipGroup
            options={AUDIENCES}
            selected={form.audience}
            onToggle={(v) => toggleMulti("audience", v)}
          />
        </Section>

        <Section title="¿Qué te diferencia del resto?" hint="Opcional, pero suma mucho.">
          <input
            value={form.differentiator}
            onChange={(e) =>
              setForm((p) => ({ ...p, differentiator: e.target.value }))
            }
            placeholder="Ej: Acceso libre y sin tabúes a cualquier tema."
            className="w-full rounded-2xl border border-input bg-secondary/30 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </Section>
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-brand px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-accent/20 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
      >
        <Sparkles className="size-4" />
        Generar propuesta de marca
      </button>
      {!isValid && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Completá tu idea, industria, personalidad y público para continuar.
        </p>
      )}
    </form>
  )
}

"use client"

import { ArrowRight, Lightbulb, Palette, Rocket, Sparkles } from "lucide-react"

const STEPS = [
  {
    icon: Lightbulb,
    title: "Idea",
    description: "Contanos qué querés crear y a quién te dirigís. Sin tecnicismos.",
  },
  {
    icon: Palette,
    title: "Diseño",
    description: "La IA define identidad, paleta, tipografías y tono de voz.",
  },
  {
    icon: Rocket,
    title: "Resultado",
    description: "Obtené un brief listo para presentar y descargar en PDF.",
  },
]

const TAGS = ["Brief creativo", "Paleta + tipografías", "User persona"]

export function LandingView({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-accent/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-20 size-72 rounded-full bg-primary/15 blur-3xl"
        />

        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" />
            Asistente de branding con IA
          </span>

          <h1 className="mt-6 font-heading text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-6xl">
            Crea un brief de marca completo en minutos
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Definí tu idea, elegí el tono de tu marca y obtené una propuesta
            visual lista para presentar.
          </p>

          <div className="mt-7 flex flex-wrap gap-2.5">
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-secondary/60 px-3.5 py-1.5 text-sm text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="mt-10 flex flex-col items-start gap-6 sm:mt-12">
        <h2 className="font-heading text-2xl font-bold tracking-tight text-balance sm:text-3xl">
          Transformá tus ideas en realidad con{" "}
          <span className="text-gradient-brand">Inteligencia Artificial.</span>
        </h2>

        <button
          type="button"
          onClick={onStart}
          className="group inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-accent/20 transition-transform hover:-translate-y-0.5"
        >
          Creá tu proyecto ahora
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </section>

      {/* How it works */}
      <section className="mt-12 rounded-3xl border border-border bg-card/60 p-8 sm:mt-16 sm:p-10">
        <h2 className="text-center font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          ¿Cómo funciona?
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-border bg-secondary/30 p-6"
            >
              <span className="absolute right-5 top-5 font-heading text-sm font-bold text-muted-foreground/50">
                0{i + 1}
              </span>
              <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground">
                <step.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-heading text-lg font-semibold">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

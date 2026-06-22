"use client"

import { useState } from "react"
import Link from "next/link"
import { Sparkles, Menu, X, Mail, History } from "lucide-react"

export function SiteHeader({ onReset }: { onReset?: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogoClick = () => {
    if (onReset) {
      onReset()
    } else {
      window.location.href = "/"
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <button
          type="button"
          onClick={handleLogoClick}
          className="group flex items-center gap-2.5 text-left focus:outline-none"
        >
          {/* <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-md shadow-accent/15 group-hover:scale-105 transition-all">
            <Sparkles className="size-4 animate-pulse-subtle" />
          </div> */}
          <span className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">
            <span className="text-brand-yellow">AI</span>{" "}
            <span>Brief Assistant</span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          <Link
            href="/"
            onClick={onReset}
            className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-all"
          >
            Generador
          </Link>
          <Link
            href="/my_briefs"
            className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-all"
          >
            Mis Briefs
          </Link>
          <a
            href="mailto:juanignaciocenteno5@gmail.com"
            className="ml-2 rounded-xl bg-secondary/60 border border-border/60 hover:bg-secondary/80 hover:border-primary/20 px-4 py-2 text-sm font-semibold text-foreground transition-all flex items-center gap-1.5"
          >
            <Mail className="size-3.5" />
            Contáctame
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="inline-flex items-center justify-center rounded-xl p-2 text-muted-foreground hover:bg-secondary/50 hover:text-foreground md:hidden focus:outline-none"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-border/40 bg-background/95 backdrop-blur-xl md:hidden animate-slide-in-left">
          <nav className="flex flex-col gap-1.5 p-4">
            <Link
              href="/"
              onClick={() => {
                setMobileMenuOpen(false)
                if (onReset) onReset()
              }}
              className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
            >
              <Sparkles className="size-4 text-primary" />
              Generador
            </Link>
            <Link
              href="/my_briefs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
            >
              <History className="size-4 text-accent" />
              Mis Briefs
            </Link>
            <a
              href="mailto:juanignaciocenteno5@gmail.com"
              className="flex items-center gap-2.5 rounded-xl bg-gradient-brand px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors"
            >
              <Mail className="size-4" />
              Contáctame
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}

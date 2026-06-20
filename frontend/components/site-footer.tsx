"use client"

import { Sparkles, Heart } from "lucide-react"

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-md py-8 sm:py-12 mt-auto print:hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2.5">
            {/* <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-brand text-primary-foreground shadow-sm shadow-accent/15">
              <Sparkles className="size-3.5" />
            </div> */}
            <span className="font-heading text-base font-bold tracking-tight text-foreground">
              <span className="text-brand-yellow">AI</span>{" "} Brief Assistant
            </span>
          </div>

          {/* Copyright */}
          <p className="text-center text-xs text-muted-foreground sm:text-left flex items-center gap-1.5 flex-wrap justify-center">
            <span>© {currentYear} AI Brief Assistant. Todos los derechos reservados.</span>
            <span className="hidden sm:inline">|</span>
            <span className="flex items-center gap-1">
              Creado con <Heart className="size-3 text-destructive fill-destructive animate-pulse-subtle" /> por Juan Ignacio Centeno.
            </span>
          </p>

          {/* Social / Studio Links */}
          <div className="flex items-center gap-4 text-muted-foreground">
            {/* GitHub */}
            <a
              href="https://github.com/juanicenteno"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/juan-ignacio-centeno/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" rx="1" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

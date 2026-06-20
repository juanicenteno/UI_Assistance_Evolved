export type FormState = {
  idea: string
  industry: string
  personalities: string[]
  tone: string[]
  styles: string[]
  audience: string[]
  differentiator: string
}

export const INDUSTRIES = [
  "Tecnología",
  "Comida",
  "Moda",
  "Salud",
  "Educación",
  "Finanzas",
] as const

export const PERSONALITIES = [
  "Profesional",
  "Divertida",
  "Minimalista",
  "Rebelde",
  "Elegante",
  "Tradicional",
  "Creativa",
  "Premium",
] as const

export const TONES = [
  "Cercano",
  "Inspirador",
  "Técnico",
  "Humorístico",
  "Formal",
  "Aspiracional",
] as const

export const STYLES = [
  "Moderno",
  "Minimalista",
  "Futurista",
  "Clásico",
  "Artesanal",
  "Elegante",
  "Lúdico",
  "Tecnológico",
] as const

export const AUDIENCES = [
  "Jóvenes",
  "Adultos",
  "Niños",
  "Adolescentes",
  "Ancianos",
] as const

export const EMPTY_FORM: FormState = {
  idea: "",
  industry: "",
  personalities: [],
  tone: [],
  styles: [],
  audience: [],
  differentiator: "",
}

export type ColorSwatch = {
  name: string
  hex: string
}

export type BriefResult = {
  name: string
  tagline: string
  description: string
  logo: string
  mockup: string
  colors: ColorSwatch[]
  typography: {
    heading: string
    body: string
    sample: string
  }
  voice: string[]
  persona: {
    name: string
    avatar: string
    age: number
    education: string
    status: string
    occupation: string
    country: string
    children: number
    bio: string
    motivations: string[]
    frustrations: string[]
  }
}

// Mock generated brief used while the AI backend is not connected.
export const MOCK_BRIEF: BriefResult = {
  name: "Saber Prohibido",
  tagline: "Conocimiento sin fronteras",
  description:
    "Un espacio donde la curiosidad y el conocimiento se encuentran sin fronteras, dirigido a adultos y ancianos que buscan explorar temas de interés con libertad y cercanía.",
  logo: "/brief-logo.png",
  mockup: "/brief-mockup.png",
  colors: [
    { name: "Slate", hex: "#2E4053" },
    { name: "Amber", hex: "#FFC080" },
    { name: "Cloud", hex: "#F5F7FA" },
    { name: "Ink", hex: "#1B2530" },
  ],
  typography: {
    heading: "Montserrat",
    body: "Inter",
    sample: "The quick brown fox jumps over the lazy dog",
  },
  voice: ["Cercano", "Inspirador", "Curioso", "Sin tabúes"],
  persona: {
    name: "Luisa",
    avatar: "/persona-luisa.png",
    age: 42,
    education: "Universitaria",
    status: "Casada",
    occupation: "Docente",
    country: "México",
    children: 2,
    bio: "Mujer curiosa y abierta, busca expandir su conocimiento en diferentes áreas y disfruta de la libertad de explorar temas sin restricciones.",
    motivations: ["Aprender siempre", "Explorar temas de interés", "Compartir lo que descubre"],
    frustrations: ["Limitaciones en el acceso a información", "Poca profundidad en los contenidos"],
  },
}

export const LOADING_STEPS = [
  "Analizando tu idea…",
  "Definiendo la estrategia de marca…",
  "Eligiendo paleta y tipografías…",
  "Diseñando la identidad visual…",
  "Construyendo tu user persona…",
  "Puliendo los últimos detalles…",
]

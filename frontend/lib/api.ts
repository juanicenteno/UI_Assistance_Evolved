import type { BriefResult, FormState } from "./brief-data"

export const API_URL = process.env.NEXT_PUBLIC_API_URL || ""

function mapFormToPayload(form: FormState): Record<string, unknown> {
  return {
    idea: form.idea,
    industria: form.industry,
    personalidad: form.personalities,
    comunicacion: form.tone,
    estilo: form.styles,
    publico: form.audience,
    diferencial: form.differentiator,
  }
}

export function mapBriefResponse(brief: any, tone: string[]): BriefResult {
  const fonts = brief.fonts || []
  const headingFont =
    fonts.find((f: any) => f.usage?.toLowerCase().includes("título"))?.font ||
    fonts[0]?.font ||
    "Inter"
  const bodyFont =
    fonts.find((f: any) => f.usage?.toLowerCase().includes("cuerpo"))?.font ||
    fonts[1]?.font ||
    fonts[0]?.font ||
    "Inter"

  return {
    name: brief.name || "",
    tagline: "",
    description: brief.description || "",
    logo: brief.logo_url ? `${API_URL}${brief.logo_url}` : "",
    mockup: brief.mockup_url ? `${API_URL}${brief.mockup_url}` : "",
    colors: (brief.colors || []).map((c: any) => ({
      name: c.name,
      hex: c.hex,
    })),
    typography: {
      heading: headingFont,
      body: bodyFont,
      sample: "The quick brown fox jumps over the lazy dog",
    },
    voice: tone.length > 0 ? tone : ["Creativo", "Profesional"],
    persona: {
      name: brief.persona?.name || "",
      avatar:
        brief.persona?.sex === "masculino"
          ? `${API_URL}/uploads/upm.png`
          : `${API_URL}/uploads/upf.png`,
      age: brief.persona?.age || 30,
      education: brief.persona?.education || "",
      status: brief.persona?.situacion || "",
      occupation: brief.persona?.ocupation || "",
      country: brief.persona?.country || "",
      children: brief.persona?.hijos || 0,
      bio: brief.persona?.description || "",
      motivations: brief.persona?.motivations || [],
      frustrations: brief.persona?.frustrations || [],
    },
  }
}

export async function generateBrief(
  form: FormState
): Promise<{ id: string; brief: BriefResult }> {
  const payload = mapFormToPayload(form)

  const res = await fetch(`${API_URL}/api/generar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new Error(err.error || `Error ${res.status}`)
  }

  const data = await res.json()
  return {
    id: data.id,
    brief: mapBriefResponse(data.brief, form.tone),
  }
}

export async function fetchBrief(id: string): Promise<BriefResult> {
  const res = await fetch(`/api/brief/${id}`)

  if (!res.ok) {
    throw new Error("Error al obtener el brief")
  }

  const data = await res.json()
  return mapBriefResponse(data, data.comunicacion || [])
}

export async function refineBrief(
  id: string,
  instruction: string
): Promise<{ brief: BriefResult; status: string }> {
  const res = await fetch(`/api/brief/${id}/refinar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ instruccion: instruction }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new Error(err.error || `Error ${res.status}`)
  }

  const data = await res.json()
  return {
    brief: mapBriefResponse(data.brief, data.brief.comunicacion || []),
    status: data.status,
  }
}

export function getPdfUrl(id: string): string {
  return `${API_URL}/api/generar-pdf?id=${id}`
}

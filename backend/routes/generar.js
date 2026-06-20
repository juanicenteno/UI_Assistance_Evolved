const { Router } = require("express");
const crypto = require("crypto");
const pool = require("../db");
const { generateBriefGroq } = require("../services/groq");
const { generateImage, saveImage } = require("../services/images");

const router = Router();

const systemPrompt = `Sos un Diseñador UX Senior y Director de Branding con enfoque estratégico, creativo y orientado al detalle. Tu tarea es crear un brief creativo completo y con personalidad basado en los datos del usuario.

REQUISITOS IMPORTANTES:
- El resultado debe ser EXCLUSIVAMENTE un JSON válido. NO incluyas texto fuera del JSON.
- Todos los textos dentro del JSON deben estar en español (excepto los prompts de imágenes).
- Los textos deben ser creativos, concretos y NO genéricos.
- El nombre del proyecto debe ser llamativo y original.
- Los textos del 'logo_prompt' y 'mockup_prompt' deben estar en INGLÉS e incluir la paleta de colores.

GUÍA DE ESTILO:
- Tono creativo, profesional y con identidad propia.
- Evitá frases vacías como "experiencia moderna" o "soluciones innovadoras".
- Usá detalles sensoriales y narrativas persuasivas.

FORMATO EXACTO DEL JSON A ENTREGAR:
{
  "name": "Nombre creativo del proyecto",
  "description": "Descripción del negocio con tono creativo y clara",
  "colors": [
    { "hex": "#HEX", "name": "Nombre del color", "role": "Uso del color" }
  ],
  "fonts": [
    { "font": "Nombre de la fuente", "url": "https://...", "usage": "para títulos o cuerpo" }
  ],
  "persona": {
    "name": "Nombre",
    "age": 30,
    "sex": "masculino o femenino",
    "country": "país de nacimiento",
    "education": "nivel educativo",
    "situacion": "soltero/a o casado/a",
    "ocupation": "posición laboral actual",
    "hijos": 0,
    "motivations": ["Motivación 1", "Motivación 2"],
    "frustrations": ["Frustración 1", "Frustración 2"],
    "description": "Breve pero potente descripción psicológica del usuario"
  },
  "logo_prompt": "Prompt corto en inglés para generar el logo",
  "mockup_prompt": "Prompt corto en inglés para generar mockups realistas"
}`;

router.post("/", async (req, res) => {
    const { idea, industria, personalidad, comunicacion, estilo, publico, diferencial } = req.body;

    if (!idea || !industria) {
        return res.status(400).json({ error: "Los campos 'idea' e 'industria' son obligatorios." });
    }

    console.log("📥 Datos recibidos:", req.body);

    const userPrompt = `Por favor, genera el brief basado en lo siguiente:
- Idea del negocio: "${idea}"
- Industria: ${industria}
- Personalidad: ${JSON.stringify(personalidad)}
- Comunicación: ${JSON.stringify(comunicacion)} 
- Estilo visual deseado: ${JSON.stringify(estilo)}
- Público objetivo: ${JSON.stringify(publico)}
- Diferencial: ${diferencial}`;

    try {
        // PASO 1: Brief con IA
        console.log("🧠 Generando brief...");
        const rawContent = await generateBriefGroq(systemPrompt, userPrompt);
        console.log("🧾 Brief recibido:\n", rawContent);

        let brief;
        try {
            brief = JSON.parse(rawContent);
        } catch (parseError) {
            console.error("❌ Error al parsear JSON:", parseError);
            return res.status(500).json({ error: "La respuesta de la IA no es un JSON válido.", rawContent });
        }

        // Guardar comunicacion (tone) en el objeto brief para usarlo al mapear
        brief.comunicacion = comunicacion;

        // PASO 2: Guardar en DB con status pending
        const id = crypto.randomUUID();
        await pool.query(
            "INSERT INTO briefs (id, data, status) VALUES (?, ?, 'pending')",
            [id, JSON.stringify(brief)]
        );

        // Responde inmediatamente sin esperar imágenes
        res.json({ id, brief });

        // PASO 3: Imágenes en background
        generateImagesBackground(id, brief);

    } catch (error) {
        console.error("❌ Error general:", error.message);
        res.status(500).json({ error: error.message || "Error generando brief con IA" });
    }
});

async function generateImagesBackground(id, brief) {
    try {
        // Paralelo, no secuencial
        const logoBuffer = await generateImage(brief.logo_prompt)
        await new Promise(r => setTimeout(r, 8000)) // esperás antes del segundo
        const mockupBuffer = await generateImage(brief.mockup_prompt)
        
        brief.logo_url = saveImage(logoBuffer, "logo");
        brief.mockup_url = saveImage(mockupBuffer, "mockup");

        await pool.query(
            "UPDATE briefs SET data = ?, status = 'ready' WHERE id = ?",
            [JSON.stringify(brief), id]
        );
        console.log("✅ Imágenes listas para brief:", id);
    } catch (e) {
        console.error("❌ Error generando imágenes:", e.message);
        await pool.query("UPDATE briefs SET status = 'error' WHERE id = ?", [id]);
    }
}

module.exports = router;

const { Router } = require("express");
const pool = require("../db");
const { generateBriefGroq } = require("../services/groq");
const { generateImage, saveImage } = require("../services/images");

const router = Router();

const refineSystemPrompt = `Sos un Diseñador UX Senior y Director de Branding con enfoque estratégico, creativo y orientado al detalle. 
Tu tarea es modificar un brief creativo en formato JSON según las instrucciones de refinamiento del usuario.

REQUISITOS IMPORTANTES:
- El resultado debe ser EXCLUSIVAMENTE el JSON modificado válido. NO incluyas explicaciones ni texto fuera del JSON.
- Mantén la misma estructura del JSON original.
- Realiza únicamente los cambios solicitados por el usuario, manteniendo la coherencia general del branding.
- NUNCA alteres ni modifiques los campos 'logo_prompt', 'mockup_prompt', 'logo_url', ni 'mockup_url'. Déjalos exactamente igual a como vienen en el JSON de entrada. Las imágenes del logo y del mockup no deben cambiar bajo ningún concepto.
- Si el usuario pide cambiar colores, actualiza la paleta de colores. Si pide cambiar tipografías, actualiza las fuentes.

ESTRUCTURA DE RETORNO (DEBE SER EXACTAMENTE ESTA):
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
  "mockup_prompt": "Prompt corto en inglés para generar mockups realistas",
  "comunicacion": ["Tono 1", "Tono 2"]
}`;

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query("SELECT data, status FROM briefs WHERE id = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ error: "No encontrado" });
        const brief = JSON.parse(rows[0].data);
        res.json({ ...brief, status: rows[0].status });
    } catch (error) {
        console.error("❌ Error al obtener brief:", error.message);
        res.status(500).json({ error: "Error al obtener el brief" });
    }
});

router.post("/:id/refinar", async (req, res) => {
    const { id } = req.params;
    const { instruccion } = req.body;

    if (!instruccion) {
        return res.status(400).json({ error: "El campo 'instruccion' es obligatorio." });
    }

    try {
        // Obtener el brief actual
        const [rows] = await pool.query("SELECT data, status FROM briefs WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Brief no encontrado" });
        }

        const currentBrief = JSON.parse(rows[0].data);

        // Crear el prompt para el modelo de lenguaje
        const userPrompt = `Brief actual:
${JSON.stringify(currentBrief, null, 2)}

Instrucción de refinamiento/modificación:
"${instruccion}"`;

        console.log(`🧠 Refinando brief ${id}...`);
        const rawContent = await generateBriefGroq(refineSystemPrompt, userPrompt);
        console.log("🧾 Brief refinado recibido:\n", rawContent);

        let updatedBrief;
        try {
            updatedBrief = JSON.parse(rawContent);
        } catch (parseError) {
            console.error("❌ Error al parsear JSON refinado:", parseError);
            return res.status(500).json({ error: "La respuesta de la IA no es un JSON válido.", rawContent });
        }

        // Asegurar que conservamos SIEMPRE las imágenes y sus prompts originales de manera intacta
        updatedBrief.logo_url = currentBrief.logo_url;
        updatedBrief.mockup_url = currentBrief.mockup_url;
        updatedBrief.logo_prompt = currentBrief.logo_prompt;
        updatedBrief.mockup_prompt = currentBrief.mockup_prompt;

        if (!updatedBrief.comunicacion && currentBrief.comunicacion) {
            updatedBrief.comunicacion = currentBrief.comunicacion;
        }

        // Forzar a que nunca cambien las imágenes ni se regeneren
        const logoPromptChanged = false;
        const mockupPromptChanged = false;

        if (logoPromptChanged || mockupPromptChanged) {
            // Guardar con status 'pending'
            await pool.query(
                "UPDATE briefs SET data = ?, status = 'pending' WHERE id = ?",
                [JSON.stringify(updatedBrief), id]
            );

            res.json({ id, brief: updatedBrief, status: "pending" });

            // Iniciar regeneración en background
            refineImagesBackground(id, updatedBrief, logoPromptChanged, mockupPromptChanged);
        } else {
            // Guardar con status 'ready'
            await pool.query(
                "UPDATE briefs SET data = ?, status = 'ready' WHERE id = ?",
                [JSON.stringify(updatedBrief), id]
            );

            res.json({ id, brief: updatedBrief, status: "ready" });
        }

    } catch (error) {
        console.error("❌ Error general al refinar:", error.message);
        res.status(500).json({ error: error.message || "Error al refinar el brief con IA" });
    }
});

async function refineImagesBackground(id, brief, logoChanged, mockupChanged) {
    try {
        if (logoChanged) {
            console.log("🔄 [Background] Regenerando logo para brief:", id);
            const logoBuffer = await generateImage(brief.logo_prompt);
            brief.logo_url = saveImage(logoBuffer, "logo");
        }

        if (logoChanged && mockupChanged) {
            // Espera de 8 segundos para evitar rate limits
            await new Promise(r => setTimeout(r, 8000));
        }

        if (mockupChanged) {
            console.log("🔄 [Background] Regenerando mockup para brief:", id);
            const mockupBuffer = await generateImage(brief.mockup_prompt);
            brief.mockup_url = saveImage(mockupBuffer, "mockup");
        }

        await pool.query(
            "UPDATE briefs SET data = ?, status = 'ready' WHERE id = ?",
            [JSON.stringify(brief), id]
        );
        console.log("✅ [Background] Imágenes refinadas listas para brief:", id);
    } catch (e) {
        console.error("❌ [Background] Error refinando imágenes:", e.message);
        await pool.query("UPDATE briefs SET status = 'error' WHERE id = ?", [id]);
    }
}

module.exports = router;

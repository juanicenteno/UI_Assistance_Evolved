const fs = require("fs");
const path = require("path");

// ── GENERACIÓN DE IMÁGENES (POLLINATIONS.AI) ──
// Usa la API pública de Pollinations.ai (FLUX model) para generar imágenes sin API key.
// Recibe un prompt en inglés y devuelve un Buffer con la imagen PNG (1024×1024).

async function generateImage(prompt) {
    const encoded = encodeURIComponent(prompt);
    const response = await fetch(
        `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true`,
        { method: "GET" }
    );

    if (!response.ok) {
        throw new Error(`Pollinations error ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

// ── PERSISTENCIA EN DISCO ──
// Guarda el buffer de la imagen en /uploads con un nombre único basado en timestamp.

function saveImage(buffer, prefix = "image") {
    const uploadDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    const filename = `${prefix}_${Date.now()}.png`;
    fs.writeFileSync(path.join(uploadDir, filename), buffer);
    return `/uploads/${filename}`;
}

module.exports = { generateImage, saveImage };

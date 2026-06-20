const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const flags = require("emoji-flags");

// ── GENERACIÓN DE PDF ──
// Toma un brief (objeto JSON), lo renderiza con Handlebars usando brief-template.html,
// y genera un PDF con Puppeteer. Las URLs de imágenes deben ser absolutas.

async function generatePdf(brief, hostUrl) {
    const templatePath = path.join(__dirname, "..", "templates", "brief-template.html");
    const templateSource = fs.readFileSync(templatePath, "utf8");
    const compileTemplate = handlebars.compile(templateSource);

    const persona = brief.persona || {};

    const countryName = persona.country || "";
    const country = flags.data.find(
        (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );

    const fontsRaw = brief.fonts || [];

    const headingFont =
        fontsRaw.find((f) => (f.usage || "").toLowerCase().includes("título"))?.font ||
        fontsRaw[0]?.font ||
        "Inter";

    const bodyFont =
        fontsRaw.find((f) => (f.usage || "").toLowerCase().includes("cuerpo"))?.font ||
        fontsRaw[1]?.font ||
        fontsRaw[0]?.font ||
        "Inter";

    const fontsGoogle = [...new Set([headingFont, bodyFont])].map((f) => ({
        font: f,
        fontUrl: f.replace(/ /g, "+"),
    }));

    const voice = brief.comunicacion || [];

    const htmlData = {
        name: brief.name || "",
        description: brief.description || "",
        logoUrl: brief.logo_url ? `${hostUrl}${brief.logo_url}` : "",
        mockupUrl: brief.mockup_url ? `${hostUrl}${brief.mockup_url}` : "",
        headingFont,
        bodyFont,
        fontsGoogle,
        colors: brief.colors || [],
        voice,
        persona: persona,
        personaAvatar: persona.sex === "masculino"
            ? `${hostUrl}/uploads/upm.png`
            : `${hostUrl}/uploads/upf.png`,
        personaFlag: country?.code
            ? `https://flagcdn.com/w40/${country.code.toLowerCase()}.png`
            : null,
    };

    const html = compileTemplate(htmlData);

    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            preferCSSPageSize: true,
            margin: {
                top: "10mm",
                right: "10mm",
                bottom: "10mm",
                left: "10mm",
            },
        });

        return pdfBuffer;
    } finally {
        await browser.close();
    }
}

module.exports = { generatePdf };

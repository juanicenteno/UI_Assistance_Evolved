const { Router } = require("express");
const pool = require("../db");
const { generatePdf } = require("../services/pdf");

const router = Router();

router.get("/", async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).send("Falta el ID");
    }

    try {
        const [rows] = await pool.query("SELECT data FROM briefs WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).send("No se encontró el brief");
        }

        const brief = JSON.parse(rows[0].data);
        const hostUrl = `${req.protocol}://${req.get("host")}`;
        const pdfBuffer = await generatePdf(brief, hostUrl);

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="brief-${id}.pdf"`,
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.error("❌ Error al generar PDF:", error);
        res.status(500).send("Error interno al generar el PDF");
    }
});

module.exports = router;

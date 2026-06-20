const express = require('express');
const cors = require('cors');
const fs = require("fs");
const path = require("path");

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Sirve las imágenes generadas (logo, mockup) y estáticas (upm.png, upf.png)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rutas
app.use("/api/generar", require("./routes/generar"));
app.use("/api/generar-pdf", require("./routes/pdf"));
app.use("/api/brief", require("./routes/brief"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

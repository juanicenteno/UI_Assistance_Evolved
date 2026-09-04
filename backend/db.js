const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "ux_brief"
});

async function initDb() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS briefs (
                id VARCHAR(36) PRIMARY KEY,
                data JSON NOT NULL,
                status VARCHAR(20) NOT NULL DEFAULT 'pending'
            )
        `);
        const [columns] = await pool.query("SHOW COLUMNS FROM briefs LIKE 'status'");
        if (columns.length === 0) {
            await pool.query("ALTER TABLE briefs ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'pending'");
            console.log("✅ Columna 'status' agregada automáticamente a la tabla 'briefs'.");
        }
    } catch (err) {
        console.error("⚠️ Error verificando estructura de la base de datos:", err.message);
    }
}

initDb();

module.exports = pool;
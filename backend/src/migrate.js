import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sequelize } from "./db.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MIGRATIONS_DIR = path.join(__dirname, "..", "migrations");

async function createMigrationsTableIfMissing() {
    await sequelize.query(
        `CREATE TABLE IF NOT EXISTS schema_migrations (
        id BIGSERIAL PRIMARY KEY,
        filename TEXT UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        `
    );
}

async function getExecutedMigrationFilenames() {
    const [rows] = await sequelize.query(
        `SELECT filename FROM schema_migrations ORDER BY filename ASC;`
    );

    return new Set(rows.map((row) => row.filename));
}

async function runMigrationFile(filename) {
    const filePath = path.join(MIGRATIONS_DIR, filename);
    const sql = fs.readFileSync(filePath, "utf-8");

    const t = await sequelize.transaction();

    try {
        await sequelize.query(sql, { transaction: t });
        await sequelize.query(
            `INSERT INTO schema_migrations (filename) VALUES (:filename);`, {
            replacements: { filename },
            transaction: t
        });

        await t.commit();
        console.log(`Applied: ${filename}`);
    }
    catch (err) {
        await t.rollback();
        console.error(`Failed ${filename}`);
        throw err;
    }
}


async function main() {
    await sequelize.authenticate();
    await createMigrationsTableIfMissing();

    const result = await getExecutedMigrationFilenames();

    const files = fs.readdirSync(MIGRATIONS_DIR).filter((file) => file.endsWith(".sql")).sort();

    for (const f of files) {
        if (!result.has(f)) await runMigrationFile(f);
        else console.log(`Skipped ${f}`);
    }

    await sequelize.close();
}

main().catch((err) => {
    console.error(err?.message || err);
    process.exit(1);
});

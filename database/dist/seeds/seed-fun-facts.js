"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const pg_1 = require("pg");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const schema_1 = require("../drizzle/schema");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const db = (0, node_postgres_1.drizzle)(pool);
const facts = [
    { icon: "🎓", text: "Full-Stack student at freeCodeCamp", position: 1 },
    { icon: "⚡", text: "Full-Stack Developer & Electrical Engineer", position: 2 },
    { icon: "🌐", text: "Member of Microverse Alumni", position: 3 },
    { icon: "🚀", text: "Taking part in Xcelsz Accelerator Program", position: 4 },
];
async function seed() {
    await db.delete(schema_1.funFacts);
    await db.insert(schema_1.funFacts).values(facts);
    console.log("Seeded 4 fun facts.");
    await pool.end();
    process.exit(0);
}
seed();

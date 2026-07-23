"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const pg_1 = require("pg");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const schema_1 = require("../drizzle/schema");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const db = (0, node_postgres_1.drizzle)(pool);
async function seed() {
    await db.insert(schema_1.contactMessages).values({
        name: "Test User",
        email: "test@example.com",
        message: "Seed data example",
    });
    console.log("Seeded.");
    await pool.end();
    process.exit(0);
}
seed();

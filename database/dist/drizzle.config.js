"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
require("dotenv/config");
exports.default = (0, drizzle_kit_1.defineConfig)({
    schema: "./drizzle/schema.ts",
    out: "./migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.VITE_DATABASE_URL,
    },
});

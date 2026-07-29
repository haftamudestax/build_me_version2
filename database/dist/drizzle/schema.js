"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.funFacts = exports.contactMessages = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.contactMessages = (0, pg_core_1.pgTable)("contact_messages", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    email: (0, pg_core_1.text)("email").notNull(),
    message: (0, pg_core_1.text)("message").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.funFacts = (0, pg_core_1.pgTable)("fun_facts", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    icon: (0, pg_core_1.text)("icon").notNull(),
    text: (0, pg_core_1.text)("text").notNull(),
    position: (0, pg_core_1.integer)("position").notNull(),
});

import { pgTable, serial, text, timestamp, integer, uuid, boolean } from "drizzle-orm/pg-core";

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const funFacts = pgTable("fun_facts", {
  id: serial("id").primaryKey(),
  icon: text("icon").notNull(),
  text: text("text").notNull(),
  position: integer("position").notNull(),
});

export const navigationEvents = pgTable("navigation_events", {
  eventId: uuid("event_id").primaryKey(),
  sessionId: uuid("session_id").notNull(),
  sourceRoute: text("source_route").notNull(),
  destinationRoute: text("destination_route").notNull(),
  eventType: text("event_type").notNull(),
  navigationSuccess: boolean("navigation_success").notNull(),
  deviceType: text("device_type").notNull(),
  viewportType: text("viewport_type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
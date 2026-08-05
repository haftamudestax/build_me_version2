"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Server is running");
});
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.get("/api/bookings", async (req, res) => {
    res.json({ message: "Bookings API endpoint is working" });
});
app.get("/api/events", async (req, res) => {
    res.json({ message: "Events API endpoint is working" });
});
app.get("/api/leads", async (req, res) => {
    res.json({ message: "Leads API endpoint is working" });
});
exports.default = app;

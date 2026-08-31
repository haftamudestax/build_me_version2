import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Routes.tsx";
import { configureNavAnalytics } from "@build-me/ui/navbar";
configureNavAnalytics({
  baseUrl: import.meta.env.VITE_ANALYTICS_URL ?? null,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

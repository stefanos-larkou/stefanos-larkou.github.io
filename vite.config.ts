import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const PORT = 5173;

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: { port: PORT, strictPort: true },
    test: {
        environment: "jsdom",
        setupFiles: "./src/test-setup.ts"
    }
});
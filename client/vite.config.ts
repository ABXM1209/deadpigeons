// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
    return {
        plugins: [react(), tailwindcss()],
        server: {
            proxy: {
                "/api": {
                    target:
                        mode === "production"
                            ? "https://deadpigeon-api.fly.dev"
                            : "http://localhost:5139",
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                },
            },
        },
    };
});

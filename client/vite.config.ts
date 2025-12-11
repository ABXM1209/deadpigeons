import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import {finalUrl} from "./src/baseUrl.ts";
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        port: 5173, // Front end port
        proxy: {
            "/api": {
                target: finalUrl,
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path,
            },
        }
    },
});

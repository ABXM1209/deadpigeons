import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => {

    return {
        plugins: [react(), tailwindcss()],
        server: {
            port: 5173,
            proxy: {
                "/api": {
                    target: "http://localhost:5139",
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                },
            },
        },
    };
});

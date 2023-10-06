import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json" assert { type: "json" };

export default defineConfig({
    plugins: [
        vue({
            script: {
                defineModel: true,
            },
        }),
        crx({ manifest }),
    ],
});

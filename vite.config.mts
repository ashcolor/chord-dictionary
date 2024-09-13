import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json" assert { type: "json" };
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

export default defineConfig({
    plugins: [
        vue({}),
        // @https://tomikyblog.com/vue-i18n-csp-header-unsafe_eval/
        VueI18nPlugin({}),
        crx({ manifest }),
    ],
});

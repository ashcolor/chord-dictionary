import { createI18n } from "vue-i18n";
import { I18N_CONFIG } from "../src/config/i18n";
import { setup } from "@storybook/vue3";
import { createPinia } from "pinia";
import "../src/tailwind.css";

export const decorators = [
    (story, context) => ({
        template: `
      <div id="chord-dictionary-app">
        <story />
      </div>
    `,
    }),
];

const i18n = createI18n(I18N_CONFIG);

const pinia = createPinia();

setup((app) => {
    if (!app.__VUE_I18N__) {
        app.use(i18n);
        app.use(pinia);
    }
});

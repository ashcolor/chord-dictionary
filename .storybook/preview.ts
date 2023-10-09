import { createI18n } from "vue-i18n";
import { I18N_CONFIG } from "../src/config/i18n";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { setup } from "@storybook/vue3";
import { createPinia } from "pinia";

const i18n = createI18n(I18N_CONFIG);

const vuetify = createVuetify({
    components,
    directives,
});

const pinia = createPinia();

setup((app) => {
    if (!app.__VUE_I18N__) {
        app.use(i18n);
        app.use(vuetify);
        app.use(pinia);
    }
});

import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import { createPinia } from "pinia";
import "./tailwind.css";
import App from "./App.vue";
import { I18N_CONFIG } from "./config/i18n";

const i18n = createI18n(I18N_CONFIG);

const pinia = createPinia();

const app = createApp(App);

app.use(i18n);
app.use(pinia);

app.mount("#app");

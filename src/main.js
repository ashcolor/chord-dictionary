import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import messages from "./config/i18n";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const el = document.createElement("app");
el.id = "chord-dictionary-app";
const wrapperEl = document.getElementById("chord-dictionary-wrapper");

if (wrapperEl) wrapperEl.remove();
document.body.appendChild(el);

const i18n = createI18n({
    locale: "en",
    messages,
    legacy: false,
});

const vuetify = createVuetify({
    components,
    directives,
});

const app = createApp(App);

app.use(i18n);
app.use(vuetify);

app.mount("#chord-dictionary-app");

window.addEventListener("beforeunload", () => {
    chrome.runtime.sendMessage(null, "reload");
});

import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import { I18N_CONFIG } from "../config/i18n";
import { createPinia } from "pinia";
import "./tailwind.css";

const el = document.createElement("app");
el.id = "chord-dictionary-app";
document.body.appendChild(el);

const i18n = createI18n(I18N_CONFIG);

const pinia = createPinia();

const app = createApp(App);

app.use(i18n);
app.use(pinia);

app.mount("#chord-dictionary-app");

const fontUrl = chrome.runtime.getURL("assets/FreeSerif.woff2");
const style = document.createElement("style");
style.textContent = `
  @font-face {
    font-family: 'FreeSerif';
    src: url('${fontUrl}') format('woff2');
`;
document.head.appendChild(style);

window.addEventListener("beforeunload", () => {
    chrome.runtime.sendMessage(null, "reload");
});

import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import { createPinia } from "pinia";
import "./tailwind.css";
import App from "./App.vue";
import { I18N_CONFIG } from "../config/i18n";

const i18n = createI18n(I18N_CONFIG);

const pinia = createPinia();

const app = createApp(App);

app.use(i18n);
app.use(pinia);

app.mount("#app");

const fontUrl = chrome.runtime.getURL("assets/FreeSerif.woff2");
const style = document.createElement("style");
style.textContent = `
  @font-face {
    font-family: 'FreeSerif';
    src: url('${fontUrl}') format('woff2');
`;
document.head.appendChild(style);

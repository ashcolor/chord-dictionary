import Vue from "vue";
import App from "./App.vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import VueI18n from "vue-i18n";
import langs from "./config/i18n";

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueI18n);

Vue.config.productionTip = false;

const el = document.createElement("app");
el.id = "chord-dictionary-app";
const wrapperEl = document.getElementById("chord-dictionary-wrapper");
if (wrapperEl) wrapperEl.remove();
document.body.appendChild(el);
new Vue({
    render: (h) => h(App),
    i18n: new VueI18n({
        locale: "en",
        messages: langs,
    }),
}).$mount("#chord-dictionary-app");
window.addEventListener("beforeunload", () => {
    chrome.runtime.sendMessage(null, "reload");
});

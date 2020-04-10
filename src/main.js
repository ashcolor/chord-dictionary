import Vue from "vue";
import App from "./App.vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import VueI18n from "vue-i18n";

import langs from "./config/i18n";

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

Vue.use(VueI18n);

Vue.config.productionTip = false;

const appId = "chord-dictionary-app";
const wrapperId = "chord-dictionary-wrapper";
const el = document.createElement("app");
el.id = appId;
const wrapperEl = document.getElementById(wrapperId);
if (!wrapperEl) {
  document.body.appendChild(el);
  new Vue({
    render: h => h(App),
    i18n: new VueI18n({
      locale: 'en',
      messages: langs
    })
  }).$mount("#" + appId);
} else {
  wrapperEl.remove();
}
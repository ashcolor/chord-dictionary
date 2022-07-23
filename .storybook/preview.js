import Vue from "vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import VueI18n from "vue-i18n";
import langs from "../src/config/i18n";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.use(VueI18n);
const i18n = new VueI18n({
    locale: "en",
    messages: langs,
});
Vue.prototype._i18n = () => i18n;
Vue.prototype.$t = (...args) => i18n.t(...args);

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};

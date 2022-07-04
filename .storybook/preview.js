import Vue from "vue";
import VueI18n from "vue-i18n";
import langs from "../src/config/i18n";
import "../src/assets/style/tailwind.css";

Vue.use(VueI18n);
const i18n = new VueI18n({
    locale: "en",
    messages: langs,
});
Vue.prototype._i18n = function () {
    return i18n;
};
Vue.prototype.$t = function (...args) {
    return i18n.t(...args);
};

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};

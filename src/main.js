import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false;

const appId = "chord-dictionary-app";
const wrapperId = "cd-wrapper";
const el = document.createElement("app");
el.id = appId;
const wrapperEl = document.getElementById(wrapperId)
const isActive = (wrapperEl == null)
if (isActive) {
    document.body.appendChild(el);
    new Vue({
        render: h => h(App)
    }).$mount("#" + appId);
} else {
    wrapperEl.remove();
}
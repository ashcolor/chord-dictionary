import Vue from 'vue'
import App from './App.vue'

const el = document.createElement("app");
el.id = "app";
document.body.appendChild(el);

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
}).$mount('#app')
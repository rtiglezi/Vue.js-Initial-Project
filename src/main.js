import Vue from "vue";
import VeeValidate from "vee-validate";

import "font-awesome/css/font-awesome.css";
import "./config/bootstrap";
import "./config/msgs";
import "./config/axios";

import App from "./App";
import pt_BR from "vee-validate/dist/locale/pt_BR";

import store from "./config/store";
import router from "./config/router";

import VueSidebarMenu from "vue-sidebar-menu";
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'

Vue.use(VueSidebarMenu);

Vue.use(VeeValidate, {
  locale: "pt_BR",
  dictionary: {
    pt_BR: pt_BR
  }
});

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");

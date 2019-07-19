import Vue from "vue";

import VeeValidate from "vee-validate";
import pt_BR from "vee-validate/dist/locale/pt_BR";

import "./config/bootstrap";
import "./config/msgs";
import "./config/axios";

import App from "./App";

import store from "./config/store";
import router from "./config/router";

import VueDraggable from "vue-draggable";

Vue.use(VueDraggable);

Vue.use(VeeValidate, {
  fieldsBagName: "formFields",
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

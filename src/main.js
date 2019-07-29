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

import VueTheMask from 'vue-the-mask'


import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import Fieldset from 'primevue/fieldset';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

Vue.component('InputText', InputText);
Vue.component('Button', Button);
Vue.component('Menu', Menu);
Vue.component('Fieldset', Fieldset);
Vue.component('Accordion', Accordion);
Vue.component('AccordionTab', AccordionTab);

import 'primevue/resources/themes/nova-light/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';



Vue.use(VueTheMask)
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

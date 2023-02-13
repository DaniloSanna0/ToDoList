import Vue from "vue";

import {
  ButtonPlugin,
  OverlayPlugin,
  SpinnerPlugin,
  ModalPlugin,
  BIcon,
  BIconTelephoneFill,
} from "bootstrap-vue";

Vue.use(ButtonPlugin);
Vue.use(SpinnerPlugin);
Vue.use(OverlayPlugin);
Vue.use(ModalPlugin);

Object.entries({
  BIcon,
  BIconTelephoneFill,
}).forEach(([name, component]) => Vue.component(name, component));

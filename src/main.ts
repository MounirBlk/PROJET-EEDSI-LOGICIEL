import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import './plugins/base';
import './plugins/vee-validate';
import './plugins/axiosApi';
//import '@mdi/font/css/materialdesignicons.css'
import qs from 'qs';
import moment from 'vue-moment'
//import RayPlugin from 'vue-ray/vue2';
//import VuePageTransition from 'vue-page-transition';
//Vue.use(VuePageTransition)
Vue.config.productionTip = false;

Vue.use(qs.stringify); // querystringify
Vue.use(moment);

export const bus = new Vue();

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

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
import io from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'
import VuePageTransition from 'vue-page-transition';
import SequentialEntrance from 'vue-sequential-entrance'
import 'vue-sequential-entrance/vue-sequential-entrance.css'

Vue.config.productionTip = false;

/*Vue.use(new VueSocketIO({
  debug: true,
  connection: io(store.state.baseUrl), //options object is Optional
  vuex: {
    store,
    actionPrefix: "SOCKET_",
    mutationPrefix: "SOCKET_"
  }
}));*/
//Vue.prototype.$socket = io(store.state.baseUrl);

Vue.use(SequentialEntrance);
Vue.use(qs.stringify); // querystringify
Vue.use(moment);
Vue.use(VuePageTransition);

export const bus = new Vue();

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

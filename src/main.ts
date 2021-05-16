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
import VueSocketIOExt from 'vue-socket.io-extended'
import VuePageTransition from 'vue-page-transition';

Vue.config.productionTip = false;

//const SocketInstance = io(store.state.baseUrl);
/*Vue.use(new VueSocketIO({
  debug: true,
    connection: SocketInstance, //options object is Optional
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_"
    }
}))*/
//Vue.use(VueSocketIOExt, SocketInstance, { store })

Vue.use(qs.stringify); // querystringify
Vue.use(moment);
Vue.use(VuePageTransition)

export const bus = new Vue();

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

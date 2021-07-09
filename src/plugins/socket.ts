import Vue from 'vue';
import io from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';
import store from '../store';

/*Vue.use(new VueSocketIO({
    debug: true,
    connection: io(store.state.baseUrl), //options object is Optional
    vuex: {
        store,
        actionPrefix: "SOCKET_",
        mutationPrefix: "SOCKET_"
    }
}));

Vue.prototype.$socket = io(store.state.baseUrl);*/

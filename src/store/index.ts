import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const dataGlobal = createPersistedState({
  paths: ['isAdmin'],
})

export default new Vuex.Store({
  state: {
    drawer: null,
    isAdmin: null
  },
  plugins: [dataGlobal], //plugin permettant d'utiliser le localstorage pour une state en particulier
  mutations: {
    SET_DRAWER(state, payload) {
      state.drawer = payload
    },
    SET_IS_ADMIN(state, payload) {
      state.isAdmin = payload
    },
  },
  actions: {
  },
  modules: {
  }
})

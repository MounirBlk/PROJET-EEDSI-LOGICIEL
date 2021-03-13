import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import {
  bus
} from "../main";
//import Home from '../views/Home.vue'

Vue.use(VueRouter)

const Auth = (next: any, to: any) => {
  if(localStorage.getItem("token") !== null && localStorage.getItem("token") !== undefined && to.path !== "/"){
    bus.$emit("connected", true);
    next()
  }else{
    localStorage.clear();
    bus.$emit("connected", false);
    next({ name: "Connexion"})
  }
}

const routes: Array<RouteConfig> = [{
    path: '/',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import (/* webpackChunkName: "about" */'@/views/Index.vue'),
    children: [{
      name: 'Connexion',
      path: '',
      component: () => import ('@/views/pages/Login.vue'),
      //beforeEnter: (to, from, next) => Auth(next, to )
      //meta: { transition: 'fade-in-up'}
    },
    {
      name: 'Accueil',
      path: 'acceuil',
      component: () => import ('@/views/pages/Dashboard.vue'),
      beforeEnter: (to, from, next) => Auth(next, to)
    }]
  },
  {
    path: '*',
    component: () =>
        import ('@/views/Index.vue'),
    children: [{
        name: '404 Error',
        path: '',
        redirect: "/",
        component: () => import ('@/views/Error.vue'),
    }]
}]

const router = new VueRouter({
  mode: 'hash',// hash mode for electron
  base: process.env.BASE_URL,
  routes
})

/*router.beforeEach((to, from, next) => {
  Auth(next, to)
});*/

export default router

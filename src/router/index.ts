import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
//import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import (/* webpackChunkName: "about" */'@/views/Index.vue'),
    children: []
  },
  {
    path: '*',
    component: () =>
        import ('@/views/Index.vue'),
    children: [{
        name: '404 Error',
        path: '',
        redirect: "/",
        component: () => import ('@/views/Error.vue')
    }]
}
  /*{
    path: '/about',
    name: 'About',
    component: () => import( '../views/About.vue')
  }*/
]

const router = new VueRouter({
  mode: 'hash',// hash mode for electron
  base: process.env.BASE_URL,
  routes
})

export default router

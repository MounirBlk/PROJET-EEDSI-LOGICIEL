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
      path: '/login',
      component: () => import ('@/views/pages/Login.vue'),
      meta: {
        requiresAuth: false,
        //transition: 'fade-in-up'
      }
    },{
      name: 'Accueil',
      path: '/',
      component: () => import ('@/views/pages/Dashboard.vue'),
      //beforeEnter: (to, from, next) => Auth(next, to)
      meta: {
        requiresAuth: true
      }
    },{
      name: 'Utilisateurs',
      path: '/utilisateurs',
      component: () => import ('@/views/pages/Utilisateurs.vue'),
      meta: {
        requiresAuth: true
      }
    },{
      name: 'Informations-Utilisateur',
      path: '/utilisateurs/utilisateur',
      component: () => import ('@/views/pages/InfosUtilisateur.vue'),
      meta: {
        requiresAuth: true
      }
    },{
      name: 'Calendar',
      path: '/calendar',
      component: () => import ('@/views/pages/Calendar.vue'),
      meta: {
        requiresAuth: true
      }
    },{
      name: 'Clients',
      path: '/clients',
      component: () => import ('@/views/pages/Clients.vue'),
      meta: {
        requiresAuth: true
      }
    },{
      name: 'Informations-Client',
      path: '/clients/client',
      component: () => import ('@/views/pages/InfosClient.vue'),
      meta: {
        requiresAuth: true
      }
    },{
      name: 'Livreurs',
      path: '/livreurs',
      component: () => import ('@/views/pages/Livreurs.vue'),
      meta: {
        requiresAuth: true
      }
    },{
      name: 'Informations-Livreur',
      path: '/livreurs/livreur',
      component: () => import ('@/views/pages/InfosLivreur.vue'),
      meta: {
        requiresAuth: true
      }
    },{
      name: 'Paramètres',
      path: '/parametres',
      component: () => import ('@/views/pages/Parametres.vue'),
      meta: {
        requiresAuth: true
      }
    },{
      name: 'Factures',
      path: '/factures',
      component: () => import ('@/views/pages/Factures.vue'),
      meta: {
        requiresAuth: true
      }
    },{
      name: 'Informations-Facture',
      path: '/factures/facture',
      component: () => import ('@/views/pages/InfosFacture.vue'),
      meta: {
        requiresAuth: true
      }
    },{
      name: 'Prospections',
      path: '/prospections',
      component: () => import ('@/views/pages/Prospections.vue'),
      meta: {
        requiresAuth: true
      }
    },{
      name: 'Informations-Prospection',
      path: '/prospections/prospection',
      component: () => import ('@/views/pages/InfosProspection.vue'),
      meta: {
        requiresAuth: true
      }
    },{
      name: 'Signalements',
      path: '/signalements',
      component: () => import ('@/views/pages/Signalements.vue'),
      meta: {
        requiresAuth: true
      }
    },{
      name: 'Livraisons',
      path: '/livraisons',
      component: () => import ('@/views/pages/Livraisons.vue'),
      meta: {
        requiresAuth: true
      }
    },{
      name: 'Informations-Livraison',
      path: '/livraisons/livraison',
      component: () => import ('@/views/pages/InfosLivraison.vue'),
      meta: {
        requiresAuth: true
      }
    },{
      name: 'Produits',
      path: '/produits',
      component: () => import ('@/views/pages/Produits.vue'),
      meta: {
        requiresAuth: true
      }
    },{
      name: 'Informations-Produit',
      path: '/produits/produit',
      component: () => import ('@/views/pages/InfosProduit.vue'),
      meta: {
        requiresAuth: true
      }
    }]
  },
  {
    path: '*',
    component: () =>
        import ('@/views/Index.vue'),
    children: [{
        name: '404 Error',
        path: '/',
        redirect: "/",
        component: () => import ('@/views/Error.vue'),
    }]
}]

const router = new VueRouter({
  mode: 'hash',// hash mode for electron
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (localStorage.getItem("token") === null || localStorage.getItem("token") === undefined) {
      localStorage.clear();
      bus.$emit("connected", false);
      next({
        //path: '/login',
        //query: { redirect: to.path }
        name: "Connexion"
      })
    } else {
      bus.$emit("connected", true);
      next()
    }
  } else {
    bus.$emit("connected", false);
    next() // make sure to always call next()!
  }
});

export default router

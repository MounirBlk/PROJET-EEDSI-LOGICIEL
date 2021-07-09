import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { bus } from '../main';
//import Home from '../views/Home.vue'

Vue.use(VueRouter);

const Auth = (next: any, to: any) => {
	if (localStorage.getItem('SET_TOKEN') !== null && localStorage.getItem('SET_TOKEN') !== undefined && to.path !== '/') {
		bus.$emit('connected', true);
		next();
	} else {
		localStorage.clear();
		bus.$emit('connected', false);
		next({ name: 'Connexion' });
	}
};

/**@param {boolean} isActive */
const setRequiresAuth = (isActive: boolean) => {
	return {
		requiresAuth: isActive
		//transition: 'fade-in-up'
	};
};

const routes: Array<RouteConfig> = [
	{
		path: '/',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ '@/views/Index.vue'),
		children: [
			{
				name: 'Connexion',
				path: '/login',
				component: () => import('@/views/pages/Login.vue'),
				meta: setRequiresAuth(false)
			},
			{
				name: 'Accueil',
				path: '/',
				component: () => import('@/views/pages/Dashboard.vue'),
				//beforeEnter: (to, from, next) => Auth(next, to)
				meta: setRequiresAuth(true)
			},
			{
				name: 'Commerciaux',
				path: '/utilisateurs',
				component: () => import('@/views/pages/Utilisateurs.vue'),
				meta: setRequiresAuth(true)
			},
			{
				name: 'Informations-Commercial',
				path: '/utilisateurs/utilisateur',
				component: () => import('@/views/pages/InfosUtilisateur.vue'),
				meta: setRequiresAuth(true)
			},
			{
				name: 'Calendrier',
				path: '/calendar',
				component: () => import('@/views/pages/Calendar.vue'),
				meta: setRequiresAuth(true)
			},
			{
				name: 'Clients',
				path: '/clients',
				component: () => import('@/views/pages/Clients.vue'),
				meta: setRequiresAuth(true)
			},
			{
				name: 'Informations-Client',
				path: '/clients/client',
				component: () => import('@/views/pages/InfosClient.vue'),
				meta: setRequiresAuth(true)
			},
			{
				name: 'Livreurs',
				path: '/livreurs',
				component: () => import('@/views/pages/Livreurs.vue'),
				meta: setRequiresAuth(true)
			},
			{
				name: 'Informations-Livreur',
				path: '/livreurs/livreur',
				component: () => import('@/views/pages/InfosLivreur.vue'),
				meta: setRequiresAuth(true)
			},
			{
				name: 'Paramètres',
				path: '/parametres',
				component: () => import('@/views/pages/Parametres.vue'),
				meta: setRequiresAuth(true)
			},
			{
				name: 'Prospections',
				path: '/prospections',
				component: () => import('@/views/pages/Prospections.vue'),
				meta: setRequiresAuth(true)
			},
			{
				name: 'Informations-Prospection',
				path: '/prospections/prospection',
				component: () => import('@/views/pages/InfosProspection.vue'),
				meta: setRequiresAuth(true)
			},
			{
				name: 'Commandes',
				path: '/commandes',
				component: () => import('@/views/pages/Commandes.vue'),
				meta: setRequiresAuth(true)
			},
			{
				name: 'Informations-Commande',
				path: '/commandes/commande',
				component: () => import('@/views/pages/InfosCommande.vue'),
				meta: setRequiresAuth(true)
			},
			{
				name: 'Produits',
				path: '/produits',
				component: () => import('@/views/pages/Produits.vue'),
				meta: setRequiresAuth(true)
			},
			{
				name: 'Informations-Produit',
				path: '/produits/produit',
				component: () => import('@/views/pages/InfosProduit.vue'),
				meta: setRequiresAuth(true)
			}
		]
	},
	{
		path: '*',
		component: () => import('@/views/Index.vue'),
		children: [
			{
				name: '404 Error',
				path: '/',
				redirect: '/',
				component: () => import('@/views/Error.vue')
			}
		]
	}
];

const isElectron: boolean = true; //String(process.env.IS_WEB).trim()
const router = new VueRouter({
	mode: isElectron ? 'hash' : 'history', // hash mode for electron
	base: process.env.BASE_URL,
	routes
});

router.beforeEach((to, from, next) => {
	if (to.matched.some((record) => record.meta.requiresAuth)) {
		// this route requires auth, check if logged in
		// if not, redirect to login page.
		if (localStorage.getItem('SET_TOKEN') === null || localStorage.getItem('SET_TOKEN') === undefined) {
			localStorage.clear();
			bus.$emit('connected', false);
			next({
				//path: '/login',
				//query: { redirect: to.path }
				name: 'Connexion'
			});
		} else {
			bus.$emit('connected', true);
			next();
		}
	} else {
		bus.$emit('connected', false);
		next(); // make sure to always call next()!
	}
});

export default router;

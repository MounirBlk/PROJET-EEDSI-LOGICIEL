<template>
<v-navigation-drawer :src="
      !$vuetify.theme.dark
        ? require('@/assets/sidebar-3-beige.jpg')
        : barImageNuit
    " v-model="drawer" app id="core-navigation-drawer">
    <center class="mt-5">
        <v-avatar color="teal" size="56">
            <img alt="Avatar" :src="!$vuetify.theme.dark ? 'https://png.pngtree.com/element_our/20200610/ourlarge/pngtree-shopping-mall-logo-image_2235997.jpg' : require('@/assets/logo.jpg')">
        </v-avatar>
        <strong class="ml-2"> E-commerce </strong>
    </center>
    <v-divider class="my-2"></v-divider>
    <v-list>
        <v-list-item link v-for="(item, index) in items" :key="index" :to="item.to">
            <v-list-item-action>
                <v-icon style="text-shadow: 0.1em 0.1em 0.1em white">{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title>
                    <strong v-if="!$vuetify.theme.dark" style="text-shadow: 0.1em 0.1em 0.1em white; font-size: 18px">{{ item.title }}</strong>
                    <strong v-else style="text-shadow: 0.1em 0.1em 0.1em black; font-size: 18px">{{ item.title }}</strong>
                </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
    </v-list>
</v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
//import * as index from 'vuex';

//require('../../assets/sidebar-3-dark.jpg')
export default Vue.extend({
    name: "DashboardCoreDrawer",
    data: (): any => ({
        //barImageJour: 'https://www.imgonline.com.ua/result_img/imgonline-com-ua-Color-filter-e5SkyjA303JL.jpg' as string,
        barImageNuit: "https://cdn.tomsguide.fr/content/uploads/sites/2/2019/10/voie-lactee-explosion.jpg",
        name: 'Dashboard',
        items: [{
            icon: 'mdi-home-outline',
            title: 'Accueil',
            to: '/',
        }, {
            title: 'Calendrier',
            icon: 'mdi-calendar-month-outline',
            to: '/calendar',
        }, {
            title: 'Utilisateurs',
            icon: 'mdi-clipboard-account',
            to: '/utilisateurs',
        },{
            title: 'Clients',
            icon: 'mdi-clipboard-account-outline',
            to: '/clients',
        },{
            title: 'Factures',
            icon: 'mdi-receipt',
            to: '/factures',
        },{
            title: 'Produits',
            icon: 'mdi-table-chair',
            to: '/produits',
        },{
            title: 'Livreurs',
            icon: 'mdi-walk',
            to: '/livreurs',
        },{
            title: 'Livraisons',
            icon: 'mdi-package-variant-closed',
            to: '/livraisons',
        },{
            title: 'Paramètres',
            icon: 'mdi-cogs',
            to: '/parametres',
        },{
            title: 'Signalements',
            icon: 'mdi-badge-account-alert-outline',
            to: '/signalements',
        },{
            title: 'Prospections',
            icon: 'mdi-bank',
            to: '/prospections',
        }]
    }),
    computed: {
        drawer: {
            get() {
                return this.$store.state.drawer;
            },
            set(val: any) {
                this.$store.commit("SET_DRAWER", val);
            },
        },
    },
});
</script>

<style>
</style>

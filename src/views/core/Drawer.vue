<template>
<v-navigation-drawer :src="
      !$vuetify.theme.dark
        ? require('@/assets/sidebar-3-beige.jpg')
        : barImageNuit
    " v-model="drawer" app id="core-navigation-drawer">
    <center class="mt-5">
        <v-avatar color="teal" size="50">
            <img alt="Avatar" :src="!$vuetify.theme.dark ? 'https://png.pngtree.com/element_our/20200610/ourlarge/pngtree-shopping-mall-logo-image_2235997.jpg' : require('@/assets/logo.jpg')">
        </v-avatar>
        <strong class="ml-1">Dashboard E-Commerce </strong>
    </center>
    <v-divider class="my-2"></v-divider>
    <v-list>
        <v-list-item link v-for="(item, index) in items" :key="index" :to="item.to" v-if="item.disabled !== true">
            <v-list-item-action>
                <v-icon v-if="!$vuetify.theme.dark" style="text-shadow: 0.1em 0.1em 0.1em white">{{ item.icon }}</v-icon>
                <v-icon v-else>{{ item.icon }}</v-icon>
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

export default Vue.extend({
    name: "DashboardCoreDrawer",
    data: (): any => ({
        barImageNuit: "https://www.euractiv.fr/wp-content/uploads/sites/3/2019/07/shutterstock_233084350-800x450.jpg",
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
        }, {
            title: 'Clients',
            icon: 'mdi-clipboard-account-outline',
            to: '/clients',
        }, {
            title: 'Factures',
            icon: 'mdi-receipt',
            to: '/factures',
            disabled: true
        }, {
            title: 'Produits',
            icon: 'mdi-sofa-single',
            to: '/produits',
        }, {
            title: 'Livreurs',
            icon: 'mdi-walk',
            to: '/livreurs',
        }, {
            title: 'Commandes',
            icon: 'mdi-package-variant-closed',
            to: '/commandes',
        }, {
            title: 'Paramètres',
            icon: 'mdi-cogs',
            to: '/parametres',
        }, {
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

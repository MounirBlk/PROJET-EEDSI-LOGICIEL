<template>
<v-navigation-drawer :src="!$vuetify.theme.dark ? barImageJour : barImageNuit" v-model="drawer" app id="core-navigation-drawer">
    <sequential-entrance>
        <center class="mt-5">
            <v-avatar color="teal" size="50">
                <img alt="Avatar" :src="!$vuetify.theme.dark ? 'https://png.pngtree.com/element_our/20200610/ourlarge/pngtree-shopping-mall-logo-image_2235997.jpg' : require('@/assets/logo.jpg')">
            </v-avatar>
            <span class="ml-2">Dashboard E-Commerce </span>
        </center>
    </sequential-entrance>
    <v-divider class="my-2"></v-divider>
    <v-list class="py-0" v-for="(item, index) in items" :key="index" v-if="item.disabled !== true">
        <sequential-entrance>
            <v-list-item v-if="!item.group" dense link :to="item.to">
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
            <v-list-group v-else :color="!$vuetify.theme.dark ? 'black' : 'white'" :prepend-icon="item.icon">
                <template v-slot:activator>
                    <v-list-item-title>
                        <strong v-if="!$vuetify.theme.dark" style="text-shadow: 0.1em 0.1em 0.1em white; font-size: 18px">{{ item.title }}</strong>
                        <strong v-else style="text-shadow: 0.1em 0.1em 0.1em black; font-size: 18px">{{ item.title }}</strong>
                    </v-list-item-title>
                </template>
                <v-list-item dense class="ml-3 mt-1" v-for="(child, i) in item.children" :to="child.to" :key="i" link>
                    <v-list-item-action>
                        <v-icon v-if="!$vuetify.theme.dark" style="text-shadow: 0.1em 0.1em 0.1em white">{{ child.icon }}</v-icon>
                        <v-icon v-else>{{ child.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>
                            <strong v-if="!$vuetify.theme.dark" style="text-shadow: 0.1em 0.1em 0.1em white; font-size: 18px">{{ child.title }}</strong>
                            <strong v-else style="text-shadow: 0.1em 0.1em 0.1em black; font-size: 18px">{{ child.title }}</strong>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-group>
        </sequential-entrance>
    </v-list>
</v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
//import * as index from 'vuex';

export default Vue.extend({
    name: "DashboardCoreDrawer",
    data: (): any => ({
        barImageJour: "https://i.pinimg.com/236x/f1/90/04/f19004dd1da67e6077ecac88c86dd665.jpg", //https://img.fruugo.com/product/5/47/85504475_max.jpg
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
            group: true,
            icon: 'mdi-account-group-outline',
            title: 'Utilisateurs',
            children: [{
                title: 'Commerciaux',
                icon: 'mdi-account-tie-outline',
                to: '/utilisateurs',
            }, {
                title: 'Clients',
                icon: 'mdi-clipboard-account-outline',
                to: '/clients',
            }, {
                title: 'Livreurs',
                icon: 'mdi-walk',
                to: '/livreurs',
            }]
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

<template>
<v-navigation-drawer :src="$vuetify.theme.dark ? barImageNuit : ''" color="primary" v-model="drawer" app id="core-navigation-drawer">
    <sequential-entrance fromBottom>
        <center class="mt-5">
            <v-avatar color="teal" size="50">
                <img alt="Avatar" :src="!$vuetify.theme.dark ? 'https://png.pngtree.com/element_our/20200610/ourlarge/pngtree-shopping-mall-logo-image_2235997.jpg' : require('@/assets/logo.jpg')">
            </v-avatar>
            <span class="ml-2" :style="$vuetify.theme.dark ? 'filter: drop-shadow(4px 4px 9px white) invert(0%);' : 'filter: drop-shadow(4px 4px 9px black) invert(0%);'">Dashboard E-Commerce </span>
        </center>
    </sequential-entrance>
    <sequential-entrance fromBottom>
        <v-divider class="my-2"></v-divider>
        <v-row :style="$vuetify.theme.dark ? 'filter: drop-shadow(8px 8px 18px indigo) invert(0%);' : 'filter: drop-shadow(4px 4px 9px white) invert(0%);'">
            <v-col cols="12" class="d-flex justify-center">
                <span class="mx-2 font-weight-light text-h6">
                    <v-icon left>mdi-face</v-icon>{{ $store.state.auth.user.firstname }} {{ $store.state.auth.user.lastname }}
                </span>
            </v-col>
        </v-row>
        <v-divider class="my-2"></v-divider>
    </sequential-entrance>
    <v-list class="py-0" v-for="(item, index) in items" :key="index" v-if="item.disabled !== true">
        <sequential-entrance fromBottom>
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

export default Vue.extend({
    name: "DashboardCoreDrawer",
    data: (): any => ({
        barImageJour: "https://images.prismic.io/cadremploi-edito/MjZjZTU0MDMtNDJkZC00MWM4LTk5M2EtYjNhODExZmRjYzli_shutterstock_664647223.jpg?auto=compress,format&rect=0,0,1000,500&w=800&h=400", //https://blog.reedexpo.fr/wp-content/uploads/2020/04/plan-d-action-commercial-scaled.jpg
        barImageNuit: "https://img.freepik.com/photos-gratuite/podium-scene-geometrique-noir-3d-fond-sombre_167650-652.jpg?size=626&ext=jpg&ga=GA1.2.1686371180.1616284800",
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

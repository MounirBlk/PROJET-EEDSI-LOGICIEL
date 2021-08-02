<template>
<v-app>
    <dashboard-core-app-bar v-if="connected != false" />

    <dashboard-core-drawer v-if="connected != false" />

    <dashboard-core-view />

    <dashboard-core-settings v-if="connected != false" />
</v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import {
    bus
} from "../main";
import Gestion from '@/mixins/Gestion';
import isOnline from 'is-online';

export default Vue.extend({
    name: 'Index',
    mixins: [Gestion],
    components: {
        DashboardCoreAppBar: () => import('@/views/core/AppBar.vue'),
        DashboardCoreDrawer: () => import('@/views/core/Drawer.vue'),
        DashboardCoreSettings: () => import('@/views/core/Settings.vue'),
        DashboardCoreView: () => import('@/views/core/View.vue'),
    },
    data: () => ({
        connected: true,
    }),
    computed: {},
    created() {
        this.$vuetify.theme.dark = new Date().getHours() >= 21 || new Date().getHours() <= 9 ? true : false;
        bus.$on("connected", (data: boolean) => {
            this.connected = data;
        });
    },
    async beforeMount() {
        if (await this.checkInternet()) {
            setTimeout(async () => {
                await this.getOwnUserData();
            }, 250);
        } else {
            return this.openNotification('top-right', 'warn', 'Attention', 'Pas de connexion internet')
        }
    },
    mounted() {},
    methods: {
        checkInternet: function (): Promise < boolean > {
            return new Promise(async (resolve, reject) => {
                const online = await isOnline({
                    timeout: 6000
                });
                resolve(online ? true : false)
            });
        }
    }
});
</script>

<template>
  <v-app>
    <dashboard-core-app-bar v-model="expandOnHover" v-if="connected != false"/>

    <dashboard-core-drawer v-if="connected != false"/>

    <dashboard-core-view />

    <!--<dashboard-core-settings v-model="expandOnHover" />-->
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { bus } from "../main";

export default Vue.extend({
  name: 'Index',
  components: {
    DashboardCoreAppBar: () => import('./core/AppBar.vue'),
    DashboardCoreDrawer: () => import('./core/Drawer.vue'),
    //DashboardCoreSettings: () => import('./core/Settings.txt'),
    DashboardCoreView: () => import('./core/View.vue'),
  },
  data: () => ({
    expandOnHover: false,
    connected:true,
  }),
  created() {
    this.$vuetify.theme.dark = false;
    bus.$on("connected",(data: any) => {
      this.connected = data;
    })
  },
});
</script>

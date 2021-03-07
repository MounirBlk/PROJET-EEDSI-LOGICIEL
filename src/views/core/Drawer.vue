<template>
<v-navigation-drawer :src="!$vuetify.theme.dark ? barImageJour : barImageNuit" v-model="drawer" app id="core-navigation-drawer">
    <v-list>
        <v-list-item link v-for="(item, index) in 12" :key="index">
            <v-list-item-action>
                <v-icon style="text-shadow: 0.1em 0.1em 0.1em white">mdi-view-dashboard</v-icon>
            </v-list-item-action>
            <v-list-item-content >
                <v-list-item-title >
                  <strong v-if="!$vuetify.theme.dark" style="text-shadow: 0.1em 0.1em 0.1em white; font-size: 19px">Dashboard</strong>
                  <strong v-else style="text-shadow: 0.1em 0.1em 0.1em black">Dashboard</strong>
                  </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
    </v-list>
</v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex'
//require('../../assets/sidebar-3-dark.jpg')
export default Vue.extend({
    name: "DashboardCoreDrawer",

    data: () => ({
      barImageJour: 'https://www.imgonline.com.ua/result_img/imgonline-com-ua-Color-filter-e5SkyjA303JL.jpg',
      barImageNuit: 'https://cdn.tomsguide.fr/content/uploads/sites/2/2019/10/voie-lactee-explosion.jpg'
    }),
    computed: {
        drawer: {
            get() {
                return this.$store.state.drawer;
            },
            set(val: any) {
                this.$store.commit("SET_DRAWER", val);
            }
        }
    }
})
</script>
<style>
</style>

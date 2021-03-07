<template>
<v-navigation-drawer :src="barImage" :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'" v-model="drawer" app id="core-navigation-drawer">

    <v-list dense>
        <v-list-item link>
            <v-list-item-action>
                <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-list-item link>
            <v-list-item-action>
                <v-icon>mdi-cog</v-icon>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title>Settings</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
    </v-list>
</v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: "DashboardCoreDrawer",

    data: () => ({}),
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

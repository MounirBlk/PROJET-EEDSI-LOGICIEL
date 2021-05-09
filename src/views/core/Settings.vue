<template>
<div id="settings-wrapper">
    <v-card :disabled="isChatReload" id="settings" class="py-2 px-5" color="rgba(0, 0, 0, .4)" dark flat link min-width="110" style="position: fixed; top: 115px; right: -35px; z-index:99">
        <v-icon color="indigo" large>
            mdi-chat-processing-outline
        </v-icon>
    </v-card>
    <v-menu v-model="menu" :close-on-content-click="false" activator="#settings" bottom content-class="v-settings" left nudge-left="30" offset-x origin="top right" transition="scale-transition">
        <v-card class="mb-0" width="500" max-height="800">
            <v-card-text class="px-0 pb-0">
                <div class="text-center ">
                    <strong class="indigo--text mb-2 d-inline-block">
                        <v-icon small left color="indigo">mdi-palette</v-icon>Couleurs personnalisées
                    </strong>
                </div>
                <v-item-group v-model="color" class="text-center">
                    <v-item v-for="color in colors" :key="color" :value="color" class="ma-1">
                        <template v-slot="{ active, toggle }">
                            <v-avatar :class="active" :color="color" style="cursor: pointer" size="25" @click="toggle" />
                        </template>
                    </v-item>
                </v-item-group>
                <v-divider class="mt-2 mb-n1 indigo" />
                <Chat class="pa-0" />
            </v-card-text>
        </v-card>
    </v-menu>
</div>
</template>

<script lang="ts">
// Mixins
//import Proxyable from 'vuetify/lib/mixins/proxyable'
import Vue from 'vue';
import {
    mapMutations,
    mapState
} from 'vuex'
import qs from 'qs'
import {
    bus
} from "../../main";

export default Vue.extend({
    name: 'DashboardCoreSettings',
    //mixins: [Proxyable],
    components: {
        Chat: () => import('../pages/Chat.vue'),
    },
    data: () => ({
        isChatReload: false as boolean,
        color: '#4CAF50',
        colors: [
            "#F3C98B",
            "#424242",
            '#9C27b0',
            '#00CAE3',
            '#4CAF50',
            '#ff9800',
            '#E91E63',
            '#FF5252'
        ],
        menu: false,
        chatNbMsgs: 0 as number,
    }),
    mounted() {},
    computed: {},
    created() {},
    watch: {
        color(val) {
            this.$vuetify.theme.themes[!this.$vuetify.theme.dark ? 'light' : 'dark'].primary = val
        },
        menu() {
            this.isChatReload = true;
            setTimeout(() => {
                this.isChatReload = false;
            }, 250);
        }
    },

    methods: {},
});
</script>

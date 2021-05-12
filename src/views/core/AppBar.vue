<template>
<v-app-bar color="primary" id="app-bar" app flat absolute>
    <v-app-bar-nav-icon @click.stop="setDrawer(!drawer)"></v-app-bar-nav-icon>
    <v-toolbar-title class="hidden-sm-and-down font-weight-light" v-text="$route.name"></v-toolbar-title>
    <v-spacer class="mx-3"></v-spacer>

    <v-tooltip bottom v-if="$router.history.current.name === 'Accueil'">
        <template v-slot:activator="{ on }">
            <v-btn color="indigo" :disabled="isDisabledSynchro" class="ml-2" min-width="0" v-on="on" @click="synchronisation" text>
                <v-icon :color="$vuetify.theme.dark ? 'info' : 'black'">mdi-cloud-refresh</v-icon>
            </v-btn>
        </template>
        <span>Synchronisation</span>
    </v-tooltip>

    <v-tooltip bottom>
        <template v-slot:activator="{ on }">
            <v-btn class="ml-2" :color="$vuetify.theme.dark ? 'orange' : 'indigo'" min-width="0" v-on="on" @click="$vuetify.theme.dark = !$vuetify.theme.dark" text>
                <v-icon color="orange" v-if="$vuetify.theme.dark">mdi-weather-sunny</v-icon>
                <v-icon color="indigo" v-else>mdi-weather-night</v-icon>
            </v-btn>
        </template>
        <span>{{ $vuetify.theme.dark ? 'Mode Jour' : 'Mode Nuit' }}</span>
    </v-tooltip>

    <v-tooltip bottom>
        <template v-slot:activator="{ on }">
            <v-btn class="ml-2" min-width="0" v-on="on" text to="/">
                <v-icon color="anchor">mdi-view-dashboard</v-icon>
            </v-btn>
        </template>
        <span>Accueil</span>
    </v-tooltip>

    <v-tooltip bottom>
        <template v-slot:activator="{ on }">
            <v-btn class="ml-2" min-width="0" v-on="on" text to="/parametres">
                <v-icon>mdi-account-cog-outline</v-icon>
            </v-btn>
        </template>
        <span>Paramètres</span>
    </v-tooltip>

    <v-tooltip bottom>
        <template v-slot:activator="{ on }">
            <v-btn @click="deconnexion" v-on="on" class="ml-2" min-width="0" text color="error">
                <v-icon>mdi-logout</v-icon>
            </v-btn>
        </template>
        <span>Déconnexion</span>
    </v-tooltip>
</v-app-bar>
</template>

<script lang="ts">
// Utilities
import {
    mapState,
    mapMutations
} from "vuex";
import Vue from 'vue';
import {
    bus
} from "../../main";
import io from 'socket.io-client';

export default Vue.extend({
    name: "DashboardCoreAppBar",
    data: () => ({
        isDisabledSynchro: false as boolean,
    }),
    computed: {
        ...mapState(["drawer"])
    },
    components: {
        Prospections: () => import("../pages/Prospections.vue")
    },
    methods: {
        ...mapMutations({
            setDrawer: "SET_DRAWER"
        }),
        deconnexion: function () {
            localStorage.clear();
            this.$router.push({
                name: "Connexion",
                //params: { reloadLogOut: true },
            });
        },
        synchronisation: function () {
            this.isDisabledSynchro = true;
            bus.$emit("synchro");
            setTimeout(() => {
                this.isDisabledSynchro = false;
            }, 10000);
        }
    }
});
</script>

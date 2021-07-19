<template>
<v-img transition="scale-transition" :src="$vuetify.breakpoint.mdAndUp ? 'https://www.potentiel-humain.eu/wp-content/uploads/2020/09/hand.jpg' : ''">
    <v-overlay :absolute="isAbsolute" :opacity="opacity" :value="isOverlay">
        <v-progress-circular color="indigo" indeterminate size="80"></v-progress-circular>
    </v-overlay>
    <v-dialog v-model="isDialogForgotPassword" width="400px" overlay-opacity="0.9">
        <v-card class="px-6" style="filter: opacity(90%);">
            <v-card-title class="indigo--text">
                Mot de passe oublié ?
                <v-icon aria-label="Close" class="ml-auto" @click="isDialogForgotPassword = false">mdi-close</v-icon>
            </v-card-title>
            <v-card-text>
                <v-col cols="12">
                    <div class="text-center">
                        <v-row>
                            <v-col cols="12" md="12">
                                <v-text-field color="indigo" label="Email*" v-model.trim="email_reset" prepend-inner-icon="mdi-email-outline" clearable />
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="mr-1" color="error" text @click.prevent="isDialogForgotPassword = false;">Fermer</v-btn>
                <v-btn color="success" text @click="resetPassword(email_reset)">
                    <v-icon left>mdi-check</v-icon> Sauvegarder
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-row justify="center">
        <v-col cols="12">
            <v-slide-y-transition appear>
                <base-material-card style="filter: opacity(85%);" :color="$vuetify.theme.dark ? 'indigo' : 'primary'" max-width="100%" width="600" class="px-5 mt-10 py-3 mx-auto">
                    <template v-slot:heading>
                        <div class="text-center">
                            <h1 class="display-1 font-weight-bold">
                                <v-icon large left>mdi-account-lock</v-icon>Connexion
                            </h1>
                        </div>
                    </template>
                    <!--<v-card>-->
                    <v-card-text class="text-center">
                        <v-form ref="form">
                            <v-col cols="12" class="py-2">
                                <v-text-field :color="$vuetify.theme.dark ? 'indigo' : 'primary darken-1'" @keyup.enter="connexion(infos.email, infos.password)" label="Email" v-model="infos.email" prepend-icon="mdi-face" clearable />
                            </v-col>
                            <v-col cols="12" class="py-2">
                                <v-text-field :color="$vuetify.theme.dark ? 'indigo' : 'primary darken-1'" @keyup.enter="connexion(infos.email, infos.password)" label="Password" v-model="infos.password" prepend-icon="mdi-lock-outline" :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" clearable />
                            </v-col>
                            <v-col cols="12" class="pt-2 mb-2">
                                <span @click="isDialogForgotPassword = true" style="cursor: pointer">Mot de passe oublié ?</span>
                            </v-col>
                            <v-badge bordered :color="isActive ? 'primary' : 'grey'" icon="mdi-lock-open-outline" overlap>
                                <v-btn dark rounded :disabled="!isActive" :color="$vuetify.theme.dark ? 'indigo' : 'primary'" @click="connexion(infos.email, infos.password)">
                                    <v-icon left>mdi-check-circle-outline</v-icon>
                                    <span>Connexion</span>
                                </v-btn>
                            </v-badge>
                        </v-form>
                    </v-card-text>
                    <!--</v-card>-->
                    <!--<router-link to="register" class="indigo--text">Inscription</router-link>-->
                </base-material-card>
            </v-slide-y-transition>
        </v-col>
    </v-row>
    <v-snackbar shaped v-model="isSnackbarOpened" elevation="24" :color="isSuccess ? 'success' : 'error'" style="filter: opacity(95%);">
        <div class="text-center subtitle-1">
            <v-icon v-if="!isSuccess" color="white" left>mdi-alert-outline</v-icon>
            <v-icon v-else color="white" left>mdi-checkbox-marked-circle-outline</v-icon>
            <span>{{ snackbarMessage }}</span>
        </div>
        <template v-slot:action="{ attrs }">
            <v-btn dark icon @click="isSnackbarOpened = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </template>
    </v-snackbar>
</v-img>
</template>

<script lang="ts">
import Vue, {
    VNode
} from 'vue';
import {
    bus
} from "@/main";
import axiosApi from "@/plugins/axiosApi";
import qs from "qs";
import {
    AxiosResponse
} from 'axios';
import Gestion from "@/mixins/Gestion"
import {
    mapState,
    mapMutations,
    mapActions,
    mapGetters,
    Store
} from 'vuex';

export default Vue.extend({
    name: 'Login',
    props: {},
    components: {},
    mixins: [Gestion],
    data: (): any => ({
        isDialogForgotPassword: false as boolean,
        infos: {
            email: '',
            password: '',
        },
        isActive: false as boolean,
        email_reset: '',
    }),
    created() {},
    beforeMount() {},
    mounted() {
        bus.$emit("connected", false);
        this.isOverlay = false;
    },
    watch: {
        /*infos: {
            handler(val: any) {
                this.isActive = true
            },
            deep: true
        }*/
        'infos.email': function (val) {
            this.isActive = val !== null && val !== "";
        }
    },
    computed: {},
    beforeDestroy() {
        bus.$emit("connected", true);
    },
    methods: {
        connexion: function (email: string, password: string): void {
            if (email == null || email == "")
                return this.errorMessage("Identifiant vide !");
            if (password == null || password == "")
                return this.errorMessage("Mot de passe vide !");

            this.isOverlay = true;
            this.$store.dispatch('authLogin', {
                email,
                password
            }).then(async (response: AxiosResponse) => {
                const token: string | null = localStorage.getItem('SET_TOKEN'); // ou response.data.token
                if (token == null || response === null) {
                    this.isOverlay = false;
                    this.infos.password = '';
                    await this.$store.dispatch('clearToken');
                    return this.errorMessage("L'utilisateur est introuvable !");
                }
                if (response.data.user.role.toLowerCase() !== "administrateur" && response.data.user.role.toLowerCase() !== "commercial") {
                    this.isOverlay = false;
                    this.infos.password = '';
                    await this.$store.dispatch('clearToken');
                    return this.errorMessage('Vous n\'avez pas l\'autorisation d\'accéder à la plateforme');
                } else {
                    setTimeout(() => {
                        this.setUser(response.data.user); //this.$store.commit("SET_USER", response.data.user) / $store.state.auth.user
                        //this.setToken(token)//this.$store.commit("SET_TOKEN", token);
                        bus.$emit("connected", true);
                        return this.$router.push({
                            name: "Accueil",
                        });
                    }, 500);
                }
            }).catch((error: any) => {
                this.catchAxios(error);
                this.isOverlay = false;
                this.infos.password = '';
            })
        },
        /*oldConnexion: function (email: string, password: string): void {
            //bus.$emit("connected", true);
            if (email == null || email == "")
                return this.errorMessage("Identifiant vide !");
            if (password == null || password == "")
                return this.errorMessage("Mot de passe vide !");

            this.isOverlay = true;
            const payload = {
                email: email,
                password: password
            };
            axiosApi
                .post("/login", qs.stringify(payload))
                .then((response: AxiosResponse) => {
                    localStorage.setItem("SET_TOKEN", response.data.token);
                    axiosApi.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("SET_TOKEN")}`;
                    if (localStorage.getItem("SET_TOKEN") == null) return this.errorMessage("Token inconnu !");
                    const isAdmin = response.data.user.role.toLowerCase() === "administrateur" ? true : false;
                    if (response.data.user.role.toLowerCase() !== "administrateur" && response.data.user.role.toLowerCase() !== "commercial") {
                        this.isOverlay = false;
                        localStorage.clear();
                        return this.errorMessage('Vous n\'avez pas l\'autorisation d\'accéder à la plateforme');
                    } else {
                        if (isAdmin === undefined || isAdmin === null) {
                            this.isOverlay = false;
                            localStorage.clear();
                            return this.errorMessage('Erreur');
                        } else {
                            this.setAdminStatus(isAdmin) //this.$store.commit("SET_IS_ADMIN", isAdmin);
                            bus.$emit("connected", true);
                            return this.$router.push({
                                name: "Accueil",
                            });
                        }
                    }
                })
                .catch((error) => {
                    this.catchAxios(error);
                    this.isOverlay = false;
                    this.infos.password = '';
                })
        },*/
        resetPassword: function (email: string) {
            if (email == null || email == "") return this.errorMessage("Email vide !");

            this.isOverlay = true;
            axiosApi
                .put("/user/forgot", qs.stringify({
                    email: email
                }))
                .then((response: AxiosResponse) => {
                    if (response.data.error === false) {
                        this.isOverlay = false;
                        Object.assign(this.$data, this.$options.data()); //reset data
                        this.$refs.form.reset();
                        this.successMessage("Votre mot de passe a bien été réinitialisé, veuillez consulter votre boîte mail");
                        setTimeout(() => {
                            this.isDialogForgotPassword = false;
                        }, 1000);
                    }
                })
                .catch((error) => {
                    console.log(error)
                    this.catchAxios(error);
                    this.isOverlay = false;
                })
        }
    }
});
</script>

<style>
</style>

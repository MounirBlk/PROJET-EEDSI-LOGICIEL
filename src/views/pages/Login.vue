<template>
<v-img src="https://ressources.regionsjob.com/seo/ObsJob/ingenieur-commercial.jpg">
    <v-overlay :absolute="isAbsolute" :opacity="opacity" :value="isOverlay">
        <v-progress-circular color="warning" indeterminate size="80"></v-progress-circular>
    </v-overlay>
    <v-dialog v-model="isDialogForgotPassword" width="400px" overlay-opacity="0.9">
        <v-card class="px-6">
            <v-card-title class="indigo--text">
                Mot de passe oublié ?
                <v-icon aria-label="Close" class="ml-auto" @click="isDialogForgotPassword = false">mdi-close</v-icon>
            </v-card-title>
            <v-card-text>
                <v-col cols="12">
                    <div class="text-center">
                        <v-row>
                            <v-col cols="12" md="12">
                                <v-text-field color="info" label="Email*" v-model.trim="email_reset" prepend-inner-icon="mdi-email-outline" clearable />
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
        <v-col cols="10">
            <v-slide-y-transition appear>
                <base-material-card color="primary" max-width="100%" width="600" class="px-5 mt-10 py-3 mx-auto">
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
                                <v-text-field color="primary" @keyup.enter="connexion(email, password)" label="Email" v-model="email" prepend-icon="mdi-face" clearable />
                            </v-col>
                            <v-col cols="12" class="py-2">
                                <v-text-field color="primary" @keyup.enter="connexion(email, password)" label="Password" v-model="password" prepend-icon="mdi-lock-outline" :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" clearable />
                            </v-col>
                            <v-col cols="12" class="py-2">
                                <span @click="isDialogForgotPassword = true" style="cursor: pointer">Mot de passe oublié ?</span>
                            </v-col>
                            <v-btn color="primary" @click="connexion(email, password)">
                                <v-icon :color="!$vuetify.theme.dark ? 'black' : 'white'" left>mdi-lock-outline</v-icon>
                                <span :class="!$vuetify.theme.dark ? 'black--text' : 'white--text'">Connexion</span>
                            </v-btn>
                        </v-form>
                    </v-card-text>
                    <!--</v-card>-->
                    <!--<router-link to="register" class="indigo--text">Inscription</router-link>-->
                </base-material-card>
            </v-slide-y-transition>
        </v-col>
    </v-row>
    <v-snackbar v-model="isSnackbarOpened" elevation="24" :color="isSuccess ? 'success' : 'error'">
        <div class="text-center subtitle-1">
            <v-icon v-if="!isSuccess" color="white" left>mdi-alert-outline</v-icon>
            <v-icon v-else color="white" left>mdi-checkbox-marked-circle-outline</v-icon>
            <span>{{ snackbarMessage }}</span>
            <v-btn dark icon class="ml-6" @click="isSnackbarOpened = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </div>
    </v-snackbar>
</v-img>
</template>

<script lang="ts">
import Vue, {
    VNode
} from 'vue';
import {
    bus
} from "../../main";
import axiosApi from "../../plugins/axiosApi";
import qs from "qs";
import {
    AxiosResponse
} from 'axios';
import Gestion from "../../mixins/Gestion"

export default Vue.extend({
    name: 'Login',
    props: {},
    components: {},
    mixins: [Gestion],
    data: (): any => ({
        isDialogForgotPassword: false as boolean,
        email: null as string | null,
        password: null as string | null,
        email_reset: '',
    }),
    created() {
        //console.log('created')
    },
    beforeMount() {
        //console.log('beforeMount')
    },
    mounted() {
        bus.$emit("connected", false);
        this.isOverlay = false;
    },
    beforeDestroy() {
        bus.$emit("connected", true);
    },
    methods: {
        connexion: function (login: string, password: string): void {
            //bus.$emit("connected", true);
            if (login == null || login == "")
                return this.errorMessage("Identifiant vide !");
            if (password == null || password == "")
                return this.errorMessage("Mot de passe vide !");

            this.isOverlay = true;
            const payload = {
                email: login,
                password: password
            };
            axiosApi
                .post("/login", qs.stringify(payload))
                .then((response: AxiosResponse) => {
                    localStorage.setItem("token", response.data.token);
                    axiosApi.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
                    if (localStorage.getItem("token") == null) return this.errorMessage("Token inconnu !");
                    //this.isOverlay = false;
                    const isAdmin = response.data.user.role.toLowerCase() === "administrateur" ? true : false;
                    if(response.data.user.role.toLowerCase() !== "administrateur" && response.data.user.role.toLowerCase() !== "commercial"){
                        this.isOverlay = false;
                        return this.errorMessage('Vous n\'avez pas l\'autorisation d\'accéder à la plateforme');
                    }else{
                        if (isAdmin === undefined || isAdmin === null) {
                            this.isOverlay = false;
                            return this.errorMessage('Erreur');
                        } else {
                            //this.$store.commit("SET_IS_ADMIN", isAdmin);
                            this.setAdminStatus(isAdmin)
                            bus.$emit("connected", true);
                            return this.$router.push({
                                name: "Accueil",
                            });
                        }
                    }
                })
                .catch((error) => {
                    console.log(error)
                    this.catchAxios(error);
                    this.isOverlay = false;
                })
        },
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

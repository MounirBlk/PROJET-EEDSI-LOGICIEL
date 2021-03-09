<template>
<v-img src="https://ressources.regionsjob.com/seo/ObsJob/ingenieur-commercial.jpg">
    <v-overlay :absolute="isAbsolute" :opacity="opacity" :value="isOverlay">
        <v-progress-circular color="warning" indeterminate size="80"></v-progress-circular>
    </v-overlay>
    <v-dialog v-model="isDialogForgotPassword" width="400px" overlay-opacity="0.9">
        <v-card class="px-6" outlined>
            <v-card-title class="i
            digo--text">
                Mot de passe oublié ?
                <v-icon aria-label="Close" class="ml-auto" @click="isDialogForgotPassword = false">mdi-close</v-icon>
            </v-card-title>
            <v-col cols="12">
                <div class="text-center">
                    IN PROGRESS, vous pouvez réinitialisé le mot de passe en contactant l'administrateur
                    <p />
                    <span class="grey--text">mounir.ballouk@gmail.com</span>
                </div>
            </v-col>
        </v-card>
    </v-dialog>
    <v-row justify="center">
        <v-col cols="10">
            <v-slide-y-transition appear>
                <base-material-card color="primary" max-width="100%" width="600" class="px-5 py-3 mx-auto">
                    <template v-slot:heading>
                        <div class="text-center">
                            <h1 class="display-1 font-weight-bold">
                                <v-icon large left>mdi-account-lock</v-icon>Connexion
                            </h1>
                        </div>
                    </template>

                    <v-card-text class="text-center">
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
                            <v-icon color="black" left>mdi-lock-outline</v-icon>
                            <span class="black--text">Connexion</span>
                        </v-btn>
                    </v-card-text>
                    <!--<router-link to="register" class="indigo--text">Inscription</router-link>-->
                </base-material-card>
            </v-slide-y-transition>
        </v-col>
    </v-row>
    <v-snackbar v-model="isSnackbarOpened" :color="isSuccess ? 'success' : 'error'">
        <div class="text-center">
            <v-icon v-if="!isSuccess" color="white">mdi-alert-outline</v-icon>
            <v-icon v-else color="white">mdi-checkbox-marked-circle-outline</v-icon>
            {{ snackbarMessage }}
            <v-btn dark icon @click="isSnackbarOpened = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </div>
    </v-snackbar>
</v-img>
</template>

<script lang="ts">
import Vue, { VNode } from 'vue';
import {
    bus
} from "../../main";
import axiosApi from "../../plugins/axiosApi";
import qs from "qs";
import { AxiosResponse } from 'axios';

export default Vue.extend({
    name: 'Login',
    props: {},
    components: {},
    data: () => ({
        isSuccess: false,
        isSnackbarOpened: false,
        snackbarMessage: "",
        /*-------------------------- */
        showPassword: false,
        isDialogForgotPassword: false,
        email: null as string | null,
        password: null as string | null,
        opacity: 0.8, //overlay
        isAbsolute: true, //overlay
        isOverlay: true, //overlay
    }),
    computed: {},
    created() {
        //console.log('created')
    },
    beforeMount() {
        //console.log('beforeMount')
    },
    mounted() {
        bus.$emit("connected", false);
        if (localStorage.getItem("token") == null) {
            localStorage.clear();
        } else {
            return this.$router.push({
                name: "Accueil",
            });
        }
        this.isOverlay = false;
    },
    beforeDestroy() {
        bus.$emit("connected", true);
    },
    methods: {
        connexion: function (login: string, password: string): void{
            //bus.$emit("connected", true);
            if (login == null || login == "")
                return (this as any).errorMessage("Identifiant vide !");
            if (password == null || password == "")
                return (this as any).errorMessage("Mot de passe vide !");

            this.isOverlay = true;
            const payload = {
                email: login,
                password: password
            };
            axiosApi
                .post("/login", qs.stringify(payload))
                .then((response: any) => {
                    localStorage.setItem("token", response.data.token);
                    axiosApi.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
                    if (localStorage.getItem("token") == null) return (this as any).errorMessage("Token inconnu !");
                    this.isOverlay = false;
                    return this.$router.push({
                        name: "Accueil",
                        /*params: {
                            logged: true
                        },*/
                    });

                })
                .catch((error) => {
                    console.log(
                        "ERROR " +
                        JSON.stringify(error.status) +
                        " : " +
                        JSON.stringify(error.data.message)
                    );
                    (this as any).errorMessage(
                        "ERROR " +
                        JSON.stringify(error.status) +
                        " : " +
                        JSON.stringify(error.data.message)
                    );
                    this.isOverlay = false;
                })
        },
        /*------------------------------------------------------ */
        /*verifyResponseOk: function (responseData: any) {
            var tmpStr = JSON.stringify(responseData);
            if (tmpStr.startsWith('"Error:')) {
                this.errorMessage(responseData.substring(7)); // suppress "Error:
                return false;
            }
            return true;
        },*/

        successMessage: function (message: string): void {
            this.snackbarMessage = message;
            this.isSuccess = true;
            this.isSnackbarOpened = true;
        },
        errorMessage: function (message: string): void {
            this.snackbarMessage = message;
            this.isSuccess = false;
            this.isSnackbarOpened = true;
        },
    }
});
</script>

<style>
</style>

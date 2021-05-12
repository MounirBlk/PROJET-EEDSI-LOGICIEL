<template>
<v-container id="parametres" fluid tag="section">
    <v-overlay :absolute="isAbsolute" :opacity="opacity" :value="isOverlay">
        <v-progress-circular color="purple" indeterminate size="80"></v-progress-circular>
    </v-overlay>
    <v-dialog v-model="isChangePasswordDialog" width="400px" overlay-opacity="0.8" persistent>
        <v-card class="px-6">
            <v-card-title class="purple--text">
                Modifier le mot de passe
                <v-icon aria-label="Close" class="ml-auto" @click="clearPassword()">mdi-close</v-icon>
            </v-card-title>
            <v-divider class="my-2" />
            <v-row>
                <v-text-field color="purple" label="Mot de passe actuel" v-model="oldPasswordUser" prepend-inner-icon="mdi-lock-outline" clearable :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" />
                <v-text-field color="purple" label="Nouveau mot de passe" v-model="passwordUser" prepend-inner-icon="mdi-lock-outline" clearable :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" />
                <v-col cols="12" class="text-right">
                    <v-btn class="mr-1" outlined color="error" text @click="clearPassword()">Annuler</v-btn>
                    <v-btn outlined color="success" text @click="savePassword(oldPasswordUser, passwordUser)">Sauvegarder</v-btn>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>
    <v-row justify="center">
        <v-col cols="12" md="8">
            <base-material-card color="purple">
                <template v-slot:heading>
                    <div class="display-1 font-weight-light">
                        <v-icon left>mdi-cog</v-icon>Profil Utilisateur
                    </div>
                    <div class="subtitle-1 font-weight-light">
                        <v-icon left>mdi-cogs</v-icon>Complete ton profil
                    </div>
                </template>
                <v-form>
                    <v-container class="py-0">
                        <v-card class="mt-0" height="auto">
                            <v-col cols="12">
                                <div class="text-center">
                                    <v-row>
                                        <v-col cols="12" md="6">
                                            <v-text-field color="purple" label="Nom" v-model="user.lastname" prepend-inner-icon="mdi-face" :clearable="isUpdateUser" :disabled="!isUpdateUser" />
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-text-field color="purple" label="Prénom" v-model="user.firstname" prepend-inner-icon="mdi-face" :clearable="isUpdateUser" :disabled="!isUpdateUser" />
                                        </v-col>
                                    </v-row>
                                    <v-row class="mt-n4">
                                        <v-col cols="12" md="12">
                                            <v-text-field color="purple" label="Email" v-model="user.email" prepend-inner-icon="mdi-email-outline" disabled />
                                        </v-col>
                                    </v-row>
                                    <v-row class="mt-n4">
                                        <v-col cols="12" md="4">
                                            <v-select color="purple" prepend-inner-icon="mdi-format-list-bulleted-type" v-model="user.civilite" :items="['Homme', 'Femme']" label="Civilité" :disabled="!isUpdateUser"></v-select>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-menu v-model="isDialogDateNaissanceOpen" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" color="purple">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field color="purple" v-model="user.dateNaissance" label="Date de naissance" prepend-inner-icon="mdi-calendar-outline" readonly v-bind="attrs" v-on="on" :disabled="!isUpdateUser"></v-text-field>
                                                </template>
                                                <v-date-picker color="purple" v-model="user.dateNaissance" first-day-of-week="1" @input="isDialogDateNaissanceOpen = false"></v-date-picker>
                                            </v-menu>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field color="purple" label="Numéro de téléphone" v-model="user.portable" prepend-inner-icon="mdi-deskphone" :clearable="isUpdateUser" :disabled="!isUpdateUser" />
                                        </v-col>
                                    </v-row>
                                </div>
                            </v-col>
                            <v-row>
                                <span v-if="isUpdateUser" class="red--text">
                                    <li>
                                        <u><strong>Note: N'oubliez pas d'enregistrer vos
                                                modifications</strong></u>
                                    </li>
                                </span>
                            </v-row>
                            <v-divider class="my-4" />
                            <v-row>
                                <v-col cols="12" md="12" class="d-flex justify-end">
                                    <v-btn @click="isChangePasswordDialog = true" class="mx-2" color="purple" text outlined :disabled="!isUpdateUser" small>
                                        <v-icon left>mdi-cog-outline</v-icon>Changer le password
                                    </v-btn>
                                    <v-btn dark small v-if="!isUpdateUser" color="purple" @click="isUpdateUser = true" class="mx-2">
                                        <v-icon left>mdi-account-edit-outline</v-icon>Modifier le Profil
                                    </v-btn>
                                    <v-btn small color="error" class="mx-2" v-if="isUpdateUser" @click="isUpdateUser = false">
                                        <v-icon left>mdi-close-circle-outline</v-icon>Annuler
                                    </v-btn>
                                    <v-btn small color="success" class="mx-2" v-if="isUpdateUser" @click="saveUpdate">
                                        <v-icon left>mdi-content-save-outline</v-icon>Sauvegarder
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-container>
                </v-form>
            </base-material-card>
        </v-col>
        <v-col cols="12" md="4">
            <base-material-card color="purple" :avatar="user.avatar">
                <template v-slot:heading>
                    <div class="text-center">
                        <h1 class="display-1 font-weight-bold">
                            <v-icon large left>mdi-star</v-icon>{{ user.role }}
                        </h1>
                    </div>
                </template>
                <v-card-text>
                    <span class="display-1 mb-3">
                        {{ user.firstname }} {{ user.lastname }}
                    </span>
                    <p />
                    <span class="subtitle-1 mb-3">
                        Dernière connexion : {{ user.lastLogin | moment("YYYY-MM-DD HH:mm")  }}
                    </span>
                    <p />
                    <span class="subtitle-1 mb-3 grey--text">
                        Création : {{ user.createdAt | moment("YYYY-MM-DD HH:mm") }}
                    </span><br />
                    <span class="subtitle-1 mb-3 grey--text">
                        Mise à jour : {{ user.updateAt | moment("YYYY-MM-DD HH:mm")  }}
                    </span><br />
                </v-card-text>
            </base-material-card>
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
</v-container>
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
    name: 'Parametres',
    mixins: [Gestion],
    props: {},
    components: {},
    //data: () => ({}),
    data(): any {
        return {
            isDialogDateNaissanceOpen: false,
            user: {
                email: "",
                nom: "",
                prenom: "",
                dateNaissance: null,
                civilite: "",
                portable: "",
                isAdmin: "",
            },
            isUpdateUser: false,
            isChangePasswordDialog: false,
            passwordUser: null,
            oldPasswordUser: null,
        }
    },
    computed: {},
    watch: {},
    created() {
        //console.log('created')
    },
    beforeMount() {
        //console.log('beforeMount')
    },
    async mounted() {
        await this.getUserData();
    },
    methods: {
        getUserData: async function () {
            this.isOverlay = true;
            axiosApi
                .get("/user/own")
                .then((response) => {
                    this.user = response.data.user;
                    this.isOverlay = false;
                })
                .catch((error) => {
                    this.catchAxios(error)
                    this.isOverlay = false;
                })
        },
        saveUpdate: async function () {
            this.isUpdateUser = false;

            axiosApi
                .put("/user/update/" + this.user._id, qs.stringify(this.user)) //update de l'user
                .then((response) => {
                    Object.assign(this.$data, this.$options.data()); //reset data
                    this.successMessage("Sauvegarde des modifications effectuée !");
                    setTimeout(() => {
                        this.getUserData();
                    }, 1000);
                })
                .catch((error) => {
                    this.catchAxios(error)
                });
        },
        savePassword: async function (oldPasswordUser: string, passwordUser: string) {
            this.isChangePasswordDialog = false;

            if (oldPasswordUser == null || oldPasswordUser == "")
                return this.errorMessage("Mot de passe actuel vide !");
            if (passwordUser == null || passwordUser == "")
                return this.errorMessage("Nouveau mot de passe vide !");

            /*--------------------------------------------------- */
            const payload = {
                oldPassword: oldPasswordUser,
                newPassword: passwordUser,
            };
            return this.errorMessage("IN PROGRESS !");
            /*await axiosApi
                .put("/userEditPass/" + this.user._id, qs.stringify(payload)) //edit password de l'user
                .then((response) => {
                    Object.assign(this.$data, this.$options.data()); //reset data
                    this.successMessage("Le mot de passe a bien été modifié !");
                    setTimeout(() => {
                        this.getUserData();
                    }, 1000);
                })
                .catch((error) => {
                    this.passwordUser = "";
                    this.oldPasswordUser = "";
                    this.catchAxios(error)
                });*/
        },
        clearPassword: function () {
            this.isChangePasswordDialog = false;
            this.showPassword = false;
            this.passwordUser = "";
            this.oldPasswordUser = "";
            this.confirmPasswordUser = "";
        },
    }
});
</script>

<style>
</style>

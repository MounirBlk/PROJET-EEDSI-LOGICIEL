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
            <v-divider class="mb-3 mt-n1" />
            <v-row>
                <v-col cols="12" class="text-right">
                    <v-form ref="formPw" v-model="rules.valid" lazy-validation>
                        <v-text-field color="purple" label="Mot de passe actuel" v-model="oldPasswordUser" prepend-inner-icon="mdi-lock-outline" clearable :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :rules="rules.passwordRules" required />
                        <v-text-field color="purple" label="Nouveau mot de passe" v-model="passwordUser" prepend-inner-icon="mdi-lock-outline" clearable :type="showNewPassword ? 'text' : 'password'" @click:append="showNewPassword = !showNewPassword" :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'" :rules="rules.passwordRules" required />
                        <v-btn class="mr-1" outlined color="error" text @click="clearPassword()">Annuler</v-btn>
                        <v-btn outlined color="success" text @click="saveNewPassword(oldPasswordUser, passwordUser)">Sauvegarder</v-btn>
                    </v-form>
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
                        <v-card class="pa-2" height="auto" outlined color="transparent">
                            <v-col cols="12">
                                <v-form ref="formUser" v-model="rules.valid" lazy-validation class="text-center">
                                    <v-row>
                                        <v-col cols="12" md="6">
                                            <v-text-field color="purple" label="Nom" v-model="user.lastname" prepend-inner-icon="mdi-face" :clearable="isUpdateUser" :disabled="!isUpdateUser" :rules="rules.caractereRules" required />
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-text-field color="purple" label="Prénom" v-model="user.firstname" prepend-inner-icon="mdi-face" :clearable="isUpdateUser" :disabled="!isUpdateUser" :rules="rules.caractereRules" required />
                                        </v-col>
                                    </v-row>
                                    <v-row class="mt-n4">
                                        <v-col cols="12" md="12">
                                            <v-text-field color="purple" label="Email" v-model="user.email" prepend-inner-icon="mdi-email-outline" disabled :rules="rules.emailRules" required />
                                        </v-col>
                                    </v-row>
                                    <v-row class="mt-n4">
                                        <v-col cols="12" md="4">
                                            <v-select color="purple" prepend-inner-icon="mdi-format-list-bulleted-type" v-model="user.civilite" :items="['Homme', 'Femme']" label="Civilité" :disabled="!isUpdateUser" :rules="rules.champRules" required></v-select>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-menu v-model="isDialogDateNaissanceOpen" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" color="purple">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field color="purple" v-model="user.dateNaissance" label="Date de naissance" prepend-inner-icon="mdi-calendar-outline" readonly v-bind="attrs" v-on="on" :disabled="!isUpdateUser" :rules="rules.dateEnRules" required></v-text-field>
                                                </template>
                                                <v-date-picker color="purple" v-model="user.dateNaissance" first-day-of-week="1" @input="isDialogDateNaissanceOpen = false" :rules="rules.dateEnRules" required></v-date-picker>
                                            </v-menu>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field color="purple" label="Numéro de téléphone" v-model="user.portable" prepend-inner-icon="mdi-deskphone" :clearable="isUpdateUser" :disabled="!isUpdateUser" />
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-col>
                            <v-row>
                                <v-col cols="12">
                                    <span v-if="isUpdateUser" class="red--text font-italic d-flex justify-end mr-3">
                                        Note: N'oubliez pas d'enregistrer vos modifications
                                    </span>
                                </v-col>
                            </v-row>
                            <v-divider class="mb-4 mx-2" />
                            <v-row>
                                <v-col cols="12" md="12" :class="{ 'd-flex justify-end': $vuetify.breakpoint.mdAndUp, }">
                                    <v-btn @click="isChangePasswordDialog = true" class="mx-2" color="purple" text outlined :disabled="!isUpdateUser" small>
                                        <v-icon left>mdi-cog-outline</v-icon>Changer le password
                                    </v-btn>
                                    <v-btn dark small v-if="!isUpdateUser" color="purple" @click="isUpdateUser = true" class="mx-2">
                                        <v-icon left>mdi-account-edit-outline</v-icon>Modifier le Profil
                                    </v-btn>
                                    <v-btn small color="error" class="mx-2" v-if="isUpdateUser" @click="cancelUpdate">
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
            <base-material-card color="purple" icon="mdi-account-tie-outline" max-width="100%" width="auto" inline class="px-5 py-3 mx-auto">
                <template v-slot:after-heading>
                    <span class="purple--text text-h5 font-weight-light">
                        {{ user.role }}
                    </span>
                </template>
                <v-card-text>
                    <span class="display-1 mb-3 font-weight-light">
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
</v-container>
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
            showNewPassword: false
        }
    },
    computed: {},
    watch: {},
    created() {},
    beforeMount() {},
    async mounted() {
        await this.getUserData();
    },
    async beforeDestroy() {
        await this.getUserData();
    },
    methods: {
        getUserData: async function () {
            this.isOverlay = true;
            axiosApi
                .get("/user/own")
                .then(async (response) => {
                    if (response) {
                        this.user = response.data.user;
                        await this.setUser(this.user); //this.$store.commit("SET_USER", response.data.user) / $store.state.auth.user
                    }
                })
                .catch((error) => {
                    this.catchAxios(error)
                }).finally(() => {
                    this.isOverlay = false;
                });
        },
        saveUpdate: function () {
            if (!this.$refs.formUser.validate()) return this.errorMessage("Veuillez vérifier les champs !");
            this.isUpdateUser = false;
            axiosApi
                .put("/user/update/" + this.user._id, qs.stringify(this.user)) //update de l'user
                .then((response) => {
                    if (response && response.data) {
                        Object.assign(this.$data, this.$options.data()); //reset data
                        this.$refs.formUser.reset();
                        this.successMessage("Sauvegarde des modifications effectuée !");
                        setTimeout(() => {
                            this.getUserData();
                        }, 1000);
                    }
                })
                .catch((error) => {
                    this.catchAxios(error)
                });
        },
        cancelUpdate: async function () {
            this.isUpdateUser = false
            await this.getUserData();
        },
        saveNewPassword: function (oldPasswordUser: string, passwordUser: string) {
            this.isChangePasswordDialog = false;
            if (!this.$refs.formPw.validate()) return this.errorMessage("Veuillez vérifier les champs !");
            if (oldPasswordUser == null || oldPasswordUser == "") return this.errorMessage("Mot de passe actuel vide !");
            if (passwordUser == null || passwordUser == "") return this.errorMessage("Nouveau mot de passe vide !");
            /*--------------------------------------------------- */
            const payload = {
                oldPassword: oldPasswordUser,
                newPassword: passwordUser,
            };
            axiosApi
                .put("/user/password", qs.stringify(payload)) //edit password de l'user
                .then((response) => {
                    if (response) {
                        Object.assign(this.$data, this.$options.data()); //reset data
                        this.$refs.formPw.reset();
                        this.successMessage("Le mot de passe a bien été modifié !");
                        setTimeout(() => {
                            this.getUserData();
                        }, 1000);
                    }
                })
                .catch((error) => {
                    this.catchAxios(error)
                }).finally(() => {
                    this.passwordUser = "";
                    this.oldPasswordUser = "";
                });;
        },
        clearPassword: function () {
            this.isChangePasswordDialog = false;
            this.showPassword = false;
            this.showNewPassword = false;
            this.passwordUser = "";
            this.oldPasswordUser = "";
            this.confirmPasswordUser = "";
        },
    }
});
</script>

<style>
</style>

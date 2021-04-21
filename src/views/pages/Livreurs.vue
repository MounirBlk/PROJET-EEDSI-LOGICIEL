<template>
<v-container id="livreurs" tag="section" fluid>
    <v-dialog v-model="isDialogNewUtilisateur" persistent max-width="1000px" overlay-opacity="0.8">
        <v-card class="px-6" outlined>
            <v-form ref="form" v-model="rules.valid" lazy-validation>
                <v-card-title class="grey--text">
                    Ajout Livreur
                    <v-icon aria-label="Close" class="ml-auto" @click="isDialogNewUtilisateur = false">mdi-close</v-icon>
                </v-card-title>
                <v-col cols="12">
                    <div class="text-center">
                        <v-divider />
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field color="grey" label="Nom*" v-model.trim="livreur.lastname" prepend-inner-icon="mdi-face" clearable :rules="rules.caractereRules" required />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field color="grey" label="Prénom*" v-model.trim="livreur.firstname" prepend-inner-icon="mdi-face" clearable :rules="rules.caractereRules" required />
                            </v-col>
                        </v-row>
                        <v-row class="mt-n4">
                            <v-col cols="12" md="6">
                                <v-text-field color="grey" label="Email*" v-model.trim="livreur.email" prepend-inner-icon="mdi-email-outline" clearable :rules="rules.emailRules" required />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field color="grey" label="Password*" v-model="livreur.password" prepend-inner-icon="mdi-lock-outline" clearable :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :rules="rules.passwordRules" required />
                            </v-col>
                        </v-row>
                        <v-row class="mt-n4">
                            <v-col cols="12" md="6">
                                <v-select color="grey" prepend-inner-icon="mdi-format-list-bulleted-type" v-model.trim="livreur.civilite" :items="['Homme', 'Femme']" label="Civilité*" :rules="rules.champRules" required></v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-menu v-model="isDialogDateNaissanceOpen" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" color="grey">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field color="grey" v-model="livreur.dateNaissance" :rules="rules.dateEnRules" required label="Date de naissance*" prepend-inner-icon="mdi-calendar-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker color="grey" locale="fr" first-day-of-week="1" v-model="livreur.dateNaissance" @input="isDialogDateNaissanceOpen = false" :rules="rules.dateEnRules" required></v-date-picker>
                                </v-menu>
                            </v-col>
                        </v-row>
                        <v-row class="mt-n4">
                            <v-col cols="12" md="6">
                                <v-text-field color="grey" label="Numéro de téléphone" v-model.trim="livreur.portable" prepend-inner-icon="mdi-deskphone" clearable />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field color="grey" label="Adresse" v-model.trim="livreur.adresse" prepend-inner-icon="mdi-walk" clearable />
                            </v-col>
                        </v-row>
                    </div>
                    <small>*Veuillez remplir les champs</small>
                    <v-col cols="12" class="text-right">
                        <v-btn class="mr-1" color="error" text @click.prevent="isDialogNewUtilisateur = false">Fermer</v-btn>
                        <v-btn color="success" text @click.prevent="saveNewUtilisateur">Sauvegarder</v-btn>
                    </v-col>
                </v-col>
            </v-form>
        </v-card>
    </v-dialog>
    <v-dialog v-model="isDialogDisableUtilisateur" width="500" overlay-opacity="0.8">
        <v-card outlined>
            <v-card-title>
                Désactiver le livreur {{ utilisateurToDisable.firstname }}
                {{ utilisateurToDisable.lastname }} ?
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="isDialogDisableUtilisateur = false" class="mx-2" fab dark>
                    <v-icon dark>mdi-close</v-icon>
                </v-btn>
                <v-btn @click="disableUtilisateur" class="mx-2" fab color="green darken-1">
                    <v-icon dark>mdi-check-bold</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <base-material-card color="grey" icon="mdi-walk" max-width="100%" width="auto" inline class="px-5 py-3 mx-auto">
        <template v-slot:after-heading>
            <div class="display-1 font-weight-light">Livreurs</div>
        </template>

        <v-row class="mt-8 mr-1">
            <v-btn color="grey" @click="isDialogNewUtilisateur = true" class="ml-3" :disabled="!isAdmin" dark>
                <v-icon left>mdi-account-plus-outline</v-icon>Ajouter Livreur
            </v-btn>
            <v-btn color="grey" icon @click="getUtilisateursData" class="ml-3">
                <v-icon large>mdi-refresh</v-icon>
            </v-btn>
            <v-text-field v-model="search" prepend-icon="mdi-magnify" class="ml-auto" label="Recherche" color="primary" hide-details single-line style="max-width: 250px" clearable />
        </v-row>
        <v-divider class="mt-6" />

        <v-skeleton-loader v-if="isFirstLoad" :loading="isLoading" type="table"></v-skeleton-loader>
        <v-data-table v-else :headers="headers" :items="items" :search.sync="search" :sort-by="['lastname']" :sort-desc="[false]" show-expand single-expand item-key="email" :expanded.sync="expanded">
            <template v-slot:[`item.createdAt`]="{ item }"> {{ item.createdAt | moment("YYYY-MM-DD HH:mm") }} </template>
            <template v-slot:[`item.lastLogin`]="{ item }"> {{ item.lastLogin | moment("YYYY-MM-DD HH:mm") }} </template>
            <template v-slot:[`item.checked`]="{ item }">
                <v-icon color="success" v-if="item.checked">mdi-checkbox-marked-circle-outline</v-icon>
                <v-icon color="error" v-else>mdi-close-circle-outline</v-icon>
            </template>
            <template v-slot:[`item.disabled`]="{ item }">
                <v-icon color="error" v-if="item.disabled">mdi-close-circle-outline</v-icon>
                <v-icon color="success" v-else>mdi-checkbox-marked-circle-outline</v-icon>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                    <span v-if="item.role.toLowerCase() === 'administrateur'" class="purple--text mr-3 pa-1 mt-1" style="border: solid 1px purple">Admin</span>
                    <v-btn small color="blue" :class="{
                        'ml-0': $vuetify.breakpoint.mdAndUp,
                        'ml-3': $vuetify.breakpoint.smAndDown,
                    }" outlined @click="PageInfosUtilisateur(item, false)">
                        <v-icon left>mdi-card-account-details-outline</v-icon>
                        Informations {{ item.civilite.toLowerCase() === "homme" ? 'M. '+ item.lastname : 'Mme '+ item.lastname }}
                    </v-btn>
                    <v-btn :disabled="item.disabled || !isAdmin || item.role.toLowerCase() === 'administrateur'" small outlined color="orange" @click="PageInfosUtilisateur(item, true)" class="ml-3">
                        <v-icon left>mdi-account-edit-outline</v-icon>
                        Modifier {{ item.civilite.toLowerCase() === "homme" ? 'M. '+ item.lastname : 'Mme '+ item.lastname }}
                    </v-btn>
                    <v-btn :disabled="item.disabled || !isAdmin || item.role.toLowerCase() === 'administrateur'" small outlined color="red" @click="dialogDeleteUtilisateur(item)" class="ml-3">
                        <v-icon left>mdi-account-remove-outline</v-icon>
                        Désactiver {{ item.civilite.toLowerCase() === "homme" ? 'M. '+ item.lastname : 'Mme '+ item.lastname }}
                    </v-btn>
                </td>
            </template>
            <div slot="no-results" :value="true" icon="warning" class="error--text">
                La recherche "{{ search }}" est inconnu.
            </div>
        </v-data-table>
    </base-material-card>
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
import Vue from 'vue';
import Gestion from "../../mixins/Gestion"
import axiosApi from '../../plugins/axiosApi';
import qs from "qs";
import {
    AxiosResponse
} from 'axios';
import moment from 'moment';

export default Vue.extend({
    name: 'Livreurs',
    mixins: [Gestion],
    props: {},
    components: {},
    //data: () => ({}),
    data(): any {
        return {
            isDialogNewUtilisateur: false as boolean,
            isDialogDateNaissanceOpen: false as boolean,
            isDialogDisableUtilisateur: false as boolean,
            utilisateurToDisable: [] as Array < any > ,
            livreur: {
                email: "",
                password: "",
                lastname: "",
                firstname: "",
                dateNaissance: "", //new Date().toISOString().substr(0, 10)
                civilite: "",
                adresse: "",
                portable: "",
                isAdmin: false,
                role: "Commercial",
            },
            search: undefined as string | null | undefined,
            expanded: [] as Array < any > ,
            headers: [{
                    text: "Nom",
                    value: "lastname",
                },
                {
                    text: "Prénom",
                    value: "firstname",
                },
                {
                    text: "Email",
                    value: "email",
                },{
                    sortable: false,
                    text: "Dernière connexion",
                    value: "lastLogin",
                }, {
                    sortable: false,
                    text: "Checked",
                    value: "checked",
                }, {
                    sortable: false,
                    text: "Actif",
                    value: "disabled",
                },
            ] as Array < any > ,
            items: [] as Array < any > ,
        }
    },
    watch: {},
    created() {
        //console.log('created')
    },
    beforeMount() {
        //console.log('beforeMount')
    },
    async mounted() {
        await this.getUtilisateursData();
    },
    methods: {
        getUtilisateursData: async function (): Promise < void > {
            //https://jsonplaceholder.typicode.com/users
            this.isLoading = true;
            this.isFirstLoad = true;
            await axiosApi.get("/user/all/Livreur") //tous les livreurs
            .then((response: AxiosResponse) => {
                this.items = response.data.users;
                for (let i = 0; i < this.items.length; i++) {
                    this.items[i].isAdmin = this.items[i].role.toLowerCase() === "administrateur" ? true : false
                }
                setTimeout(() => {
                    this.isLoading = false;
                    this.isFirstLoad = false;
                }, 1000);
            })
            .catch((error) => {
                this.catchAxios(error)
                setTimeout(() => {
                    this.isLoading = false;
                    this.isFirstLoad = false;
                }, 1000);
            });
        },
        saveNewUtilisateur: async function (): Promise < void > {
            if (!this.$refs.form.validate()) return this.errorMessage("Veuillez vérifier les champs !");

            this.livreur.role = this.livreur.isAdmin === true ? 'Administrateur' : 'Livreur'
            await axiosApi.post(
                "/register",
                qs.stringify(this.livreur)
            )
            .then((response) => {
                Object.assign(this.$data, this.$options.data()); //reset data
                this.$refs.form.reset();
                this.successMessage("Le livreur a bien été ajouté !");
                setTimeout(() => {
                    this.getUtilisateursData();
                }, 1000);
            })
            .catch((error) => {
                this.catchAxios(error)
            });
        },
        disableUtilisateur: async function (): Promise < void > {
            this.isDialogDisableUtilisateur = false;
            await axiosApi
            .put("/user/disable/" + this.utilisateurToDisable._id)
            .then((response) => {
                console.log(response.data.message)
                const utilisateurFirstname = this.utilisateurToDisable.firstname;
                const utilisateurLastname = this.utilisateurToDisable.lastname;
                Object.assign(this.$data, this.$options.data()); //reset data
                //this.$refs.form.reset();
                this.successMessage(`Le livreur ${utilisateurFirstname} ${utilisateurLastname} a été désactivé avec succès`);
                setTimeout(() => {
                    this.getUtilisateursData();
                }, 1000);
            })
            .catch((error) => {
                this.catchAxios(error)
            });
        },
        dialogDeleteUtilisateur: function (infosLivreur: Record < string, any > ) {
            this.isDialogDisableUtilisateur = true;
            this.utilisateurToDisable = infosLivreur;
        },
        PageInfosUtilisateur: function (infosLivreur: Record < string, any > , isEdit: boolean) {
            this.$router.push({
                name: "Informations-Livreur",
                params: {
                    isEdit: isEdit,
                    infosLivreur: infosLivreur
                },
            });
        }
    }
});
</script>

<style></style>

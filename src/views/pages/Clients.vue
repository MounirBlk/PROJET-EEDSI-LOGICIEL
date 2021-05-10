<template>
<v-container id="clients" tag="section" fluid>
    <v-dialog v-model="isDialogDisableUtilisateur" width="500" overlay-opacity="0.8">
        <v-card outlined>
            <v-card-title>
                Désactiver le client {{ utilisateurToDisable.firstname }}
                {{ utilisateurToDisable.lastname }} ?
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="isDialogDisableUtilisateur = false" class="mx-2" icon outlined  color="red" dark>
                    <v-icon dark>mdi-close</v-icon>
                </v-btn>
                <v-btn @click="disableUser" class="mx-2" icon outlined color="green darken-1">
                    <v-icon dark>mdi-check-bold</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <base-material-card color="indigo" icon="mdi-clipboard-account-outline" max-width="100%" width="auto" inline class="px-5 py-3 mx-auto">
        <template v-slot:after-heading>
            <div class="display-1 font-weight-light">Clients</div>
        </template>

        <v-row class="mt-8 mr-1">
            <v-btn color="indigo" outlined icon @click="getUtilisateursData" class="ml-3">
                <v-icon large>mdi-refresh</v-icon>
            </v-btn>
            <v-text-field v-model="search" prepend-icon="mdi-magnify" class="ml-auto" label="Recherche" color="indigo" hide-details single-line style="max-width: 250px" clearable />
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
    name: 'Clients',
    mixins: [Gestion],
    props: {},
    components: {},
    //data: () => ({}),
    data(): any {
        return {
            isDialogDisableUtilisateur: false as boolean,
            utilisateurToDisable: [] as Array < any > ,
            client: {
                email: "",
                password: "",
                lastname: "",
                firstname: "",
                dateNaissance: "", //new Date().toISOString().substr(0, 10)
                civilite: "",
                portable: "",
                isAdmin: false,
                role: "Client",
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
                },{
                    sortable: false,
                    text: "Checked",
                    value: "checked",
                },{
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
            await axiosApi.get("/user/all/Client") //tous les clients
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
        disableUser: async function (): Promise < void > {
            this.isDialogDisableUtilisateur = false;
            await axiosApi
            .put("/user/disable/" + this.utilisateurToDisable._id)
            .then((response) => {
                console.log(response.data.message)
                const utilisateurFirstname = this.utilisateurToDisable.firstname;
                const utilisateurLastname = this.utilisateurToDisable.lastname;
                Object.assign(this.$data, this.$options.data()); //reset data
                //this.$refs.form.reset();
                this.successMessage(`Le client ${utilisateurFirstname} ${utilisateurLastname} a été désactivé avec succès`);
                setTimeout(() => {
                    this.getUtilisateursData();
                }, 1000);
            })
            .catch((error) => {
                this.catchAxios(error)
            });
        },
        dialogDeleteUtilisateur: function (infosClient: Record < string, any > ) {
            this.isDialogDisableUtilisateur = true;
            this.utilisateurToDisable = infosClient;
        },
        PageInfosUtilisateur: function (infosClient: Record < string, any > , isEdit: boolean) {
            this.$router.push({
                name: "Informations-Client",
                params: {
                    isEdit: isEdit,
                    infosClient: infosClient
                },
            });
        }
    }
});
</script>

<style></style>

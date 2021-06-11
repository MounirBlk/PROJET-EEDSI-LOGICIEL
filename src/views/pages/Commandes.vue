<template>
<v-container id="produits" tag="section" fluid>
    <v-dialog v-model="isDialogDeleteCommande" width="500" overlay-opacity="0.8">
        <v-card outlined>
            <v-card-title>
                Supprimer la commande {{ commandeToDelete.refID }} ?
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="isDialogDeleteCommande = false" class="mx-2" icon outlined color="red" dark>
                    <v-icon dark>mdi-close</v-icon>
                </v-btn>
                <v-btn @click="deleteCommande" class="mx-2" icon outlined color="green darken-1">
                    <v-icon dark>mdi-check-bold</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="isDialogEditCommande" width="500" overlay-opacity="0.8">
        <v-card outlined>
            <v-card-title>
                Modifier une commande
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="6" md="6">
                            <v-select label="Statut" v-model="commandeToUpdate.statut" :items='["Attente", "Livraison", "Signalement", "Termine"]' color="success" prepend-inner-icon="mdi-format-list-checkbox" clearable></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field label="Date de livraison" v-model="commandeToUpdate.dateLivraison" hint="YYYY-MM-DD HH:mm" color="success" prepend-inner-icon="mdi-card-text-outline" clearable></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field label="Adresse de livraison" v-model="commandeToUpdate.adresseLivraison" color="success" prepend-inner-icon="mdi-card-text-outline" clearable></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="12" v-if="commandeToUpdate.statut !== 'Attente'">
                            <v-autocomplete :disabled="!isEditLivreur" v-model="updatedLivreurID" :items="livreurs" prepend-inner-icon="mdi-magnify" color="success" item-text="lastname" item-value="_id" hide-no-data hide-details item-color label="Livreur"></v-autocomplete>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="mr-1" v-if="commandeToUpdate.statut !== 'Attente'" outlined :color="!isEditLivreur ? 'orange' : 'pink'" text @click="isEditLivreur = !isEditLivreur;">Modifier livreur</v-btn>
                <v-btn class="mr-1" color="error" text @click.prevent="isDialogEditCommande = false;">Fermer</v-btn>
                <v-btn color="success" text @click.prevent="saveModification(commandeToUpdate, updatedLivreurID)">
                    <v-icon left>mdi-check</v-icon> Sauvegarder
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <base-material-card color="success" icon="mdi-package-variant-closed" max-width="100%" width="auto" inline class="px-5 py-3 mx-auto">
        <template v-slot:after-heading>
            <div class="display-1 font-weight-light">Commandes</div>
        </template>
        <v-row class="mt-8 mr-1">
            <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn :disabled="isFirstLoad || isLoading" color="success" icon v-bind="attrs" v-on="on" @click="getCommandesData" class="ml-3">
                        <v-icon large>mdi-refresh</v-icon>
                    </v-btn>
                </template>
                <span>Refresh</span>
            </v-tooltip>
            <v-text-field v-model="search" prepend-icon="mdi-magnify" class="ml-auto" label="Recherche" color="success" hide-details single-line style="max-width: 250px" clearable />
        </v-row>
        <v-divider class="mt-6" />
        <v-skeleton-loader v-if="isFirstLoad" :loading="isLoading" type="table"></v-skeleton-loader>
        <v-data-table v-else :headers="headers" :items="commandes" :search.sync="search" :sort-by="['dateLivraison']" :sort-desc="[false]" item-key="refID">
            <template v-slot:[`item.clientID.lastname`]="{ item }">
                <v-icon color="error" v-if="item.clientID === null" left>mdi-close-circle-outline</v-icon>
                <v-icon color="success" v-else left>mdi-checkbox-marked-circle-outline</v-icon>
                {{ item.clientID !== null ? 'M/Mme. ' + item.clientID.lastname : "Inconnu" }}
            </template>
            <template v-slot:[`item.livreurID.lastname`]="{ item }">
                <v-icon color="error" v-if="item.livreurID === null" left>mdi-close-circle-outline</v-icon>
                <v-icon color="success" v-else left>mdi-checkbox-marked-circle-outline</v-icon>
                <span v-if="item.livreurID !== null">{{ 'M/Mme. ' + item.livreurID.lastname }}</span>
                <span v-else>Inconnu</span>
            </template>
            <template v-slot:[`item.statut`]="{ item }">
                <v-chip dark :color="item.statut === 'Attente' ? 'indigo' : item.statut === 'Livraison' ? 'orange' : item.statut === 'Signalement' ? 'red' : item.statut === 'Termine' ? 'green' : 'grey darken-1'">{{ item.statut }}</v-chip>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-btn :disabled="isFirstLoad || isLoading" icon color="success" @click="downloadCommande(item)">
                    <v-icon>
                        mdi-download
                    </v-icon>
                </v-btn>
                <v-btn :disabled="isFirstLoad || isLoading" icon color="info" @click="PageInfosCommande(item, false)">
                    <v-icon>
                        mdi-information-outline
                    </v-icon>
                </v-btn>
                <v-btn :disabled="isFirstLoad || isLoading || item.statut === 'Termine'" icon color="orange" @click="PageInfosCommande(item, true)">
                    <v-icon>
                        mdi-pencil-outline
                    </v-icon>
                </v-btn>
                <v-btn :disabled="isFirstLoad || isLoading" icon color="error" @click="dialogDeleteCommande(item)">
                    <v-icon>
                        mdi-delete-outline
                    </v-icon>
                </v-btn>
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
    AxiosResponse,
    AxiosRequestConfig
} from 'axios';
import moment from 'moment';
import fileSaver from 'file-saver';

export default Vue.extend({
    name: 'Commandes',
    mixins: [Gestion],
    props: {},
    components: {},
    //data: () => ({}),
    data(): any {
        return {
            isDialogDeleteCommande: false as boolean,
            isDialogEditCommande: false as boolean,
            isLoading: true as boolean, //squeleton-loader
            isFirstLoad: true as boolean, //squeleton-loader
            commandeToDelete: [] as Array < any > ,
            search: undefined as string | null | undefined,
            headers: [{
                text: "Reférence commande",
                value: "refID",
            }, {
                text: "Statut",
                value: "statut",
            }, {
                text: "Date de livraison",
                value: "dateLivraison",
            }, {
                //sortable: false,
                text: "Client",
                value: "clientID.lastname",
            }, {
                text: "Livreur",
                value: "livreurID.lastname",
                divider: true
            }, {
                text: 'Actions',
                value: 'actions',
                sortable: false,
                align: 'center'
            }] as Array < any > ,
            commandes: [] as Array < any > ,
            livreurs: [] as Array < any > ,
            commandeToUpdate: {},
            updatedLivreurID: '',
            isEditLivreur: false as boolean,
        }
    },
    watch: {},
    created() {},
    beforeMount() {},
    async mounted() {
        await this.getCommandesData();
    },
    methods: {
        getCommandesData: function (): void {
            this.isLoading = true;
            this.isFirstLoad = true;
            const requestCommandes = axiosApi.get('/commande/all/all');
            const requestLivreurs = axiosApi.get('/user/all/Livreur');
            Promise.all([requestCommandes, requestLivreurs])
                .then((response: AxiosResponse[]) => {
                    this.commandes = response[0].data.commandes;
                    this.livreurs = response[1].data.users;
                    setTimeout(() => {
                        this.isLoading = false;
                        this.isFirstLoad = false;
                    }, 1000);
                }).catch((error: any) => {
                    this.catchAxios(error)
                    setTimeout(() => {
                        this.isLoading = false;
                        this.isFirstLoad = false;
                    }, 1000);
                });
        },
        downloadCommande: function (infosCommande: Record < string, any > ) {
            if (infosCommande.clientID === null || infosCommande.clientID === undefined) {
                return this.errorMessage('Le client n\'existe pas')
            } else {
                this.isLoading = true;
                this.isFirstLoad = true;
                const payload = {
                    commande: infosCommande
                };
                const configAxios: AxiosRequestConfig = {
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    timeout: 1000 * 60 * 60,
                    responseType: 'blob'
                };
                axiosApi.post("/commande/download", payload, configAxios)
                    .then((response: AxiosResponse) => {
                        fileSaver.saveAs(response.data, `${infosCommande.refID}.pdf`); //application/pdf;charset=utf-8
                        this.successMessage("Téléchargement effectué avec succès");
                        setTimeout(() => {
                            this.isLoading = false;
                            this.isFirstLoad = false;
                        }, 1500);
                    })
                    .catch((error) => {
                        this.catchAxios(error)
                        setTimeout(() => {
                            this.isLoading = false;
                            this.isFirstLoad = false;
                        }, 1000);
                    });
            }
        },
        saveModification: function (commandeToUpdate: any, updatedLivreurID: string): void {
            let payload = {
                statut: commandeToUpdate.statut,
                dateLivraison: commandeToUpdate.dateLivraison,
                adresseLivraison: commandeToUpdate.adresseLivraison,
                livreurID: updatedLivreurID,
            }
            payload.livreurID = this.isEditLivreur ? payload.livreurID : undefined
            axiosApi
                .put("/commande/update/" + commandeToUpdate._id, qs.stringify(payload))
                .then((response: AxiosResponse) => {
                    Object.assign(this.$data, this.$options.data()); //reset data
                    this.successMessage("Sauvegarde des modifications effectuée !");
                    setTimeout(() => {
                        this.getCommandesData();
                    }, 1000);
                })
                .catch((error) => {
                    this.catchAxios(error)
                });
        },
        deleteCommande: function (): void {
            this.isDialogDeleteCommande = false;
            axiosApi
                .delete("/commande/delete/" + this.commandeToDelete._id)
                .then((response: AxiosResponse) => {
                    Object.assign(this.$data, this.$options.data()); //reset data
                    //this.$refs.form.reset();
                    this.successMessage(`La commande a été supprimée avec succès`);
                    setTimeout(() => {
                        this.getCommandesData();
                    }, 1000);
                })
                .catch((error) => {
                    this.catchAxios(error)
                });
        },
        dialogDeleteCommande: function (infosCommande: Record < string, any > ) {
            this.isDialogDeleteCommande = true;
            this.commandeToDelete = infosCommande;
        },
        PageInfosCommande: function (infosCommande: Record < string, any > , isEdit: boolean) {
            if (isEdit) {
                this.commandeToUpdate = infosCommande;
                this.isDialogEditCommande = true;
            } else {
                this.isDialogEditCommande = false;
                this.$router.push({
                    name: "Informations-Commande",
                    params: {
                        idCommande: infosCommande._id,
                    },
                });
            }
        },
    }
});
</script>

<style></style>

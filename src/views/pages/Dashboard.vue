<template>
<div id="dashboard" class="pb-10">
    <v-container>
        <v-row>
            <v-col cols="12" md="12" sm="12">
                <v-hover v-slot="{ hover }">
                    <base-material-card :color="hover ? 'red lighten-1' :'red'" max-width="100%" width="auto" :style="hover ? 'filter: drop-shadow(3px 3px 7px red) invert(5%);' : 'filter: opacity(100%);'" class="px-5 py-3 mx-auto">
                        <template v-slot:heading>
                            <div class="text-center">
                                <span class="display-1 font-weight-bold">
                                    <v-icon large left>mdi-package-variant</v-icon>Commandes
                                </span>
                            </div>
                        </template>
                        <base-area-chart :key="resetComponentKey" :labels="chartCommandes.labels" :datasets="chartCommandes.datasets" />
                    </base-material-card>
                </v-hover>
            </v-col>
            <v-col cols="12" md="6" sm="12">
                <v-hover v-slot="{ hover }">
                    <base-material-card :color="hover ? 'indigo lighten-1' : 'indigo'" max-width="100%" width="auto" :style="hover ? 'filter: drop-shadow(3px 3px 7px indigo) invert(5%);' : 'filter: opacity(100%);'" class="px-5 py-3 mx-auto">
                        <template v-slot:heading>
                            <div class="text-center">
                                <span class="display-1 font-weight-bold">
                                    <v-icon large left>mdi-chair-school</v-icon>Produits/Composants
                                </span>
                            </div>
                        </template>
                        <base-bar-chart :key="resetComponentKey" :labels="chartProductComp.labels" :datasets="chartProductComp.datasets" :title="chartProductComp.title" />
                    </base-material-card>
                </v-hover>
            </v-col>
            <v-col cols="12" md="6" sm="12">
                <v-hover v-slot="{ hover }">
                    <base-material-card :color="hover ? 'pink lighten-1' : 'pink'" max-width="100%" width="auto" :style="hover ? 'filter: drop-shadow(3px 3px 7px pink) invert(5%);' : 'filter: opacity(100%);'" class="px-5 py-3 mx-auto">
                        <template v-slot:heading>
                            <div class="text-center">
                                <span class="display-1 font-weight-bold">
                                    <v-icon large left>mdi-account-group-outline</v-icon>Utilisateurs actifs
                                </span>
                            </div>
                        </template>
                        <base-pie-chart :key="resetComponentKey" :labels="chartPieUsers.labels" :datasets="chartPieUsers.datasets" :title="chartPieUsers.title" />
                    </base-material-card>
                </v-hover>
            </v-col>
            <v-col cols="12" md="12" sm="12">
                <v-hover v-slot="{ hover }">
                    <base-material-card :color="hover ? 'orange lighten-1' :'orange'" max-width="100%" width="auto" :style="hover ? 'filter: drop-shadow(3px 3px 7px orange) invert(5%);' : 'filter: opacity(100%);'" class="px-5 py-3 mx-auto">
                        <template v-slot:heading>
                            <div class="text-center">
                                <span class="display-1 font-weight-bold">
                                    <v-icon large left>mdi-finance</v-icon>Budgétisation (<v-icon large>mdi-currency-eur</v-icon>)
                                </span>
                            </div>
                        </template>
                        <base-line-chart :key="resetComponentKey" :chartData="chartBudget" :options="optionsChartBudget" />
                    </base-material-card>
                </v-hover>
            </v-col>
            <!--<v-col cols="12" md="12">
                <v-parallax src="https://zdnet1.cbsistatic.com/hub/i/r/2020/05/11/703e8b53-6149-47dd-9969-f7de6b044b3e/resize/1200xauto/311e6c882043a19e7b68cef0de73456f/apple-music.png" aspect-ratio="1" ></v-parallax>
                <vuetify-audio file="../../test.mp3" color="success" :ended="audioFinish" downloadable></vuetify-audio>
            </v-col>-->
            <v-col cols="12" md="12">
                <v-expansion-panels style="z-index: 0" focusable v-model="panelCommandes">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="green--text">Liste de commandes</v-expansion-panel-header>
                        <v-expansion-panel-content class="mb-n9">
                            <Commandes class="px-0"></Commandes>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
            <v-col cols="12" md="12">
                <v-expansion-panels style="z-index: 0" focusable v-model="panelCalendrier">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="red--text">Calendrier de commandes</v-expansion-panel-header>
                        <v-expansion-panel-content class="mb-n9">
                            <Calendar class="px-0"></Calendar>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        </v-row>
        <base-go-to-up />
        <v-snackbar v-model="isSnackbarOpened" elevation="24" :color="isSuccess ? 'success' : 'error'" style="filter: opacity(95%);">
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
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Gestion from "../../mixins/Gestion"
import Commandes from "./Commandes.vue"
import Calendar from "./Calendar.vue"
import axiosApi from '../../plugins/axiosApi';
import qs from "qs";
import {
    AxiosResponse,
    AxiosError
} from 'axios';
import moment from 'moment';
import {
    bus
} from "../../main";

export default Vue.extend({
    name: 'Dashboard',
    props: {},
    mixins: [Gestion],
    components: {
        Commandes,
        Calendar,
        VuetifyAudio: () => import('vuetify-audio'),
    },
    data: (): any => ({
        panelCalendrier: 1,
        panelCommandes: 1,
        chartCommandes: {
            title: 'Commandes',
            labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
            datasets: [{
                label: "Commandes client",
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }, {
                label: "Commandes prospect (devis)",
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }]
        },
        chartProductComp: {
            title: 'Produits et composants en fonction du type',
            labels: ["Chaise", "Table", "Armoire", "Lit", "Autres"],
            datasets: [{
                label: "Produits",
                data: [0, 0, 0, 0, 0]
            }, {
                label: "Composants",
                data: [0, 0, 0, 0, 0]
            }]
        },
        chartPieUsers: {
            title: 'Utilisateurs actifs de l\'entreprise',
            labels: ["Administrateurs", "Commerciaux", "Clients", "Livreurs", "Prospects"],
            datasets: {
                data: [0, 0, 0, 0, 0]
            }
        },
        chartBudget: {
            title: 'Chart',
            labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
            datasets: [{
                label: "Revenus par mois",
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                borderColor: "orange", //#05CBE1
                pointBackgroundColor: 'white', //rgba(171, 71, 188, 1)
                backgroundColor: "transparent" //transparent
            }]
        },
        optionsChartBudget: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: false,
                text: "Budgétisation (€)"
            }
        },
        //value: 'filter: opacity(100%);',
    }),
    created() {
        bus.$on("synchro", async () => {
            await this.getData();
        });
    },
    beforeMount() {},
    async mounted() {
        await this.getData();
    },
    methods: {
        getData: function (): void {
            let ttPromise: Promise < AxiosResponse < any >> [] = []
            ttPromise.push(axiosApi.get("/commande/all/all"));
            ttPromise.push(axiosApi.get("/user/all/all"));
            ttPromise.push(axiosApi.get("/product/all"));
            ttPromise.push(axiosApi.get("/composant/all"));
            Promise.all(ttPromise)
                .then((response: AxiosResponse[]) => {
                    if (!response[0].data.error) {
                        let pieCommandesClientData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        let pieCommandesProspectData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        let pieCommandesRevenusData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        response[0].data.commandes.forEach((commande: any) => {
                            if (commande.clientID && commande.clientID !== null && commande.clientID.role === "Prospect") { //Prospect
                                for (let j = 0; j < 12; j++) {
                                    pieCommandesProspectData[j] = (new Date(commande.dateLivraison).getMonth() + 1) === (j + 1) ? pieCommandesProspectData[j] + 1 : pieCommandesProspectData[j]
                                }
                            } else { //Client
                                for (let i = 0; i < 12; i++) {
                                    pieCommandesClientData[i] = (new Date(commande.dateLivraison).getMonth() + 1) === (i + 1) ? pieCommandesClientData[i] + 1 : pieCommandesClientData[i]
                                }
                            }
                            for (let k = 0; k < 12; k++) {
                                pieCommandesRevenusData[k] = (new Date(commande.dateLivraison).getMonth() + 1) === (k + 1) ? pieCommandesRevenusData[k] + commande.prixTotal : pieCommandesRevenusData[k]
                            }
                        });
                        this.chartCommandes.datasets[0].data = pieCommandesClientData;
                        this.chartCommandes.datasets[1].data = pieCommandesProspectData;
                        this.chartBudget.datasets[0].data = pieCommandesRevenusData.map((el: any) => el = parseFloat(el.toFixed(2)))
                    }
                    if (!response[1].data.error) {
                        let pieUsersData = [0, 0, 0, 0, 0]
                        const tabRoles = ["Administrateur", "Commercial", "Client", "Livreur", "Prospect"]
                        response[1].data.users.filter((user: any) => user.disabled === false).forEach((user: any) => {
                            tabRoles.forEach((role: string, index: number) => {
                                pieUsersData[index] = user.role === role ? pieUsersData[index] + 1 : pieUsersData[index]
                            });
                        });
                        this.chartPieUsers.datasets.data = pieUsersData;
                    }
                    if (!response[2].data.error && !response[3].data.error) {
                        const tabTypes = ["Chaise", "Table", "Armoire", "Lit", "Autres"]
                        let pieProductData = [0, 0, 0, 0, 0]
                        response[2].data.products.forEach((product: any) => {
                            tabTypes.forEach((type: string, index: number) => {
                                pieProductData[index] = product.type === type ? pieProductData[index] + 1 : pieProductData[index]
                            });
                        });
                        let pieCompData = [0, 0, 0, 0, 0]
                        response[3].data.composants.forEach((composant: any) => {
                            tabTypes.forEach((type: string, index: number) => {
                                pieCompData[index] = composant.type === type ? pieCompData[index] + 1 : pieCompData[index]
                            });
                        });
                        this.chartProductComp.datasets[0].data = pieProductData;
                        this.chartProductComp.datasets[1].data = pieCompData;
                    }
                    this.resetComponentKey++ //reset data chart
                }).catch((error: AxiosError) => {
                    this.catchAxios(error)
                });
        },
    }
});
</script>

<style>
</style>

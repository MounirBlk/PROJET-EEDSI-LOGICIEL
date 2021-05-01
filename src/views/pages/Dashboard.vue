<template>
<div id="dashboard" class="pb-10">
    <v-container>
        <v-row>
            <v-col cols="12" md="12" sm="12">
                <base-area-chart :key="resetComponentKey" :labels="chartCommandes.labels" :datasets="chartCommandes.datasets" :title="chartCommandes.title" />
            </v-col>
            <v-col cols="6" md="6" sm="12">
                <base-material-card color="indigo" max-width="100%" width="auto" class="px-5 py-3 mx-auto">
                    <template v-slot:heading>
                        <div class="text-center">
                            <h1 class="display-1 font-weight-bold">
                                <v-icon large left>mdi-chair-school</v-icon>Produits/Composants
                            </h1>
                        </div>
                    </template>
                    <base-bar-chart :key="resetComponentKey" :labels="chartProductComp.labels" :datasets="chartProductComp.datasets" :title="chartProductComp.title" />
                </base-material-card>
            </v-col>
            <v-col cols="6" md="6" sm="12">
                <base-material-card color="red" max-width="100%" width="auto" class="px-5 py-3 mx-auto">
                    <template v-slot:heading>
                        <div class="text-center">
                            <h1 class="display-1 font-weight-bold">
                                <v-icon large left>mdi-account-group-outline</v-icon>Utilisateurs
                            </h1>
                        </div>
                    </template>
                    <base-pie-chart :colors="chartPieUsers.colors" :labels="chartPieUsers.labels" :datasets="chartPieUsers.datasets" :title="chartPieUsers.title" />
                </base-material-card>
            </v-col>
            <v-col cols="12" md="12">
                <base-line-chart :key="resetComponentKey" :chartData="chartBudget" :options="optionsChartBudget" />
            </v-col>
            <v-col cols="12" md="12">
                <v-expansion-panels style="z-index: 0" focusable v-model="panelCommandes">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="green--text">Commandes</v-expansion-panel-header>
                        <v-expansion-panel-content class="mb-n9">
                            <Commandes class="px-0"></Commandes>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
            <v-col cols="12" md="12">
                <v-expansion-panels style="z-index: 0" focusable v-model="panelCalendrier">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="red--text">Calendrier</v-expansion-panel-header>
                        <v-expansion-panel-content class="mb-n9">
                            <Calendar class="px-0"></Calendar>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        </v-row>
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

export default Vue.extend({
    name: 'Dashboard',
    props: {},
    mixins: [Gestion],
    components: {
        Commandes,
        Calendar
    },
    data: (): any => ({
        panelCalendrier: 0,
        panelCommandes: 0,
        chartCommandes: {
            title: 'Commandes',
            labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
            datasets: [{
                    label: "Commandes client",
                    typeGradient: 1,
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                },
                {
                    label: "Commandes Devis Prospect",
                    typeGradient: 2,
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                }
            ]
        },
        chartProductComp: {
            title: 'Produits et Composants en fonction du type',
            labels: ["Chaise", "Table", "Armoire", "Lit", "Autres"],
            datasets: [{
                    label: "Produits",
                    typeGradient: 1,
                    data: [0, 0, 0, 0, 0]
                },
                {
                    label: "Composants",
                    typeGradient: 2,
                    data: [0, 0, 0, 0, 0]
                }
            ]
        },
        chartPieUsers: {
            title: 'Utilisateurs',
            labels: ["Administrateurs", "Commerciaux", "Clients", "Livreurs", "Prospects"],
            datasets: {
                data: [0, 0, 0, 0, 0]
            },
            colors: ["indigo", "orange", "green", "purple", "red"]
        },
        chartBudget: {
            title: 'Chart',
            labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
            datasets: [{
                    label: "Revenus par mois",
                    typeGradient: 1,
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    borderColor: "orange",//#05CBE1
                    pointBackgroundColor: 'indigo',//rgba(171, 71, 188, 1)
                    backgroundColor: "transparent"
                }]
        },
        optionsChartBudget: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: "Budgétisation (€)"
            }
        },
    }),
    created() {},
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
                        /*const months = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
                        const d = new Date("2021-04-30 20:40");
                        console.log("The current month is " + months[d.getMonth()]);*/
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
                        response[1].data.users.forEach((user: any) => {
                            pieUsersData[0] = user.role === "Administrateur" ? pieUsersData[0] + 1 : pieUsersData[0]
                            pieUsersData[1] = user.role === "Commercial" ? pieUsersData[1] + 1 : pieUsersData[1]
                            pieUsersData[2] = user.role === "Client" ? pieUsersData[2] + 1 : pieUsersData[2]
                            pieUsersData[3] = user.role === "Livreur" ? pieUsersData[3] + 1 : pieUsersData[3]
                            pieUsersData[4] = user.role === "Prospect" ? pieUsersData[4] + 1 : pieUsersData[4]
                        });
                        this.chartPieUsers.datasets.data = pieUsersData;
                    }
                    if (!response[2].data.error && !response[3].data.error) {
                        let pieProductData = [0, 0, 0, 0, 0]
                        response[2].data.products.forEach((product: any) => {
                            pieProductData[0] = product.type === "Chaise" ? pieProductData[0] + 1 : pieProductData[0]
                            pieProductData[1] = product.type === "Table" ? pieProductData[1] + 1 : pieProductData[1]
                            pieProductData[2] = product.type === "Armoire" ? pieProductData[2] + 1 : pieProductData[2]
                            pieProductData[3] = product.type === "Lit" ? pieProductData[3] + 1 : pieProductData[3]
                            pieProductData[4] = product.type === "Autres" ? pieProductData[4] + 1 : pieProductData[4]
                        });
                        let pieCompData = [0, 0, 0, 0, 0]
                        response[3].data.composants.forEach((composant: any) => {
                            pieCompData[0] = composant.type === "Chaise" ? pieCompData[0] + 1 : pieCompData[0]
                            pieCompData[1] = composant.type === "Table" ? pieCompData[1] + 1 : pieCompData[1]
                            pieCompData[2] = composant.type === "Armoire" ? pieCompData[2] + 1 : pieCompData[2]
                            pieCompData[3] = composant.type === "Lit" ? pieCompData[3] + 1 : pieCompData[3]
                            pieCompData[4] = composant.type === "Autres" ? pieCompData[4] + 1 : pieCompData[4]
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

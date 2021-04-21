<template>
<div id="dashboard" class="pb-10">
    <v-container>
        <base-area-chart :labels="chart.labels" :datasets="chart.datasets" :title="chart.title" />
        <v-row>
            <v-col cols="6" md="6" sm="12">
                <base-material-card color="indigo" max-width="100%" width="auto" class="px-5 py-3 mx-auto">
                    <template v-slot:heading>
                        <div class="text-center">
                            <h1 class="display-1 font-weight-bold">
                                <v-icon large left>mdi-star</v-icon>Chart
                            </h1>
                        </div>
                    </template>
                    <base-bar-chart :labels="chart.labels" :datasets="chart.datasets" :title="chart.title" />
                </base-material-card>
            </v-col>
            <v-col cols="6" md="6" sm="12">
                <base-material-card color="red" max-width="100%" width="auto" class="px-5 py-3 mx-auto">
                    <template v-slot:heading>
                        <div class="text-center">
                            <h1 class="display-1 font-weight-bold">
                                <v-icon large left>mdi-star</v-icon>Chart
                            </h1>
                        </div>
                    </template>
                    <base-pie-chart :labels="chartPie.labels" :datasets="chartPie.datasets" :title="chartPie.title" />
                </base-material-card>
            </v-col>
            <v-col cols="12" md="12">
                <base-line-chart :key="resetComponentKey" :chartData="chartInit" :options="options" />
                <!--<base-line-chart :labels="chart.labels" :datasets="chart.datasets" :title="chart.title" />-->
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
        chart: {
            title: 'Chart',
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                    label: "Data One",
                    typeGradient: 1,
                    data: [40, 39, 10, 40, 39, 80, 40]
                },
                {
                    label: "Data Twod",
                    typeGradient: 2,
                    data: [60, 55, 32, 10, 2, 12, 53]
                }
            ]
        },
        chartPie: {
            title: 'Chart Pie',
            labels: ["Books", "Magazines", "Newspapers"],
            datasets: {
                data: [40, 39, 20]
            }
        },
        chartInit: {
            title: 'Chart',
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                    label: "Data One",
                    typeGradient: 1,
                    data: [40, 39, 10, 40, 39, 80, 40],
                    borderColor: "#FC2525",
                    pointBackgroundColor: 'rgba(171, 71, 188, 1)',
                    backgroundColor: "transparent"
                },
                {
                    label: "Data Twod",
                    typeGradient: 2,
                    data: [60, 55, 32, 10, 2, 12, 53],
                    borderColor: "#05CBE1",
                    pointBackgroundColor: 'rgba(171, 71, 188, 1)',
                    backgroundColor: "transparent"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: "My Data"
            }
        },
    }),
    created() {
        //console.log('created')
    },
    beforeMount() {
        //console.log('beforeMount')
    },
    mounted() {
        //console.log(window)
    },
    methods: {}
});
</script>

<style>
</style>

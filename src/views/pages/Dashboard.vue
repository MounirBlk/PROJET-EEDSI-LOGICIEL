<template >
<div id="dashboard"  class="pb-10">
    <v-container>
        <base-area-chart :labels="chart.labels" :datasets="chart.datasets" :title="chart.title" />
        <v-row>
            <v-col cols="6" md="6" sm="12">
                <base-material-card color="indigo" max-width="100%" width="auto" class="px-5 py-3 mx-auto">
                    <template v-slot:heading>
                        <div class="text-center">
                            <h1 class="display-1 font-weight-bold">
                                <v-icon large left>mdi-star</v-icon>Chart <v-btn color="orange" @click="test"> test</v-btn>
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
        </v-row>
        <!--<base-line-chart :labels="chart.labels" :datasets="chart.datasets" :title="chart.title" />-->
    </v-container>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'Dashboard',
    props: {},
    components: {},
    data: () => ({
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
    }),
    computed: {},
    created() {
        //console.log('created')
    },
    beforeMount() {
        //console.log('beforeMount')
    },
    mounted() {
        //console.log('mounted')
    },
    methods: {
      test: function(): void{
        this.chart.datasets[0].data = [80, 79, 50, 40, 39, 80, 40]
        this.chartPie.title = 'New Chart Pie'
        this.chartPie.datasets.data = [80, 39, 50, 100]
        this.chartPie.labels = ["Books", "Magazines", "Newspapers", 'Autres']
      }
    }
});
</script>

<style>
</style>

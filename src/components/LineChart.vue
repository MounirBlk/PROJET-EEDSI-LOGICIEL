<script lang="ts">
import {
    Line
} from "vue-chartjs";
import Vue from 'vue';

export default Vue.extend({
    extends: Line,
    data(): any {
        return {
            
        }
    },
    props: {
        title: {
            type: String,
            default: '',
        },
        labels: {
            type: Array,
            default: () => ([]),
        },
        datasets: {
            type: Array,
            default: () => ([]),
        },
    },
    /*watch: {
        datasets: {
            handler(val) {
                this.renderChartjs();
            },
            deep: true
        },
        title: {
            handler(val) {
                this.renderChartjs();
            },
            deep: true
        },
        labels: {
            handler(val) {
                this.renderChartjs();
            },
            deep: true
        },
    },*/
    mounted() {
        this.renderChartjs();
    },
    methods: {
        renderChartjs: function () {
            for (let i = 0; i < this.datasets.length; i++) {
                this.datasets[i].borderColor = parseInt(this.datasets[i].typeGradient) === 1 ? "#FC2525" : "#05CBE1"
                this.datasets[i].pointBackgroundColor = 'rgba(171, 71, 188, 1)'
                this.datasets[i].borderColor = 'rgba(1, 116, 188, 0.50)'
                this.datasets[i].backgroundColor = "transparent"
            }
            this.renderChart({
                labels: this.labels,
                datasets: this.datasets
            }, {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: "My Data"
                }
            });
        }
    }

});
</script>

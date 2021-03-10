<script lang="ts">
import Vue from 'vue';
import {
    Bar
} from "vue-chartjs";

export default Vue.extend({
    extends: Bar,
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
        /*this.$watch('datasets', function () {
            console.log('a thing changed')
        }, {
            deep: true
        })*/
        this.renderChartjs();
    },
    methods: {
        renderChartjs: function () {
            for (let i = 0; i < this.datasets.length; i++) {
                this.datasets[i].backgroundColor = i === 1 ? "#f87979" : 'lightblue'
            }
            this.renderChart({
                labels: this.labels,
                datasets: this.datasets
            }, {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: this.title
                }
            });
        }
    }

});
</script>

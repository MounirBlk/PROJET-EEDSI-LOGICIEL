<script lang="ts">
import {
    Pie,
    mixins
} from "vue-chartjs";
const {
    reactiveProp,
    reactiveData
} = mixins
import Vue from 'vue';

export default Vue.extend({
    extends: Pie,
    //mixins: [reactiveProp],
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
            type: Object,
            default: () => ({}),
        },
    },
    watch: {
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
    },
    mounted() {
        this.renderChartjs();
    },
    methods: {
        renderChartjs: function () {
            this.renderChart({
                labels: this.labels,
                datasets: [{
                    backgroundColor: ["blue", "red", "green", "purple"],
                    data: this.datasets.data
                }]
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

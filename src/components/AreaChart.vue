<script lang="ts">
import Vue from 'vue';
import {
    Line,
    mixins
} from "vue-chartjs";
const {
    reactiveProp,
    reactiveData
} = mixins
export default Vue.extend({
    extends: Line,
    //mixins: [reactiveProp],
    /*props: {
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
    },*/
    props: ["title","labels","datasets"],
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
    data(): any {
        return {
            gradient: null,
            gradient2: null
        };
    },
    mounted() {
        this.renderChartjs();
    },
    methods: {
        renderChartjs: function () {
            this.gradient = this.$refs.canvas
                .getContext("2d")
                .createLinearGradient(0, 0, 0, 450);
            this.gradient2 = this.$refs.canvas
                .getContext("2d")
                .createLinearGradient(0, 0, 0, 450);

            this.gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
            this.gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
            this.gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

            this.gradient2.addColorStop(0, "rgba(0, 231, 255, 0.9)");
            this.gradient2.addColorStop(0.5, "rgba(0, 231, 255, 0.25)");
            this.gradient2.addColorStop(1, "rgba(0, 231, 255, 0)");

            for (let i = 0; i < this.datasets.length; i++) {
                this.datasets[i].borderColor = parseInt(this.datasets[i].typeGradient) === 1 ? "#FC2525" : "#05CBE1"
                this.datasets[i].pointBackgroundColor = 'white'
                this.datasets[i].borderWidth = 1
                this.datasets[i].pointBorderColor = 'white'
                this.datasets[i].backgroundColor = parseInt(this.datasets[i].typeGradient) === 1 ? this.gradient : this.gradient2
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

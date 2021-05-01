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
import Gestion from '@/mixins/Gestion';

export default Vue.extend({
    extends: Pie,
    mixins: [Gestion],
    data(): any {
        return {
            gradColors: [],
        }
    },
    props: ["title", "labels", "datasets"],
    watch: {
        /*datasets: {
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
        },*/
    },
    mounted() {
        this.renderChartjs();
    },
    methods: {
        renderChartjs: function () {
            for (let i = 0; i < this.datasets.data.length; i++) {
                this.gradColors.push(this.$refs.canvas.getContext("2d").createLinearGradient(0, 0, 0, 450)) //
                this.gradColors[i].addColorStop(0, this.radientColors[i].colorOne);
                this.gradColors[i].addColorStop(0.5, this.radientColors[i].colorTwo);
                this.gradColors[i].addColorStop(1, this.radientColors[i].colorThree);
            }
            this.renderChart({
                labels: this.labels,
                datasets: [{
                    backgroundColor: this.gradColors,
                    data: this.datasets.data
                }]
            }, {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: this.title === null || this.title === undefined ? false : true,
                    text: this.title === null || this.title === undefined ? '' : this.title
                }
            });
        }
    }
});
</script>

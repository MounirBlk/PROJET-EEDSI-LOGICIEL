<script lang="ts">
import Vue from 'vue';
import {
    Line,
    mixins
} from "vue-chartjs";
import Gestion from "../mixins/Gestion"
const {
    reactiveProp,
    reactiveData
} = mixins

export default Vue.extend({
    extends: Line,
    mixins: [Gestion],
    props: ["title", "labels", "datasets"],
    data(): any {
        return {
            gradColors: [],
        };
    },
    mounted() {
        this.renderChartjs();
    },
    methods: {
        renderChartjs: function () {
            for (let i = 0; i < this.datasets.length; i++) {
                this.gradColors.push(this.$refs.canvas.getContext("2d").createLinearGradient(0, 0, 0, 450)); //
                this.gradColors[i].addColorStop(0, this.radientColors[i].colorOne);
                this.gradColors[i].addColorStop(0.5, this.radientColors[i].colorTwo);
                this.gradColors[i].addColorStop(1, this.radientColors[i].colorThree);
                this.datasets[i].backgroundColor = this.gradColors[i];
                this.datasets[i].borderColor = this.radientColors[i].color;
                this.datasets[i].pointBackgroundColor = 'white';
                this.datasets[i].borderWidth = 1;
                this.datasets[i].pointBorderColor = 'white';
            }
            this.renderChart({
                labels: this.labels,
                datasets: this.datasets
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

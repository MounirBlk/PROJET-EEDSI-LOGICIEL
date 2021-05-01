<script lang="ts">
import Vue from 'vue';
import {
    Line,
    mixins
} from "vue-chartjs";
import Gestion from '@/mixins/Gestion';
const {
    reactiveProp
} = mixins

export default Vue.extend({
    extends: Line,
    mixins: [reactiveProp, Gestion],
    props: ["options"],
    data: (): any => ({
        gradColors: []
    }),
    mounted() {
        this.renderData();
    },
    methods: {
        renderData: function () {
            for (let i = 0; i < this.chartData.datasets.length; i++) {
                this.gradColors.push(this.$refs.canvas.getContext("2d").createLinearGradient(0, 0, 0, 450)) //
                this.gradColors[i].addColorStop(0, this.radientColors[2].colorOne);
                this.gradColors[i].addColorStop(0.5, this.radientColors[2].colorTwo);
                this.gradColors[i].addColorStop(1, this.radientColors[2].colorThree);
                this.chartData.datasets[i].backgroundColor = this.gradColors[i];
            }
            this.renderChart(this.chartData, this.options);
        }
    }
});
</script>

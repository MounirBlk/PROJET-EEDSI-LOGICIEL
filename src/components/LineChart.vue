<script lang="ts">
import Vue from 'vue';
import {
    Line,
    mixins
} from "vue-chartjs";
const {
    reactiveProp
} = mixins

export default Vue.extend({
    extends: Line,
    mixins: [reactiveProp],
    props: ["options"],
    data: (): any => ({}),
    mounted() {
        this.renderData();
    },
    methods: {
        renderData: function () {
            this.renderChart(this.chartData, this.options);
        }
    }
});
</script>

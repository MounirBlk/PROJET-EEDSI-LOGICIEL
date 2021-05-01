<script lang="ts">
import Vue from 'vue';
import {
    Bar
} from "vue-chartjs";

export default Vue.extend({
    extends: Bar,
    data(): any {
        return {}
    },
    props: ["title","labels","datasets"],
    mounted() {
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

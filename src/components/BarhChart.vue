<script lang="ts">
import {
    HorizontalBar
} from "vue-chartjs";
import Vue from 'vue';

export default Vue.extend({
    extends: HorizontalBar,
    data: (): any => ({}),
    mounted() {
        this.renderChart({
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [{
                label: 'Data One',
                backgroundColor: '#f87979',
                data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
            }]
        }, {
            responsive: true,
            maintainAspectRatio: false
        })
    }
})
</script>

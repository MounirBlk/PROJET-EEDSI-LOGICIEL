<template>
<v-main>
    <vue-page-transition name="fade-in-down">
        <router-view class="mb-10" style="z-index: 99" />
    </vue-page-transition>

    <base-go-to-up />
    
    <dashboard-core-footer style="z-index:0;" />
</v-main>
</template>

<script lang="ts">
import {
    bus
} from "@/main";
import Vue from 'vue';

export default Vue.extend({
    name: "DashboardCoreView",
    components: {
        DashboardCoreFooter: () => import("./Footer.vue")
    },
    data() {
        return {}
    },
    created() {},
    watch: {},
    computed: {}
});
</script>

<style>
</style>

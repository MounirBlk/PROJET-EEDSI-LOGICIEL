<template>
<v-footer absolute :inset="insetFooter" color="primary" id="dashboard-core-footer">
    <v-row align="center" no-gutters>
        <v-spacer class="hidden-sm-and-down" />
        <v-col cols="12" md="auto">
            <div class="body-1 font-weight-light pt-0 pt-md-0 text-center">
                &copy;
                <span> {{ new Date().getFullYear() }} - Dashboard E-Commerce</span>
            </div>
        </v-col>
    </v-row>
</v-footer>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: "DashboardCoreFooter",

    data: () => ({
        insetFooter: false
    })
});
</script>

<style lang="sass">
</style>

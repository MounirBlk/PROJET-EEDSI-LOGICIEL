<template>
<v-footer style="filter:opacity(99%)" absolute class="py-1" tile :fixed="isFixed" :inset="insetFooter" :color="$vuetify.theme.dark ? '#424242' : 'primary'" id="dashboard-core-footer">
    <v-row align="center" no-gutters>
        <v-spacer class="hidden-sm-and-down" />
        <v-col cols="12" md="auto">
            <div class="caption font-weight-light pt-0 pt-md-0 text-center">
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
        insetFooter: false,
        isFixed: false
    }),

});
</script>

<style lang="sass">
</style>

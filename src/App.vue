<template>
<router-view />
</template>

<script lang="ts">
import Vue from 'vue';
import Gestion from './mixins/Gestion';

export default Vue.extend({
    name: 'App',
    mixins: [Gestion],
    data: () => ({}),
    computed: {},
    async beforeMount() {
        await this.getUserData();
    },
    mounted() {},
    methods: {}
});
</script>

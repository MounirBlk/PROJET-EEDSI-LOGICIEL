<template>
<div id="bot">

</div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
    bus
} from "../main";
import Gestion from '@/mixins/Gestion';

export default Vue.extend({
    name: 'bot',
    props: {},
    mixins: [Gestion],
    components: {},
    data(): any {
        return {}
    },
    computed: {},
    watch:{},
    created() {},
    beforeMount() {},
    mounted() {},
    methods: {}
});
</script>

<style></style>

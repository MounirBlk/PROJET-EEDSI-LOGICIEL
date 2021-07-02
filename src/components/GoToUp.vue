<template>
<div>
    <v-fab-transition>
        <v-btn style="filter: opacity(90%);" v-scroll="onScroll" v-show="fab" fab dark fixed bottom right color="indigo" @click="toTop">
            <v-icon large>mdi-chevron-up</v-icon>
        </v-btn>
    </v-fab-transition>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
    bus
} from "../main";

export default Vue.extend({
    name: 'GoToUp',
    props: {},
    components: {},
    data(): any {
        return {
            fab: false as boolean
        }
    },
    computed: {},
    created() {},
    beforeMount() {},
    mounted() {},
    methods: {
        onScroll(e: any) {
            if (typeof window === 'undefined') return
            const top = window.pageYOffset || e.target.scrollTop || 0
            this.fab = top > 25
        },
        toTop() {
            this.$vuetify.goTo(0)
        }
    }
});
</script>

<style></style>

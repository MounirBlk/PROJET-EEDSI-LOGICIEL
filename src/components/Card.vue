<template>
  <v-card
    max-width="400"
    class="v-card--material pa-3 mt-4 mx-auto"
  >
    <v-sheet
      class="v-sheet--offset mx-auto"
      color="cyan"
      elevation="12"
      max-width="calc(100% - 32px)"
    >
      <v-sparkline
        :labels="labels"
        :value="value"
        color="white"
        line-width="2"
        padding="16"
      ></v-sparkline>
    </v-sheet>

    <v-card-text class="pt-0">
      <div class="title font-weight-light mb-2">
        User Registrations
      </div>
      <div class="subheading font-weight-light grey--text">
        Last Campaign Performance
      </div>
      <v-divider class="my-2"></v-divider>
      <v-icon
        class="mr-2"
        small
      >
        mdi-clock
      </v-icon>
      <span class="caption grey--text font-weight-light">last registration 26 minutes ago</span>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { bus } from "../main";

export default Vue.extend({
  name: 'Card',
  props: {},
  components: {},
  data(): any {
      return {
        labels: [
          '12am',
          '3am',
          '6am',
          '9am',
          '12pm',
          '3pm',
          '6pm',
          '9pm',
        ],
        value: [
          200,
          675,
          410,
          390,
          310,
          460,
          250,
          240,
        ], 
      }
  },
  computed: {},
  created() {
    //console.log('created')
  },
  beforeMount() {
    //console.log('beforeMount')
  },
  mounted(){
    //console.log('mounted')
  },
  methods: {}
});
</script>
<style lang="sass">
  .v-sheet--offset 
    top: -24px
    position: relative

  .v-card--material
    &__avatar
      position: relative
      top: -64px
      margin-bottom: -32px

    &__heading
      position: relative
      top: -40px
      transition: .3s ease
      z-index: 1
</style>


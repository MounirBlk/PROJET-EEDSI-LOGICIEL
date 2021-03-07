<template>
  <v-container class="error-page" fill-height tag="section">
    <v-row class="text-center" justify="center">
      <v-col cols="auto">
        <h1 class="font-weight-black">404</h1>

        <div class="display-4 mb-5">Page not found :(</div>

        <v-btn color="success" to="/Accueil">Get me out of here!</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Error',
  components: {},
  //mounted() {}
});
</script>

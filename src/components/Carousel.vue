<template>
<div id="carousel" v-if="images.length > 0">
    <v-fade-transition>
        <carousel-3d v-if="$vuetify.breakpoint.mdAndUp" :height="height" :width="width" :display="display" :border="1" :autoplay="autoplay" :autoplay-timeout='5000'>
            <slide v-for="(image, i) in images" :index="i" :key="i">
                <v-img transition="scale-transition" :src="image"></v-img>
            </slide>
        </carousel-3d>
    </v-fade-transition>
    <v-fade-transition>
        <v-carousel v-if="$vuetify.breakpoint.smAndDown" cycle show-arrows-on-hover :hide-delimiter-background="$vuetify.breakpoint.mdAndUp">
            <v-carousel-item v-for="(image,i) in images" :key="i" :src="image" reverse-transition="fade-transition" transition="fade-transition"></v-carousel-item>
        </v-carousel>
    </v-fade-transition>
</div>
</template>

<script>
import {
    Carousel3d,
    Slide
} from 'vue-carousel-3d';
import Vue from 'vue';

export default Vue.extend({
    props: {
        autoplay: {
            type: Boolean,
            default: true
        },
        display:{
            type: Number,
            default: 5
        },
        images: {
            type: Array,
            default: () => ([])
        },
        height:{
            type: Number,
            default: 280
        },
        width:{
            type: Number,
            default: 400
        }
    },
    components: {
        Carousel3d,
        Slide
    },
    data() {
        return {}
    }
});
</script>

<style>
.carousel-3d-slide {
    height: 100% !important;
}
</style>

<template>
<div id="map" class="map" :style="`height: ${size}px; width: 100%; z-index: 0;`">
    <v-overlay :absolute="isAbsolute" :opacity="opacity" :value="isOverlay">
        <v-progress-circular color="green" indeterminate size="80"></v-progress-circular>
    </v-overlay>
    <LMap ref="map" style="z-index: 0;" :zoom="10" :center="[48.992106, 2.429232]" :options="{zoomControl: false}">
        <LControlLayers position="bottomright"></LControlLayers>
        <LTileLayer v-for="tileProvider in tileProviders" :key="tileProvider.name" :name="tileProvider.name" :visible="tileProvider.visible" :url="tileProvider.url" layer-type="base" />
        <!--:attribution="tileProvider.attribution" -->
        <!--<LGeoJson :geojson="geoJsonData" />-->
        <LControlZoom position="topleft" zoomInTitle="Zoom avant" zoomOutTitle="Zoom arrière"></LControlZoom>
        <LControl position="bottomleft">
            <v-btn color="green" style="filter: opacity(85%)" @click.prevent="getData()">
                <v-icon left>mdi-refresh</v-icon> Refresh
            </v-btn>
        </LControl>
        <LControlAttribution position="topright" prefix="Dashbord ECommerce" />
        <LControl position="topright">
            <v-chip color="indigo" small outlined class="font-weight-bold">
                <v-icon color="indigo" left>mdi-map-marker-radius-outline</v-icon> En attente
            </v-chip>
        </LControl>
        <LControl position="topright">
            <v-chip color="orange" small outlined class="font-weight-bold">
                <v-icon color="orange" left>mdi-map-marker-radius-outline</v-icon>En cours
            </v-chip>
        </LControl>
        <LControl position="topright">
            <v-chip color="red" small outlined class="font-weight-bold">
                <v-icon color="red" left>mdi-map-marker-radius-outline</v-icon>Signalement
            </v-chip>
        </LControl>
        <LControl position="topright">
            <v-chip color="green" small outlined class="font-weight-bold">
                <v-icon color="green" left>mdi-map-marker-radius-outline</v-icon>Terminée
            </v-chip>
        </LControl>
        <LMarker :lat-lng="[48.992106, 2.429232]" :opacity="0.9" :icon="getIcon('blue')">
            <LPopup>
                <v-icon color="indigo" left>mdi-map-marker-radius-outline</v-icon>En attente
            </LPopup>
            <LTooltip>
                <v-icon color="indigo" left>mdi-map-marker-radius-outline</v-icon><span class="indigo--text font-weight-bold">En attente</span>
            </LTooltip>
        </LMarker>
        <LMarker :lat-lng="[48.891269, 2.283995]" :opacity="0.9" :icon="getIcon('green')">
            <LPopup>
                <v-icon color="green" left>mdi-map-marker-radius-outline</v-icon>Terminée
            </LPopup>
            <LTooltip>
                <v-icon color="green" left>mdi-map-marker-radius-outline</v-icon><span class="green--text font-weight-bold">Terminée</span>
            </LTooltip>
        </LMarker>
        <LMarker :lat-lng="[48.992854, 2.382245]" :opacity="0.9" :icon="getIcon(!isBlink ? 'gold' : 'black')">
            <LPopup>
                <v-icon color="orange" left>mdi-map-marker-radius-outline</v-icon>En cours
            </LPopup>
            <LTooltip>
                <v-icon color="orange" left>mdi-map-marker-radius-outline</v-icon><span class="orange--text font-weight-bold">En cours</span>
            </LTooltip>
        </LMarker>
    </LMap>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
    bus
} from "../main";
import Gestion from '@/mixins/Gestion';
import L from 'leaflet';
import axiosApi from '@/plugins/axiosApi';
import qs from "qs";
import {
    AxiosResponse,
    AxiosError
} from 'axios';

export default Vue.extend({
    name: 'Map',
    props: {
        size: {
            type: Number,
            default: 400
        },
    },
    mixins: [Gestion],
    components: {},
    data(): any {
        return {
            tileProviders: [{
                    name: 'OpenStreetMap',
                    visible: true,
                    //attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                },
                {
                    name: 'OpenTopoMap',
                    visible: false,
                    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
                    //attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
                },
            ],
            geoJsonData: null,
            isBlink: false,
            intervalid1: null
        }
    },
    computed: {},
    watch: {},
    created() {},
    beforeMount() {},
    async mounted() {
        //this.geoJsonData = await axiosApi.get('https://france-geojson.gregoiredavid.fr/repo/regions/ile-de-france/region-ile-de-france.geojson') //https://france-geojson.gregoiredavid.fr/  geojson
        //console.log(this.geoJsonData)
        this.setBlink()
        await this.getData();
    },
    methods: {
        setBlink: function () {
            setInterval(() => {
                this.isBlink = !this.isBlink;
            }, 1000);
        },
        getData: function (): void {
            this.isOverlay = true;
            let adresse = "70 Rue Marius Aufan 92300 Levallois-Perre"
            axiosApi.get("https://api-adresse.data.gouv.fr/search/?q=" + adresse.replaceAll(' ', '+'))
                .then((response: AxiosResponse) => {
                    console.log(response.data)
                    setTimeout(() => {
                        this.isOverlay = false;
                    }, 1000);
                }).catch((error) => {
                    this.catchAxios(error)
                    setTimeout(() => {
                        this.isOverlay = false;
                    }, 1000);
                });
        },
        getIcon: function (color: string = null): void {
            const colors: string[] = ['blue', 'gold', 'red', 'green', 'orange', 'yellow', 'violet', 'grey', 'black']
            let selectedColor = 'blue';
            if (colors.find((el) => el === color)) {
                selectedColor = color
            }
            return L.icon({
                iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${selectedColor}.png`,
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
            })
        }
    }
});
</script>

<style scoped></style>

<template>
<div id="map" class="map" :style="`height: ${mapOptions.size}px; width: 100%; z-index: 0;`">
    <LMap ref="map" style="z-index: 0;" :zoom="mapOptions.zoom" :center="mapOptions.center" :options="{zoomControl: false}">
        <LControlLayers position="bottomright"></LControlLayers>
        <LTileLayer v-for="tileProvider in tileProviders" :key="tileProvider.name" :name="tileProvider.name" :visible="tileProvider.visible" :url="tileProvider.url" layer-type="base" />
        <!--:attribution="tileProvider.attribution" -->
        <!--<LGeoJson :geojson="geoJsonData" />-->
        <LControlZoom position="topleft" zoomInTitle="Zoom avant" zoomOutTitle="Zoom arrière"></LControlZoom>
        <LControl position="bottomleft">
            <v-btn color="green" dark style="filter: opacity(85%)" @click.prevent="$emit('getCommandes')">
                <v-icon>mdi-refresh</v-icon>
            </v-btn>
        </LControl>
        <LControlAttribution position="topright" prefix="Dashbord ECommerce" />
        <LControl position="topright" v-for="statut in statutsCommandes" :key="statut">
            <v-chip :color="getCommandeColor(statut)" small outlined class="font-weight-bold">
                <v-icon :color="getCommandeColor(statut)" left>mdi-map-marker-radius-outline</v-icon>
                <span v-if="statut === 'Attente'">En attente</span>
                <span v-if="statut === 'Livraison'">En cours</span>
                <span v-if="statut === 'Signalement'">Signalement</span>
                <span v-if="statut === 'Termine'">Terminée</span>
            </v-chip>
        </LControl>
        <LMarker v-for="(commande, index) in commandes" :key="index" :lat-lng="[commande.coordinate.latitude, commande.coordinate.longitude]" :opacity="0.9" :icon="getIcon(new Date(commande.dateLivraison) < new Date() && commande.statut !== 'Termine' ? !isBlink ? getCommandeColor(commande.statut) : 'black' : getCommandeColor(commande.statut))">
            <LPopup>
                <v-btn small color="indigo" @click="voirLivraison(commande._id)" icon class="mr-1 mt-1">
                    <v-icon>mdi-information-outline</v-icon>
                </v-btn>
                <v-icon :color="getCommandeColor(commande.statut)" left>mdi-map-marker-radius-outline</v-icon><span :class="`${getCommandeColor(commande.statut)}--text font-weight-bold`">{{ commande.statut }}</span>
                <br /><span :class="`${getCommandeColor(commande.statut)}--text font-weight-bold`">Date de Livraison: {{ commande.dateLivraison }}</span>
                <br v-if="commande.clientID && commande.statut === 'Termine'" /><span v-if="commande.clientID && commande.statut === 'Termine'" class="font-weight-bold">Livré chez: </span><span v-if="commande.clientID && commande.statut === 'Termine'">M/Mme {{ commande.clientID.lastname }}</span>
                <br v-if="commande.clientID && commande.statut !== 'Termine'" /><span v-if="commande.clientID && commande.statut !== 'Termine'" class="font-weight-bold">Livraison prévu chez: </span><span v-if="commande.clientID && commande.statut !== 'Termine'">M/Mme {{ commande.clientID.lastname }}</span>
                <br v-if="commande.livreurID" /><span v-if="commande.livreurID" class="font-weight-bold">Livreur: </span> <span v-if="commande.livreurID">M/Mme {{ commande.livreurID.lastname }}</span>
                <br /><span class="font-weight-bold">Référence:</span> {{ commande.refID }}
                <br /><span class="font-weight-bold">Adresse:</span> {{ commande.adresseLivraison }}
                <br />
                <v-row v-if="$vuetify.breakpoint.mdAndUp && commande && commande.articles.length !== 0" no-gutters>
                    <v-col cols="2" class="ma-1" :style="`border: solid 1px ${getCommandeColor(commande.statut)}`" v-for="(article, i) in commande.articles" :key="i" v-if="article">
                        <div v-if="article.idProduct.tabImgLinks" v-for="(image, j) in article.idProduct.tabImgLinks ? article.idProduct.tabImgLinks : []" :key="j">
                            <v-img v-if="isDataOk(image) && image !== '' && isObjectNotEmpty(commande.articles[i].idProduct) ? image.split(`${commande.articles[i].idProduct._id}/`)[1].includes(commande.articles[i].couleur) : false" transition="scale-transition" :src="image" height="40" width="100%" aspect-ratio="1" class="white">
                                <template v-slot:placeholder>
                                    <v-row class="fill-height ma-0" align="center" justify="center"> </v-row>
                                </template>
                            </v-img>
                        </div>
                        <div v-if="!article.idProduct.tabImgLinks">
                            <v-img transition="scale-transition" height="40" width="100%" :src="require('@/assets/ecommerce_logo.png')" aspect-ratio="1" class="white">
                                <template v-slot:placeholder>
                                    <v-row class="fill-height ma-0" align="center" justify="center"> </v-row>
                                </template>
                            </v-img>
                        </div>
                    </v-col>
                </v-row>
                <v-chip small outlined color="red" class="mt-1" v-if="new Date(commande.dateLivraison) < new Date() && commande.statut !== 'Termine'">
                    <v-icon color="red" left small>mdi-alert-outline</v-icon>Retard
                </v-chip>
            </LPopup>
            <LTooltip v-if="$vuetify.breakpoint.mdAndUp">
                <v-icon :color="getCommandeColor(commande.statut)" left>mdi-map-marker-radius-outline</v-icon><span :class="`${getCommandeColor(commande.statut)}--text font-weight-bold`">{{ commande.statut }}</span>
                <v-icon right color="red" v-if="new Date(commande.dateLivraison) < new Date() && commande.statut !== 'Termine'" small>mdi-alert-outline</v-icon>
                <br /><span :class="`${getCommandeColor(commande.statut)}--text font-weight-bold`">Date de Livraison: {{ commande.dateLivraison }}</span>
                <br /><span class="font-weight-bold">Référence:</span> {{ commande.refID }}
                <br /><span class="font-weight-bold">Adresse:</span> {{ commande.adresseLivraison }}
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
    AxiosError,
    AxiosRequestConfig
} from 'axios';

export default Vue.extend({
    name: 'Map',
    props: {
        commandes: {
            type: Array,
            default: []
        },
        mapOptions: {
            type: Object,
            default: {
                size: {
                    type: Number,
                    default: 420
                },
                zoom: {
                    type: Number,
                    default: 5
                },
                center: {
                    type: Array,
                    default: [48.992106, 2.429232]
                },
            },
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
                }
            ],
            geoJsonData: null,
            isBlink: false,
            statutsCommandes: ['Attente', 'Livraison', 'Signalement', 'Termine'],
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
    },
    methods: {
        setBlink: function () {
            setInterval(() => {
                this.isBlink = !this.isBlink;
            }, 750);
        },
        voirLivraison: function (id: string): void {
            if (id) {
                return this.$router.push({
                    name: "Informations-Commande",
                    params: {
                        idCommande: id,
                    },
                });
            }
        },
        getCommandeColor: function (statut: string): string {
            let color = 'grey';
            if (statut === 'Attente') color = 'blue'
            if (statut === 'Livraison') color = 'orange'
            if (statut === 'Signalement') color = 'red'
            if (statut === 'Termine') color = 'green'
            return color;
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

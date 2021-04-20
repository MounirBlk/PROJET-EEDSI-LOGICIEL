<template>
<v-container id="calendar" fluid tag="section">
    <v-overlay :absolute="isAbsolute" :opacity="opacity" :value="isOverlay">
        <v-progress-circular color="red" indeterminate size="80"></v-progress-circular>
    </v-overlay>
    <v-dialog v-model="isDialogEvent" width="500" overlay-opacity="0.8">
        <v-card outlined>
            <v-card-title>
                Assigner une livraison
            </v-card-title>
            <v-card-text>
                <v-simple-table dense>
                    <template v-slot:default>
                        <tbody>
                            <tr>
                                <td>Statut</td>
                                <td>{{ infoEvenement.statut }}</td>
                            </tr>
                            <tr>
                                <td>Adresse de livraison</td>
                                <td>{{ infoEvenement.adresseLivraison }}</td>
                            </tr>
                            <tr>
                                <td>Début</td>
                                <td>{{ infoEvenement.start | moment("YYYY-MM-DD HH:mm") }}</td>
                            </tr>
                            <tr>
                                <td>Fin</td>
                                <td>{{ infoEvenement.end | moment("YYYY-MM-DD HH:mm") }}</td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
                <div class="mt-4">
                    <v-chip v-if="infoEvenement.livreur !== null && infoEvenement.livreur !== undefined">Livreur: M/Mme. {{ infoEvenement.livreur.lastname }}</v-chip>
                    <v-autocomplete v-else class="mt-5" :items="livreurs" prepend-icon="mdi-magnify" color="red" item-text="lastname" item-value="_id" v-model="livreurID" hide-no-data hide-details item-color label="Livreur" outlined></v-autocomplete>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="mr-1" color="error" text @click.prevent="isDialogEvent = false;">Fermer</v-btn>
                <v-btn color="success" text :disabled="infoEvenement.livreur !== null && infoEvenement.livreur !== undefined" @click.prevent="saveAssignage(infoEvenement, livreurID)">
                    <v-icon left>mdi-check</v-icon> Sauvegarder
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-row>
        <v-col cols="12" md="12" sm="12">
            <base-material-card icon="mdi-calendar-month-outline" color="red" max-width="100%" width="auto" class="px-5 py-3 mx-auto">
                <template v-slot:after-heading>
                    <div class="display-1 font-weight-light">Calendrier de commandes</div>
                </template>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-card>
                            <v-toolbar flat>
                                <v-toolbar-title v-if="$vuetify.breakpoint.mdAndUp">{{ new Date() | moment("YYYY-MM-DD HH:mm") }}</v-toolbar-title>
                                <v-btn color="red" icon class="ml-3" @click="getData">
                                    <v-icon large>mdi-refresh</v-icon>
                                </v-btn>
                            </v-toolbar>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row class="fill-height">
                    <v-col>
                        <v-sheet height="64">
                            <v-toolbar flat>
                                <v-btn outlined class="mr-4" color="red darken-2" @click="focus = ''">
                                    Today
                                </v-btn>
                                <v-btn fab text small color="red darken-2" @click="$refs.calendar.prev()">
                                    <v-icon small>
                                        mdi-chevron-left
                                    </v-icon>
                                </v-btn>
                                <v-btn fab text small color="red darken-2" @click="$refs.calendar.next()">
                                    <v-icon small>
                                        mdi-chevron-right
                                    </v-icon>
                                </v-btn>
                                <v-toolbar-title v-if="$refs.calendar">
                                    {{ $refs.calendar.title }}
                                </v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-menu bottom right>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn outlined color="red darken-2" v-bind="attrs" v-on="on">
                                            <span>{{ typeToLabel[type] }}</span>
                                            <v-icon right>
                                                mdi-menu-down
                                            </v-icon>
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item @click="type = 'day'">
                                            <v-list-item-title>Day</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="type = 'week'">
                                            <v-list-item-title>Week</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="type = 'month'">
                                            <v-list-item-title>Month</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="type = '4day'">
                                            <v-list-item-title>4 days</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </v-toolbar>
                        </v-sheet>
                        <v-sheet height="600">
                            <v-calendar ref="calendar" v-model="focus" color="primary" :events="events" :event-color="getEventColor" :type="type" @click:event="myEvent" @click:more="viewDay" @click:date="viewDay"></v-calendar>
                        </v-sheet>
                    </v-col>
                </v-row>
            </base-material-card>
        </v-col>
    </v-row>
    <v-snackbar v-model="isSnackbarOpened" elevation="24" :color="isSuccess ? 'success' : 'error'">
        <div class="text-center subtitle-1">
            <v-icon v-if="!isSuccess" color="white" left>mdi-alert-outline</v-icon>
            <v-icon v-else color="white" left>mdi-checkbox-marked-circle-outline</v-icon>
            <span>{{ snackbarMessage }}</span>
            <v-btn dark icon class="ml-6" @click="isSnackbarOpened = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </div>
    </v-snackbar>
</v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Gestion from "../../mixins/Gestion"
import axiosApi from '../../plugins/axiosApi';
import qs from "qs";
import {
    AxiosResponse
} from 'axios';
import moment from 'moment';

export default Vue.extend({
    name: 'Calendrier',
    mixins: [Gestion],
    props: {},
    components: {},
    //data: () => ({}),
    data(): any {
        return {
            focus: '',
            type: 'month',
            typeToLabel: {
                'month': 'Month',
                'week': 'Week',
                'day': 'Day',
                '4day': '4 Days',
            },
            selectedEvent: {},
            selectedElement: null,
            selectedOpen: false,
            events: [],
            colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
            commandes: [],
            livreurs: [],
            infoEvenement: {},
            isDialogEvent: false,
            livreurID: null
        }
    },
    computed: {},
    watch: {},
    created() {},
    beforeMount() {},
    async mounted() {
        await this.getData()
    },
    methods: {
        getData: function (): void {
            this.isOverlay = true;
            const requestCommandes = axiosApi.get('/commande/all/all');
            const requestLivreurs = axiosApi.get('/user/all/Livreur');
            Promise.all([requestCommandes, requestLivreurs])
                .then((response: AxiosResponse[]) => {
                    Object.assign(this.$data, this.$options.data()); //reset data
                    this.commandes = response[0].data.commandes;
                    this.livreurs = response[1].data.users;
                    this.commandes.forEach((element: any) => {
                        this.events.push({
                            idCommande: element._id,
                            statut: element.statut,
                            name: element.statut === "Attente" ? "En attente" : element.statut === "Livraison" ? "En cours de livraison" : element.statut === "Signalement" ? "Livraison en signalement" : element.statut === "Termine" ? "Livraison terminé" : "Commande",
                            start: new Date(element.dateLivraison),
                            end: new Date(element.dateLivraison),
                            color: this.colors[this.rnd(0, this.colors.length - 1)],
                            timed: true,
                            adresseLivraison: element.adresseLivraison,
                            livreur: element.livreurID
                        })
                    });
                    this.$refs.calendar.checkChange()
                    setTimeout(() => {
                        this.isOverlay = false;
                    }, 1000);
                }).catch((error: any) => {
                    this.catchAxios(error)
                    setTimeout(() => {
                        this.isOverlay = false;
                    }, 1000);
                });
        },
        saveAssignage: function (infoEvenement: any, livreurID: string) {
            if (livreurID === '' || livreurID === null || livreurID === undefined) return this.errorMessage("Veuillez sélectionner un livreur !");
            axiosApi.put("/commande/update/" + infoEvenement.idCommande, qs.stringify({
                    livreurID: livreurID,
                    statut: "Livraison"
                })) //update
                .then((response: AxiosResponse) => {
                    Object.assign(this.$data, this.$options.data()); //reset data
                    this.successMessage("L'assignage a bien été effectué !");
                    setTimeout(() => {
                        this.getData();
                    }, 1000);
                })
                .catch((error) => {
                    this.catchAxios(error)
                    setTimeout(() => {
                        this.isOverlay = false;
                    }, 1000);
                });
        },
        myEvent(day: any) {
            this.infoEvenement = day.eventParsed.input;
            this.isDialogEvent = true;
        },
        viewDay({
            date
        }: any) {
            this.focus = date
            this.type = 'day'
        },
        getEventColor(event: any) {
            return event.color
        },
        rnd(a: number, b: number) {
            return Math.floor((b - a + 1) * Math.random()) + a
        },
    }
});
</script>

<style>
</style>

<template>
<v-container id="article" tag="section" fluid>
    <v-row>
        <v-col cols="12" md="7">
            <v-simple-table dense>
                <template v-slot:default>
                    <tbody>
                        <tr>
                            <td>Référence du produit</td>
                            <td>{{ article.idProduct.refID }}</td>
                        </tr>
                        <tr>
                            <td>Nom du produit</td>
                            <td>{{ article.idProduct.nom }}</td>
                        </tr>
                        <tr>
                            <td>Type</td>
                            <td>{{ article.idProduct.type }}</td>
                        </tr>
                        <tr>
                            <td>Sous-Type</td>
                            <td>{{ article.idProduct.sousType }}</td>
                        </tr>
                        <tr color="red">
                            <td>Couleurs</td>
                            <td>{{ article.idProduct.couleurs.join(', ') }}</td>
                        </tr>
                        <tr>
                            <td>Matières</td>
                            <td>{{ article.idProduct.matieres.join(', ') }}</td>
                        </tr>
                        <tr>
                            <td>Longueur</td>
                            <td>{{ article.idProduct.longueur }} cm</td>
                        </tr>
                        <tr>
                            <td>Largeur</td>
                            <td>{{ article.idProduct.largeur }} cm</td>
                        </tr>
                        <tr>
                            <td>Profondeur</td>
                            <td>{{ article.idProduct.profondeur }} cm</td>
                        </tr>
                        <tr>
                            <td>Poids</td>
                            <td>{{ article.idProduct.poids }} kg</td>
                        </tr>
                        <tr>
                            <td>Prix</td>
                            <td>{{ article.idProduct.prix }} €</td>
                        </tr>
                        <tr>
                            <td>Taxe</td>
                            <td>{{ article.idProduct.taxe * 100 }} %</td>
                        </tr>
                        <tr>
                            <td>Quantité</td>
                            <td>{{ article.idProduct.quantite }}</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
            <v-divider color="green" class="my-2"></v-divider>
            <v-simple-table dense>
                <template v-slot:default>
                    <tbody>
                        <tr>
                            <td>Couleur de l'article</td>
                            <td>{{ article.couleur }}</td>
                        </tr>
                        <tr>
                            <td>Matière de l'article</td>
                            <td>{{ article.matiere }}</td>
                        </tr>
                        <tr>
                            <td>Quantité de l'article</td>
                            <td>{{ article.quantite }}</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-col>
        <v-col cols="12" md="5">
            <v-row>
                <v-col cols="12" v-for="(img, index) in paginatedData" :key="index" v-if="article.tabImgLinks !== undefined">
                    <v-img :src="img" height="300" width="auto" aspect-ratio="1" class="grey lighten-2">
                        <template v-slot:placeholder>
                            <v-row class="fill-height ma-0" align="center" justify="center">
                                <v-progress-circular indeterminate color="success darken-1"></v-progress-circular>
                            </v-row>
                        </template>
                    </v-img>
                </v-col>
                <v-col cols="12" md="12" v-if="article.tabImgLinks !== undefined">
                    <div class="text-center">
                        <v-pagination circle v-model="pageNumber" :length="article.tabImgLinks.length" @input="nextPage" />
                    </div>
                </v-col>
                <v-col cols="12" md="12">
                    <v-simple-table dense>
                        <template v-slot:default>
                            <tbody>
                                <th>Nom composant</th>
                                <th>Couleur</th>
                                <th>Matière</th>
                                <th>Quantité</th>
                                <tr v-for="(composant, index) in article.listeComposantsSelected" :key="index">
                                    <td>{{ composant.idComposant.nom }}</td>
                                    <td>{{ composant.couleur }}</td>
                                    <td>{{ composant.matiere }}</td>
                                    <td>{{ composant.quantite }}</td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
    <v-snackbar v-model="isSnackbarOpened" elevation="24" :color="isSuccess ? 'success' : 'error'">
        <div class="text-center subtitle-1">
            <v-icon v-if="!isSuccess" color="white">mdi-alert-outline</v-icon>
            <v-icon v-else color="white">mdi-checkbox-marked-circle-outline</v-icon>
            <span>{{ snackbarMessage }}</span>
            <v-btn dark icon class="ml-6" @click="isSnackbarOpened = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </div>
    </v-snackbar>
</v-container>
</template>

<script lang="ts">
import Vue, {
    VNode
} from 'vue';
import {
    bus
} from "../../main";
import axiosApi from "../../plugins/axiosApi";
import qs from "qs";
import {
    AxiosResponse
} from 'axios';
import Gestion from "../../mixins/Gestion"

export default Vue.extend({
    name: 'Article',
    mixins: [Gestion],
    props: {
        article: {
            type: Object,
            default: (): any => ({
                nom: "",
                description: "",
                type: "",
                sousType: "",
                poids: 0, //new Date().toISOString().substr(0, 10)
                longueur: 0,
                largeur: 0,
                profondeur: 0,
                prix: 0.00,
                taxe: 0.05,
                quantite: 0,
                composants: [],
                matieres: [],
                couleurs: [],
                chosenFile: null as any,
                tabImgLinks: []
            }),
        }
    },
    //props: ['article'],
    components: {},
    data(): any {
        return {}
    },
    computed: {
        pageCount() {
            let l = this.article.tabImgLinks === undefined ? 1 : this.article.tabImgLinks.length,
                s = this.size;
            return Math.ceil(l / s) - 1;
        },
        paginatedData() {
            const start = this.pageNumber * this.size - this.size,
                end = start + this.size;
            return this.article.tabImgLinks === undefined ? [] : this.article.tabImgLinks.slice(start, end);
        }
    },
    watch: {},
    created() {},
    beforeMount() {},
    mounted() {},
    methods: {
        nextPage(page: number) {
            this.pageNumber = page;
        }
    }
});
</script>

<style>
</style>

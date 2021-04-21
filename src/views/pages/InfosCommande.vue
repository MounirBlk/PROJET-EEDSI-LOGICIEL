<template>
<v-container fluid tag="section">
    <v-row justify="center">
        <v-col cols="12" md="8">
            <base-material-card color="success darken-1">
                <template v-slot:heading>
                    <div>
                        <div class="display-1 white--text">
                            <span>Articles de la commande</span><br />
                        </div>
                    </div>
                </template>
                <div v-for="(item, index) in paginatedData" :key="index">
                    <Article :article="item" />
                </div>
                <v-row>
                    <v-col cols="12" class="text-left">
                        <v-divider color="green" class="my-5"></v-divider>
                        <v-btn class="mr-1" outlined color="error" text to="/commandes">
                            <v-icon left>mdi-close-circle-outline</v-icon>Retour
                        </v-btn>
                    </v-col>
                </v-row>
                <v-pagination circle v-model="pageNumber" :length="commande.articles.length" @input="nextPage" />
            </base-material-card>
        </v-col>
        <v-col cols="12" md="4" v-if="commande.livreurID !== null">
            <base-material-card color="success darken-1" icon="mdi-account-outline" max-width="100%" width="auto" inline class="px-5 py-3 mx-auto">
                <template v-slot:after-heading>
                    <div class="subtitle-1">
                        <span>Informations livreur</span>
                    </div>
                </template>
                <v-row>
                    <v-col cols="12">
                        <h4 class="subtitle-1 font-weight-light mb-2 text-md-center">
                            <b>{{ commande.livreurID.firstname + ' ' + commande.livreurID.lastname }}</b>
                        </h4>
                    </v-col>
                    <v-card-text>
                        <v-col cols="12">
                            <v-simple-table dense>
                                <template v-slot:default>
                                    <tbody>
                                        <tr>
                                            <td>Email</td>
                                            <td>{{ commande.livreurID.email }}</td>
                                        </tr>
                                        <tr>
                                            <td>Portable</td>
                                            <td>{{ commande.livreurID.portable }}</td>
                                        </tr>
                                        <tr>
                                            <td>Date de naissance</td>
                                            <td>{{ commande.livreurID.dateNaissance }}</td>
                                        </tr>
                                        <tr>
                                            <td>Dernière connexion</td>
                                            <td>{{ commande.livreurID.lastLogin | moment("YYYY-MM-DD HH:mm") }}</td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                        </v-col>
                    </v-card-text>
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
import Vue, {
    VNode
} from "vue";
import {
    bus
} from "../../main";
import axiosApi from "../../plugins/axiosApi";
import qs from "qs";
import {
    AxiosResponse
} from "axios";
import Gestion from "../../mixins/Gestion";
import Article from "./Article.vue"

export default Vue.extend({
    name: "InfosCommande",
    mixins: [Gestion],
    props: {},
    components: {
        Article
    },
    data(): any {
        return {
            commande: {
                articles: [],
                livreurID: {
                    lastname:'',
                    firstname:'',
                    email:'',
                    portable:'',
                    dateNaissance: '',
                    lastLogin: ''
                }
            },
            pageNumber: 1 as number,
            size: 1 as number
        };
    },
    computed: {
        pageCount() {
            let l = this.commande.articles === undefined ? 1 : this.commande.articles.length,
                s = this.size;
            return Math.ceil(l / s) - 1;
        },
        paginatedData() {
            const start = this.pageNumber * this.size - this.size,
                end = start + this.size;
            return this.commande.articles === undefined ? [] : this.commande.articles.slice(start, end);
        }
    },
    watch: {},
    created() {
        //console.log('created')
    },
    beforeMount() {
        //console.log('beforeMount')
    },
    mounted(): any {
        if (this.$route.params.idCommande !== null && this.$route.params.idCommande !== undefined) {
            this.getCommandesData(this.$route.params.idCommande);
        } else {
            return this.$router.push({
                name: "Commandes"
            });
        }
    },
    methods: {
        getCommandesData: function (idCommande: string): void {
            this.isLoading = true;
            this.isFirstLoad = true;
            axiosApi
                .get("/commande/one/" + idCommande) //one commande
                .then((response: AxiosResponse) => {
                    this.commande = response.data.commande;
                    console.log(this.commande)
                    setTimeout(() => {
                        this.isLoading = false;
                        this.isFirstLoad = false;
                    }, 1000);
                })
                .catch(error => {
                    this.catchAxios(error);
                    setTimeout(() => {
                        this.isLoading = false;
                        this.isFirstLoad = false;
                    }, 1000);
                });
        },
        nextPage(page: number) {
            this.pageNumber = page;
        }
    }
});
</script>

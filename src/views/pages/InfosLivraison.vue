<template>
<v-container fluid tag="section">
    <v-row justify="center">
        <v-col cols="12" md="8">
            <base-material-card color="#F3C98B">
                <template v-slot:heading>
                    <div v-if="$route.params.isEdit === false">
                        <div class="display-1 white--text">
                            <span>Livraison</span><br />
                        </div>
                    </div>
                    <div v-else>
                        <div class="display-2 white--text mb-4">
                            <v-icon large>mdi-account-edit-outline</v-icon>Modification livraison
                        </div>
                    </div>
                </template>
                <v-skeleton-loader v-if="isFirstload" :loading="isLoading" type="table"></v-skeleton-loader>
                <div v-else>
                    <div v-if="$route.params.isEdit === false">
                        <v-row>
                            <v-col cols="12" md="8">
                                <v-simple-table dense>
                                    <template v-slot:default>
                                        <tbody>
                                            <tr>
                                                <td>Nom du produit</td>
                                                <td>{{ livraison.nom }}</td>
                                            </tr>
                                            <tr>
                                                <td>Type</td>
                                                <td>{{ livraison.type }}</td>
                                            </tr>
                                            <tr>
                                                <td>Sous-Type</td>
                                                <td>{{ livraison.sousType }}</td>
                                            </tr>
                                            <tr>
                                                <td>Couleur</td>
                                                <td>{{ livraison.couleur }}</td>
                                            </tr>
                                            <tr>
                                                <td>Matière</td>
                                                <td>{{ livraison.matiere }}</td>
                                            </tr>
                                            <tr>
                                                <td>Longueur</td>
                                                <td>{{ livraison.longueur }}</td>
                                            </tr>
                                            <tr>
                                                <td>Largeur</td>
                                                <td>{{ livraison.largeur }}</td>
                                            </tr>
                                            <tr>
                                                <td>Profondeur</td>
                                                <td>{{ livraison.profondeur }}</td>
                                            </tr>
                                            <tr>
                                                <td>Poids</td>
                                                <td>{{ livraison.poids }}</td>
                                            </tr>
                                            <tr>
                                                <td>Prix</td>
                                                <td>{{ livraison.prix }}</td>
                                            </tr>
                                            <tr>
                                                <td>Taxe</td>
                                                <td>{{ livraison.taxe }}</td>
                                            </tr>
                                            <tr>
                                                <td>Quantité</td>
                                                <td>{{ livraison.quantite }}</td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-img src="`https://picsum.photos/500/300?image=1`" lazy-src="`https://picsum.photos/10/6?image=1`" aspect-ratio="1" class="grey lighten-2">
                                    <template v-slot:placeholder>
                                        <v-row class="fill-height ma-0" align="center" justify="center">
                                            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                        </v-row>
                                    </template>
                                </v-img>
                            </v-col>
                        </v-row>
                        <v-row>
                              <div class="text-center">
    <v-pagination
      v-model="page"
      :length="6"
    ></v-pagination>
  </div>
                        </v-row>
                        <v-row>
                            <v-col cols="12" class="text-left">
                                <v-btn class="mr-1" outlined color="error" text to="/livraisons">
                                    <v-icon left>mdi-close-circle-outline</v-icon>Retour
                                </v-btn>
                            </v-col>
                        </v-row>
                    </div>
                    <div class="px-4" v-else>
                        <v-form ref="form" v-model="rules.valid" lazy-validation>
                            <v-row>
                                <v-col cols="12">
                                    <div class="text-center">
                                        <v-divider />
                                        <v-row>

                                        </v-row>
                                        <v-row class="mt-n4">

                                        </v-row>
                                        <v-row class="mt-n4">

                                        </v-row>
                                        <v-row class="mt-n4">

                                        </v-row>
                                    </div>
                                    <v-col cols="12" class="text-right">
                                        <v-btn class="mr-1" outlined color="error" text to="/livraisons">
                                            <v-icon left>mdi-close-circle-outline</v-icon>Retour
                                        </v-btn>
                                        <v-btn outlined color="success" text @click="modificationLivraison">
                                            <v-icon left>mdi-content-save-outline</v-icon>Sauvegarder
                                        </v-btn>
                                    </v-col>
                                </v-col>
                            </v-row>
                        </v-form>
                    </div>
                </div>
            </base-material-card>
        </v-col>
        <v-col cols="12" md="4">
            <v-skeleton-loader v-if="isFirstload" :loading="isLoading" type="table"></v-skeleton-loader>
            <div v-else>
                <base-material-card color="#F3C98B" icon="mdi-bank" max-width="100%" width="auto" inline class="px-5 py-3 mx-auto">
                    <template v-slot:after-heading>
                        <div class="subtitle-1">
                            <span>Informations Livreur</span>
                        </div>
                    </template>
                    <v-row>
                        <v-col cols="12">
                            <h4 class="subtitle-1 font-weight-light mb-2 text-md-center">{{ livreur.firstname }} {{ livreur.lastname }}</h4>
                        </v-col>
                        <v-card-text>
                            <v-col cols="12">
                                <v-simple-table dense>
                                    <template v-slot:default>
                                        <tbody>
                                            <tr>
                                                <td>Email</td>
                                                <td>{{ livreur.email }}</td>
                                            </tr>
                                            <tr>
                                                <td>Date de naissance</td>
                                                <td>{{ livreur.dateNaissance }}</td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </v-col>
                            <v-col cols="12">

                            </v-col>
                        </v-card-text>
                    </v-row>
                </base-material-card>
            </div>
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
    name: 'InfosLivraison',
    mixins: [Gestion],
    props: {},
    components: {},
    //data: () => ({}),
    data(): any {
        return {
            changePassword: false as boolean,
            isDialogDateNaissanceOpen: false as boolean,
            isFirstload: false as boolean,
            isLoading: false as boolean,
            livraison: {
                nom: 'Chaise en platinum',
                type: 'Chaise',
                sousType: 'Chaise',
                couleur: 'rouge',
                matiere: 'Bois',
                longueur: '150',
                largeur: '150',
                profondeur: '30',
                poids: '50',
                prix: 150,
                taxe: '0.2',
                quantite: 8
            },
            livreur: {
                firstname: 'livreurfirstname',
                lastname: 'livreurlastname'
            },
            page: 1
        }
    },
    computed: {},
    watch: {},
    created() {
        //console.log('created')
    },
    beforeMount() {
        //console.log('beforeMount')
    },
    mounted(): any {
        if (
            this.$route.params.infosLivraison != null &&
            this.$route.params.infosLivraison != 0
        ) {
            setTimeout(() => {
                this.isLoading = false;
                this.isFirstLoad = false;
            }, 1000);
        } else {
            return this.$router.push({
                name: "Livraisons"
            });
        }
    },
    methods: {
        modificationLivraison: async function () {
            if (!this.$refs.form.validate() && (!this.$refs.form.validate() && this.changePassword))
                return this.errorMessage("Veuillez vérifier les champs !");
            return;
            /*await axiosApi
                .put("/user/" + this.livraison._id, qs.stringify(this.livraison)) //update du utilisateur
                .then((response: AxiosResponse) => {
                    if (response.data.error == false) {
                        this.$refs.form.reset();
                        this.successMessage("Sauvegarde des modifications effectuée !");
                        this.isLoading = true;
                        this.isFirstLoad = true;
                    }
                    setTimeout(() => {
                        this.$router.push({
                            name: "Prospections"
                        });
                    }, 1000);
                })
                .catch((error: any) => {
                    this.catchAxios(error)
                });*/
        },
    }
});
</script>

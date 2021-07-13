<template>
<v-container fluid tag="section">
    <v-row justify="center">
        <v-col cols="12" md="8">
            <base-material-card color="brown">
                <template v-slot:heading>
                    <div v-if="$route.params.isEdit === false">
                        <div class="display-1 white--text">
                            <span>Produit</span><br />
                        </div>
                    </div>
                    <div v-else>
                        <div class="display-1 white--text mb-0">
                            <v-icon large left>mdi-pencil</v-icon>Modification produit
                        </div>
                    </div>
                </template>
                <v-skeleton-loader v-if="isFirstload" :loading="isLoading" type="table"></v-skeleton-loader>
                <div v-else>
                    <div v-if="$route.params.isEdit === false">
                        <v-row>
                            <v-col cols="12" md="7">
                                <v-simple-table dense>
                                    <template v-slot:default>
                                        <tbody>
                                            <tr>
                                                <td>Référence du produit</td>
                                                <td>{{ produit.refID }}</td>
                                            </tr>
                                            <tr>
                                                <td>Nom du produit</td>
                                                <td>{{ produit.nom }}</td>
                                            </tr>
                                            <tr>
                                                <td>Type</td>
                                                <td>{{ produit.type }}</td>
                                            </tr>
                                            <tr>
                                                <td>Sous-Type</td>
                                                <td>{{ produit.sousType }}</td>
                                            </tr>
                                            <tr>
                                                <td>Couleurs</td>
                                                <td>{{ produit.couleurs.join(', ') }}</td>
                                            </tr>
                                            <tr>
                                                <td>Matières</td>
                                                <td>{{ produit.matieres.join(', ') }}</td>
                                            </tr>
                                            <tr>
                                                <td>Longueur</td>
                                                <td>{{ produit.longueur }} cm</td>
                                            </tr>
                                            <tr>
                                                <td>Largeur</td>
                                                <td>{{ produit.largeur }} cm</td>
                                            </tr>
                                            <tr>
                                                <td>Profondeur</td>
                                                <td>{{ produit.profondeur }} cm</td>
                                            </tr>
                                            <tr>
                                                <td>Poids</td>
                                                <td>{{ produit.poids }} kg</td>
                                            </tr>
                                            <tr>
                                                <td>Prix</td>
                                                <td>{{ produit.prix }} €</td>
                                            </tr>
                                            <tr>
                                                <td>Taxe</td>
                                                <td>{{ produit.taxe * 100 }} %</td>
                                            </tr>
                                            <tr>
                                                <td>Quantité</td>
                                                <td>{{ produit.quantite }}</td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </v-col>
                            <v-col cols="12" md="5">
                                <v-row v-if="produit.tabImgLinks !== undefined">
                                    <v-col cols="12" v-for="(img, index) in paginatedData" :key="index">
                                        <v-img :src="img" height="300" width="auto" aspect-ratio="1" class="grey lighten-2">
                                            <template v-slot:placeholder>
                                                <v-row class="fill-height ma-0" align="center" justify="center">
                                                    <v-progress-circular indeterminate color="brown"></v-progress-circular>
                                                </v-row>
                                            </template>
                                        </v-img>
                                    </v-col>
                                    <v-col cols="12" md="12">
                                        <div class="text-center">
                                            <v-pagination circle v-model="pageNumber" :length="produit.tabImgLinks.length" @input="nextPage" />
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" class="text-left">
                                <v-btn class="mr-1" outlined color="error" text to="/produits">
                                    <v-icon left>mdi-close-circle-outline</v-icon>Retour
                                </v-btn>
                            </v-col>
                        </v-row>
                    </div>
                    <div class="px-4" v-else>
                        <v-card class="px-6" outlined>
                            <v-form ref="form">
                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field label="Nom" color="brown" v-model.trim="produit.nom" prepend-inner-icon="mdi-card-text-outline" clearable></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-select label="Type" :items='["Chaise", "Table", "Armoire", "Lit", "Autres"]' color="brown" v-model="produit.type" prepend-inner-icon="mdi-format-list-checkbox" clearable></v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field label="Sous-type" color="brown" v-model.trim="produit.sousType" prepend-inner-icon="mdi-alphabetical" clearable></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-textarea color="brown" label="Description" rows="3" v-model="produit.description" prepend-inner-icon="mdi-text-box-outline" />
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-select label="Matieres" small-chips chips counter deletable-chips disable-lookup multiple :items='matiereItems' color="brown" v-model="produit.matieres" prepend-inner-icon="mdi-format-list-checkbox">
                                                    <template v-slot:selection="{ item, index }">
                                                        <v-chip small v-if="index === 0">
                                                            <span>{{ item }}</span>
                                                        </v-chip>
                                                        <span v-if="index === 1" class="brown--text caption">
                                                            (+{{ produit.matieres.length - 1 }} autre(s))
                                                        </span>
                                                    </template>
                                                </v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-select label="Couleurs" :disabled="produit.chosenFile === null || produit.chosenFile === undefined" small-chips chips counter deletable-chips disable-lookup multiple :items='colorItems' color="brown" v-model="produit.couleurs" prepend-inner-icon="mdi-format-list-checkbox">
                                                    <template v-slot:selection="{ item, index }">
                                                        <v-chip small v-if="index === 0">
                                                            <span>{{ item }}</span>
                                                        </v-chip>
                                                        <span v-if="index === 1" class="brown--text caption">
                                                            (+{{ produit.couleurs.length - 1 }} autre(s))
                                                        </span>
                                                    </template>
                                                </v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="2">
                                                <v-text-field label="Quantité" color="brown" v-model.trim="produit.quantite" prepend-inner-icon="mdi-numeric" clearable></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="2">
                                                <v-file-input small-chips v-model="produit.chosenFile" accept="image/*" label="Image" truncate-length="15"></v-file-input>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="3">
                                                <v-text-field label="Poids" append-icon="kg" color="brown" v-model.trim="produit.poids" prepend-inner-icon="mdi-numeric" clearable></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="3">
                                                <v-text-field label="Longueur" append-icon="cm" color="brown" v-model.trim="produit.longueur" prepend-inner-icon="mdi-numeric" clearable></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="3">
                                                <v-text-field label="Largeur" append-icon="cm" color="brown" v-model.trim="produit.largeur" prepend-inner-icon="mdi-numeric" clearable></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="3">
                                                <v-text-field label="Profondeur" append-icon="cm" color="brown" v-model.trim="produit.profondeur" prepend-inner-icon="mdi-numeric" clearable></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field label="Prix" disabled append-icon="€" color="brown" v-model.trim="produit.prix" prepend-inner-icon="mdi-currency-eur" clearable></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field label="Taxe" disabled append-icon="/1" color="brown" v-model.trim="produit.taxe" prepend-inner-icon="mdi-brightness-percent" clearable></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-select prepend-inner-icon="mdi-video-input-component" label="Composants" small-chips chips counter deletable-chips disable-lookup :disabled="produit.type === null || produit.type === ''" :items="composants.filter((item) => item.type === produit.type && !item.archive)" item-text="nom" item-value="_id" v-model="produit.composants" multiple>
                                                    <template v-slot:selection="{ item, index }">
                                                        <v-chip small v-if="index === 0">
                                                            <span>{{ item.nom }}</span>
                                                        </v-chip>
                                                        <span v-if="index === 1" class="brown--text caption">
                                                            (+{{ produit.composants.length - 1 }} autre(s))
                                                        </span>
                                                    </template>
                                                </v-select>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12" class="text-center">
                                                <b class="error--text text-h5">Attention la liste des composants a été réinitialisé !</b>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn class="mr-1" outlined color="error" text to="/produits">
                                        <v-icon left>mdi-close-circle-outline</v-icon>Retour
                                    </v-btn>
                                    <v-btn outlined color="success" text @click.prevent="modificationProduit">
                                        <v-icon left>mdi-content-save-outline</v-icon>Sauvegarder
                                    </v-btn>
                                </v-card-actions>
                            </v-form>
                        </v-card>
                    </div>
                </div>
            </base-material-card>
        </v-col>
        <v-col cols="12" md="4" v-if="$route.params.isEdit === false">
            <v-skeleton-loader v-if="isFirstload" :loading="isLoading" type="table"></v-skeleton-loader>
            <div v-else>
                <base-material-card color="brown" icon="mdi-cog" max-width="100%" width="auto" inline class="px-5 py-3 mx-auto">
                    <template v-slot:after-heading>
                        <div class="subtitle-1">
                            <span>Informations composants</span>
                        </div>
                    </template>
                    <v-row>
                        <v-col cols="12">
                            <h4 class="subtitle-1 font-weight-light mb-2 text-md-center"><b>Liste de composants</b></h4>
                        </v-col>
                        <v-card-text>
                            <v-col cols="12">
                                <v-simple-table dense>
                                    <template v-slot:default>
                                        <tbody>
                                            <div v-if="produit.composants === null || produit.composants === undefined || produit.composants.length === 0" class="text-center">
                                                <v-chip>Aucun composant sélectionné</v-chip>
                                            </div>
                                            <tr v-else v-for="(composant, index) in produit.composants" :key="index">
                                                <td>{{ composant.refID }}</td>
                                                <td>{{ composant.nom }}</td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </v-col>
                        </v-card-text>
                    </v-row>
                </base-material-card>
            </div>
        </v-col>
    </v-row>
    <v-snackbar shaped v-model="isSnackbarOpened" elevation="24" :color="isSuccess ? 'success' : 'error'" style="filter: opacity(95%);">
        <div class="text-center subtitle-1">
            <v-icon v-if="!isSuccess" color="white" left>mdi-alert-outline</v-icon>
            <v-icon v-else color="white" left>mdi-checkbox-marked-circle-outline</v-icon>
            <span>{{ snackbarMessage }}</span>
        </div>
        <template v-slot:action="{ attrs }">
            <v-btn dark icon  @click="isSnackbarOpened = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </template>
    </v-snackbar>
</v-container>
</template>

<script lang="ts">
import Vue, {
    VNode
} from 'vue';
import {
    bus
} from "@/main";
import axiosApi from "@/plugins/axiosApi";
import qs from "qs";
import {
    AxiosResponse
} from 'axios';
import Gestion from "@/mixins/Gestion"

export default Vue.extend({
    name: 'InfosProduit',
    mixins: [Gestion],
    props: {},
    components: {},
    //data: () => ({}),
    data(): any {
        return {
            isFirstload: false as boolean,
            isLoading: false as boolean,
            produit: {
                nom: "",
                description: "",
                type: "",
                sousType: "",
                poids: "", //new Date().toISOString().substr(0, 10)
                longueur: "",
                largeur: "",
                profondeur: "",
                prix: "",
                taxe: 0.05,
                quantite: "",
                composants: [],
                matieres: [],
                couleurs: [],
                chosenFile: null as any,
                tabImgLinks: []
            },
            pageNumber: 1 as number,
            size: 1 as number,
            colorItems: ["rouge", "orange", "jaune", "chartreuse", "vert", "turquoise", "cyan", "outremer", "bleu", "violet", "magenta", "carmin"],
            matiereItems: ["Metal", "Bois", "Plastique", "Polymére", "Cuir", "Fer", "Laque", "Teck", "Verre", "Pin", "Tissu"],
            composants: []
        }
    },
    computed: {
        pageCount() {
            let l = this.produit.tabImgLinks === undefined ? 1 : this.produit.tabImgLinks.length,
                s = this.size;
            return Math.ceil(l / s) - 1;
        },
        paginatedData() {
            const start = this.pageNumber * this.size - this.size,
                end = start + this.size;
            return this.produit.tabImgLinks === undefined ? [] : this.produit.tabImgLinks.slice(start, end);
        },
    },
    watch: {},
    created() {
        //console.log('created')
    },
    beforeMount() {
        //console.log('beforeMount')
    },
    mounted(): any {
        if (this.$route.params.idProduit !== null && this.$route.params.idProduit !== undefined) {
            this.getProduitData(this.$route.params.idProduit)
            this.composants = this.$route.params.composants
            console.log(this.produit)
        } else {
            return this.$router.push({
                name: "Produits"
            });
        }
    },
    methods: {
        getProduitData: function (idProduit: string): void {
            this.isLoading = true;
            this.isFirstLoad = true;
            axiosApi.get("/product/one/" + idProduit) //one produit
                .then((response: AxiosResponse) => {
                    this.produit = response.data.product;
                    this.produit.composants = this.$route.params.isEdit ? [] : this.produit.composants
                    setTimeout(() => {
                        this.isLoading = false;
                        this.isFirstLoad = false;
                    }, 1000);
                })
                .catch((error) => {
                    this.catchAxios(error)
                    setTimeout(() => {
                        this.isLoading = false;
                        this.isFirstLoad = false;
                    }, 1000);
                });
        },
        nextPage(page: number) {
            this.pageNumber = page;
        },
        modificationProduit: function () {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data; ', //boundary=----WebKitFormBoundaryu2bwWC2UJRwib11V
                    'Authorization': 'Bearer ' + localStorage.getItem("SET_TOKEN")
                },
            };
            if (this.produit.taxe < 0 || this.produit.taxe > 1) return this.errorMessage("Veuillez vérifier la taxe !");
            this.isLoading = true;
            this.isFirstLoad = true;
            const payload = this.setProduitFormData();
            axiosApi.put("/product/update/" + this.produit._id, payload, config) //update
                .then((response: AxiosResponse) => {
                    if (response.data.error == false) {
                        this.successMessage("Sauvegarde des modifications effectuée !");
                    }
                    setTimeout(() => {
                        this.$router.push({
                            name: "Produits"
                        });
                    }, 1000);
                })
                .catch((error: any) => {
                    this.catchAxios(error)
                });
        },
        setProduitFormData: function (): FormData {
            let payload = new FormData();
            payload.append('img', this.produit.chosenFile)
            payload.append('nom', this.produit.nom)
            payload.append('description', this.produit.description)
            payload.append('type', this.produit.type)
            payload.append('sousType', this.produit.sousType)
            payload.append('poids', this.produit.poids)
            payload.append('longueur', this.produit.longueur)
            payload.append('largeur', this.produit.largeur)
            payload.append('profondeur', this.produit.profondeur)
            payload.append('prix', this.produit.prix)
            payload.append('taxe', this.produit.taxe)
            payload.append('quantite', this.produit.quantite)
            if (this.produit.matieres.length > 0) {
                this.produit.matieres.forEach((el: string) => {
                    payload.append('matieres', el)
                });
                if (this.produit.matieres.length === 1) payload.append('matieres', '')
            } else {
                for (let i = 0; i < 2; i++) payload.append('matieres', '')
            }
            if (this.produit.couleurs.length > 0) {
                this.produit.couleurs.forEach((el: string) => {
                    payload.append('couleurs', el)
                });
                if (this.produit.couleurs.length === 1) payload.append('couleurs', '')
            } else {
                for (let i = 0; i < 2; i++) payload.append('couleurs', '')
            }
            if (this.produit.composants.length > 0) {
                this.produit.composants.forEach((el: string) => {
                    payload.append('composants', el)
                });
                if (this.produit.composants.length === 1) payload.append('composants', '')
            } else {
                for (let i = 0; i < 2; i++) payload.append('composants', '')
            }
            return payload;
        },
    }
});
</script>

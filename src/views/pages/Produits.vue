<template>
<v-container id="produits" tag="section" fluid>
    <v-dialog v-model="isDialogComposant" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar tile dark color="orange">
                <v-btn icon dark @click="isDialogComposant = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Gestion des composants</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn dark text @click="isDialogComposant = false">
                        Fermer
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <Composants />
        </v-card>
    </v-dialog>
    <v-dialog v-model="isDialogNewProduit" v-if="" persistent max-width="1000px" overlay-opacity="0.8">
        <v-card color="brown" class="px-6" outlined v-if="isOnLoading">
            <v-card-text>
                Chargement...
                <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
        </v-card>
        <v-card class="px-6" outlined v-else>
            <v-form ref="form" v-model="rules.valid" lazy-validation>
                <v-card-title class="brown--text">
                    Ajout Produit
                    <v-icon aria-label="Close" class="ml-auto" @click="isDialogNewProduit = false;$refs.form.reset()">mdi-close</v-icon>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field label="Nom" color="brown" v-model.trim="produit.nom" prepend-inner-icon="mdi-card-text-outline" clearable :rules="rules.caractereRules" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-select label="Type" :items='["Chaise", "Table", "Armoire", "Lit", "Autres"]' color="brown" v-model="produit.type" prepend-inner-icon="mdi-format-list-checkbox" clearable :rules="rules.champRules" required></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field label="Sous-type" color="brown" v-model.trim="produit.sousType" prepend-inner-icon="mdi-alphabetical" clearable></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea color="brown" label="Description" rows="3" v-model="produit.description" prepend-inner-icon="mdi-text-box-outline" :rules="rules.champRules" required />
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-select label="Matières" small-chips chips counter deletable-chips disable-lookup multiple :items='matiereItems' color="brown" v-model="produit.matieres" prepend-inner-icon="mdi-format-list-checkbox" :rules="rules.champRules" required>
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
                                <v-select label="Couleurs" small-chips chips counter deletable-chips disable-lookup multiple :items='colorItems' color="brown" v-model="produit.couleurs" prepend-inner-icon="mdi-format-list-checkbox" :rules="rules.champRules" required>
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
                                <v-text-field label="Quantité" color="brown" v-model.trim="produit.quantite" prepend-inner-icon="mdi-numeric" clearable :rules="rules.numericRules" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="2">
                                <v-file-input small-chips v-model="produit.chosenFile" accept="image/*" label="Image" truncate-length="15"></v-file-input>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field label="Poids" append-icon="kg" color="brown" v-model.trim="produit.poids" prepend-inner-icon="mdi-numeric" clearable :rules="rules.numericRules" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field label="Longueur" append-icon="cm" color="brown" v-model.trim="produit.longueur" prepend-inner-icon="mdi-numeric" clearable :rules="rules.numericRules" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field label="Largeur" append-icon="cm" color="brown" v-model.trim="produit.largeur" prepend-inner-icon="mdi-numeric" clearable :rules="rules.numericRules" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field label="Profondeur" append-icon="cm" color="brown" v-model.trim="produit.profondeur" prepend-inner-icon="mdi-numeric" clearable :rules="rules.numericRules" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field label="Prix" append-icon="€" color="brown" v-model.trim="produit.prix" prepend-inner-icon="mdi-currency-eur" clearable :rules="rules.floatRules" required></v-text-field>
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
                            <v-col cols="12" md="12">
                                <v-btn outlined color="brown" @click="isDialogComposant = true">
                                    <v-icon left>mdi-cog-outline</v-icon> Gestion des composants
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="mr-1" color="error" text @click.prevent="isDialogNewProduit = false;$refs.form.reset()">Fermer</v-btn>
                    <v-btn color="success" text @click.prevent="saveNewProduit">
                        <v-icon left>mdi-check</v-icon> Sauvegarder
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
    <v-dialog v-model="isDialogDeleteProduit" width="500" overlay-opacity="0.8">
        <v-card outlined>
            <v-card-title>
                Supprimer le produit {{ produitToDelete.nom }} ?
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="isDialogDeleteProduit = false" class="mx-2" icon outlined color="red" dark>
                    <v-icon dark>mdi-close</v-icon>
                </v-btn>
                <v-btn @click="deleteProduit" class="mx-2" icon outlined color="green darken-1">
                    <v-icon dark>mdi-check-bold</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <base-material-card :kinesisActive="false" color="brown" icon="mdi-sofa-outline" max-width="100%" width="auto" inline class="py-3 mx-auto">
        <template v-slot:after-heading>
            <div class="display-1 font-weight-light">Produits</div>
        </template>
        <v-row class="mt-8 mr-1">
            <v-btn color="brown" dark @click="isDialogNewProduit = true" class="ml-3">
                <v-icon left>mdi-plus-circle-outline</v-icon>Ajouter Produit
            </v-btn>
            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon color="brown" class="ml-3" v-bind="attrs" v-on="on" @click="isDialogComposant = true">
                        <v-icon large>mdi-cog-outline</v-icon>
                    </v-btn>
                </template>
                <span>Gestion composants</span>
            </v-tooltip>
            <v-btn color="brown" icon @click="getProduitsData" class="ml-3">
                <v-icon large>mdi-refresh</v-icon>
            </v-btn>
            <v-text-field v-model="search" prepend-icon="mdi-magnify" class="ml-auto" label="Recherche" color="brown" hide-details single-line style="max-width: 250px" clearable />
        </v-row>
        <v-divider class="mt-6" />
        <v-skeleton-loader v-if="isFirstLoad" :loading="isLoading" type="table"></v-skeleton-loader>
        <v-data-table v-else :headers="headers" :items="items" :search.sync="search" :sort-by="['nom']" :sort-desc="[false]" item-key="nom">
            <template v-slot:[`item.nom`]="{ item }">
                <span class="red--text" v-if="item.archive">{{ item.nom }}</span>
                <span v-else>{{ item.nom }}</span>
            </template>
            <template v-slot:[`item.type`]="{ item }">
                <v-chip dark color="brown">{{ item.type }}</v-chip>
            </template>
            <template v-slot:[`item.imgLink`]="{ item }">
                <v-img v-if="item.imgLink !== null" transition="scale-transition" :src="item.imgLink" height="80" width="120" aspect-ratio="1" class="grey lighten-2">
                    <template v-slot:placeholder>
                        <v-row class="fill-height ma-0" align="center" justify="center"> </v-row>
                    </template>
                </v-img>
                <v-img v-else transition="scale-transition" height="80" width="120" :src="require('@/assets/ecommerce_logo.png')" aspect-ratio="1" class="grey lighten-2">
                    <template v-slot:placeholder>
                        <v-row class="fill-height ma-0" align="center" justify="center"> </v-row>
                    </template>
                </v-img>
            </template>
            <template v-slot:[`item.archive`]="{ item }">
                <v-icon color="error" v-if="item.archive">mdi-close-circle-outline</v-icon>
                <v-icon color="success" v-else>mdi-checkbox-marked-circle-outline</v-icon>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-btn icon color="info" @click="PageInfosProduit(item, false)">
                    <v-icon> mdi-information-outline </v-icon>
                </v-btn>
                <v-btn icon color="orange" :disabled="item.archive" @click="PageInfosProduit(item, true)">
                    <v-icon> mdi-pencil-outline </v-icon>
                </v-btn>
                <v-btn icon color="error" :disabled="item.archive" @click="dialogDeleteProduit(item)">
                    <v-icon> mdi-delete-outline </v-icon>
                </v-btn>
            </template>
            <div slot="no-results" :value="true" icon="warning" class="error--text">
                La recherche "{{ search }}" est inconnu.
            </div>
        </v-data-table>
    </base-material-card>
    <v-snackbar shaped v-model="isSnackbarOpened" elevation="24" :color="isSuccess ? 'success' : 'error'" v-filter="'opacity(95%)'">
        <div class="text-center subtitle-1">
            <v-icon v-if="!isSuccess" color="white" left>mdi-alert-outline</v-icon>
            <v-icon v-else color="white" left>mdi-checkbox-marked-circle-outline</v-icon>
            <span>{{ snackbarMessage }}</span>
        </div>
        <template v-slot:action="{ attrs }">
            <v-btn dark icon @click="isSnackbarOpened = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </template>
    </v-snackbar>
</v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Gestion from "@/mixins/Gestion"
import axiosApi from '@/plugins/axiosApi';
import qs from "qs";
import {
    AxiosResponse
} from 'axios';
import moment from 'moment';
import Composants from "./Composants.vue"

export default Vue.extend({
    name: 'Produits',
    mixins: [Gestion],
    props: {},
    components: {
        Composants
    },
    //data: () => ({}),
    data(): any {
        return {
            isDialogComposant: false as boolean,
            isDialogNewProduit: false as boolean,
            isDialogDeleteProduit: false as boolean,
            produitToDelete: [] as Array < any > ,
            produit: {
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
                chosenFile: null as any
            },
            colorItems: ["rouge", "orange", "jaune", "chartreuse", "vert", "turquoise", "cyan", "outremer", "bleu", "violet", "magenta", "carmin"],
            matiereItems: ["Metal", "Bois", "Plastique", "Polymére", "Cuir", "Fer", "Laque", "Teck", "Verre", "Pin", "Tissu"],
            search: undefined as string | null | undefined,
            headers: [{
                    text: "Image",
                    value: "imgLink",
                    sortable: false,
                }, {
                    text: "Nom",
                    value: "nom",
                },
                {
                    text: "Type",
                    value: "type",
                },
                {
                    text: "Quantité",
                    value: "quantite",
                },
                {
                    //sortable: false,
                    text: "Prix(€)",
                    value: "prix",
                },
                {
                    text: "Disponible",
                    value: "archive",
                    divider: true,
                },
                {
                    text: 'Actions',
                    value: 'actions',
                    sortable: false,
                    align: 'center'
                },
            ] as Array < any > ,
            items: [] as Array < any > ,
            composants: [] as Array < any > ,
            isOnLoading: false as boolean
        }
    },
    watch: {},
    created() {
        //console.log('created')
    },
    beforeMount() {
        //console.log('beforeMount')
    },
    async mounted() {
        await this.getProduitsData();
    },
    methods: {
        getProduitsData: function (): void {
            this.isLoading = true;
            this.isFirstLoad = true;
            const requestProducts = axiosApi.get("/product/all");
            const requestComposants = axiosApi.get("/composant/all");
            Promise.all([requestProducts, requestComposants])
                .then((response: AxiosResponse[]) => {
                    this.items = response[0].data.products;
                    this.composants = response[1].data.composants;
                    setTimeout(() => {
                        this.isLoading = false;
                        this.isFirstLoad = false;
                    }, 1000);
                }).catch((error: any) => {
                    this.catchAxios(error)
                    setTimeout(() => {
                        this.isLoading = false;
                        this.isFirstLoad = false;
                    }, 1000);
                });
        },
        saveNewProduit: function (): void {
            if (!this.$refs.form.validate()) return this.errorMessage("Veuillez vérifier les champs !");
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data; ', //boundary=----WebKitFormBoundaryu2bwWC2UJRwib11V
                    'Authorization': 'Bearer ' + localStorage.getItem("SET_TOKEN")
                },
            };
            if (this.produit.taxe < 0 || this.produit.taxe > 1) return this.errorMessage("Veuillez vérifier la taxe !");
            this.isOnLoading = true;
            const payload = this.setProduitFormData();
            axiosApi.post("/product/add", payload, config)
                .then((response) => {
                    Object.assign(this.$data, this.$options.data()); //reset data
                    this.successMessage("Le produit a bien été ajouté !");
                    setTimeout(() => {
                        this.getProduitsData();
                    }, 1000);
                })
                .catch((error) => {
                    console.log(error)
                    this.isOnLoading = false;
                    this.catchAxios(error)
                });
        },
        deleteProduit: function (): void {
            this.isDialogDeleteProduit = false;
            axiosApi
                .delete("/product/delete/" + this.produitToDelete._id)
                .then((response) => {
                    Object.assign(this.$data, this.$options.data()); //reset data
                    this.successMessage(`Le produit a été archivé avec succès`);
                    setTimeout(() => {
                        this.getProduitsData();
                    }, 1000);
                })
                .catch((error) => {
                    this.catchAxios(error)
                });
        },
        dialogDeleteProduit: function (infosProduit: Record < string, any > ) {
            this.isDialogDeleteProduit = true;
            this.produitToDelete = infosProduit;
        },
        PageInfosProduit: function (infosProduit: Record < string, any > , isEdit: boolean) {
            this.$router.push({
                name: "Informations-Produit",
                params: {
                    isEdit: isEdit,
                    idProduit: infosProduit._id,
                    composants: this.composants
                },
            });
        },
        getFormData: function (object: any) {
            const formData = new FormData();
            Object.keys(object).forEach(key => formData.append(key, object[key]));
            return formData;
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

<style></style>

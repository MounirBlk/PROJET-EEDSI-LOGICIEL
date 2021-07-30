<template>
<v-container id="composants" tag="section" fluid>
    <v-dialog v-model="isDialogNewComposant" persistent max-width="1000px" overlay-opacity="0.8">
        <v-card color="orange" class="px-6" outlined v-if="isOnLoading">
            <v-card-text>
                Chargement...
                <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
        </v-card>
        <v-card class="px-6" outlined v-else>
            <v-form ref="form" v-model="rules.valid" lazy-validation>
                <v-card-title class="orange--text">
                    Ajout Composant
                    <v-icon aria-label="Close" class="ml-auto" @click="isDialogNewComposant = false;$refs.form.reset()">mdi-close</v-icon>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field label="Nom" color="orange" v-model.trim="composant.nom" prepend-inner-icon="mdi-card-text-outline" clearable :rules="rules.caractereRules" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-select label="Type" :items='["Chaise", "Table", "Armoire", "Lit", "Autres"]' color="orange" v-model="composant.type" prepend-inner-icon="mdi-format-list-checkbox" clearable :rules="rules.champRules" required></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field label="Prix" append-icon="€" color="orange" v-model.trim="composant.prix" prepend-inner-icon="mdi-currency-eur" clearable :rules="rules.floatRules" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea color="orange" label="Description" rows="3" v-model="composant.description" prepend-inner-icon="mdi-text-box-outline" :rules="rules.champRules" required />
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-select label="Matieres" small-chips chips counter deletable-chips disable-lookup multiple :items='matiereItems' color="orange" v-model="composant.matieres" prepend-inner-icon="mdi-format-list-checkbox" :rules="rules.champRules" required>
                                    <template v-slot:selection="{ item, index }">
                                        <v-chip small v-if="index === 0">
                                            <span>{{ item }}</span>
                                        </v-chip>
                                        <span v-if="index === 1" class="orange--text caption">
                                            (+{{ composant.matieres.length - 1 }} autre(s))
                                        </span>
                                    </template>
                                </v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-select label="Couleurs" small-chips chips counter deletable-chips disable-lookup multiple :items='colorItems' color="orange" v-model="composant.couleurs" prepend-inner-icon="mdi-format-list-checkbox" :rules="rules.champRules" required>
                                    <template v-slot:selection="{ item, index }">
                                        <v-chip small v-if="index === 0">
                                            <span>{{ item }}</span>
                                        </v-chip>
                                        <span v-if="index === 1" class="orange--text caption">
                                            (+{{ composant.couleurs.length - 1 }} autre(s))
                                        </span>
                                    </template>
                                </v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="2">
                                <v-text-field label="Quantité" color="orange" v-model.trim="composant.quantite" prepend-inner-icon="mdi-numeric" clearable :rules="rules.numericRules" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="2">
                                <v-file-input small-chips v-model="composant.chosenFile" accept="image/*" label="Image" truncate-length="15"></v-file-input>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field label="Poids" append-icon="kg" color="orange" v-model.trim="composant.poids" prepend-inner-icon="mdi-numeric" clearable :rules="rules.numericRules" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field label="Longueur" append-icon="cm" color="orange" v-model.trim="composant.longueur" prepend-inner-icon="mdi-numeric" clearable :rules="rules.numericRules" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field label="Largeur" append-icon="cm" color="orange" v-model.trim="composant.largeur" prepend-inner-icon="mdi-numeric" clearable :rules="rules.numericRules" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field label="Profondeur" append-icon="cm" color="orange" v-model.trim="composant.profondeur" prepend-inner-icon="mdi-numeric" clearable :rules="rules.numericRules" required></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="mr-1" color="error" text @click.prevent="isDialogNewComposant = false;$refs.form.reset()">Fermer</v-btn>
                    <v-btn color="success" text @click.prevent="saveNewComposant">
                        <v-icon left>mdi-check</v-icon> Sauvegarder
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
    <v-dialog v-model="isDialogDeleteComposant" width="500" overlay-opacity="0.8">
        <v-card outlined>
            <v-card-title>
                Supprimer le composant {{ composantToDelete.nom }} ?
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="isDialogDeleteComposant = false" class="mx-2" icon outlined color="red" dark>
                    <v-icon dark>mdi-close</v-icon>
                </v-btn>
                <v-btn @click="deleteUtilisateur" class="mx-2" icon outlined color="green darken-1">
                    <v-icon dark>mdi-check-bold</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="isDialogEditComposant" persistent max-width="1000px" overlay-opacity="0.8">
        <v-card class="px-6" outlined>
            <v-form ref="form">
                <v-card-title class="orange--text">
                    Modification Composant
                    <v-icon aria-label="Close" class="ml-auto" @click="isDialogEditComposant = false;">mdi-close</v-icon>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field label="Nom" color="orange" v-model.trim="composantToUpdate.nom" prepend-inner-icon="mdi-card-text-outline" clearable></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-select label="Type" :items='["Chaise", "Table", "Armoire", "Lit", "Autres"]' color="orange" v-model="composantToUpdate.type" prepend-inner-icon="mdi-format-list-checkbox" clearable></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field label="Prix" append-icon="€" color="orange" v-model.trim="composantToUpdate.prix" prepend-inner-icon="mdi-currency-eur" clearable></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea color="orange" label="Description" rows="3" v-model="composantToUpdate.description" prepend-inner-icon="mdi-text-box-outline" />
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-select label="Matières" small-chips chips counter deletable-chips disable-lookup multiple :items='matiereItems' color="orange" v-model="composantToUpdate.matieres" prepend-inner-icon="mdi-format-list-checkbox">
                                    <template v-slot:selection="{ item, index }">
                                        <v-chip small v-if="index === 0">
                                            <span>{{ item }}</span>
                                        </v-chip>
                                        <span v-if="index === 1" class="orange--text caption">
                                            (+{{ composantToUpdate.matieres.length - 1 }} autre(s))
                                        </span>
                                    </template>
                                </v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-select label="Couleurs" small-chips :disabled="composantToUpdate.chosenFile === null || composantToUpdate.chosenFile === undefined" chips counter deletable-chips disable-lookup multiple :items='colorItems' color="orange" v-model="composantToUpdate.couleurs" prepend-inner-icon="mdi-format-list-checkbox">
                                    <template v-slot:selection="{ item, index }">
                                        <v-chip small v-if="index === 0">
                                            <span>{{ item }}</span>
                                        </v-chip>
                                        <span v-if="index === 1" class="orange--text caption">
                                            (+{{ composantToUpdate.couleurs.length - 1 }} autre(s))
                                        </span>
                                    </template>
                                </v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="2">
                                <v-text-field label="Quantité" color="orange" v-model.trim="composantToUpdate.quantite" prepend-inner-icon="mdi-numeric" clearable></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="2">
                                <v-file-input small-chips v-model="composantToUpdate.chosenFile" accept="image/*" label="Image" truncate-length="15"></v-file-input>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field label="Poids" append-icon="kg" color="orange" v-model.trim="composantToUpdate.poids" prepend-inner-icon="mdi-numeric" clearable></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field label="Longueur" append-icon="cm" color="orange" v-model.trim="composantToUpdate.longueur" prepend-inner-icon="mdi-numeric" clearable></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field label="Largeur" append-icon="cm" color="orange" v-model.trim="composantToUpdate.largeur" prepend-inner-icon="mdi-numeric" clearable></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field label="Profondeur" append-icon="cm" color="orange" v-model.trim="composantToUpdate.profondeur" prepend-inner-icon="mdi-numeric" clearable></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="mr-1" color="error" text @click.prevent="isDialogEditComposant = false">
                        <v-icon left>mdi-close-circle-outline</v-icon>Fermer
                    </v-btn>
                    <v-btn color="success" text @click.prevent="modificationComposant">
                        <v-icon left>mdi-check</v-icon> Sauvegarder
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
    <v-dialog v-model="isDialogInfosComposant" persistent overlay-opacity="0.8">
        <v-card class="px-6" outlined>
            <v-form ref="form">
                <v-card-title class="orange--text">
                    Informations Composant
                    <v-icon aria-label="Close" class="ml-auto" @click="isDialogInfosComposant = false;">mdi-close</v-icon>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <base-material-card color="orange">
                            <template v-slot:heading>
                                <div class="display-1 white--text">
                                    <span>Composant</span><br />
                                </div>
                            </template>
                            <div>
                                <div>
                                    <v-row>
                                        <v-col cols="12" md="7">
                                            <v-simple-table dense>
                                                <template v-slot:default>
                                                    <tbody>
                                                        <tr>
                                                            <td>Référence du composant</td>
                                                            <td>{{ composantInfos.refID }}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Nom du composant</td>
                                                            <td>{{ composantInfos.nom }}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Type</td>
                                                            <td>{{ composantInfos.type }}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Couleurs</td>
                                                            <td>{{ composantInfos.couleurs.join(', ') }}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Matières</td>
                                                            <td>{{ composantInfos.matieres.join(', ') }}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Longueur</td>
                                                            <td>{{ composantInfos.longueur }} cm</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Largeur</td>
                                                            <td>{{ composantInfos.largeur }} cm</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Profondeur</td>
                                                            <td>{{ composantInfos.profondeur }} cm</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Poids</td>
                                                            <td>{{ composantInfos.poids }} kg</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Prix</td>
                                                            <td>{{ composantInfos.prix }} €</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Quantité</td>
                                                            <td>{{ composantInfos.quantite }}</td>
                                                        </tr>
                                                    </tbody>
                                                </template>
                                            </v-simple-table>
                                        </v-col>
                                        <v-col cols="12" md="5">
                                            <v-row v-if="composantInfos.tabImgLinks !== undefined">
                                                <v-col cols="12" v-for="(img, index) in paginatedData" :key="index">
                                                    <v-img transition="scale-transition" :src="img" height="300" width="auto" aspect-ratio="1" class="grey lighten-2">
                                                        <template v-slot:placeholder>
                                                            <v-row class="fill-height ma-0" align="center" justify="center">
                                                                <v-progress-circular indeterminate color="orange"></v-progress-circular>
                                                            </v-row>
                                                        </template>
                                                    </v-img>
                                                </v-col>
                                                <v-col cols="12" md="12">
                                                    <div class="text-center">
                                                        <v-pagination circle v-model="pageNumber" :length="composantInfos.tabImgLinks.length" @input="nextPage" />
                                                    </div>
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                </div>
                            </div>
                        </base-material-card>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="mr-1" color="error" text @click.prevent="isDialogInfosComposant = false">
                        <v-icon left>mdi-close-circle-outline</v-icon>Fermer
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
    <base-material-card color="orange" icon="mdi-table-chair" max-width="100%" width="auto" inline class="px-5 py-3 mx-auto">
        <template v-slot:after-heading>
            <div class="display-1 font-weight-light">Composants</div>
        </template>
        <v-row class="mt-8 mr-1">
            <v-btn color="orange" dark @click="isDialogNewComposant = true" class="ml-3">
                <v-icon left>mdi-plus-circle-outline</v-icon>Ajouter Composant
            </v-btn>
            <v-btn color="orange" icon @click="getComposantsData" class="ml-3">
                <v-icon large>mdi-refresh</v-icon>
            </v-btn>
            <v-text-field v-model="search" prepend-icon="mdi-magnify" class="ml-auto" label="Recherche" color="orange" hide-details single-line style="max-width: 250px" clearable />
        </v-row>
        <v-divider class="mt-6" />
        <v-skeleton-loader v-if="isFirstLoad" :loading="isLoading" type="table"></v-skeleton-loader>
        <v-data-table v-else :headers="headers" :items="items" :search.sync="search" :sort-by="['nom']" :sort-desc="[false]" item-key="nom">
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
            <template v-slot:[`item.type`]="{ item }">
                <v-chip dark color="orange">{{ item.type }}</v-chip>
            </template>
            <template v-slot:[`item.nom`]="{ item }">
                <span class="red--text" v-if="item.archive">{{ item.nom }}</span>
                <span v-else>{{ item.nom }}</span>
            </template>
            <template v-slot:[`item.archive`]="{ item }">
                <v-icon color="error" v-if="item.archive">mdi-close-circle-outline</v-icon>
                <v-icon color="success" v-else>mdi-checkbox-marked-circle-outline</v-icon>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-btn icon color="info" @click="getOneComposant(item, false)">
                    <v-icon> mdi-information-outline </v-icon>
                </v-btn>
                <v-btn icon color="orange" :disabled="item.archive" @click="getOneComposant(item, true)">
                    <v-icon> mdi-pencil-outline </v-icon>
                </v-btn>
                <v-btn icon color="error" :disabled="item.archive" @click="dialogDeleteComposant(item)">
                    <v-icon> mdi-delete-outline </v-icon>
                </v-btn>
            </template>
            <div slot="no-results" :value="true" icon="warning" class="error--text">
                La recherche "{{ search }}" est inconnu.
            </div>
        </v-data-table>
    </base-material-card>
    <v-snackbar shaped v-model="isSnackbarOpened" elevation="24" :color="isSuccess ? 'success' : 'error'" style="filter: opacity(95%);">
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

export default Vue.extend({
    name: 'Composants',
    mixins: [Gestion],
    props: {},
    components: {},
    //data: () => ({}),
    data(): any {
        return {
            isDialogNewComposant: false as boolean,
            isDialogDeleteComposant: false as boolean,
            isDialogInfosComposant: false as boolean,
            isDialogEditComposant: false as boolean,
            composantToDelete: [] as Array < any > ,
            composant: {
                nom: "",
                description: "",
                type: "",
                poids: 0,
                longueur: 0,
                largeur: 0,
                profondeur: 0,
                prix: 0.00,
                quantite: 0,
                matieres: [],
                couleurs: [],
                chosenFile: null as any
            },
            composantToUpdate: {
                nom: "",
                description: "",
                type: "",
                poids: "",
                longueur: "",
                largeur: "",
                profondeur: "",
                prix: "",
                quantite: "",
                matieres: [],
                couleurs: [],
                chosenFile: null as any,
                tabImgLinks: []
            },
            composantInfos: {
                nom: "",
                description: "",
                type: "",
                poids: "",
                longueur: "",
                largeur: "",
                profondeur: "",
                prix: "",
                quantite: "",
                matieres: [],
                couleurs: [],
                chosenFile: null as any,
                tabImgLinks: []
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
            pageNumber: 1 as number,
            size: 1 as number,
            isOnLoading: false as boolean
        }
    },
    watch: {},
    computed: {
        pageCount() {
            let l = this.composantInfos.tabImgLinks === undefined ? 1 : this.composantInfos.tabImgLinks.length,
                s = this.size;
            return Math.ceil(l / s) - 1;
        },
        paginatedData() {
            const start = this.pageNumber * this.size - this.size,
                end = start + this.size;
            return this.composantInfos.tabImgLinks === undefined ? [] : this.composantInfos.tabImgLinks.slice(start, end);
        },
    },
    created() {
        //console.log('created')
    },
    beforeMount() {
        //console.log('beforeMount')
    },
    async mounted() {
        await this.getComposantsData();
    },
    methods: {
        getComposantsData: function (): void {
            this.isLoading = true;
            this.isFirstLoad = true;
            axiosApi.get("/composant/all")
                .then((response: AxiosResponse) => {
                    this.items = response.data.composants;
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
        saveNewComposant: function (): void {
            if (!this.$refs.form.validate()) return this.errorMessage("Veuillez vérifier les champs !");
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data; ', //boundary=----WebKitFormBoundaryu2bwWC2UJRwib11V
                    'Authorization': 'Bearer ' + localStorage.getItem("SET_TOKEN")
                },
            };
            if (this.composant.taxe < 0 || this.composant.taxe > 1) return this.errorMessage("Veuillez vérifier la taxe !");
            this.isOnLoading = true;
            const payload = this.setComposantFormData(this.composant);
            axiosApi.post("/composant/add", payload, config)
                .then((response) => {
                    //this.isOnLoading = false;
                    Object.assign(this.$data, this.$options.data()); //reset data
                    //this.$refs.form.reset();
                    this.successMessage("Le composant a bien été ajouté !");
                    setTimeout(() => {
                        this.getComposantsData();
                    }, 1000);
                })
                .catch((error) => {
                    console.log(error)
                    this.isOnLoading = false;
                    this.catchAxios(error)
                });
        },
        nextPage(page: number) {
            this.pageNumber = page;
        },
        deleteUtilisateur: function (): void {
            this.isDialogDeleteComposant = false;
            axiosApi
                .delete("/composant/delete/" + this.composantToDelete._id)
                .then((response) => {
                    Object.assign(this.$data, this.$options.data()); //reset data
                    //this.$refs.form.reset();
                    this.successMessage(`Le composant a été archivé avec succès`);
                    setTimeout(() => {
                        this.getComposantsData();
                    }, 1000);
                })
                .catch((error) => {
                    this.catchAxios(error)
                });
        },
        dialogDeleteComposant: function (infosComposant: Record < string, any > ) {
            this.isDialogDeleteComposant = true;
            this.composantToDelete = infosComposant;
        },
        getOneComposant: function (infosComposant: Record < string, any > , isEdit: boolean) {
            if (isEdit) {
                this.composantToUpdate = infosComposant;
                this.isDialogEditComposant = true;
                this.isDialogInfosComposant = false;
            } else {
                this.getOneComposantData(infosComposant._id)
            }
        },
        getOneComposantData: function (idComposant: string): void {
            this.isLoading = true;
            this.isFirstLoad = true;
            axiosApi.get("/composant/one/" + idComposant) //one composant
                .then((response: AxiosResponse) => {
                    this.composantInfos = response.data.composant;
                    setTimeout(() => {
                        this.isLoading = false;
                        this.isFirstLoad = false;
                        this.isDialogInfosComposant = true;
                        this.isDialogEditComposant = false;
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
        modificationComposant: function () {
            this.isLoading = true;
            this.isFirstLoad = true;
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data; ', //boundary=----WebKitFormBoundaryu2bwWC2UJRwib11V
                    'Authorization': 'Bearer ' + localStorage.getItem("SET_TOKEN")
                },
            };
            const payload = this.setComposantFormData(this.composantToUpdate);
            this.isDialogEditComposant = false;
            axiosApi.put("/composant/update/" + this.composantToUpdate._id, payload, config) //update
                .then((response: AxiosResponse) => {
                    if (response.data.error == false) {
                        this.successMessage("Sauvegarde des modifications effectuée !");
                    }
                    setTimeout(() => {
                        this.getComposantsData();
                        this.isLoading = false;
                        this.isFirstLoad = false;
                    }, 1000);
                })
                .catch((error: any) => {
                    this.catchAxios(error)
                });
        },
        getFormData: function (object: any) {
            const formData = new FormData();
            Object.keys(object).forEach(key => formData.append(key, object[key]));
            return formData;
        },
        setComposantFormData: function (data: any): FormData {
            let payload = new FormData();
            payload.append('img', data.chosenFile)
            payload.append('nom', data.nom)
            payload.append('description', data.description)
            payload.append('type', data.type)
            payload.append('poids', data.poids)
            payload.append('longueur', data.longueur)
            payload.append('largeur', data.largeur)
            payload.append('profondeur', data.profondeur)
            payload.append('prix', data.prix)
            payload.append('quantite', data.quantite)
            if (data.matieres.length > 0) {
                data.matieres.forEach((el: string) => {
                    payload.append('matieres', el)
                });
                if (data.matieres.length === 1) payload.append('matieres', '')
            } else {
                for (let i = 0; i < 2; i++) payload.append('matieres', '')
            }
            if (data.couleurs.length > 0) {
                data.couleurs.forEach((el: string) => {
                    payload.append('couleurs', el)
                });
                if (data.couleurs.length === 1) payload.append('couleurs', '')
            } else {
                for (let i = 0; i < 2; i++) payload.append('couleurs', '')
            }
            return payload;
        },
    }
});
</script>

<style></style>

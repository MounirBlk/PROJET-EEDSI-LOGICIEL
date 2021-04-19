<template>
<v-container id="factures" tag="section" fluid>
    <v-dialog v-model="isDialogComposant" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar dark color="brown lighten-2">
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
    <v-dialog v-model="isDialogNewProduit" max-width="800px">
        <v-card>
            <v-card-title>
                <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field label="Nom"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-select label="Type" :items='["Chaise", "Table", "Armoire", "Lit"]'></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-select label="Sous-type"></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-select label="Matiere" multiple :items='["Metal", "Bois", "Plastique", "Polymére"]'></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-select label="Couleur" multiple :items='["Noir", "Blanc", "Marron", "Gris"]'></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field label="Quantité"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-file-input small-chips v-model="chosenFile" accept="image/*" label="Image" truncate-length="15"></v-file-input>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field label="Poids(kg)"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field label="Longueur(cm)"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field label="Largeur(cm)"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field label="Profondeur(cm)"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field label="Prix meuble(€)"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field label="Taxe(%)"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-select label="Composants" :items='["Roulette en or", "Pied de meuble en marbre", "Mousse dorée", "Pied de meuble rouge"]' multiple></v-select>
                        </v-col>
                        <v-col cols="12" md="12" sm="12">
                            <v-btn outlined color="green" @click="newProduct">
                                <v-icon>mdi-check</v-icon> Sauvegarder
                            </v-btn>
                        </v-col>
                        <v-col cols="12" md="8">
                            <v-btn outlined color="brown" @click="isDialogComposant = true">
                                <v-icon>mdi-cog-outline</v-icon> Gestion des composants
                            </v-btn>
                        </v-col>
                        <v-col cols="12" md="4">
                            <strong> Prix total: 150 €</strong>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="close">
                    Cancel
                </v-btn>
                <v-btn color="green darken-1" text @click="save">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <base-material-card color="brown" icon="mdi-sofa-single-outline" max-width="100%" width="auto" inline class="px-5 py-3 mx-auto">
        <template v-slot:after-heading>
            <div class="display-1 font-weight-light">Produits</div>
        </template>

        <v-row class="mt-8 mr-1">
            <v-btn color="brown" @click="isDialogNewProduit = true" class="ml-3" dark>
                <v-icon left>mdi-plus</v-icon>Ajouter un produit
            </v-btn>
            <v-btn color="brown" @click="isDialogComposant = true" class="ml-3" dark>
                <v-icon left>mdi-cog-outline</v-icon>Gestion composant
            </v-btn>
            <v-btn color="brown" icon class="ml-3">
                <v-icon large>mdi-refresh</v-icon>
            </v-btn>
            <v-text-field v-model="search" prepend-icon="mdi-magnify" class="ml-auto" label="Recherche" color="primary" hide-details single-line style="max-width: 250px" clearable />
        </v-row>
        <v-divider class="mt-6" />

        <v-data-table :headers="headers" :items="desserts" sort-by="nom" class="elevation-1">
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="PageInfosProduit(item, false)">
                    mdi-information
                </v-icon>
                <v-icon small class="mr-2" @click="editItem(item)">
                    mdi-pencil
                </v-icon>
                <v-icon small @click="deleteItem(item)">
                    mdi-delete
                </v-icon>
            </template>
            <template v-slot:no-data>
                <v-btn color="primary" @click="initialize">
                    Reset
                </v-btn>
            </template>
        </v-data-table>
    </base-material-card>
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
import Composants from "./Composants.vue"
export default Vue.extend({
    name: 'Factures',
    mixins: [Gestion],
    props: {},
    components: {
        Composants
    },
    //data: () => ({}),
    data(): any {
        return {
            chosenFile: null,
            search: undefined as string | null | undefined,
            isDialogComposant: false,
            isDialogNewProduit: false,
            dialog: false,
            dialogDelete: false,
            headers: [{
                    text: 'RefID',
                    align: 'start',
                    sortable: false,
                    value: 'RefID',
                },
                {
                    text: 'Nom',
                    value: 'nom'
                },
                {
                    text: 'Type',
                    value: 'type'
                },
                {
                    text: 'Prix total (€)',
                    value: 'prixTotal'
                },
                {
                    text: 'Actions',
                    value: 'actions',
                    sortable: false
                },
            ],
            desserts: [],
            editedIndex: -1,
            editedItem: {
                RefID: 0,
                nom: '',
                type: "Chaise",
                prixTotal: 100,
            },
            defaultItem: {
                RefID: 0,
                nom: '',
                type: "Chaise",
                prixTotal: 100,
            },
        }
    },
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Nouveau produit' : 'Modifier produit'
        },
    },
    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },
    created() {
        this.initialize()
    },
    beforeMount() {
        //console.log('beforeMount')
    },
    mounted() {
        //console.log('mounted')
    },
    methods: {
        newProduct:  function () {
            console.log(this.chosenFile)
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data; ', //boundary=----WebKitFormBoundaryu2bwWC2UJRwib11V
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                },
            };
            const formData = new FormData()
            formData.append('img', this.chosenFile)
            formData.append('nom', 'Chaise en titane vue')
            formData.append('description', 'test2 vue')
            formData.append('type', 'chaise')
            formData.append('matieres', 'Metal')
            formData.append('matieres', 'Bois')
            formData.append('couleurs', 'rouge')
            formData.append('couleurs', 'vert')
            formData.append('couleurs', 'bleu')
            formData.append('poids', '500')
            formData.append('longueur', '500')
            formData.append('largeur', '500')
            formData.append('profondeur', '50')
            formData.append('prix', '50.52')
            formData.append('taxe', '0.05')
            formData.append('quantite', '5')
            axiosApi.post("https://api-imie-e-commerce.herokuapp.com/product/add", formData, config)
                .then((response) => {
                    console.log(response.data)
                })
                .catch((error) => {
                    throw error;
                });
        },
        initialize() {
            this.desserts = [{
                    RefID: 1525,
                    nom: 'Frozen Yogurt',
                    type: "Chaise",
                    prixTotal: 100,
                },
                {
                    RefID: 54554,
                    nom: 'Ice cream sandwich',
                    type: "Table",
                    prixTotal: 100,
                },
                {
                    RefID: 524,
                    nom: 'Eclair',
                    type: "Chaise",
                    prixTotal: 100,
                },
                {
                    RefID: 4525,
                    nom: 'Cupcake',
                    type: "Chaise",
                    prixTotal: 100,
                },
                {
                    RefID: 356,
                    nom: 'Gingerbread',
                    type: "Chaise",
                    prixTotal: 100,
                },
                {
                    RefID: 3455,
                    nom: 'Jelly bean',
                    type: "Chaise",
                    prixTotal: 100,
                },
                {
                    RefID: 32552,
                    nom: 'Lollipop',
                    type: "Chaise",
                    prixTotal: 100,
                },
                {
                    RefID: 5452,
                    nom: 'Honeycomb',
                    type: "Chaise",
                    prixTotal: 100,
                },
                {
                    RefID: 55,
                    nom: 'Donut',
                    type: "Chaise",
                    prixTotal: 100,
                },
                {
                    RefID: 55452,
                    nom: 'KitKat',
                    type: "Chaise",
                    prixTotal: 100,
                },
            ]
        },

        editItem(item) {
            this.editedIndex = this.desserts.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.isDialogNewProduit = true
        },
        PageInfosProduit: function (infosProduit: Record < string, any > , isEdit: boolean) {
            this.$router.push({
                name: "Informations-Produit",
                params: {
                    isEdit: isEdit,
                    infosProduit: infosProduit
                },
            });
        },
        deleteItem(item) {
            this.editedIndex = this.desserts.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            this.desserts.splice(this.editedIndex, 1)
            this.closeDelete()
        },

        close() {
            this.isDialogNewProduit = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.desserts[this.editedIndex], this.editedItem)
            } else {
                this.desserts.push(this.editedItem)
            }
            this.close()
        },
    }
});
</script>

<style>
.imgProduct {
    width: 30%;
    margin: auto;
    display: block;
    margin-bottom: 10px;
}
</style>

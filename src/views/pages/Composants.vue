<template>
<v-container id="factures" tag="section" fluid>
    <v-dialog v-model="isDialogNewComposant" max-width="800px">
        <v-card>
            <v-card-title>
                <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field label="Nom"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-select label="Type" :items='["Pied en mousse", "Table", "Armoire", "Lit"]'></v-select>
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
                            <v-file-input label="Image" truncate-length="15"></v-file-input>
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
                        <v-col cols="12" sm="6" md="12">
                            <v-text-field label="Prix composant(€)"></v-text-field>
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
    <base-material-card color="brown lighten-2" icon="mdi-table-chair"  width="auto" inline class="px-5 py-3 mx-auto">
        <template v-slot:after-heading>
            <div class="display-1 font-weight-light">Composants</div>
        </template>

        <v-row class="mt-8 mr-1">
            <v-btn color="brown lighten-2" @click="isDialogNewComposant = true" class="ml-3" dark>
                <v-icon left>mdi-plus</v-icon>Ajouter un composant
            </v-btn>
            <v-btn color="brown lighten-2" icon class="ml-3">
                <v-icon large>mdi-refresh</v-icon>
            </v-btn>
            <v-text-field v-model="search" prepend-icon="mdi-magnify" class="ml-auto" label="Recherche" color="primary" hide-details single-line style="max-width: 250px" clearable />
        </v-row>
        <v-divider class="mt-6" />

        <v-data-table :headers="headers" :items="desserts" sort-by="nom" class="elevation-1">
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">
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
export default Vue.extend({
    name: 'Factures',
    mixins: [Gestion],
    props: {},
    components: {},
    //data: () => ({}),
    data(): any {
        return {
            search: undefined as string | null | undefined,
            isDialogComposant: false,
            isDialogNewComposant: false,
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
                type: "Pied en mousse",
                prixTotal: 35,
            },
            defaultItem: {
                RefID: 0,
                nom: '',
                type: "Pied en mousse",
                prixTotal: 35,
            },
        }
    },
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Nouveau composant' : 'Modifier composant'
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
        initialize() {
            this.desserts = [{
                    RefID: 1525,
                    nom: 'Frozen Yogurt',
                    type: "Pied en mousse",
                    prixTotal: 35,
                },
                {
                    RefID: 54554,
                    nom: 'Ice cream sandwich',
                    type: "Table",
                    prixTotal: 35,
                },
                {
                    RefID: 524,
                    nom: 'Eclair',
                    type: "Pied en mousse",
                    prixTotal: 35,
                },
                {
                    RefID: 4525,
                    nom: 'Cupcake',
                    type: "Pied en mousse",
                    prixTotal: 35,
                },
                {
                    RefID: 356,
                    nom: 'Gingerbread',
                    type: "Pied en mousse",
                    prixTotal: 35,
                },
                {
                    RefID: 3455,
                    nom: 'Jelly bean',
                    type: "Pied en mousse",
                    prixTotal: 35,
                },
                {
                    RefID: 32552,
                    nom: 'Lollipop',
                    type: "Pied en mousse",
                    prixTotal: 35,
                },
                {
                    RefID: 5452,
                    nom: 'Honeycomb',
                    type: "Pied en mousse",
                    prixTotal: 35,
                },
                {
                    RefID: 55,
                    nom: 'Donut',
                    type: "Pied en mousse",
                    prixTotal: 35,
                },
                {
                    RefID: 55452,
                    nom: 'KitKat',
                    type: "Pied en mousse",
                    prixTotal: 35,
                },
            ]
        },

        editItem(item) {
            this.editedIndex = this.desserts.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.isDialogNewComposant = true
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
            this.isDialogNewComposant = false
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
</style>

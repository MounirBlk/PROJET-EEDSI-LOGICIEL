<template>
<v-container id="livraisons" tag="section" fluid>
    <v-dialog v-model="isDialogLivraison" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="close">
                    Cancel
                </v-btn>
                <v-btn color="#F3C98B darken-1" text @click="save">
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
    <base-material-card color="#F3C98B" icon="mdi-package-variant-closed" max-width="100%" width="auto" inline class="px-5 py-3 mx-auto">
        <template v-slot:after-heading>
            <div class="display-1 font-weight-light">Livraisons</div>
        </template>

        <v-row class="mt-8 mr-1">
            <v-btn color="#F3C98B" icon class="ml-3">
                <v-icon large>mdi-refresh</v-icon>
            </v-btn>
            <v-text-field v-model="search" prepend-icon="mdi-magnify" class="ml-auto" label="Recherche" color="#F3C98B" hide-details single-line style="max-width: 250px" clearable />
        </v-row>
        <v-divider class="mt-6" />

        <v-data-table :headers="headers" :items="items" sort-by="RefID" class="elevation-1">
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="PageInfosLivraison(item, false)">
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
                <v-btn color="#F3C98B" @click="initialize">
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
    name: 'Livraisons',
    mixins: [Gestion],
    props: {},
    components: {},
    //data: () => ({}),
    data(): any {
        return {
            search: undefined as string | null | undefined,
            isDialogLivraison: false,
            dialog: false,
            dialogDelete: false,
            headers: [{
                    text: 'RefID',
                    align: 'start',
                    sortable: false,
                    value: 'RefID',
                },
                {
                    text: 'Client',
                    value: 'client'
                },
                {
                    text: 'Livreur',
                    value: 'livreur'
                },
                {
                    text: 'Date de livraison',
                    value: 'dateLivraison'
                },
                {
                    text: 'Status',
                    value: 'status'
                },
                {
                    text: 'Actions',
                    value: 'actions',
                    sortable: false
                },
            ],
            items: [],
            editedIndex: -1,
            editedItem: {
                RefID: 0,
                client: '',
                livreur: '',
                dateLivraison: "2021-03-16",
                status: 'En cour',
            },
            defaultItem: {
                RefID: 0,
                client: '',
                livreur: '',
                dateLivraison: "2021-03-16",
                status: 'En cour',
            },
        }
    },
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Livraison' : 'Modifier livraison'
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
            this.items = [{
                    RefID: 1525,
                    client: 'Frozen Yogurt',
                    livreur: 'Livreur1',
                    dateLivraison: "2021-03-16",
                    status: 'En cour',
                },
                {
                    RefID: 54554,
                    client: 'Ice cream sandwich',
                    livreur: 'Livreur2',
                    dateLivraison: "2021-03-16",
                    status: 'En cour',
                },
                {
                    RefID: 524,
                    client: 'Eclair',
                    livreur: 'Livreur3',
                    dateLivraison: "2021-03-16",
                    status: 'En cour',
                },
                {
                    RefID: 4525,
                    client: 'Cupcake',
                    livreur: 'Livreur4',
                    dateLivraison: "2021-03-16",
                    status: 'En cour',
                },
                {
                    RefID: 356,
                    client: 'Gingerbread',
                    livreur: 'Livreur5',
                    dateLivraison: "2021-03-16",
                    status: 'En cour',
                },
                {
                    RefID: 3455,
                    client: 'Jelly bean',
                    livreur: 'Livreur6',
                    dateLivraison: "2021-03-16",
                    status: 'En cour',
                },
                {
                    RefID: 32552,
                    client: 'Lollipop',
                    livreur: 'Livreur7',
                    dateLivraison: "2021-03-16",
                    status: 'En cour',
                },
                {
                    RefID: 5452,
                    client: 'Honeycomb',
                    livreur: 'Livreur8',
                    dateLivraison: "2021-03-16",
                    status: 'En cour',
                },
                {
                    RefID: 55,
                    client: 'Donut',
                    livreur: 'Livreur9',
                    dateLivraison: "2021-03-16",
                    status: 'En cour',
                },
                {
                    RefID: 55452,
                    client: 'KitKat',
                    livreur: 'Livreur10',
                    dateLivraison: "2021-03-16",
                    status: 'En cour',
                },
            ]
        },
        PageInfosLivraison: function (infosLivraison: Record < string, any > , isEdit: boolean) {
            this.$router.push({
                name: "Informations-Livraison",
                params: {
                    isEdit: isEdit,
                    infosLivraison: infosLivraison
                },
            });
        },
        editItem(item: any) {
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.isDialogLivraison = true
        },
        deleteItem(item: any) {
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            this.items.splice(this.editedIndex, 1)
            this.closeDelete()
        },

        close() {
            this.isDialogLivraison = false
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
                Object.assign(this.items[this.editedIndex], this.editedItem)
            } else {
                this.items.push(this.editedItem)
            }
            this.close()
        },
    }
});
</script>

<style>
</style>

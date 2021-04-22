<template>
<v-container id="prospections" tag="section" fluid>
    <v-dialog v-model="isDialogNewEntreprise" persistent max-width="1000px" overlay-opacity="0.8">
        <v-card class="px-6" outlined>
            <v-form ref="form" v-model="rules.valid" lazy-validation>
                <v-card-title class="pink--text">
                    Ajout d'une nouvelle entreprise
                    <v-icon aria-label="Close" class="ml-auto" @click="isDialogNewEntreprise = false">mdi-close</v-icon>
                </v-card-title>
                <v-col cols="12">
                    <div class="text-center">
                        <v-row v-if="!isSaisieEntData">
                            <v-col cols="12" md="8">
                                <v-text-field color="pink" label="Siret*" v-model="entreprise.siret" prepend-inner-icon="mdi-numeric" clearable :rules="rules.numericRules" required />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-btn color="pink" @click="isSaisieEntData = true" outlined>
                                    <v-icon left>mdi-pencil</v-icon>Saisie manuelle
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-row v-else>
                            <v-col cols="12" md="6">
                                <v-text-field color="pink" label="Siret*" v-model="entreprise.siret" prepend-inner-icon="mdi-numeric" clearable :rules="rules.numericRules" required />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field color="pink" label="Siren*" v-model="entreprise.siren" prepend-inner-icon="mdi-numeric" clearable :rules="rules.numericRules" required />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field color="pink" label="Nom*" v-model="entreprise.nom" prepend-inner-icon="mdi-face" clearable :rules="rules.caractereRules" required />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field color="pink" label="Adresse*" v-model="entreprise.adresse" prepend-inner-icon="mdi-face" clearable :rules="rules.champRules" required />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-menu v-model="isDialogDateCreationOpen" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" color="info">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field color="pink" v-model="entreprise.dateCreation" :rules="rules.dateEnRules" required label="Date de création*" prepend-inner-icon="mdi-calendar-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker color="pink" locale="fr" first-day-of-week="1" v-model="entreprise.dateCreation" @input="isDialogDateCreationOpen = false" :rules="rules.dateEnRules" required></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field color="pink" label="Téléphone" v-model="entreprise.telephone" prepend-inner-icon="mdi-numeric" clearable />
                            </v-col>
                            <v-col cols="12" md="5">
                                <v-select color="pink" prepend-inner-icon="mdi-format-list-bulleted-type" v-model="entreprise.etatAdministratif" :items="['Actif', 'Ferme']" label="Etat administratif*" :rules="rules.champRules" required></v-select>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field color="pink" label="Catégorie entreprise*" v-model="entreprise.categorieEntreprise" prepend-inner-icon="mdi-numeric" clearable :rules="rules.champRules" required />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field color="pink" label="Catégorie juridique" v-model="entreprise.categorieJuridique" prepend-inner-icon="mdi-numeric" clearable />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field color="pink" label="Numéro TVA" v-model="entreprise.numeroTvaIntra" prepend-inner-icon="mdi-numeric" clearable />
                            </v-col>
                        </v-row>
                    </div>
                    <small>*Veuillez remplir les champs</small>
                    <v-col cols="12" class="text-right">
                        <v-btn class="mr-3" color="indigo" v-if="isSaisieEntData" text @click="resetForm">Reset</v-btn>
                        <v-btn class="mr-3" color="red" v-if="isSaisieEntData" text @click="isSaisieEntData = false">Retour</v-btn>
                        <v-btn class="mr-3" color="error" text @click="isDialogNewEntreprise = false">Fermer</v-btn>
                        <v-btn color="orange" v-if="!isSaisieEntData" @click="getDataCompagny(entreprise.siret)" text>Rechercher ?</v-btn>
                        <v-btn color="success" v-if="isSaisieEntData" @click="saveNewEntreprise" text>Sauvegarder</v-btn>
                    </v-col>
                </v-col>
            </v-form>
        </v-card>
    </v-dialog>
    <v-dialog v-model="isDialogEditEntreprise" persistent max-width="1000px" overlay-opacity="0.8">
        <v-card class="px-6" outlined>
            <v-form ref="form" v-model="rules.valid" lazy-validation>
                <v-card-title class="pink--text">
                    Modification de l'entreprise
                    <v-icon aria-label="Close" class="ml-auto" @click="isDialogEditEntreprise = false">mdi-close</v-icon>
                </v-card-title>
                <v-col cols="12">
                    <div class="text-center">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field color="pink" label="Nom*" v-model="entrepriseToUpdate.nom" prepend-inner-icon="mdi-face" clearable />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field color="pink" label="Adresse*" v-model="entrepriseToUpdate.adresse" prepend-inner-icon="mdi-face" clearable />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-menu v-model="isDialogDateEditOpen" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" color="info">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field color="pink" v-model="entrepriseToUpdate.dateCreation" label="Date de création*" prepend-inner-icon="mdi-calendar-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker color="pink" locale="fr" first-day-of-week="1" v-model="entrepriseToUpdate.dateCreation" @input="isDialogDateEditOpen = false"></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field color="pink" label="Téléphone" v-model="entrepriseToUpdate.telephone" prepend-inner-icon="mdi-numeric" clearable />
                            </v-col>
                            <v-col cols="12" md="5">
                                <v-select color="pink" prepend-inner-icon="mdi-format-list-bulleted-type" v-model="entrepriseToUpdate.etatAdministratif" :items="['Actif', 'Ferme']" label="Etat administratif*"></v-select>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field color="pink" label="Catégorie entreprise*" v-model="entrepriseToUpdate.categorieEntreprise" prepend-inner-icon="mdi-numeric" clearable />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field color="pink" label="Catégorie juridique" v-model="entrepriseToUpdate.categorieJuridique" prepend-inner-icon="mdi-numeric" clearable />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field color="pink" label="Numéro TVA" v-model="entrepriseToUpdate.numeroTvaIntra" prepend-inner-icon="mdi-numeric" clearable />
                            </v-col>
                        </v-row>
                    </div>
                    <small>*Veuillez remplir les champs</small>
                    <v-col cols="12" class="text-right">
                        <v-btn class="mr-1" color="error" @click="isDialogEditEntreprise = false" text>Fermer</v-btn>
                        <v-btn color="success" @click="saveEditEntreprise(entrepriseToUpdate)" text>Sauvegarder</v-btn>
                    </v-col>
                </v-col>
            </v-form>
        </v-card>
    </v-dialog>
    <v-dialog v-model="isDialogNewUtilisateur" persistent max-width="1000px" overlay-opacity="0.8">
        <v-card class="px-6" outlined>
            <v-form ref="form" v-model="rules.valid" lazy-validation>
                <v-card-title class="pink--text">
                    Ajout Client Prospect
                    <v-icon aria-label="Close" class="ml-auto" @click="isDialogNewUtilisateur = false">mdi-close</v-icon>
                </v-card-title>
                <v-col cols="12">
                    <div class="text-center">
                        <v-divider />
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field color="pink" label="Nom*" v-model.trim="prospect.lastname" prepend-inner-icon="mdi-face" clearable :rules="rules.caractereRules" required />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field color="pink" label="Prénom*" v-model.trim="prospect.firstname" prepend-inner-icon="mdi-face" clearable :rules="rules.caractereRules" required />
                            </v-col>
                        </v-row>
                        <v-row class="mt-n4">
                            <v-col cols="12" md="6">
                                <v-text-field color="pink" label="Email*" v-model.trim="prospect.email" prepend-inner-icon="mdi-email-outline" clearable :rules="rules.emailRules" required />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field color="pink" label="Password*" v-model="prospect.password" prepend-inner-icon="mdi-lock-outline" clearable :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :rules="rules.passwordRules" required />
                            </v-col>
                        </v-row>
                        <v-row class="mt-n4">
                            <v-col cols="12" md="2">
                                <v-select color="pink" prepend-inner-icon="mdi-format-list-bulleted-type" v-model.trim="prospect.civilite" :items="['Homme', 'Femme']" label="Civilité*" :rules="rules.champRules" required></v-select>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-menu v-model="isDialogDateNaissanceOpen" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" color="pink">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field color="pink" v-model="prospect.dateNaissance" :rules="rules.dateEnRules" required label="Date de naissance*" prepend-inner-icon="mdi-calendar-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker color="pink" locale="fr" first-day-of-week="1" v-model="prospect.dateNaissance" @input="isDialogDateNaissanceOpen = false" :rules="rules.dateEnRules" required></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field color="pink" label="Numéro de téléphone" v-model.trim="prospect.portable" prepend-inner-icon="mdi-deskphone" clearable />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-autocomplete v-model="prospect.idEntreprise" :items="entreprises" prepend-inner-icon="mdi-format-list-bulleted-type" color="pink" item-text="nom" item-value="_id" hide-no-data hide-details item-color label="Entreprise" :rules="rules.champRules" required></v-autocomplete>
                            </v-col>
                        </v-row>
                    </div>
                    <small>*Veuillez remplir les champs</small>
                    <v-col cols="12" class="text-right">
                        <v-btn class="mr-1" color="error" text @click.prevent="isDialogNewUtilisateur = false">Fermer</v-btn>
                        <v-btn color="success" text @click.prevent="saveNewUtilisateur">Sauvegarder</v-btn>
                    </v-col>
                </v-col>
            </v-form>
        </v-card>
    </v-dialog>
    <v-dialog v-model="isDialogDisableUtilisateur" width="500" overlay-opacity="0.8">
        <v-card outlined>
            <v-card-title>
                Désactivé le client prospect {{ utilisateurToDisable.firstname }}
                {{ utilisateurToDisable.lastname }} ?
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="isDialogDisableUtilisateur = false" class="mx-2" fab dark>
                    <v-icon dark>mdi-close</v-icon>
                </v-btn>
                <v-btn @click="disableUtilisateur" class="mx-2" fab color="green darken-1">
                    <v-icon dark>mdi-check-bold</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <base-material-card color="pink" icon="mdi-bank" max-width="100%" width="auto" inline class="px-5 py-3 mx-auto">
        <template v-slot:after-heading>
            <div class="display-1 font-weight-light">Prospections</div>
        </template>

        <v-row class="mt-8 mr-1">
            <v-btn color="pink" @click="isDialogNewUtilisateur = true" class="ml-3" :disabled="!isAdmin" dark outlined>
                <v-icon left>mdi-account-plus-outline</v-icon>Ajouter client prospect
            </v-btn>
            <v-btn color="pink" @click="isDialogNewEntreprise = true" class="ml-3" :disabled="!isAdmin" dark outlined>
                <v-icon left>mdi-domain-plus</v-icon>Ajouter une entreprise
            </v-btn>
            <v-btn color="pink" icon @click="getProspectionsData" class="ml-3">
                <v-icon large>mdi-refresh</v-icon>
            </v-btn>
            <v-text-field v-model="search" prepend-icon="mdi-magnify" class="ml-auto" label="Recherche" color="primary" hide-details single-line style="max-width: 250px" clearable />
        </v-row>
        <v-divider class="mt-6" />

        <v-skeleton-loader v-if="isFirstLoad" :loading="isLoading" type="table"></v-skeleton-loader>
        <v-data-table v-else :headers="headers" :items="prospects" :search.sync="search" :sort-by="['lastname']" :sort-desc="[false]" show-expand single-expand item-key="email" :expanded.sync="expanded">
            <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                    <span v-if="item.role.toLowerCase() === 'administrateur'" class="purple--text mr-3 pa-1 mt-1" style="border: solid 1px purple">Admin</span>
                    <v-btn small color="blue" :class="{
                        'ml-0': $vuetify.breakpoint.mdAndUp,
                        'ml-3': $vuetify.breakpoint.smAndDown,
                    }" outlined @click="PageInfosUtilisateur(item, false)">
                        <v-icon left>mdi-card-account-details-outline</v-icon>
                        Informations {{ item.civilite.toLowerCase() === "homme" ? 'M. '+ item.lastname : 'Mme '+ item.lastname }}
                    </v-btn>
                    <v-btn :disabled="!isAdmin || item.role.toLowerCase() === 'administrateur'" small outlined color="orange" @click="PageInfosUtilisateur(item, true)" class="ml-3">
                        <v-icon left>mdi-account-edit-outline</v-icon>
                        Modifier {{ item.civilite.toLowerCase() === "homme" ? 'M. '+ item.lastname : 'Mme '+ item.lastname }}
                    </v-btn>
                    <v-btn :disabled="item.disabled || !isAdmin || item.role.toLowerCase() === 'administrateur'" small outlined color="red" @click="dialogDeleteUtilisateur(item)" class="ml-3">
                        <v-icon left>mdi-account-remove-outline</v-icon>
                        Désactiver {{ item.civilite.toLowerCase() === "homme" ? 'M. '+ item.lastname : 'Mme '+ item.lastname }}
                    </v-btn>
                    <v-btn :disabled="item.disabled || !isAdmin || item.role.toLowerCase() === 'administrateur'" small outlined @click="dialogUpdateEntreprise(item.idEntreprise)" class="ml-3">
                        <v-icon left>mdi-pencil-outline</v-icon>
                        Modifier entreprise
                    </v-btn>
                    <v-btn color="pink" @click="dialogNewDevis(item)" class="ml-3" :disabled="!isAdmin" dark small outlined>
                        <v-icon left>mdi-bank-plus</v-icon>Créer un devis
                    </v-btn>
                </td>
            </template>
            <template v-slot:[`item.createdAt`]="{ item }"> {{ item.createdAt | moment("YYYY-MM-DD HH:mm") }} </template>
            <template v-slot:[`item.lastLogin`]="{ item }"> {{ item.lastLogin | moment("YYYY-MM-DD HH:mm") }} </template>
            <template v-slot:[`item.checked`]="{ item }">
                <v-icon color="success" v-if="item.checked">mdi-checkbox-marked-circle-outline</v-icon>
                <v-icon color="error" v-else>mdi-close-circle-outline</v-icon>
            </template>
            <template v-slot:[`item.disabled`]="{ item }">
                <v-icon color="error" v-if="item.disabled">mdi-close-circle-outline</v-icon>
                <v-icon color="success" v-else>mdi-checkbox-marked-circle-outline</v-icon>
            </template>
            <div slot="no-results" :value="true" icon="warning" class="error--text">
                La recherche "{{ search }}" est inconnu.
            </div>
        </v-data-table>
    </base-material-card>
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
    name: 'Prospections',
    mixins: [Gestion],
    props: {},
    components: {},
    //data: () => ({}),
    data(): any {
        return {
            isDialogNewUtilisateur: false as boolean,
            isDialogDateNaissanceOpen: false as boolean,
            isDialogDisableUtilisateur: false as boolean,
            utilisateurToDisable: [] as Array < any > ,
            prospect: {
                email: "",
                password: "",
                lastname: "",
                firstname: "",
                dateNaissance: "", //new Date().toISOString().substr(0, 10)
                civilite: "",
                portable: "",
                isAdmin: false,
                role: "Commercial",
                idEntreprise: ""
            },
            search: undefined as string | null | undefined,
            expanded: [] as Array < any > ,
            headers: [{
                    text: "Nom",
                    value: "lastname",
                },
                {
                    text: "Prénom",
                    value: "firstname",
                },
                {
                    text: "Email",
                    value: "email",
                }, {
                    sortable: false,
                    text: "Checked",
                    value: "checked",
                }, {
                    sortable: false,
                    text: "Actif",
                    value: "disabled",
                },
            ] as Array < any > ,
            prospects: [] as Array < any > ,
            isDialogNewEntreprise: false as boolean,
            isDialogEditEntreprise: false as boolean,
            entreprises: [] as Array < any > ,
            entreprise: {
                siret: '',
                nom: '',
                adresse: '',
                telephone: '',
                siren: '',
                categorieEntreprise: '',
                categorieJuridique: '',
                dateCreation: '',
                etatAdministratif: '',
                numeroTvaIntra: '',
            },
            entrepriseToUpdate: {
                //siret: '',
                nom: '',
                adresse: '',
                telephone: '',
                //siren: '',
                categorieEntreprise: '',
                categorieJuridique: '',
                dateCreation: '',
                etatAdministratif: '',
                numeroTvaIntra: '',
            },
            isSaisieEntData: false as boolean,
            isNotFound: false as boolean,
            isDialogDateCreationOpen: false as boolean,
            isDialogDateEditOpen: false as boolean,
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
        await this.getProspectionsData();
    },
    methods: {
        getProspectionsData: async function (): Promise < void > {
            //https://jsonplaceholder.typicode.com/users
            this.isLoading = true;
            this.isFirstLoad = true;
            let ttPromise: any[] = []
            ttPromise.push(axiosApi.get("/user/all/Prospect")) //tous les clients prospects
            ttPromise.push(axiosApi.get("/entreprises")) //tous les entreprises
            ttPromise.push(axiosApi.get("/product/all")) //tous les entreprises
            Promise.all(ttPromise)
            .then((response: AxiosResponse[]) => {
                this.prospects = response[0].data.users;
                this.entreprises = response[1].data.entreprises;
                this.products = response[2].data.products;
                for (let i = 0; i < this.prospects.length; i++) {
                    this.prospects[i].isAdmin = this.prospects[i].role.toLowerCase() === "administrateur" ? true : false
                }
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
        dialogNewDevis: function (item: any){        
            this.isLoading = true;
            this.isFirstLoad = true;
            let randomProductNum: number = this.randNumber(0 ,this.products.length - 1)
            let payload = {
                idProduct: this.products[randomProductNum]._id,
                matiere: this.products[randomProductNum].matieres[this.randNumber(0 ,this.products[randomProductNum].matieres.length - 1)],
                couleur: this.products[randomProductNum].couleurs[this.randNumber(0 ,this.products[randomProductNum].couleurs.length - 1)],
                quantite: 1,
            }
            axiosApi
                .post("/devis/add/" + item._id, qs.stringify(payload)) //generate devis
                .then((response: AxiosResponse) => {
                    Object.assign(this.$data, this.$options.data()); //reset data
                    this.successMessage("Le devis a bien été créer !");
                    setTimeout(() => {
                        this.getProspectionsData();
                    }, 1000);
                })
                .catch((error) => {
                    this.catchAxios(error)
                    setTimeout(() => {
                        this.isOverlay = false;
                    }, 1000);
                });
        },
        randNumber : function(min: number, max: number): number {
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        getDataCompagny: function (siret: string = '') {
            if (siret === '') return this.errorMessage("Le SIRET ne peut pas être vide !");
            if (siret.length !== 14) return this.errorMessage("Le SIRET doit contenir 14 chiffres !")
            if (siret.match(/^[0-9]*$/gm) == null) return this.errorMessage("Le SIRET doit contenir seulement des chiffres !")

            axiosApi
                .get('https://entreprise.data.gouv.fr/api/sirene/v3/etablissements/' + siret)
                .then(({
                    data: response
                }: AxiosResponse) => {
                    if (response !== undefined || response !== null) {
                        this.entreprise.siret = siret
                        this.entreprise.nom = response.etablissement.unite_legale.denomination === undefined ? '' : response.etablissement.unite_legale.denomination
                        this.entreprise.adresse = response.etablissement.geo_adresse === undefined ? '' : response.etablissement.geo_adresse
                        this.entreprise.telephone = null;
                        this.entreprise.siren = response.etablissement.siren === undefined ? '' : response.etablissement.siren
                        this.entreprise.categorieEntreprise = response.etablissement.unite_legale.categorie_entreprise === undefined ? '' : response.etablissement.unite_legale.categorie_entreprise
                        this.entreprise.categorieJuridique = response.etablissement.unite_legale.categorie_juridique === undefined ? '' : response.etablissement.unite_legale.categorie_juridique
                        this.entreprise.dateCreation = response.etablissement.unite_legale.date_creation === undefined ? '' : response.etablissement.unite_legale.date_creation
                        this.entreprise.etatAdministratif = response.etablissement.unite_legale.etat_administratif === undefined ? '' : response.etablissement.unite_legale.etat_administratif.toLowerCase() === 'a' ? 'Actif' : 'Ferme'
                        this.entreprise.numeroTvaIntra = response.etablissement.unite_legale.numero_tva_intra === undefined ? '' : response.etablissement.unite_legale.numero_tva_intra
                        this.isSaisieEntData = true;
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.errorMessage("Le SIRET est introuvable ou inconnu, réessayer !");
                });
            //.finally(() => {});
        },
        saveNewEntreprise: async function (): Promise < void > {
            if (!this.$refs.form.validate()) return this.errorMessage("Veuillez vérifier les champs !");

            axiosApi.post("/entreprise", qs.stringify(this.entreprise))
            .then((response) => {
                Object.assign(this.$data, this.$options.data()); //reset data
                this.$refs.form.reset();
                this.successMessage("L'entreprise a bien été ajouté !");
                setTimeout(() => {
                    this.getProspectionsData();
                }, 1000);
            })
            .catch((error) => {
                this.catchAxios(error)
            });
        },
        saveNewUtilisateur: function (): void {
            if (!this.$refs.form.validate()) return this.errorMessage("Veuillez vérifier les champs !");

            this.prospect.role = this.prospect.isAdmin === true ? 'Administrateur' : 'Prospect'
            axiosApi.post("/register", qs.stringify(this.prospect))
                .then((response) => {
                    Object.assign(this.$data, this.$options.data()); //reset data
                    this.$refs.form.reset();
                    this.successMessage("Le client prospect a bien été ajouté !");
                    setTimeout(() => {
                        this.getProspectionsData();
                    }, 1000);
                })
                .catch((error) => {
                    this.catchAxios(error)
                });
        },
        dialogUpdateEntreprise: function (item: any): void {
            this.isDialogEditEntreprise = true;
            this.entrepriseToUpdate = item;
        },
        saveEditEntreprise: function (entrepriseToUpdate: any): void {
            let payload = {
                nom: entrepriseToUpdate.nom,
                adresse: entrepriseToUpdate.adresse,
                telephone: entrepriseToUpdate.telephone,
                categorieEntreprise: entrepriseToUpdate.categorieEntreprise,
                categorieJuridique: entrepriseToUpdate.categorieJuridique,
                dateCreation: entrepriseToUpdate.dateCreation,
                etatAdministratif: entrepriseToUpdate.etatAdministratif,
                numeroTvaIntra: entrepriseToUpdate.numeroTvaIntra,
            }
            axiosApi
                .put("/entreprise/" + entrepriseToUpdate._id, qs.stringify(payload)) //update entreprise
                .then((response: AxiosResponse) => {
                    if (response.data.error == false) {
                        Object.assign(this.$data, this.$options.data()); //reset data
                        this.$refs.form.reset();
                        this.successMessage("Sauvegarde des modifications effectuée !");
                        setTimeout(() => {
                            this.getProspectionsData();
                        }, 1000);
                    }
                })
                .catch((error: any) => {
                    this.catchAxios(error)
                });
        },
        disableUtilisateur: function (): void {
            this.isDialogDisableUtilisateur = false;
            axiosApi
                .put("/user/disable/" + this.utilisateurToDisable._id)
                .then((response) => {
                    console.log(response.data.message)
                    const utilisateurFirstname = this.utilisateurToDisable.firstname;
                    const utilisateurLastname = this.utilisateurToDisable.lastname;
                    Object.assign(this.$data, this.$options.data()); //reset data
                    //this.$refs.form.reset();
                    this.successMessage(`Le client prospect ${utilisateurFirstname} ${utilisateurLastname} a été désactivé avec succès`);
                    setTimeout(() => {
                        this.getProspectionsData();
                    }, 1000);
                })
                .catch((error) => {
                    this.catchAxios(error)
                });
        },
        dialogDeleteUtilisateur: function (infosProspect: Record < string, any > ) {
            this.isDialogDisableUtilisateur = true;
            this.utilisateurToDisable = infosProspect;
        },
        PageInfosUtilisateur: function (infosProspect: Record < string, any > , isEdit: boolean) {
            this.$router.push({
                name: "Informations-Prospection",
                params: {
                    isEdit: isEdit,
                    idProspect: infosProspect._id,
                },
            });
        },
        resetForm: function () {
            this.entreprise = {
                siret: '',
                nom: '',
                adresse: '',
                telephone: '',
                siren: '',
                categorieEntreprise: '',
                categorieJuridique: '',
                dateCreation: '',
                etatAdministratif: '',
                numeroTvaIntra: '',
            }
        }
    }
});
</script>

<style></style>

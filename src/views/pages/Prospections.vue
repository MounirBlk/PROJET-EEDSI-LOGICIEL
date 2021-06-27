<template>
<v-container id="prospections" tag="section" fluid>
    <v-dialog v-model="isDialogEntreprise" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar tile dark color="pink darken-2">
                <v-btn icon dark @click="isDialogEntreprise = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Gestion des entreprises</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn dark text @click="isDialogEntreprise = false">
                        Fermer
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <v-container>
                <v-row no-gutters class="mb-10">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn :disabled="isProgress" color="pink darken-2" text v-bind="attrs" v-on="on" @click="getProspectionsData" class="mt-4 ml-3">
                                <v-icon large>mdi-refresh</v-icon>
                            </v-btn>
                        </template>
                        <span>Refresh</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-badge :color="!isEditEntreprise ? 'red' : 'green'" class="mt-4 ml-3" overlap :content="!isEditEntreprise ? 'Désactivé' : 'Activé'">
                                <v-btn :disabled="isProgress" v-bind="attrs" v-on="on" text color="orange" @click="isEditEntreprise = !isEditEntreprise">
                                    <v-icon :color="!isEditEntreprise ? 'orange' : 'orange darken-2'" large>mdi-square-edit-outline</v-icon>
                                </v-btn>
                            </v-badge>
                        </template>
                        <span>Mode modification</span>
                    </v-tooltip>
                    <v-text-field v-model="searchEnt" class="ml-auto" prepend-icon="mdi-magnify" label="Recherche" color="pink" hide-details single-line style="max-width: 250px" clearable />
                </v-row>
                <v-skeleton-loader v-if="isFirstLoad" :loading="isLoading" type="table"></v-skeleton-loader>
                <v-data-table v-else :headers="headersEntreprises" :items="entreprises" :search.sync="searchEnt" :sort-by="['nom']" :sort-desc="[false]" show-expand single-expand item-key="siret" :expanded.sync="expandedEnt">
                    <template v-slot:expanded-item="{ headers, item }">
                        <td :colspan="headers.length">
                            <v-row class="my-2">
                                <v-col cols="12" md="3">
                                    <v-text-field color="pink darken-2" disabled label="Siren" v-model="item.siren" prepend-inner-icon="mdi-numeric" clearable />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field color="pink darken-2" :disabled="!isEditEntreprise" label="Nom" v-model="item.nom" prepend-inner-icon="mdi-alphabetical" clearable />
                                </v-col>
                                <v-col cols="12" md="5">
                                    <v-text-field color="pink darken-2" :disabled="!isEditEntreprise" label="Adresse" v-model="item.adresse" prepend-inner-icon="mdi-alphabetical" clearable />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-menu v-model="isDialogDateCreationOpen" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" color="info">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field color="pink darken-2" :disabled="!isEditEntreprise" v-model="item.dateCreation" label="Date de création" prepend-inner-icon="mdi-calendar-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker color="pink darken-2" locale="fr" first-day-of-week="1" v-model="item.dateCreation" @input="isDialogDateCreationOpen = false"></v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field color="pink darken-2" :disabled="!isEditEntreprise" label="Téléphone" v-model="item.telephone" prepend-inner-icon="mdi-numeric" clearable />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-select color="pink darken-2" :disabled="!isEditEntreprise" label="Etat administratif" prepend-inner-icon="mdi-format-list-bulleted-type" v-model="item.etatAdministratif" :items="['Actif', 'Ferme']"></v-select>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-select color="pink darken-2" :disabled="!isEditEntreprise" label="Catégorie entreprise" :items='["GE", "ETI", "PME", "MIC", "AUTRES"]' v-model="item.categorieEntreprise" prepend-inner-icon="mdi-numeric" clearable />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field color="pink darken-2" :disabled="!isEditEntreprise" label="Catégorie juridique" v-model="item.categorieJuridique" prepend-inner-icon="mdi-numeric" clearable />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field color="pink darken-2" :disabled="!isEditEntreprise" label="Numéro TVA" v-model="item.numeroTvaIntra" prepend-inner-icon="mdi-numeric" clearable />
                                </v-col>
                                <v-col cols="12" class="d-flex justify-end pt-0" v-if="isEditEntreprise">
                                    <v-btn color="error" small @click="deleteEntreprise(item._id)" outlined>
                                        <v-icon small color="error" left>mdi-trash-can-outline</v-icon> Supprimer
                                    </v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn color="success" small @click="saveEditEntreprise(item)" outlined>
                                        <v-icon small color="success" left>mdi-content-save-outline</v-icon> Sauvegarder
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </td>
                    </template>
                    <template v-slot:[`item.categorieEntreprise`]="{ item }">
                        <v-chip ripple dark color="red" v-if="item.categorieEntreprise.toLowerCase() === 'autres' || item.categorieEntreprise === 'null' || item.categorieEntreprise === null || item.categorieEntreprise === undefined">
                            <v-icon>mdi-close-circle-outline</v-icon>
                        </v-chip>
                        <v-chip ripple dark color="indigo" v-else>{{ item.categorieEntreprise }}</v-chip>
                    </template>
                    <template v-slot:[`item.createdAt`]="{ item }"> {{ item.createdAt | moment("YYYY-MM-DD HH:mm") }} </template>
                    <template v-slot:[`item.updateAt`]="{ item }"> {{ item.updateAt | moment("YYYY-MM-DD HH:mm") }} </template>
                    <template v-slot:[`item.etatAdministratif`]="{ item }">
                        <v-icon color="error" v-if="item.etatAdministratif !== 'Actif'">mdi-close-circle-outline</v-icon>
                        <v-icon color="success" v-else>mdi-checkbox-marked-circle-outline</v-icon>
                    </template>
                    <template v-slot:[`item.dateCreation`]="{ item }">
                        <span v-if="item.dateCreation">{{ item.dateCreation }}</span>
                        <v-icon color="error" v-else>mdi-close-circle-outline</v-icon>
                    </template>
                    <span slot="no-results" :value="true" icon="warning" class="error--text">
                        La recherche "{{ searchEnt }}" est inconnu.
                    </span>
                </v-data-table>
            </v-container>
        </v-card>
    </v-dialog>
    <v-dialog persistent v-model="isDialogDocOptions" width="700" overlay-opacity="0.8">
        <v-card outlined>
            <v-toolbar dense color="pink darken-2" dark>
                <v-icon left>mdi-cog-outline</v-icon>
                Options formatage de document
            </v-toolbar>
            <v-card-text>
                <v-container>
                    <v-row no-gutters>
                        <v-col cols="12" md="12" class="mt-2">
                            <v-badge v-if="isEditOptions" :value="isHoverCheckboxChecked" class="mr-10 mt-0 pa-0" color="deep-purple accent-4" content="Seuls les prospects vérifié recevront un mail" right overlap transition="slide-x-transition">
                                <v-hover v-model="isHoverCheckboxChecked">
                                    <v-checkbox @change="activeProspectsSelected(optionsDoc.isCheckedProspect)" color="pink darken-2" v-model="optionsDoc.isCheckedProspect" :disabled="!isEditOptions" dense label="Checked prospect"></v-checkbox>
                                </v-hover>
                            </v-badge>
                            <div v-else class="mb-3">
                                <v-icon left v-if="optionsDoc.isCheckedProspect" color="success">mdi-checkbox-marked-circle-outline</v-icon>
                                <v-icon left v-if="!optionsDoc.isCheckedProspect" color="error">mdi-close-circle-outline</v-icon>
                                <span>Checked prospect</span>
                            </div>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-checkbox v-if="isEditOptions" class="ma-0 pa-0" color="pink darken-2" v-model="optionsDoc.isCgv" dense label="CGV"></v-checkbox>
                            <div v-else class="mb-3">
                                <v-icon left v-if="optionsDoc.isCgv" color="success">mdi-checkbox-marked-circle-outline</v-icon>
                                <v-icon left v-if="!optionsDoc.isCgv" color="error">mdi-close-circle-outline</v-icon>
                                <span>CGV</span>
                            </div>
                        </v-col>
                        <v-col cols="12" md="5">
                            <v-checkbox v-if="isEditOptions" class="ma-0 pa-0" color="pink darken-2" v-model="optionsDoc.isAdminCommercial" dense label="Admins/Commerciaux"></v-checkbox>
                            <div v-else class="mb-3">
                                <v-icon left v-if="optionsDoc.isAdminCommercial" color="success">mdi-checkbox-marked-circle-outline</v-icon>
                                <v-icon left v-if="!optionsDoc.isAdminCommercial" color="error">mdi-close-circle-outline</v-icon>
                                <span>Admins/Commerciaux</span>
                            </div>
                        </v-col>
                        <v-col cols="12" md="7">
                            <v-select v-if="isEditOptions && optionsDoc.isAdminCommercial" class="pa-0 ma-0" label="Sélectionner" small-chips chips counter item-text="email" item-value="email" deletable-chips disable-lookup multiple :items='administrateurs' color="pink darken-2" v-model="optionsDoc.emailAdminCommercial" prepend-icon="mdi-format-list-checkbox">
                                <template v-slot:selection="{ item, index }">
                                    <v-chip dark small v-if="index === 0">
                                        <span>{{ item.email }}</span>
                                    </v-chip>
                                    <span v-if="index === 1" class="pink--text caption">
                                        (+{{ optionsDoc.emailAdminCommercial.length - 1 }} autre(s))
                                    </span>
                                </template>
                            </v-select>
                        </v-col>
                        <v-col cols="12" md="5">
                            <v-checkbox v-if="isEditOptions" class="ma-0 pa-0" color="pink darken-2" v-model="optionsDoc.isUser" dense label="Autre destinataire"></v-checkbox>
                            <div v-else class="mb-3">
                                <v-icon left v-if="optionsDoc.isUser" color="success">mdi-checkbox-marked-circle-outline</v-icon>
                                <v-icon left v-if="!optionsDoc.isUser" color="error">mdi-close-circle-outline</v-icon>
                                <span>Autre destinataire</span>
                            </div>
                        </v-col>
                        <v-col cols="12" md="7">
                            <v-text-field v-if="isEditOptions && optionsDoc.isUser" class="pa-0 ma-0" color="pink darken-2" label="Email" v-model.trim="optionsDoc.emailUser" prepend-icon="mdi-email-plus-outline" clearable />
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-checkbox v-if="isEditOptions" class="ma-0 pa-0" color="pink darken-2" v-model="optionsDoc.isDownload" dense label="Téléchargement"></v-checkbox>
                            <div v-else class="mb-3">
                                <v-icon left v-if="optionsDoc.isDownload" color="success">mdi-checkbox-marked-circle-outline</v-icon>
                                <v-icon left v-if="!optionsDoc.isDownload" color="error">mdi-close-circle-outline</v-icon>
                                <span>Téléchargement</span>
                            </div>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn @click="isEditOptions = !isEditOptions" class="mx-1" :color="!isEditOptions ? 'orange' : 'success'" icon outlined dark>
                    <v-icon dark v-if="!isEditOptions">mdi-pencil-outline</v-icon>
                    <v-icon dark v-else>mdi-pencil-off-outline</v-icon>
                </v-btn>
                <v-btn v-if="!isEditOptions" @click="isDialogDocOptions = false" class="mx-1" icon outlined color="green darken-1">
                    <v-icon dark>mdi-check-bold</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="isDialogConfigurator" width="auto" overlay-opacity="0.8">
        <v-card>
            <v-toolbar tile dark color="pink darken-2">
                <v-toolbar-title>Configurateur d'articles</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn dark color="success lighten-1" text @click="saveConfiguratorArticles">
                        Sauvegarder les articles
                    </v-btn>
                </v-toolbar-items>
                <v-btn icon dark @click="isDialogConfigurator = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <div class="mx-15 mt-5">
                <sequential-entrance delay="250" fromRight>
                    <v-row v-for="(product, i) in products" :key="i" class="mt-0">
                        <v-col cols="12" md="12">
                            <v-row class="mt-0">
                                <v-col cols="12" md="2">
                                    <v-img v-if="product.imgLink !== null" :src="product.imgLink" height="80" width="120" aspect-ratio="1" class="grey lighten-2">
                                        <template v-slot:placeholder>
                                            <v-row class="fill-height ma-0" align="center" justify="center"> </v-row>
                                        </template>
                                    </v-img>
                                    <v-img v-else height="80" width="120" :src="require('@/assets/ecommerce_logo.png')" aspect-ratio="1" class="grey lighten-2">
                                        <template v-slot:placeholder>
                                            <v-row class="fill-height ma-0" align="center" justify="center"> </v-row>
                                        </template>
                                    </v-img>
                                </v-col>
                                <v-col cols="12" md="2" align-self="center">
                                    <span v-if="productsConfigurator[i].saved" class="success--text">{{ product.nom }}</span>
                                    <span v-else>{{ product.nom }}</span>
                                </v-col>
                                <v-col cols="12" md="2" align-self="center">
                                    <v-select label="Couleur" :disabled="productsConfigurator[i].saved" v-model="productsConfigurator[i].couleur" small-chips chips deletable-chips disable-lookup :items="product.couleurs" color="success darken-2" prepend-inner-icon="mdi-format-list-checkbox"></v-select>
                                </v-col>
                                <v-col cols="12" md="2" align-self="center">
                                    <v-select label="Matière" :disabled="productsConfigurator[i].saved" v-model="productsConfigurator[i].matiere" small-chips chips deletable-chips disable-lookup :items="product.matieres" color="success darken-2" prepend-inner-icon="mdi-format-list-checkbox"></v-select>
                                </v-col>
                                <v-col cols="12" md="2" align-self="center">
                                    <v-text-field type="number" label="Quantité" :disabled="productsConfigurator[i].saved" v-model="productsConfigurator[i].quantite" color="success darken-2" prepend-inner-icon="mdi-numeric" clearable></v-text-field>
                                </v-col>
                                <v-col cols="12" md="2" align-self="center">
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-switch @change="saveProduct(productsConfigurator[i], i)" color="success darken-2" v-model="productsConfigurator[i].saved" dense label="Sauvegarder produit"></v-switch>
                                        </template>
                                        <span>Sauvegarder pour la liste d'articles</span>
                                    </v-tooltip>
                                </v-col>
                            </v-row>
                            <v-expansion-panels focusable class="mt-2">
                                <v-expansion-panel v-for="(composant, j) in product.composants" :key="j">
                                    <v-expansion-panel-header class="indigo--text">Composants</v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <v-row class="mt-0">
                                            <v-col cols="12" md="2">
                                                <v-img v-if="composant.imgLink !== null" :src="composant.imgLink" height="80" width="120" aspect-ratio="1" class="grey lighten-2">
                                                    <template v-slot:placeholder>
                                                        <v-row class="fill-height ma-0" align="center" justify="center"> </v-row>
                                                    </template>
                                                </v-img>
                                                <v-img v-else height="80" width="120" :src="require('@/assets/ecommerce_logo.png')" aspect-ratio="1" class="grey lighten-2">
                                                    <template v-slot:placeholder>
                                                        <v-row class="fill-height ma-0" align="center" justify="center"> </v-row>
                                                    </template>
                                                </v-img>
                                            </v-col>
                                            <v-col cols="12" md="2" align-self="center">
                                                <span v-if="productsConfigurator[i].listeComposantsSelected[j].saved" class="indigo--text">{{ composant.nom }}</span>
                                                <span v-else>{{ composant.nom }}</span>
                                            </v-col>
                                            <v-col cols="12" md="2" align-self="center">
                                                <v-select label="Couleur" :disabled="productsConfigurator[i].listeComposantsSelected[j].saved" v-model="productsConfigurator[i].listeComposantsSelected[j].couleur" small-chips chips deletable-chips disable-lookup :items="composant.couleurs" color="indigo darken-2" prepend-inner-icon="mdi-format-list-checkbox"></v-select>
                                            </v-col>
                                            <v-col cols="12" md="2" align-self="center">
                                                <v-select label="Matière" :disabled="productsConfigurator[i].listeComposantsSelected[j].saved" v-model="productsConfigurator[i].listeComposantsSelected[j].matiere" small-chips chips deletable-chips disable-lookup :items="composant.matieres" color="indigo darken-2" prepend-inner-icon="mdi-format-list-checkbox"></v-select>
                                            </v-col>
                                            <v-col cols="12" md="2" align-self="center">
                                                <v-text-field type="number" label="Quantité" :disabled="productsConfigurator[i].listeComposantsSelected[j].saved" v-model="productsConfigurator[i].listeComposantsSelected[j].quantite" color="indigo darken-2" prepend-inner-icon="mdi-numeric" clearable></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="2" align-self="center">
                                                <v-tooltip top>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-switch @change="saveComposant(productsConfigurator[i].listeComposantsSelected[j], i, j)" color="indigo darken-2" v-model="productsConfigurator[i].listeComposantsSelected[j].saved" dense label="Sauvegarder composant"></v-switch>
                                                    </template>
                                                    <span>Sauvegarder du composant pour le produit</span>
                                                </v-tooltip>
                                            </v-col>
                                        </v-row>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>
                            <v-divider class="my-5"></v-divider>
                        </v-col>
                    </v-row>
                </sequential-entrance>
            </div>
        </v-card>
    </v-dialog>
    <v-dialog v-model="isDialogNewEntreprise" persistent max-width="1000px" overlay-opacity="0.8">
        <v-card class="px-6" outlined>
            <v-form ref="form" v-model="rules.valid" lazy-validation>
                <v-card-title class="pink--text">
                    Ajout d'une nouvelle entreprise
                    <v-icon aria-label="Close" class="ml-auto" @click="isDialogNewEntreprise = false">mdi-close</v-icon>
                </v-card-title>
                <v-col cols="12">
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
                            <v-text-field color="pink" label="Nom*" v-model="entreprise.nom" prepend-inner-icon="mdi-alphabetical" clearable :rules="rules.caractereRules" required />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field color="pink" label="Adresse*" v-model="entreprise.adresse" prepend-inner-icon="mdi-alphabetical" clearable :rules="rules.champRules" required />
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-menu v-model="isDialogDateCreationOpen" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" color="info">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field color="pink" v-model="entreprise.dateCreation" label="Date de création*" prepend-inner-icon="mdi-calendar-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                                </template>
                                <v-date-picker color="pink" locale="fr" first-day-of-week="1" v-model="entreprise.dateCreation" @input="isDialogDateCreationOpen = false"></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-text-field color="pink" label="Téléphone" v-model="entreprise.telephone" prepend-inner-icon="mdi-numeric" clearable />
                        </v-col>
                        <v-col cols="12" md="5">
                            <v-select color="pink" prepend-inner-icon="mdi-format-list-bulleted-type" v-model="entreprise.etatAdministratif" :items="['Actif', 'Ferme']" label="Etat administratif*" :rules="rules.champRules" required></v-select>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-select color="pink" label="Catégorie entreprise*" :items='["GE", "ETI", "PME", "MIC", "AUTRES"]' v-model="entreprise.categorieEntreprise" prepend-inner-icon="mdi-format-list-bulleted-type" clearable :rules="rules.champRules" required />
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field color="pink" label="Catégorie juridique" v-model="entreprise.categorieJuridique" prepend-inner-icon="mdi-numeric" clearable />
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field color="pink" label="Numéro TVA" v-model="entreprise.numeroTvaIntra" prepend-inner-icon="mdi-numeric" clearable />
                        </v-col>
                    </v-row>
                    <small class="font-italic font-weight-light">*Champs obligatoires</small>
                    <v-col cols="12" class="text-right">
                        <v-btn class="mr-3" color="red" v-if="isSaisieEntData" text @click="isSaisieEntData = false">Retour</v-btn>
                        <v-btn class="mr-3" color="indigo" v-if="isSaisieEntData" text @click="resetForm">Reset</v-btn>
                        <v-btn class="mr-3" color="error" text @click="isDialogNewEntreprise = false">Fermer</v-btn>
                        <v-btn color="orange" v-if="!isSaisieEntData" @click="getDataCompagny(entreprise.siret)" text>Rechercher</v-btn>
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
                            <v-col cols="12" md="4">
                                <v-text-field color="pink" label="Téléphone" v-model="entrepriseToUpdate.telephone" prepend-inner-icon="mdi-numeric" clearable />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-select color="pink" prepend-inner-icon="mdi-format-list-bulleted-type" v-model="entrepriseToUpdate.etatAdministratif" :items="['Actif', 'Ferme']" label="Etat administratif*"></v-select>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-select color="pink" label="Catégorie entreprise*" :items='["GE", "ETI", "PME", "MIC", "AUTRES"]' v-model="entrepriseToUpdate.categorieEntreprise" prepend-inner-icon="mdi-numeric" clearable />
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
                Désactiver le client prospect {{ utilisateurToDisable.firstname }}
                {{ utilisateurToDisable.lastname }} ?
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="isDialogDisableUtilisateur = false" class="mx-2" icon outlined color="red" dark>
                    <v-icon dark>mdi-close</v-icon>
                </v-btn>
                <v-btn @click="disableUtilisateur" class="mx-2" icon outlined color="green darken-1">
                    <v-icon dark>mdi-check-bold</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <base-material-card color="pink" icon="mdi-bank" max-width="100%" width="auto" inline class="px-5 py-3 mx-auto">
        <template v-slot:after-heading>
            <div class="display-1 font-weight-light">Prospections</div>
        </template>
        <v-row class="mt-8 mr-1" no-gutters>
            <v-col cols="12" md="12" class="mb-3">
                <v-btn color="pink" @click="isDialogNewUtilisateur = true" class="ml-3" :disabled="isProgress || !isAdmin || isFirstLoad || isLoading" outlined>
                    <v-icon left>mdi-account-plus-outline</v-icon>Ajouter client prospect
                </v-btn>
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn :disabled="isProgress || isFirstLoad || isLoading" color="pink" icon v-bind="attrs" v-on="on" @click="getProspectionsData" class="ml-3">
                            <v-icon large>mdi-refresh</v-icon>
                        </v-btn>
                    </template>
                    <span>Refresh</span>
                </v-tooltip>
            </v-col>
            <v-speed-dial v-model="isEntrepriseSpeedDial" class="ml-3 mb-3" direction="right" open-on-hover transition="scale">
                <template v-slot:activator>
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn v-if="isAdmin" v-model="isEntrepriseSpeedDial" :disabled="isProgress || isFirstLoad || isLoading" v-bind="attrs" v-on="on" outlined color="pink" dark icon>
                                <v-icon v-if="isEntrepriseSpeedDial">
                                    mdi-close
                                </v-icon>
                                <v-icon v-else>
                                    mdi-domain
                                </v-icon>
                            </v-btn>
                        </template>
                        <span>Entreprise</span>
                    </v-tooltip>
                </template>
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn :disabled="isProgress || isFirstLoad || isLoading" icon outlined dark @click="isDialogNewEntreprise = true" color="indigo" v-bind="attrs" v-on="on">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </template>
                    <span>Ajouter une entreprise</span>
                </v-tooltip>
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn :disabled="isProgress || isFirstLoad || isLoading" icon outlined dark color="green" @click.prevent="isDialogEntreprise = true" v-bind="attrs" v-on="on">
                            <v-icon>mdi-cog-outline</v-icon>
                        </v-btn>
                    </template>
                    <span>Gestion des entreprises</span>
                </v-tooltip>
            </v-speed-dial>
        </v-row>
        <v-row no-gutters v-if="isProgress">
            <v-col cols="12" md="12">
                <v-progress-linear dark striped color="indigo" v-model="valueTraitement" height="20">
                    <strong>{{ Math.ceil(valueTraitement) > 100 ? 100 : Math.ceil(valueTraitement) }}%</strong>
                </v-progress-linear>
            </v-col>
        </v-row>
        <v-divider />
        <v-skeleton-loader v-if="isFirstLoad" :loading="isLoading" type="table"></v-skeleton-loader>
        <v-data-table v-else v-model="prospectsSelected" @toggle-select-all="selectAllToggle" show-select :headers="headersProspects" :items="prospects" :search.sync="search" :sort-by="['lastname']" :sort-desc="[false]" show-expand single-expand item-key="email" :expanded.sync="expanded">
            <template v-slot:top>
                <v-divider></v-divider>
                <v-row class="py-3">
                    <v-badge class="my-3 ml-3 mr-5" :color="optionsDoc.isCheckedProspect ? 'success darken-1' : 'indigo'" overlap :content="!optionsDoc.isCheckedProspect ? prospectsSelected.length === 0 ? '0' : prospectsSelected.length : availableCheckedProspectsNum === 0 ? '0' : availableCheckedProspectsNum">
                        <v-btn color="pink darken-2" :disabled="isProgress || prospectsSelected.length < 1" @click="generateDevis(prospectsSelected)" text outlined>
                            <v-icon left>mdi-file-document-multiple-outline</v-icon>Génération de devis
                        </v-btn>
                    </v-badge>
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn :disabled="isProgress" class="my-3 ml-3 mr-5" color="pink darken-2" v-bind="attrs" v-on="on" icon @click="isDialogDocOptions = true;" outlined text>
                                <v-icon>mdi-cogs</v-icon>
                            </v-btn>
                        </template>
                        <span>Options document</span>
                    </v-tooltip>
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-badge class="my-3 mr-5" color="indigo" dot>
                                <v-btn color="pink darken-2" v-bind="attrs" v-on="on" icon to="/produits" outlined text>
                                    <v-icon>mdi-sofa</v-icon>
                                </v-btn>
                            </v-badge>
                        </template>
                        <span>Page produits</span>
                    </v-tooltip>
                    <v-switch color="pink darken-2" :disabled="isProgress" class="mr-5" v-model="isRandomArticles" dense label="Articles aléatoire"></v-switch>
                    <v-fade-transition>
                        <v-badge class="my-3 ml-3" v-if="!isRandomArticles" color="indigo" overlap :content="articles.length === 0 ? '0' : articles.length">
                            <v-btn :disabled="isProgress" color="pink darken-2" @click="isDialogConfigurator = true" text outlined>
                                <v-icon left>mdi-cog-transfer-outline</v-icon>Configurateur
                            </v-btn>
                        </v-badge>
                    </v-fade-transition>
                    <v-text-field v-model="search" prepend-icon="mdi-magnify" class="ml-auto mr-5" label="Recherche" color="pink" hide-details single-line style="max-width: 250px" clearable />
                </v-row>
                <v-divider></v-divider>
            </template>
            <template v-slot:[`item.data-table-select`]="{ item, isSelected, select }">
                <v-simple-checkbox color="pink" :ripple="false" :value="isSelected" :disabled="item.disabled" @input="select($event)"></v-simple-checkbox>
            </template>
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
                    <v-btn :disabled="isProgress || item.disabled || !isAdmin || item.role.toLowerCase() === 'administrateur'" small outlined color="orange" @click="PageInfosUtilisateur(item, true)" class="ml-3">
                        <v-icon left>mdi-account-edit-outline</v-icon>
                        Modifier {{ item.civilite.toLowerCase() === "homme" ? 'M. '+ item.lastname : 'Mme '+ item.lastname }}
                    </v-btn>
                    <v-btn :disabled="isProgress || item.disabled || !isAdmin || item.role.toLowerCase() === 'administrateur'" small outlined color="red" @click="dialogDeleteUtilisateur(item)" class="ml-3">
                        <v-icon left>mdi-account-remove-outline</v-icon>
                        Désactiver {{ item.civilite.toLowerCase() === "homme" ? 'M. '+ item.lastname : 'Mme '+ item.lastname }}
                    </v-btn>
                    <v-btn :disabled="isProgress || item.disabled || !isAdmin || item.role.toLowerCase() === 'administrateur'" small outlined @click="dialogUpdateEntreprise(item.idEntreprise)" class="ml-3">
                        <v-icon left>mdi-square-edit-outline</v-icon>
                        Modifier entreprise
                    </v-btn>
                </td>
            </template>
            <template v-slot:[`item.idEntreprise`]="{ item }">
                <v-chip ripple outlined dark color="pink"> {{ item.idEntreprise.nom }}</v-chip>
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
            <span slot="no-results" :value="true" icon="warning" class="error--text">
                La recherche "{{ search }}" est inconnu.
            </span>
        </v-data-table>
    </base-material-card>
    <v-snackbar v-model="isSnackbarOpened" elevation="24" :color="isSuccess ? 'success' : 'error'" style="filter: opacity(95%);">
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
import Gestion from "@/mixins/Gestion"
import axiosApi from '@/plugins/axiosApi';
import qs from "qs";
import axios, {
    AxiosResponse,
    AxiosError,
    AxiosRequestConfig
} from 'axios';
import moment from 'moment';
import fileSaver from 'file-saver';
import io from 'socket.io-client';
import {
    bus
} from "@/main";

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
                dateNaissance: "",
                civilite: "",
                portable: "",
                isAdmin: false,
                role: "Commercial",
                idEntreprise: ""
            },
            search: undefined as string | null | undefined,
            expanded: [] as Array < any > ,
            expandedEnt: [] as Array < any > ,
            headersProspects: [{
                text: "Nom",
                value: "lastname",
                align: 'center',
            }, {
                text: "Prénom",
                value: "firstname",
                align: 'center',
            }, {
                text: "Email",
                value: "email",
                align: 'center',
            }, {
                //sortable: false,
                text: "Entreprise",
                value: "idEntreprise",
                align: 'center',
            }, {
                sortable: false,
                text: "Checked",
                value: "checked",
                align: 'center',
            }, {
                sortable: false,
                text: "Actif",
                value: "disabled",
                align: 'center',
            }, ] as Array < any > ,
            headersEntreprises: [{
                text: "Siret",
                value: "siret",
                align: 'center',
            }, {
                text: "Nom",
                value: "nom",
                align: 'center',
            }, {
                text: "Catégorie entreprise",
                value: "categorieEntreprise",
                align: 'center',
            }, {
                sortable: false,
                text: "Date de création",
                value: "dateCreation",
                align: 'center',
            }, {
                sortable: false,
                text: "Ajout en base",
                value: "createdAt",
                align: 'center',
            }, {
                sortable: false,
                text: "Mise à jour en base",
                value: "updateAt",
                align: 'center',
            }, {
                sortable: false,
                text: "Etat administratif actif",
                value: "etatAdministratif",
                align: 'center',
            }, ] as Array < any > ,
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
                nom: '',
                adresse: '',
                telephone: '',
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
            products: [] as any[],
            isRandomArticles: false as boolean,
            prospectsSelected: [] as any[],
            isRemovedAllSelected: true as boolean,
            isDialogConfigurator: false as boolean,
            productsConfigurator: [{}] as any[],
            isHoverCheckboxChecked: false as boolean,
            optionsDoc: {
                isCheckedProspect: false as boolean,
                isCgv: true as boolean,
                isAdminCommercial: false as boolean,
                isUser: false as boolean,
                emailUser: '',
                emailAdminCommercial: [],
                isDownload: true as boolean,
            },
            isDialogDocOptions: false as boolean,
            isEditOptions: false as boolean,
            administrateurs: [] as any[],
            isEntrepriseSpeedDial: false as boolean,
            isDialogEntreprise: false as boolean,
            searchEnt: '',
            isEditEntreprise: false as boolean,
            articles: [] as any[],
            valueTraitement: 0 as number,
            isProgress: false as boolean,
            availableCheckedProspectsNum: 0 as number,
        }
    },
    watch: {},
    computed: {
        /*socket() {
            return io(this.$store.state.baseUrl);
        },*/
    },
    created() {},
    beforeMount() {
        this.socketServer()
        if (this.valueTraitement !== 0) this.isProgress = true;
    },
    async mounted() {
        await this.getProspectionsData();
    },
    sockets: {},
    methods: {
        socketServer: function () {
            this.socket.on('traitement', (valueMax: number, value: number) => {
                this.valueTraitement = (100 * value) / valueMax;
            });
            this.socket.on('traitementStatut', (isTraitement: boolean) => {
                this.isProgress = isTraitement;
                if (this.valueTraitement === 0 && this.isProgress) this.successMessage('Un traitement a été lancé !')
            });
        },
        getProspectionsData: async function (): Promise < void > {
            //https://jsonplaceholder.typicode.com/users
            Object.assign(this.$data, this.$options.data()); //reset data
            this.isLoading = true;
            this.isFirstLoad = true;
            let ttPromise: any[] = []
            ttPromise.push(axiosApi.get("/user/all/Prospect")) //tous les clients prospects
            ttPromise.push(axiosApi.get("/entreprises")) //tous les entreprises
            ttPromise.push(axiosApi.get("/product/all")) //tous les produits
            ttPromise.push(axiosApi.get("/user/all/Commercial")) //tous les commerciaux/admins
            Promise.all(ttPromise)
            .then((response: AxiosResponse[]) => {
                this.prospects = response[0].data.users;
                this.entreprises = response[1].data.entreprises;
                this.products = response[2].data.products;
                this.administrateurs = response[3].data.users;
                this.productsConfigurator = []
                this.products.forEach((el: any) => {
                    let composants: any[] = []
                    el.composants.forEach((cp: any) => {
                        composants.push({
                            "idComposant": cp._id,
                            "matiere": null,
                            "couleur": null,
                            "quantite": 1,
                            "saved": false
                        })
                    });
                    this.productsConfigurator.push({
                        "idProduct": el._id,
                        "matiere": null,
                        "couleur": null,
                        "quantite": 1,
                        "listeComposantsSelected": composants,
                        "saved": false
                    })
                });
                for (let i = 0; i < this.prospects.length; i++) {
                    this.prospects[i].isAdmin = this.prospects[i].role.toLowerCase() === "administrateur" ? true : false
                }
                setTimeout(() => {
                    this.isLoading = false;
                    this.isFirstLoad = false;
                }, 1000);
            }).catch((error: AxiosError) => {
                this.catchAxios(error)
                setTimeout(() => {
                    this.isLoading = false;
                    this.isFirstLoad = false;
                }, 1000);
            });
        },
        generateDevis: async function (prospectsSelected: any[] = []) {
            const products: any[] = this.shuffle(this.products.filter((product: any) => product.archive === false));
            let devis: any[] = [];
            prospectsSelected = prospectsSelected.filter((p: any) => p.disabled === false);
            prospectsSelected = this.optionsDoc.isCheckedProspect ? prospectsSelected.filter((pp: any) => pp.checked === true) : prospectsSelected
            if (prospectsSelected.length === 0 && this.optionsDoc.isCheckedProspect) {
                return this.errorMessage("Aucun prospect vérifié disponible");
            }
            if (this.isRandomArticles) {
                prospectsSelected.forEach((prospect: any) => {
                    devis.push({
                        prospectID: prospect._id,
                        articles: this.getRandomProduct(products)
                    })
                });
            } else {
                if (this.articles.length === 0) {
                    return this.errorMessage("Veuillez saisir l'option articles aléatoire ou sauvegarder la configuration des produits");
                } else {
                    prospectsSelected.forEach((prospect: any) => {
                        devis.push({
                            prospectID: prospect._id,
                            articles: this.articles
                        })
                    });
                }
            }
            const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if (this.optionsDoc.isUser) {
                if (this.optionsDoc.emailUser.match(regexEmail) == null) {
                    return this.errorMessage('L\'email du destinataire suplémentaire n\'est pas au bon format')
                }
            }
            if (this.optionsDoc.isAdminCommercial) {
                for (let i = 0; i < this.optionsDoc.emailAdminCommercial.length; i++) {
                    if (this.optionsDoc.emailAdminCommercial[i].match(regexEmail) == null) {
                        return this.errorMessage('La sélection d\'email n\'est pas au bon format')
                    }
                }
            }
            const payload: any = {
                "devis": devis,
                "optionsDoc": this.optionsDoc
            }
            /*const source = axios.CancelToken.source();
            const timeout = setTimeout(() => {
                source.cancel(); // Timeout Logic
            }, 1000 * 60 * 60);*/
            const configAxios: AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                timeout: 1000 * 60 * 60,
                //cancelToken: source.token,
                responseType: this.optionsDoc.isDownload ? 'blob' : 'json' // blob arraybuffer
            }
            this.isProgress = true;
            //this.socket.emit('startTraitement')
            this.socket.emit('newMessage', 'Un traitement a été lancé !'); // envoie msg vers socket node
            axiosApi
                .post("/devis/add", payload, configAxios)
                .then(async (response: AxiosResponse) => {
                    //clearTimeout(timeout);
                    this.isLoading = true;
                    this.isFirstLoad = true;
                    if (this.optionsDoc.isDownload) {
                        //window.open(`${this.baseUrl}/download/${response.data.destPath}`, '_self') // _self _blank 
                        //console.log(window.URL.createObjectURL(response.data))
                        if (devis.length === 1) {
                            /*const blob = new Blob([response.data], { type: response.headers["Content-type"] + ';charset=utf-8' })*/
                            fileSaver.saveAs(response.data, "download.pdf"); //application/pdf;charset=utf-8
                        } else {
                            /*const blob = new Blob([response.data], { type: response.headers["Content-type"] })*/
                            fileSaver.saveAs(response.data, "download.zip"); //application/zip ou application/octet-stream
                        }
                    }
                    this.successMessage(devis.length === 1 ? "Le devis a bien été envoyé par mail" : "Les devis ont bien été envoyé par mail");
                    setTimeout(() => {
                        this.valueTraitement = 0;
                        this.isProgress = false;
                        this.getProspectionsData();
                    }, 6000);
                }).catch((error: AxiosError) => {
                    //clearTimeout(timeout);
                    this.optionsDoc.isDownload ? this.errorMessage('Erreur sur les traitements !') : this.catchAxios(error)
                    setTimeout(() => {
                        this.isProgress = false;
                    }, 1000);
                });
        },
        getRandomProduct: function (products: any[]): any[] {
            let articles: any[] = []
            for (let i = 0; i < this.randNumber(1, products.length); i++) {
                let listeComposants: any[] = []
                products[i].composants.forEach((el: any) => {
                    listeComposants.push({
                        "idComposant": el._id,
                        "matiere": el.matieres[this.randNumber(0, el.matieres.length - 1)],
                        "couleur": el.couleurs[this.randNumber(0, el.couleurs.length - 1)],
                        "quantite": this.randNumber(1, 2)
                    })
                });
                articles.push({
                    "idProduct": products[i]._id,
                    "matiere": products[i].matieres[this.randNumber(0, products[i].matieres.length - 1)],
                    "couleur": products[i].couleurs[this.randNumber(0, products[i].couleurs.length - 1)],
                    "quantite": this.randNumber(1, 1),
                    "listeComposantsSelected": listeComposants as any[],
                });
            }
            return articles;
        },
        /**@param {Array} a Shuffles array in place. ES6 version*/
        shuffle: function (a: any[]): any[] {
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        },
        selectAllToggle: function (props: any) {
            if (this.isRemovedAllSelected === true) {
                this.isRemovedAllSelected = false;
                this.prospectsSelected = [];
                //const self = this;
                props.items.forEach((item: any) => {
                    if (!item.disabled) {
                        this.prospectsSelected.push(item);
                    }
                });
            } else {
                this.isRemovedAllSelected = true;
                this.prospectsSelected = [];
            }
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
                .catch((error: AxiosError) => {
                    console.log(error);
                    this.errorMessage("Le SIRET est introuvable ou inconnu, réessayer !");
                });
        },
        saveNewEntreprise: async function (): Promise < void > {
            if (!this.$refs.form.validate()) return this.errorMessage("Veuillez vérifier les champs !");
            axiosApi.post("/entreprise", qs.stringify(this.entreprise))
            .then((response: AxiosResponse) => {
                Object.assign(this.$data, this.$options.data()); //reset data
                this.$refs.form.reset();
                this.successMessage("L'entreprise a bien été ajouté !");
                setTimeout(() => {
                    this.getProspectionsData();
                }, 5000);
            })
            .catch((error: AxiosError) => {
                this.catchAxios(error)
            });
        },
        saveNewUtilisateur: function (): void {
            if (!this.$refs.form.validate()) return this.errorMessage("Veuillez vérifier les champs !");
            this.prospect.role = this.prospect.isAdmin === true ? 'Administrateur' : 'Prospect'
            axiosApi.post("/register", qs.stringify(this.prospect))
                .then((response: AxiosResponse) => {
                    Object.assign(this.$data, this.$options.data()); //reset data
                    this.$refs.form.reset();
                    this.successMessage("Le client prospect a bien été ajouté !");
                    setTimeout(() => {
                        this.getProspectionsData();
                    }, 5000);
                })
                .catch((error: AxiosError) => {
                    this.catchAxios(error)
                });
        },
        dialogUpdateEntreprise: function (item: any): void {
            this.isDialogEditEntreprise = true;
            this.entrepriseToUpdate = item;
        },
        saveEditEntreprise: function (entrepriseToUpdate: any): void {
            const payload = {
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
                    Object.assign(this.$data, this.$options.data()); //reset data
                    this.successMessage("Sauvegarde des modifications effectuée !");
                    setTimeout(() => {
                        this.getProspectionsData();
                    }, 5000);
                })
                .catch((error: AxiosError) => {
                    this.catchAxios(error)
                });
        },
        deleteEntreprise: function (idEntreprise: string): void {
            axiosApi
                .delete("/entreprise/" + idEntreprise)
                .then((response: AxiosResponse) => {
                    //Object.assign(this.$data, this.$options.data()); //reset data
                    this.successMessage(`L'entreprise a été supprimée avec succès`);
                    setTimeout(() => {
                        this.getProspectionsData();
                    }, 3000);
                })
                .catch((error) => {
                    this.catchAxios(error)
                });
        },
        disableUtilisateur: function (): void {
            this.isDialogDisableUtilisateur = false;
            axiosApi
                .put("/user/disable/" + this.utilisateurToDisable._id)
                .then((response: AxiosResponse) => {
                    const utilisateurFirstname = this.utilisateurToDisable.firstname;
                    const utilisateurLastname = this.utilisateurToDisable.lastname;
                    Object.assign(this.$data, this.$options.data()); //reset data
                    //this.$refs.form.reset();
                    this.successMessage(`Le client prospect ${utilisateurFirstname} ${utilisateurLastname} a été désactivé avec succès`);
                    setTimeout(() => {
                        this.getProspectionsData();
                    }, 5000);
                })
                .catch((error: AxiosError) => {
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
        },
        saveConfiguratorArticles: function () {
            this.articles = []
            this.productsConfigurator.forEach((pr: any) => {
                let composants: any[] = []
                pr.listeComposantsSelected.forEach((cp: any) => {
                    if (cp.saved) {
                        if (cp.idComposant === null || cp.matiere === null || cp.couleur === null || cp.quantite === 0) {
                            return this.errorMessage('Les informations du composant ne sont pas valide')
                        } else {
                            composants.push({
                                "idComposant": cp.idComposant,
                                "matiere": cp.matiere,
                                "couleur": cp.couleur,
                                "quantite": cp.quantite,
                            })
                        }
                    }
                });
                if (pr.saved) {
                    if (pr.idProduct === null || pr.matiere === null || pr.couleur === null || pr.quantite === 0) {
                        return this.errorMessage('Les informations du produit ne sont pas valide')
                    } else {
                        this.articles.push({
                            "idProduct": pr.idProduct,
                            "matiere": pr.matiere,
                            "couleur": pr.couleur,
                            "quantite": pr.quantite,
                            "listeComposantsSelected": composants as any[],
                        })
                    }
                }
            });
            let isEmpty: boolean = true;
            this.productsConfigurator.forEach((el: any) => {
                if (el.saved === true) isEmpty = false;
            });
            if (isEmpty) this.errorMessage('Attention aucun article a été sauvegarder')
            this.isRandomArticles = false;
            this.isDialogConfigurator = false
        },
        saveProduct: function (pr: any, i: number) {
            if (pr.idProduct === null || pr.matiere === null || pr.couleur === null || parseInt(pr.quantite) < 1) {
                this.errorMessage('Les informations du produit ne sont pas valide')
                setTimeout(() => {
                    this.productsConfigurator[i].saved = false;
                }, 250);
            }
        },
        saveComposant: function (cp: any, i: number, j: number) {
            if (cp.idProduct === null || cp.matiere === null || cp.couleur === null || parseInt(cp.quantite) < 1) {
                this.errorMessage('Les informations du composant ne sont pas valide')
                setTimeout(() => {
                    this.productsConfigurator[i].listeComposantsSelected[j].saved = false;
                }, 250);
            }
        },
        activeProspectsSelected: function (isChecked: boolean) {
            if (isChecked) {
                this.availableCheckedProspectsNum = this.optionsDoc.isCheckedProspect ? this.prospectsSelected.filter((pp: any) => pp.checked === true).length : this.availableCheckedProspectsNum
            }
        }
    }
});
</script>

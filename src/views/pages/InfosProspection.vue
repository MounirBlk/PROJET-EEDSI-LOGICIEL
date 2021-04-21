<template>
<v-container id="client" fluid tag="section">
    <v-row justify="center">
        <v-col cols="12" md="8">
            <base-material-card color="pink">
                <template v-slot:heading>
                    <div v-if="$route.params.isEdit === false">
                        <div class="display-1 white--text">
                            <span v-if="prospect.role === 'Administrateur'">Administrateur</span>
                            <span v-else>Client Prospect</span><br />
                        </div>
                    </div>
                    <div v-else>
                        <div class="display-2 white--text mb-4">
                            <v-icon large>mdi-account-edit-outline</v-icon>Modification client prospect
                        </div>
                        <div class="subtitle-2 white--text">
                            <span>{{ prospect.email }}</span>
                        </div>
                    </div>
                </template>
                <v-skeleton-loader v-if="isFirstload" :loading="isLoading" type="table"></v-skeleton-loader>
                <div v-else>
                    <div v-if="$route.params.isEdit === false">
                        <v-simple-table dense>
                            <template v-slot:default>
                                <tbody>
                                    <tr>
                                        <td>Prénom</td>
                                        <td>{{ prospect.firstname }}</td>
                                    </tr>
                                    <tr>
                                        <td>Nom</td>
                                        <td>{{ prospect.lastname }}</td>
                                    </tr>
                                    <tr>
                                        <td>Email</td>
                                        <td>{{ prospect.email }}</td>
                                    </tr>
                                    <tr>
                                        <td>Numéro de téléphone</td>
                                        <td v-if="prospect.portable != ''">{{ prospect.portable }}</td>
                                        <td v-else>Inconnu</td>
                                    </tr>
                                    <tr>
                                        <td>Civilité</td>
                                        <td>{{ prospect.civilite }}</td>
                                    </tr>
                                    <tr>
                                        <td>Date de naissance</td>
                                        <td>{{ prospect.dateNaissance }}</td>
                                    </tr>
                                    <tr>
                                        <td>Création</td>
                                        <td>{{ prospect.createdAt }}</td>
                                    </tr>
                                    <tr>
                                        <td>Mise à jour</td>
                                        <td>{{ prospect.updateAt }}</td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                        <v-row>
                            <v-col cols="12" class="text-left">
                                <v-btn class="mr-1" outlined color="error" text to="/prospections">
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
                                            <v-col cols="12" md="6">
                                                <v-text-field color="pink" label="Nom*" v-model="prospect.lastname" prepend-inner-icon="mdi-face" clearable :rules="rules.caractereRules" required solo />
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <v-text-field color="pink" label="Prénom*" v-model="prospect.firstname" prepend-inner-icon="mdi-face" clearable :rules="rules.caractereRules" required solo />
                                            </v-col>
                                        </v-row>
                                        <v-row class="mt-n4">
                                            <v-col cols="12" md="6">
                                                <v-text-field color="pink" label="Email*" v-model="prospect.email" prepend-inner-icon="mdi-email-outline" clearable solo disabled />
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <v-tooltip top>
                                                    <template v-slot:activator="{ on }">
                                                        <v-text-field color="pink" label="Password*" v-model="prospect.password" prepend-inner-icon="mdi-lock-outline" clearable :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :rules="rules.passwordRules" :disabled="changePassword == false" solo v-on="on" />
                                                    </template>
                                                    <span>*Attention, cela risque de changer le mot de passe définitivement</span>
                                                </v-tooltip>
                                            </v-col>
                                        </v-row>
                                        <v-row class="mt-n4">
                                            <v-col cols="12" md="6">
                                                <v-select color="pink" prepend-inner-icon="mdi-format-list-bulleted-type" v-model="prospect.civilite" :items="['Homme', 'Femme']" label="Civilité*" :rules="rules.champRules" required solo></v-select>
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <v-menu v-model="isDialogDateNaissanceOpen" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" color="pink">
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field color="pink" v-model="prospect.dateNaissance" label="Date de naissance" prepend-inner-icon="mdi-calendar-outline" readonly v-bind="attrs" v-on="on" solo></v-text-field>
                                                    </template>
                                                    <v-date-picker color="pink" first-day-of-week="1" v-model="prospect.dateNaissance" @input="isDialogDateNaissanceOpen = false" :rules="rules.dateUsRules" required></v-date-picker>
                                                </v-menu>
                                            </v-col>
                                        </v-row>
                                        <v-row class="mt-n4">
                                            <v-col cols="12" md="6">
                                                <v-text-field color="pink" label="Numéro de téléphone" v-model="prospect.portable" prepend-inner-icon="mdi-deskphone" clearable solo />
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <v-text-field color="pink" label="Adresse" v-model="prospect.adresse" prepend-inner-icon="mdi-walk" clearable solo />
                                            </v-col>
                                        </v-row>
                                    </div>
                                    <v-row>
                                        <v-col cols="12" md="12">
                                            <v-btn @click="changePassword = !changePassword" color="secondary" text outlined small>
                                                <v-icon left>mdi-cog-outline</v-icon>Modifier le password
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                    <v-col cols="12" class="text-right">
                                        <v-btn class="mr-1" outlined color="error" text to="/prospections">
                                            <v-icon left>mdi-close-circle-outline</v-icon>Retour
                                        </v-btn>
                                        <v-btn outlined color="success" text @click="modificationProfile">
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
                <base-material-card color="pink" icon="mdi-bank" max-width="100%" width="auto" inline class="px-5 py-3 mx-auto">
                    <template v-slot:after-heading>
                        <div class="subtitle-1">
                            <span>Entreprise</span>
                        </div>
                    </template>
                    <v-row v-if="$route.params.isEdit === false">
                        <v-col cols="12">
                            <h4 class="display-1 font-weight-light mb-2 text-md-center pink--text">{{ entreprise.name }}</h4>
                        </v-col>
                        <v-card-text>
                            <v-col cols="12">
                                <v-simple-table dense>
                                    <template v-slot:default>
                                        <tbody>
                                            <tr>
                                                <td>Nom</td>
                                                <td>{{ entreprise.name }}</td>
                                            </tr>
                                            <tr>
                                                <td>Siret</td>
                                                <td>{{ entreprise.siret }}</td>
                                            </tr>
                                            <tr>
                                                <td>Date de création</td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </v-col>
                            <v-col cols="12">
                                <h2 class="font-weight-light grey--text">
                                    <v-icon large left color="blue">mdi-skype</v-icon>
                                    Skype: {{ prospect.firstname }}.skype
                                </h2>
                            </v-col>
                            <v-col cols="12">
                                <h2 class="font-weight-light grey--text">
                                    <v-icon large left color="indigo">mdi-linkedin</v-icon>
                                    Linkedin: {{ prospect.firstname }}.linkedin
                                </h2>
                            </v-col>
                            <v-col cols="12">
                                <h2 class="font-weight-light grey--text">
                                    <v-icon large left color="indigo">mdi-facebook</v-icon>
                                    Facebook: {{ prospect.firstname }}.facebook
                                </h2>
                            </v-col>
                            <v-col cols="12">
                                <h2 class="font-weight-light grey--text">
                                    <v-icon large left color="blue">mdi-twitter</v-icon>
                                    Twitter: {{ prospect.firstname }}.twitter
                                </h2>
                            </v-col>
                        </v-card-text>
                    </v-row>
                    <v-row v-else>
                        <v-skeleton-loader :loading="isLoading" type="table"></v-skeleton-loader>
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
    name: 'Prospect',
    mixins: [Gestion],
    props: {},
    components: {},
    //data: () => ({}),
    data(): any {
        return {
            changePassword: false as boolean,
            isDialogDateNaissanceOpen: false as boolean,
            //isFirstload: false as boolean,
            //isLoading: false as boolean,
            prospect: {},
            entreprise: {
                name: 'IMIE PARIS',
                siret: 12345678902135
            }
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
        //modification du utilisateur choisi
        if (
            this.$route.params.infosProspect != null &&
            this.$route.params.infosProspect != 0
        ) {
            this.prospect = this.$route.params.infosProspect;
            setTimeout(() => {
                this.isLoading = false;
                this.isFirstLoad = false;
            }, 1000);
        } else {
            return this.$router.push({
                name: "Prospections"
            });
        }
    },
    methods: {
        modificationProfile: async function () {
            if (!this.$refs.form.validate() && (!this.$refs.form.validate() && this.changePassword))
                return this.errorMessage("Veuillez vérifier les champs !");

            this.prospect.role = this.prospect.isAdmin === true ? 'Administrateur' : 'Prospect'
            await axiosApi
                .put("/user/update/" + this.prospect._id, qs.stringify(this.prospect)) //update du utilisateur
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
                });
        },
    }
});
</script>

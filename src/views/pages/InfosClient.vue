<template>
<v-container id="client" fluid tag="section">
    <v-row justify="center">
        <v-col cols="12" md="8">
            <base-material-card color="indigo">
                <template v-slot:heading>
                    <div v-if="$route.params.isEdit === false">
                        <div class="text-h5 white--text">
                            <span v-if="client.role === 'Administrateur'">Administrateur</span>
                            <span v-else>Client</span><br />
                        </div>
                        Dernière connexion : {{ client.lastLogin | moment("YYYY-MM-DD HH:mm") }}
                    </div>
                    <div v-else>
                        <div class="text-h5 white--text mb-4">
                            <v-icon large left>mdi-account-edit-outline</v-icon>Modification client
                        </div>
                        <div class="subtitle-2 white--text">
                            <span>{{ client.email }}</span>
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
                                        <td>Email</td>
                                        <td>{{ client.email }}</td>
                                    </tr>
                                    <tr>
                                        <td>Numéro de téléphone</td>
                                        <td v-if="client.portable != ''">{{ client.portable }}</td>
                                        <td v-else>Inconnu</td>
                                    </tr>
                                    <tr>
                                        <td>Civilité</td>
                                        <td>{{ client.civilite }}</td>
                                    </tr>
                                    <tr>
                                        <td>Date de naissance</td>
                                        <td>{{ client.dateNaissance }}</td>
                                    </tr>
                                    <tr>
                                        <td>Création</td>
                                        <td>{{ client.createdAt | moment("YYYY-MM-DD HH:mm") }}</td>
                                    </tr>
                                    <tr>
                                        <td>Mise à jour</td>
                                        <td>{{ client.updateAt | moment("YYYY-MM-DD HH:mm") }}</td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                        <v-row class="mt-2">
                            <v-col cols="12" class="text-left">
                                <v-btn class="mr-1" outlined color="error" text to="/clients">
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
                                                <v-text-field color="indigo" label="Nom*" v-model="client.lastname" prepend-inner-icon="mdi-face" clearable :rules="rules.caractereRules" required solo />
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <v-text-field color="indigo" label="Prénom*" v-model="client.firstname" prepend-inner-icon="mdi-face" clearable :rules="rules.caractereRules" required solo />
                                            </v-col>
                                        </v-row>
                                        <v-row class="mt-n4">
                                            <v-col cols="12" md="6">
                                                <v-text-field color="indigo" label="Email*" v-model="client.email" prepend-inner-icon="mdi-email-outline" clearable solo disabled />
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <v-tooltip top>
                                                    <template v-slot:activator="{ on }">
                                                        <v-text-field color="indigo" label="Password*" v-model="client.password" prepend-inner-icon="mdi-lock-outline" clearable :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :rules="rules.passwordRules" :disabled="changePassword == false" solo v-on="on" />
                                                    </template>
                                                    <span>*Attention, cela risque de changer le mot de passe définitivement</span>
                                                </v-tooltip>
                                            </v-col>
                                        </v-row>
                                        <v-row class="mt-n4">
                                            <v-col cols="12" md="4">
                                                <v-select color="indigo" prepend-inner-icon="mdi-format-list-bulleted-type" v-model="client.civilite" :items="['Homme', 'Femme']" label="Civilité*" :rules="rules.champRules" required solo></v-select>
                                            </v-col>
                                            <v-col cols="12" md="4">
                                                <v-menu v-model="isDialogDateNaissanceOpen" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" color="indigo">
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field color="indigo" v-model="client.dateNaissance" label="Date de naissance" prepend-inner-icon="mdi-calendar-outline" readonly v-bind="attrs" v-on="on" solo></v-text-field>
                                                    </template>
                                                    <v-date-picker color="indigo" first-day-of-week="1" v-model="client.dateNaissance" @input="isDialogDateNaissanceOpen = false" :rules="rules.dateUsRules" required></v-date-picker>
                                                </v-menu>
                                            </v-col>
                                            <v-col cols="12" md="4">
                                                <v-text-field color="indigo" label="Numéro de téléphone" v-model="client.portable" prepend-inner-icon="mdi-deskphone" clearable solo />
                                            </v-col>
                                        </v-row>
                                    </div>
                                    <v-row>
                                        <v-col v-if="changePassword">
                                            <b class="text-h6 pink--text">Le champ password est disponible</b>
                                        </v-col>
                                    </v-row>
                                    <v-col cols="12" class="text-right">
                                        <v-btn @click="changePassword = !changePassword" class="mr-1" color="secondary" text outlined small>
                                            <v-icon left>mdi-cog-outline</v-icon>Modifier le password
                                        </v-btn>
                                        <v-btn class="mr-1" outlined color="error" text to="/clients" small>
                                            <v-icon left>mdi-close-circle-outline</v-icon>Retour
                                        </v-btn>
                                        <v-btn outlined color="success" text @click="modificationProfil" small>
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
                <base-material-card color="indigo" icon="mdi-clipboard-account" max-width="100%" width="auto" inline class="px-5 py-3 mx-auto">
                    <v-row v-if="$route.params.isEdit === false">
                        <v-col cols="12">
                            <h4 class="display-1 font-weight-light mb-2 text-md-center indigo--text">{{ client.firstname }} {{ client.lastname }}</h4>
                        </v-col>
                        <v-card-text>
                            <v-col cols="12">
                                <h2 class="font-weight-light mb-n3 grey--text">
                                    <v-icon large left color="blue">mdi-skype</v-icon>
                                    Skype: {{ client.firstname }}.skype
                                </h2>
                            </v-col>
                            <v-col cols="12">
                                <h2 class="font-weight-light mb-n3 grey--text">
                                    <v-icon large left color="indigo">mdi-linkedin</v-icon>
                                    Linkedin: {{ client.firstname }}.linkedin
                                </h2>
                            </v-col>
                            <v-col cols="12">
                                <h2 class="font-weight-light mb-n3 grey--text">
                                    <v-icon large left color="indigo">mdi-facebook</v-icon>
                                    Facebook: {{ client.firstname }}.facebook
                                </h2>
                            </v-col>
                            <v-col cols="12">
                                <h2 class="font-weight-light grey--text">
                                    <v-icon large left color="blue">mdi-twitter</v-icon>
                                    Twitter: {{ client.firstname }}.twitter
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
    <v-snackbar shaped v-model="isSnackbarOpened" elevation="24" :color="isSuccess ? 'success' : 'error'" v-filter="'opacity(95%)'">
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
    name: 'Client',
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
            client: {}
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
            this.$route.params.infosClient != null &&
            this.$route.params.infosClient != 0
        ) {
            this.client = this.$route.params.infosClient;
            setTimeout(() => {
                this.isLoading = false;
                this.isFirstLoad = false;
            }, 1000);
        } else {
            return this.$router.push({
                name: "Clients"
            });
        }
    },
    methods: {
        modificationProfil: function () {
            if (!this.$refs.form.validate() && (!this.$refs.form.validate() && this.changePassword))
                return this.errorMessage("Veuillez vérifier les champs !");

            this.client.role = this.client.isAdmin === true ? 'Administrateur' : 'Client'
            axiosApi
                .put("/user/update/" + this.client._id, qs.stringify(this.client)) //update du utilisateur
                .then((response: AxiosResponse) => {
                    if (response.data.error == false) {
                        this.$refs.form.reset();
                        this.successMessage("Sauvegarde des modifications effectuée !");
                        this.isLoading = true;
                        this.isFirstLoad = true;
                    }
                    setTimeout(() => {
                        this.$router.push({
                            name: "Clients"
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

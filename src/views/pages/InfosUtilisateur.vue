<template>
<v-container id="utilisateur" fluid tag="section">
    <v-row justify="center">
        <v-col cols="12" md="8">
            <base-material-card color="info">
                <template v-slot:heading>
                    <div v-if="$route.params.isEdit === false">
                        <div class="text-h5 white--text">
                            <span v-if="user.role === 'Administrateur'">Administrateur</span>
                            <span v-else>Commercial</span><br />
                        </div>
                        Dernière connexion : {{ user.lastLogin | moment("YYYY-MM-DD HH:mm") }}
                    </div>
                    <div v-else>
                        <div class="text-h5 white--text mb-4">
                            <v-icon large left>mdi-account-edit-outline</v-icon>Modification utilisateur
                        </div>
                        <div class="subtitle-2 white--text">
                            <span>{{ user.email }}</span>
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
                                        <td>{{ user.email }}</td>
                                    </tr>
                                    <tr>
                                        <td>Numéro de téléphone</td>
                                        <td v-if="user.portable != ''">{{ user.portable }}</td>
                                        <td v-else>Inconnu</td>
                                    </tr>
                                    <tr>
                                        <td>Civilité</td>
                                        <td>{{ user.civilite }}</td>
                                    </tr>
                                    <tr>
                                        <td>Date de naissance</td>
                                        <td>{{ user.dateNaissance }}</td>
                                    </tr>
                                    <tr>
                                        <td>Statut administrateur</td>
                                        <td v-if="user.role === 'Administrateur'">Oui</td>
                                        <td v-else>Non</td>
                                    </tr>
                                    <tr>
                                        <td>Création</td>
                                        <td>{{ user.createdAt | moment("YYYY-MM-DD HH:mm") }}</td>
                                    </tr>
                                    <tr>
                                        <td>Mise à jour</td>
                                        <td>{{ user.updateAt | moment("YYYY-MM-DD HH:mm") }}</td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                        <v-row class="mt-2">
                            <v-col cols="12" class="text-left">
                                <v-btn class="mr-1" outlined color="error" text to="/utilisateurs">
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
                                                <v-text-field color="info" label="Nom*" v-model="user.lastname" prepend-inner-icon="mdi-face" clearable :rules="rules.caractereRules" required solo />
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <v-text-field color="info" label="Prénom*" v-model="user.firstname" prepend-inner-icon="mdi-face" clearable :rules="rules.caractereRules" required solo />
                                            </v-col>
                                        </v-row>
                                        <v-row class="mt-n4">
                                            <v-col cols="12" md="6">
                                                <v-text-field color="info" label="Email*" v-model="user.email" prepend-inner-icon="mdi-email-outline" clearable solo disabled />
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <v-tooltip top>
                                                    <template v-slot:activator="{ on }">
                                                        <v-text-field color="info" label="Password*" v-model="user.password" prepend-inner-icon="mdi-lock-outline" clearable :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :rules="rules.passwordRules" :disabled="changePassword == false" solo v-on="on" />
                                                    </template>
                                                    <span>*Attention, cela risque de changer le mot de passe définitivement</span>
                                                </v-tooltip>
                                            </v-col>
                                        </v-row>
                                        <v-row class="mt-n4">
                                            <v-col cols="12" md="4">
                                                <v-select color="info" prepend-inner-icon="mdi-format-list-bulleted-type" v-model="user.civilite" :items="['Homme', 'Femme']" label="Civilité*" :rules="rules.champRules" required solo></v-select>
                                            </v-col>
                                            <v-col cols="12" md="4">
                                                <v-menu v-model="isDialogDateNaissanceOpen" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" color="info">
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field color="info" v-model="user.dateNaissance" label="Date de naissance" prepend-inner-icon="mdi-calendar-outline" readonly v-bind="attrs" v-on="on" solo></v-text-field>
                                                    </template>
                                                    <v-date-picker color="info" first-day-of-week="1" v-model="user.dateNaissance" @input="isDialogDateNaissanceOpen = false" :rules="rules.dateUsRules" required></v-date-picker>
                                                </v-menu>
                                            </v-col>
                                            <v-col cols="12" md="4">
                                                <v-text-field color="info" label="Numéro de téléphone" v-model="user.portable" prepend-inner-icon="mdi-deskphone" clearable solo />
                                            </v-col>
                                        </v-row>
                                    </div>
                                    <v-row>
                                        <v-col cols="12" md="2">
                                            <v-switch class="my-n2" v-model="user.isAdmin" label="Administrateur" color="info"></v-switch>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col v-if="changePassword">
                                            <b class="text-h6 pink--text">Le champ password est disponible</b>
                                        </v-col>
                                    </v-row>
                                    <v-col cols="12" class="text-right">
                                        <v-btn @click="changePassword = !changePassword" class="mr-1" color="secondary" text outlined small>
                                            <v-icon left>mdi-cog-outline</v-icon>Modifier le password
                                        </v-btn>
                                        <v-btn class="mr-1" outlined color="error" text to="/utilisateurs" small>
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
                <base-material-card class="v-card-profile" :avatar="user.avatar">
                    <v-row v-if="$route.params.isEdit === false">
                        <v-col cols="12">
                            <h4 class="display-1 font-weight-light mb-2 text-md-center info--text">{{ user.firstname }} {{ user.lastname }}</h4>
                        </v-col>
                        <v-card-text>
                            <v-col cols="12" class="mb-5">
                                <h2 class="grey--text">
                                    <v-icon large left color="info">mdi-web</v-icon>Site Web:
                                    <span>Inconnu</span>
                                </h2>
                            </v-col>
                            <v-col cols="12">
                                <h2 class="font-weight-light mb-n3 grey--text">
                                    <v-icon large left color="blue">mdi-skype</v-icon>
                                    Skype: {{ user.firstname }}.skype
                                </h2>
                            </v-col>
                            <v-col cols="12">
                                <h2 class="font-weight-light mb-n3 grey--text">
                                    <v-icon large left color="indigo">mdi-linkedin</v-icon>
                                    Linkedin: {{ user.firstname }}.linkedin
                                </h2>
                            </v-col>
                            <v-col cols="12">
                                <h2 class="font-weight-light mb-n3 grey--text">
                                    <v-icon large left color="indigo">mdi-facebook</v-icon>
                                    Facebook: {{ user.firstname }}.facebook
                                </h2>
                            </v-col>
                            <v-col cols="12">
                                <h2 class="font-weight-light grey--text">
                                    <v-icon large left color="blue">mdi-twitter</v-icon>
                                    Twitter: {{ user.firstname }}.twitter
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
    name: 'Example',
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
            user: {}
        }
    },
    computed: {},
    watch: {},
    created() {},
    beforeMount() {},
    mounted(): any {
        //modification du utilisateur choisi
        if (
            this.$route.params.infosUtilisateur != null &&
            this.$route.params.infosUtilisateur != 0
        ) {
            this.user = this.$route.params.infosUtilisateur;
            this.user.avatar = this.user.avatar ? this.user.avatar : 'https://thumbs.dreamstime.com/b/businessman-icon-vector-male-avatar-profile-image-profile-businessman-icon-vector-male-avatar-profile-image-182095609.jpg';
            setTimeout(() => {
                this.isLoading = false;
                this.isFirstLoad = false;
            }, 1000);
        } else {
            return this.$router.push({
                name: "Commerciaux"
            });
        }
    },
    methods: {
        modificationProfil: function () {
            if (!this.$refs.form.validate() && (!this.$refs.form.validate() && this.changePassword))
                return this.errorMessage("Veuillez vérifier les champs !");

            this.user.role = this.user.isAdmin === true ? 'Administrateur' : 'Commercial'
            axiosApi
                .put("/user/update/" + this.user._id, qs.stringify(this.user)) //update de l'utilisateur
                .then((response: AxiosResponse) => {
                    if (response.data.error == false) {
                        this.$refs.form.reset();
                        this.successMessage("Sauvegarde des modifications effectuée !");
                        this.isLoading = true;
                        this.isFirstLoad = true;
                    }
                    setTimeout(() => {
                        this.$router.push({
                            name: "Commerciaux"
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

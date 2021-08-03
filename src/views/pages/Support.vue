<template>
<v-container id="support" tag="section" fluid>
    <v-overlay :absolute="isAbsolute" :opacity="opacity" :value="isOverlay">
        <v-progress-circular color="primary" indeterminate size="80"></v-progress-circular>
    </v-overlay>
    <v-row>
        <v-col cols="12" md="4">
            <base-material-card color="primary" max-width="100%" width="auto" inline class="px-5 py-3 mx-auto">
                <template v-slot:heading>
                    <span class="text-h5 font-weight-bold">
                        <v-icon left large>mdi-account-group-outline</v-icon>L'équipe ECommerce
                    </span>
                    <p />
                    <span class="subtitle-2">
                        Le formulaire ci-contre est à votre disposition pour toutes demandes d’informations.
                        De la simple demande de renseignements ou pour une question technique, ce formulaire est fait pour vous.
                    </span>
                </template>
                <v-card width="auto" height="auto" elevation="0" outlined color="transparent">
                    <v-container fluid>
                        <v-row>
                            <v-col cols="12" md="12">
                                <v-chip small ripple class="mb-2" color="primary">
                                    <v-icon small left>mdi-map-marker</v-icon>Adresse
                                </v-chip><br />
                                <v-chip small ripple color="primary" class="caption" outlined>70 Rue Marius Aufan, 92300 Levallois-Perret</v-chip>
                            </v-col>
                            <v-col cols="12" md="12">
                                <v-chip small ripple class="mb-2" color="primary">
                                    <v-icon small left>mdi-deskphone</v-icon>Téléphone
                                </v-chip><br />
                                <v-chip small ripple color="primary" class="caption" outlined>01.02.03.04.05</v-chip>
                            </v-col>
                            <v-col cols="12" md="12">
                                <v-chip small ripple class="mb-2" color="primary">
                                    <v-icon small left>mdi-email-outline</v-icon>Email
                                </v-chip><br />
                                <v-chip small ripple color="primary" class="caption" outlined>support.ecommerce@gmail.com</v-chip>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </base-material-card>
        </v-col>
        <v-col cols="12" md="8">
            <v-form ref="formContact" v-model="rules.valid" lazy-validation>
                <base-material-card color="primary" icon="mdi-handshake" max-width="100%" width="auto" inline class="px-5 py-3 mx-auto">
                    <template v-slot:after-heading>
                        <span class="text-h5 font-weight-light">Contacter le support</span>
                    </template>
                    <v-card width="auto" height="auto" elevation="0" outlined color="transparent">
                        <v-card-text class="py-0">
                            <v-container fluid>
                                <v-row dense justify="center" align="center" align-content="center">
                                    <v-col align-self="start" order="auto" cols="12" md="6">
                                        <!-- align-self="center" justify="center" align="center" align-content="center" -->
                                        <v-text-field clearable v-model="contact.lastname" label="Nom*" prepend-icon="mdi-face" :rules="rules.caractereRules" required />
                                    </v-col>
                                    <v-col align-self="start" order="auto" cols="12" md="6">
                                        <v-text-field clearable v-model="contact.firstname" label="Prénom*" prepend-icon="mdi-face" :rules="rules.caractereRules" required />
                                    </v-col>
                                    <v-col align-self="start" order="auto" cols="12" md="8">
                                        <v-text-field clearable v-model="contact.email" label="Email*" prepend-icon="mdi-email-outline" :rules="rules.emailRules" required />
                                    </v-col>
                                    <v-col align-self="start" order="auto" cols="12" md="4">
                                        <v-text-field clearable v-model="contact.phone" label="Téléphone" prepend-icon="mdi-deskphone" />
                                    </v-col>
                                    <v-col align-self="start" order="auto" cols="12" md="12">
                                        <v-text-field clearable v-model="contact.objet" label="Objet*" prepend-icon="mdi-text" :rules="rules.champRules" required />
                                    </v-col>
                                    <v-col align-self="start" order="auto" cols="12" md="12">
                                        <tiptap-vuetify :cardProps="{ outlined: true, tile: true, elevation: 3 }" :toolbar-attributes="{ color: 'primary', dark: this.$vuetify.theme.dark }" :placeholder="`Comment pouvons-nous vous aider ?*`" v-model="contact.content" :extensions="extensions" />
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="success" text @click.prevent="sendMail(contact)">
                                <v-icon left>mdi-send-circle-outline</v-icon>Envoyer
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </base-material-card>
            </v-form>
        </v-col>
    </v-row>
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
import Vue, {
    VNode
} from 'vue';
import {
    bus
} from "../../main";
import axiosApi from "../../plugins/axiosApi";
import {
    AxiosResponse,
    AxiosError
} from 'axios';
import Gestion from "../../mixins/Gestion"
import {
    TiptapVuetify,
    Heading,
    Bold,
    Italic,
    Strike,
    Underline,
    Code,
    Paragraph,
    BulletList,
    OrderedList,
    ListItem,
    Link,
    Blockquote,
    HardBreak,
    HorizontalRule,
    History,
    Image
} from 'tiptap-vuetify'

export default Vue.extend({
    name: 'Support',
    mixins: [Gestion],
    props: {},
    components: {
        TiptapVuetify
    },
    data(): any {
        return {
            extensions: [
                History,
                Blockquote,
                Link,
                Underline,
                Strike,
                Italic,
                ListItem,
                BulletList,
                OrderedList,
                [Heading, {
                    options: {
                        levels: [1, 2, 3]
                    }
                }],
                Bold,
                Code,
                HorizontalRule,
                Paragraph,
                HardBreak,
                //Image
            ],
        }
    },
    computed: {
        contact() {
            return {
                lastname: this.isDataOk(this.$store.state.auth.user.lastname) ? this.$store.state.auth.user.lastname : null,
                firstname: this.isDataOk(this.$store.state.auth.user.firstname) ? this.$store.state.auth.user.firstname : null,
                email: this.isDataOk(this.$store.state.auth.user.email) ? this.$store.state.auth.user.email : null,
                phone: this.isDataOk(this.$store.state.auth.user.portable) ? this.$store.state.auth.user.portable : null,
                objet: null,
                content: `<h3>Bonjour le support,</h3><p>-</p><h3>Dans l'attente de votre réponse, veuillez agréer mes salutations distinguées.</h3><h3>Cordialement.</h3>`
            }
        }
    },
    watch: {},
    created() {},
    beforeMount() {
        this.isOverlay = false;
    },
    mounted() {},
    methods: {
        sendMail: function (contact: any) {
            return console.log(contact)
            if (this.isDataOk(contact) && this.isObjectNotEmpty(contact)) {
                if (!this.$refs.formContact.validate()) return this.errorMessage("Veuillez vérifier les champs !");
                else if (!this.isDataOk(contact.content) || contact.content === '' || contact.content.length === 0) return this.errorMessage("Veuillez remplir le message !");
                else {
                    this.isOverlay = true;
                    axiosApi
                        .post("/support/mail", contact, this.configAxios())
                        .then((response: AxiosResponse) => {
                            if (this.isDataOk(response)) {
                                Object.assign(this.$data, this.$options.data()); //reset data
                                this.$refs.formContact.reset();
                                this.successMessage("Le mail a bien été envoyé au support");
                            }
                        })
                        .catch((error: AxiosError) => {
                            this.catchAxios(error)
                        }).finally(() => {
                            this.isOverlay = false;
                        });
                }
            }
        }
    }
});
</script>

<style>
</style>

<template>
<v-container id="facture" tag="section" fluid>
    <base-material-card color="orange" icon="mdi-receipt" max-width="100%" width="auto" inline class="px-5 py-3 mx-auto">
        <template v-slot:after-heading>
            <div class="display-1 font-weight-light">Facture</div>
        </template>
        <v-row>
            <v-col cols="12" md="7">
                <div id="pdf"></div>
            </v-col>
            <v-col cols="12" md="5">
                <v-btn color="red" text>
                    <v-icon left large>mdi-arrow-left</v-icon><span class="ml-5" style="font-size:20px">Retour</span>
                </v-btn><p />
                <v-btn color="orange" text>
                    <v-icon left large>mdi-pencil</v-icon><span class="ml-5" style="font-size:20px">Modifier</span>
                </v-btn><p />
                <v-btn color="success" text>
                    <v-icon left large>mdi-send</v-icon><span class="ml-5" style="font-size:20px">Envoyer par mail</span>
                </v-btn><p />
                <v-btn color="info" text>
                    <v-icon left large>mdi-download</v-icon><span class="ml-5" style="font-size:20px">Générer le document</span>
                </v-btn><p />
            </v-col>
        </v-row>
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
import easyinvoice from 'easyinvoice'

export default Vue.extend({
    name: 'Facture',
    mixins: [Gestion],
    props: {},
    components: {},
    //data: () => ({}),
    data(): any {
        return {}
    },
    computed: {},
    watch: {},
    created() {
        //console.log('created')
    },
    beforeMount() {
        //console.log('beforeMount')
    },
    async mounted() {
        //console.log('mounted')
        await this.renderInvoice()
    },
    methods: {
        async renderInvoice() {
            //See documentation for all data properties
            document.getElementById("pdf").innerHTML = "loading...";
            const data = this.getSampleData();
            const result = await easyinvoice.createInvoice(data);
            easyinvoice.render('pdf', result.pdf);
        },
        getSampleData() {
            return {
                //"documentTitle": "RECEIPT", //Defaults to INVOICE
                "currency": "USD",
                "taxNotation": "vat", //or gst
                "marginTop": 25,
                "marginRight": 25,
                "marginLeft": 25,
                "marginBottom": 25,
                "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png", //or base64
                //"logoExtension": "png", //only when logo is base64
                "sender": {
                    "company": "Sample Corp",
                    "address": "Sample Street 123",
                    "zip": "1234 AB",
                    "city": "Sampletown",
                    "country": "Samplecountry"
                    //"custom1": "custom value 1",
                    //"custom2": "custom value 2",
                    //"custom3": "custom value 3"
                },
                "client": {
                    "company": "Client Corp",
                    "address": "Clientstreet 456",
                    "zip": "4567 CD",
                    "city": "Clientcity",
                    "country": "Clientcountry"
                    //"custom1": "custom value 1",
                    //"custom2": "custom value 2",
                    //"custom3": "custom value 3"
                },
                "invoiceNumber": "2020.0001",
                "invoiceDate": "05-01-2020",
                "products": [{
                        "quantity": "2",
                        "description": "Test1",
                        "tax": 6,
                        "price": 33.87
                    },
                    {
                        "quantity": "4",
                        "description": "Test2",
                        "tax": 21,
                        "price": 10.45
                    }
                ],
                "bottomNotice": "Kindly pay your invoice within 15 days."
            };
        }
    }
});
</script>

<style>
#pdf {
    text-align: center;
}

#pdf canvas {
    border: 1px solid black;
    width: 95%;
}
</style>

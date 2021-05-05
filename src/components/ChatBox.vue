<template>
<v-card class="mx-auto px-3" max-width="auto" tile>
    <v-row>
        <v-col cols="12" md="12" sm="12">
            <v-list-item class="mt-n7" two-line v-for="(item, index) in paginatedData" :key="index">
                <v-list-item-avatar v-ripple :color="item.userInfos.role !== 'Administrateur' ? 'indigo' : 'orange'">
                    <span class="white--text">{{ item.userInfos.firstname.charAt(0).toUpperCase() }}{{ item.userInfos.lastname.charAt(0).toUpperCase() }}</span>
                </v-list-item-avatar>
                <v-list-item-content class="mt-5">
                    <v-card max-width="250" :color="item.userInfos.role !== 'Administrateur' ? 'rgba(63, 81, 181, .8)' : 'rgba(255, 152, 0, .8)'" v-ripple class="white--text py-1 px-2 mb-1">
                        <v-divider class="mb-1" color="transparent"></v-divider>
                        <v-list-item-title :class="item.userInfos.role !== 'Administrateur' ? 'grey--text subtitle-2 mb-1' : 'brown--text subtitle-2 mb-1'">
                            <v-icon left small v-if="item.userInfos.role === 'Administrateur'">mdi-star</v-icon>
                            <v-icon left small v-else>mdi-account</v-icon>{{ item.username }}
                        </v-list-item-title>
                        <!--<v-list-item-subtitle class="white--text subtitle-1">{{ item.message }}</v-list-item-subtitle>-->
                        <span>{{ item.message }}</span>
                        <v-divider class="mt-1" color="transparent"></v-divider>
                    </v-card>
                    <v-list-item-subtitle class="mx-2 caption grey--text">{{ item.createdAt | moment("YYYY/MM/DD HH:mm") }}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </v-col>
        <v-col cols="12" md="12" sm="12" class="pa-0">
            <v-pagination circle color="indigo" v-model="pageNumber" :length="Math.ceil(messages.length/size)" prev-icon="mdi-menu-left" next-icon="mdi-menu-right" total-visible="5" @input="nextPage" />
        </v-col>
        <v-col cols="12" md="12" sm="12">
            <v-text-field class="mx-3 mb-1" color="indigo" hint="Les messages seront automatiquement supprimés" label="Taper un message" @keyup.enter="sendMessage(msg)" v-model.trim="msg" prepend-inner-icon="mdi-alphabetical" clearable />
            <v-btn class="float-right" color="indigo" @click.prevent="sendMessage(msg)" :disabled="!msg" outlined>
                <v-icon left>mdi-send</v-icon>Envoyer
            </v-btn>
        </v-col>
    </v-row>
</v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import {
    bus
} from "../main";
import Gestion from '@/mixins/Gestion';

export default Vue.extend({
    name: 'ChatBox',
    mixins: [Gestion],
    props: ['messages'],
    components: {},
    data(): any {
        return {
            msg: '',
            pageNumber: 1 as number,
            size: 5 as number,
        }
    },
    computed: {
        pageCount() {
            let l = this.messages.length,
                s = this.size;
            return Math.ceil(l / s) - 1;
        },
        paginatedData() {
            const start = this.pageNumber * this.size - this.size,
                end = start + this.size;
            return this.messages.slice(start, end);
        }
    },
    created() {},
    beforeMount() {},
    mounted() {},
    methods: {
        sendMessage: function (msg: string) {
            if (!msg) return;
            this.$emit('sendMessage', msg);
            this.msg = "";
        },
        nextPage(page: number) {
            this.pageNumber = page;
        }
    }
});
</script>

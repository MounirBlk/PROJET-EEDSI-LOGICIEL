<template>
<v-container>
    <v-subheader class="my-2">
        <v-badge color="indigo" bordered overlap :content="users.length === 0 ? '0' : users.length">
            <v-icon large color="indigo">mdi-face-outline</v-icon>
        </v-badge>
        <v-badge class="ml-4" :color="messages.length === 0 || !isAdmin ? 'grey' : 'red darken-2'" overlap :content="messages.length === 0 ? '0 messages' : `${messages.length} messages`">
            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn :disabled="messages.length === 0 || !isAdmin" color="red darken-2" icon @click="resetMessages" v-bind="attrs" v-on="on">
                        <v-icon large>mdi-restore</v-icon>
                    </v-btn>
                </template>
                <span>Reset</span>
            </v-tooltip>
        </v-badge>
    </v-subheader>
    <v-skeleton-loader v-if="isLoading" class="mx-3" type="list-item-three-line"></v-skeleton-loader>
    <base-chat-box v-else :messages="messages" @sendMessage="this.sendMessage" />
</v-container>
</template>

<script lang="ts">
// @ is an alias to /src
import io from 'socket.io-client';
import Vue from 'vue';
import {
    bus
} from "../../main";
import axiosApi from '../../plugins/axiosApi';
import qs from "qs";
import {
    AxiosResponse
} from 'axios';
import Gestion from '@/mixins/Gestion';

export default Vue.extend({
    name: 'Chat',
    props: {},
    mixins: [Gestion],
    components: {},
    data(): any {
        return {
            //socket: io("https://api-imie-e-commerce.herokuapp.com"),
            messages: [],
            users: [],
            isLoading: false as boolean
        }
    },
    computed: {
        socket(){
            return io(this.$store.state.baseUrl);
        }
    },
    created() {},
    beforeMount() {},
    mounted() {
        this.joinServer();
    },
    methods: {
        joinServer: function () {
            this.isLoading = true;
            this.socket.on('loggedIn', (data: any) => {
                this.users = data.users;
                this.socket.emit('getMessagesDB')
                this.socket.emit('newUser', localStorage.getItem("token"));
            });
            this.listen();
            this.isLoading = false;
        },
        listen: function () {
            this.socket.on('getMessagesEmpty', (messages: any) => {
                this.messages = messages;
            });
            this.socket.on('userOnline', (username: string) => {
                this.users.push(username);
            });
            this.socket.on('userLeft', (user: any) => {
                this.users.splice(this.users.indexOf(user), 1);
            });
            this.socket.on('getMessage', (message: string) => { //recuperation msg de socket node
                this.messages.push(message)
            });
            this.socket.on('getAllMessages', (messages: any[]) => { //recuperation msg de socket node
                this.messages = messages;
            });
        },
        sendMessage: function (message: string) {
            this.socket.emit('newMessage', message); // envoie msg vers socket node
        },
        resetMessages: function () {
            this.socket.emit('resetMessages')
        },

    }
});
</script>

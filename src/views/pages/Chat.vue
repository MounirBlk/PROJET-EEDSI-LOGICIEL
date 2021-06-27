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
    <base-chat-box :messages="messages" @sendMessage="this.sendNewMessage" />
</v-container>
</template>

<script lang="ts">
// @ is an alias to /src
import io from 'socket.io-client';
import Vue from 'vue';
import {
    bus
} from "@/main";
import axiosApi from '@/plugins/axiosApi';
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
            messages: [],
            users: [],
        }
    },
    computed: {
        /*socket() {
            return io(this.$store.state.baseUrl);
        }*/
    },
    created() {},
    beforeMount() {},
    mounted() {
        this.joinServer();
    },
    sockets: {},
    methods: {
        joinServer: function () {
            this.socket.on('loggedIn', (data: any) => {
                this.users = data.users;
                this.socket.emit('getMessagesDB')
                this.socket.emit('newUser', localStorage.getItem("token"));
            });
            this.listen();
        },
        listen: function () {
            this.socket.on('getMessagesEmpty', (messages: any) => {
                this.messages = messages;
                this.messages = this.triDate(this.messages, 'createdAt', true);
                this.$emit('messagesCounter', this.messages.length)
            });
            this.socket.on('userOnline', (username: string) => {
                this.users.push(username);
            });
            this.socket.on('userLeft', (user: any) => {
                this.users.splice(this.users.indexOf(user), 1);
            });
            this.socket.on('getMessage', (data: any) => { //recuperation msg de socket node
                this.openNotification('top-right', data.userInfos.role === 'Administrateur' ? 'primary' : '#FFA500', '' , ' Message de ' + data.username + '<br /> > ' + data.message)
                this.messages.push(data)
                this.messages = this.triDate(this.messages, 'createdAt', true);
                this.$emit('messagesCounter', this.messages.length)
            });
            this.socket.on('getAllMessages', (messages: any[]) => { //recuperation msg de socket node
                this.messages = messages;
                this.messages = this.triDate(this.messages, 'createdAt', true);
                this.$emit('messagesCounter', this.messages.length)
            });
        },
        sendNewMessage: function (message: string) {
            this.socket.emit('newMessage', message); // envoie msg vers socket node
        },
        resetMessages: function () {
            this.socket.emit('resetMessages')
        },
    }
});
</script>

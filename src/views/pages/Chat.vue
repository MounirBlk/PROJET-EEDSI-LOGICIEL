<template>
<v-container>
    <v-subheader class="mt-2 mb-1">
        <v-badge color="indigo" bordered overlap :content="users.length === 0 ? '0' : users.length">
            <v-icon large color="indigo">mdi-face-outline</v-icon>
        </v-badge>
    </v-subheader>
    <base-chat-box :messages="messages" @sendMessage="this.sendMessage" />
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

export default Vue.extend({
    name: 'Chat',
    props: {},
    components: {},
    data(): any {
        return {
            socket: io("https://api-imie-e-commerce.herokuapp.com"),
            messages: [],
            users: [],
        }
    },
    computed: {

    },
    created() {},
    beforeMount() {},
    mounted() {
        this.joinServer();
    },
    methods: {
        joinServer: async function () {
            this.socket.on('loggedIn', (data: any) => {
                this.messages = data.messages;
                this.users = data.users;
                this.socket.emit('newuser', localStorage.getItem("token"));
            });
            this.listen();
        },
        listen: async function () {
            this.socket.on('userOnline', (user: any) => {
                this.users.push(user);
            });
            this.socket.on('userLeft', (user: any) => {
                this.users.splice(this.users.indexOf(user), 1);
            });
            this.socket.on('msg', (message: string) => {
                this.messages.push(message)
            });
        },
        sendMessage: function (message: string) {
            this.socket.emit('msg', message);
        },
        getUtilisateurData: function (): Promise < any > {
            return new Promise((resolve, reject) => {
                axiosApi
                    .get("/user/own")
                    .then((response) => {
                        resolve(response.data.user);
                    })
                    .catch((error) => {
                        reject(error)
                    })
            });
        },
    }
});
</script>

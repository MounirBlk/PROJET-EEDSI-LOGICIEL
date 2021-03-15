<template>
<v-container id="calendar">
    <v-row>
        <v-col cols="12" md="12" sm="12">
            <base-material-card icon="mdi-calendar-month-outline" color="error" max-width="100%" width="auto" class="px-5 py-3 mx-auto">
                <template v-slot:after-heading>
                    <div class="display-1 font-weight-light">Calendrier de livraisons</div>
                </template>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-card>
                            <v-toolbar flat>
                                <v-toolbar-title v-if="$vuetify.breakpoint.mdAndUp">{{ new Date().toISOString().substr(0, 10) }}</v-toolbar-title>
                                <v-btn color="error" icon class="ml-3">
                                    <v-icon large>mdi-refresh</v-icon>
                                </v-btn>
                            </v-toolbar>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row class="fill-height">
                    <v-col>
                        <v-sheet height="64">
                            <v-toolbar flat>
                                <v-btn outlined class="mr-4" color="error darken-2" @click="setToday">
                                    Today
                                </v-btn>
                                <v-btn fab text small color="error darken-2" @click="prev">
                                    <v-icon small>
                                        mdi-chevron-left
                                    </v-icon>
                                </v-btn>
                                <v-btn fab text small color="error darken-2" @click="next">
                                    <v-icon small>
                                        mdi-chevron-right
                                    </v-icon>
                                </v-btn>
                                <v-toolbar-title v-if="$refs.calendar">
                                    {{ $refs.calendar.title }}
                                </v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-menu bottom right>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn outlined color="error darken-2" v-bind="attrs" v-on="on">
                                            <span>{{ typeToLabel[type] }}</span>
                                            <v-icon right>
                                                mdi-menu-down
                                            </v-icon>
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item @click="type = 'day'">
                                            <v-list-item-title>Day</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="type = 'week'">
                                            <v-list-item-title>Week</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="type = 'month'">
                                            <v-list-item-title>Month</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="type = '4day'">
                                            <v-list-item-title>4 days</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </v-toolbar>
                        </v-sheet>
                        <v-sheet height="600">
                            <v-calendar ref="calendar" v-model="focus" color="primary" :events="events" :event-color="getEventColor" :type="type" @click:event="showEvent" @click:more="viewDay" @click:date="viewDay" @change="updateRange"></v-calendar>
                            <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
                                <v-card min-width="350px" flat>
                                    <v-toolbar :color="selectedEvent.color">
                                        <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                                    </v-toolbar>
                                    <v-card-text>
                                        <span v-html="selectedEvent.details"></span>
                                        <v-select :color="selectedEvent.color" prepend-inner-icon="mdi-format-list-bulleted-type" :items="['Livreur1 livreur1', 'Livreur2 livreur2']" label="Livreur*"></v-select>

                                    </v-card-text>
                                    <v-card-actions>
                                        <v-btn text color="error" @click="selectedOpen = false">
                                            Cancel
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                        <v-btn text color="success" @click="selectedOpen = false">
                                            Valider
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-menu>
                        </v-sheet>
                    </v-col>
                </v-row>
            </base-material-card>
        </v-col>
    </v-row>
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
            focus: '',
            type: 'month',
            typeToLabel: {
                month: 'Month',
                week: 'Week',
                day: 'Day',
                '4day': '4 Days',
            },
            selectedEvent: {},
            selectedElement: null,
            selectedOpen: false,
            events: [],
            colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
            names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
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
    mounted() {
        this.$refs.calendar.checkChange()
    },
    methods: {
        viewDay({
            date
        }: any) {
            this.focus = date
            this.type = 'day'
        },
        getEventColor(event: any) {
            return event.color
        },
        setToday() {
            this.focus = ''
        },
        prev() {
            this.$refs.calendar.prev()
        },
        next() {
            this.$refs.calendar.next()
        },
        showEvent({
            nativeEvent,
            event
        }: any) {
            const open = () => {
                this.selectedEvent = event
                this.selectedElement = nativeEvent.target
                setTimeout(() => {
                    this.selectedOpen = true
                }, 10)
            }

            if (this.selectedOpen) {
                this.selectedOpen = false
                setTimeout(open, 10)
            } else {
                open()
            }

            nativeEvent.stopPropagation()
        },
        updateRange({
            start,
            end
        }: any) {
            const events = []

            const min = new Date(`${start.date}T00:00:00`)
            const max = new Date(`${end.date}T23:59:59`)
            const days = (max.getTime() - min.getTime()) / 86400000
            const eventCount = this.rnd(days, days + 20)

            for (let i = 0; i < eventCount; i++) {
                const allDay = this.rnd(0, 3) === 0
                const firstTimestamp = this.rnd(min.getTime(), max.getTime())
                const first = new Date(firstTimestamp - (firstTimestamp % 900000))
                const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
                const second = new Date(first.getTime() + secondTimestamp)

                events.push({
                    name: this.names[this.rnd(0, this.names.length - 1)],
                    start: first,
                    end: second,
                    color: this.colors[this.rnd(0, this.colors.length - 1)],
                    timed: !allDay,
                })
            }

            this.events = events
        },
        rnd(a: number, b: number) {
            return Math.floor((b - a + 1) * Math.random()) + a
        },
    }
});
</script>

<style>
</style>

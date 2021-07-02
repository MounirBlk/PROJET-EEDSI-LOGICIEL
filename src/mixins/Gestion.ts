import Vue, {
    VNode
} from 'vue';
import { bus } from "@/main";
import { rules } from "@/plugins/observable"
import { mapState, mapMutations } from "vuex";
import moment from 'moment';
import io from 'socket.io-client';
import { AxiosRequestConfig } from 'axios';

export default Vue.extend({
    name: 'Mixins',
    props: {},
    components: {},
    data: (): any => ({
        showPassword: false as boolean,
        isSuccess: false as boolean,//snackbar
        isSnackbarOpened: false as boolean,//snackbar
        snackbarMessage: "" as string,//snackbar
        resetComponentKey: 0 as number,//reset chart render
        opacity: 0.8 as number, //overlay
        isAbsolute: true as boolean, //overlay
        isOverlay: true as boolean, //overlay
        isLoading: true as boolean,//squeleton-loader
        isFirstLoad: true as boolean,//squeleton-loader
        radientColors: [{
            color: "#FC2525",
            colorOne: "rgba(255, 0,0, 0.6)",
            colorTwo: "rgba(255, 0, 0, 0.25)",
            colorThree: "rgba(255, 0, 0, 0)",
        }, {
            color: "#05CBE1",
            colorOne: "rgba(0, 231, 255, 0.9)",
            colorTwo: "rgba(0, 231, 255, 0.25)",
            colorThree: "rgba(0, 231, 255, 0)",
        }, {
            color: "#ff9800",
            colorOne: "rgba(255, 152, 0, 0.9)",
            colorTwo: "rgba(255, 152, 0, 0.4)",
            colorThree: "rgba(255, 152, 0, 0)",
        }, {
            color: "#4caf50",
            colorOne: "rgba(76, 175, 80, 0.9)",
            colorTwo: "rgba(76, 175, 80, 0.25)",
            colorThree: "rgba(76, 175, 80, 0)",
        }, {
            color: "#c122d6",
            colorOne: "rgba(193, 34, 214, 0.9)",
            colorTwo: "rgba(193, 34, 214, 0.25)",
            colorThree: "rgba(193, 34, 214, 0)",
        }],
        urlUsersData: 'https://jsonplaceholder.typicode.com/users'
    }),
    computed: {
        rules(){
            return rules;
        },
        ...mapState(["isAdmin"]),
        ...mapState(["baseUrl"]),
        /*isAdmin(): boolean {
            return this.$store.state.isAdmin;
        },*/
        socket() {
            return io(this.$store.state.baseUrl);
        },
    },        
    created() {},
    beforeMount() {},
    mounted(){},
    methods: {
        ...mapMutations({
            setAdminStatus: "SET_IS_ADMIN"
        }),
        successMessage: function (message: string): void {
            this.snackbarMessage = message;
            this.isSuccess = true;
            this.isSnackbarOpened = true;
        },
        errorMessage: function (message: string): void {
            this.snackbarMessage = message;
            this.isSuccess = false;
            this.isSnackbarOpened = true;
        },
        catchAxios: function (errorObj: any): void {
            if(errorObj.data){
                console.log(`ERROR ${JSON.stringify(errorObj.status ? errorObj.status : 500)} : ${JSON.stringify(errorObj.data.message ? errorObj.data.message : '')}`);
                this.errorMessage(errorObj.data.message ? errorObj.data.message : 'Le serveur ne répond plus !');
            }else{
                console.log(JSON.stringify(errorObj))
                this.errorMessage('Le serveur ne répond plus !')
            }
        },
        configAxios: function(): AxiosRequestConfig {
            return {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    "Accept": 'application/json'
                },
                //responseType: 'json'
            } as AxiosRequestConfig
        },
        changeToFormatDateFr (input: string): string{
            return moment(input).format('DD-MM-YYYY')
        },
        changeToFormatDateEn(input: string): string{
            return moment(input).format('YYYY-MM-DD')
        },
        /*------------------------------------------------------ */
        verifyResponseOk: function (responseData: any) {
            const tmpStr = JSON.stringify(responseData);
            if (tmpStr.startsWith('"Error:')) {
                this.errorMessage(responseData.substring(7)); // suppress "Error:
                return false;
            }
            return true;
        },
        openNotification(position: any = null, color: '#3f51b5', title: '', message: '') {//indigo = #3f51b5
            this.$vs.notification({
                color,
                position,
                width: null,
                icon: null,// `<i class='bx bx-select-multiple' ></i>`
                duration: '5000',//en ms ou null
                title: "<h1 style='font-weight: lighter'>" + title +"</h1>",
                text: "<h2 style='font-weight: lighter'>" + message + "</h2>"
            })
        },
        randNumber: function (min: number, max: number): number {
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        /**
         * @param {Array} tabDates Tableau de dates
         * @param {string} keyObject Clé de l'objet du tab
         * @param {boolean} isPriorityNewDate true -> retourne les dernières dates proche du présent
         */
        triDate(tabDates: any[], keyObject: string, isPriorityNewDate: boolean){
            return tabDates.sort((a: any, b: any) => {
                const dateA = a[keyObject];
                const dateB = b[keyObject];
                if (isPriorityNewDate ? dateA > dateB : dateA < dateB) {
                    return -1;
                } else if (dateA == dateB) {
                    return 0;
                } else {
                    return 1;
                }
            });
        }
    }
})
import Vue, {
    VNode
} from 'vue';
import { bus } from "@/main";
import { rules } from "@/plugins/observable"
import { mapState, mapMutations } from "vuex";
import moment from 'moment';

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
        }]
    }),
    computed: {
        rules(){
            return rules;
        },
        ...mapState(["isAdmin"]),
        /*isAdmin(): boolean {
            return this.$store.state.isAdmin;
        },*/
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
                console.log(`ERROR ${JSON.stringify(errorObj.status)} : ${JSON.stringify(errorObj.data.message)}`);
                this.errorMessage(errorObj.data.message);
            }else{
                console.log(JSON.stringify(errorObj))
                this.errorMessage('Erreur serveur !')
            }
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
    }
})
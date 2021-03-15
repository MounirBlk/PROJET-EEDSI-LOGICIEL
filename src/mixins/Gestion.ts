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
    created() {
      //console.log('created')
    },
    beforeMount() {
      //console.log('beforeMount')
    },
    mounted(){
      //console.log('mounted')
    },
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
            console.log(
                "ERROR " +
                JSON.stringify(errorObj.status) +
                " : " +
                JSON.stringify(errorObj.data.message)
            );
            this.errorMessage(
                "ERROR " +
                JSON.stringify(errorObj.status) +
                " : " +
                JSON.stringify(errorObj.data.message)
            );
        },
        resetRenderChart: function(): void {
            this.resetComponentKey += 1;
        },
        changeToFormatDateFr (input: string): string{
            return moment(input).format('DD-MM-YYYY')
        },
        changeToFormatDateEn(input: string): string{
            return moment(input).format('YYYY-MM-DD')
        }
        /*------------------------------------------------------ */
        /*verifyResponseOk: function (responseData: any) {
            var tmpStr = JSON.stringify(responseData);
            if (tmpStr.startsWith('"Error:')) {
                this.errorMessage(responseData.substring(7)); // suppress "Error:
                return false;
            }
            return true;
        },*/
    }
})
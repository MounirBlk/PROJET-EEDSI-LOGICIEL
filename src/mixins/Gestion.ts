import Vue, {
    VNode
} from 'vue';
import { bus } from "@/main";
import { rules } from "@/plugins/observable"
import { mapState, mapMutations } from "vuex";

export default Vue.extend({
    name: 'Mixins',
    props: {},
    components: {},
    data: (): any => ({
        isSuccess: false,//snackbar
        isSnackbarOpened: false,//snackbar
        snackbarMessage: "",//snackbar
        resetComponentKey: 0,//reset chart render
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
        changeToFormatDateFr (input: any): string{
            const datePart = input.match(/\d+/g)
            const year = datePart[0] // get only two digits
            const month = datePart[1];
            const day = datePart[2];
            return day+'-'+month+'-'+year;
        },
        changeToFormatDateEn(input: any): string{
            const datePart = input.split('-')
            return datePart[2]+'-'+datePart[1]+'-'+datePart[0];
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
import Vue, {
    VNode
} from 'vue';
import { bus } from "@/main";
import { rules } from "@/plugins/observable"

export default Vue.extend({
    name: 'Mixins',
    props: {},
    components: {},
    data: (): any => ({
        isSuccess: false,
        isSnackbarOpened: false,
        snackbarMessage: "",
        resetComponentKey: 0,
    }),
    computed: {
        rules(){
            return rules;
        },
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
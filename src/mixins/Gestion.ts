import Vue, { VNode } from 'vue';
import { bus } from '@/main';
import { rules } from '@/plugins/observable';
import { mapState, mapMutations, mapActions } from 'vuex';
import moment from 'moment';
import io from 'socket.io-client';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosApi from '@/plugins/axiosApi';

/*Vue.directive('filter', {
	bind: function (el, binding, vnode) {
		el.style.filter = binding.value
	}
})*/

export default Vue.extend({
	name: 'Mixins',
	props: {},
	components: {},
	directives: {
		filter: {
			bind: function (el, binding, vnode) {
				el.style.filter = binding.value
			}
		}
	},
	data: (): any => ({
		showPassword: false as boolean,
		isSuccess: false as boolean, //snackbar
		isSnackbarOpened: false as boolean, //snackbar
		snackbarMessage: '' as string, //snackbar
		resetComponentKey: 0 as number, //reset chart render
		opacity: 0.8 as number, //overlay
		isAbsolute: true as boolean, //overlay
		isOverlay: true as boolean, //overlay
		isLoading: true as boolean, //squeleton-loader
		isFirstLoad: true as boolean, //squeleton-loader
		radientColors: [
			{
				color: '#FC2525',
				colorOne: 'rgba(255, 0,0, 0.6)',
				colorTwo: 'rgba(255, 0, 0, 0.25)',
				colorThree: 'rgba(255, 0, 0, 0)'
			},
			{
				color: '#05CBE1',
				colorOne: 'rgba(0, 231, 255, 0.9)',
				colorTwo: 'rgba(0, 231, 255, 0.25)',
				colorThree: 'rgba(0, 231, 255, 0)'
			},
			{
				color: '#ff9800',
				colorOne: 'rgba(255, 152, 0, 0.9)',
				colorTwo: 'rgba(255, 152, 0, 0.4)',
				colorThree: 'rgba(255, 152, 0, 0)'
			},
			{
				color: '#4caf50',
				colorOne: 'rgba(76, 175, 80, 0.9)',
				colorTwo: 'rgba(76, 175, 80, 0.25)',
				colorThree: 'rgba(76, 175, 80, 0)'
			},
			{
				color: '#c122d6',
				colorOne: 'rgba(193, 34, 214, 0.9)',
				colorTwo: 'rgba(193, 34, 214, 0.25)',
				colorThree: 'rgba(193, 34, 214, 0)'
			}
		],
		urlUsersData: 'https://jsonplaceholder.typicode.com/users',
	}),
	computed: {
		rules() {
			return rules;
		},
		...mapState([ 'baseUrl' ]),
		isAdmin(): boolean {
            return this.$store.state.auth.user.role === 'Administrateur';
        },
		socket() {
			return io(this.$store.state.baseUrl);
		}
	},
	created() {},
	beforeMount() {},
	mounted() {},
	methods: {
		...mapMutations({
            setUser: 'SET_USER',
            setToken: 'SET_TOKEN'
        }),
		...mapActions({
			logOut: 'clearToken',
		}),
		successMessage: function(message: string): void {
			this.snackbarMessage = message;
			this.isSuccess = true;
			this.isSnackbarOpened = true;
		},
		errorMessage: function(message: string): void {
			this.snackbarMessage = message;
			this.isSuccess = false;
			this.isSnackbarOpened = true;
		},
		catchAxios: function(errorObj: any): void {
			if (this.isObjectNotEmpty(errorObj.data)) {
				console.log(
					`ERROR ${JSON.stringify(errorObj.status ? errorObj.status : 500)} : ${JSON.stringify(
						this.isDataOk(errorObj.data.message) ? errorObj.data.message : ''
					)}`
				);
				this.errorMessage(this.isDataOk(errorObj.data.message) ? errorObj.data.message : 'Le serveur ne répond plus !');
			} else {
				console.log(JSON.stringify(errorObj));
				this.errorMessage('Le serveur ne répond plus !');
			}
		},
		configAxios: function(): AxiosRequestConfig {
			return {
				headers: {
					'Content-Type': 'application/json;charset=utf-8',
					Accept: 'application/json'
				}
				//responseType: 'json'
			} as AxiosRequestConfig;
		},
		changeToFormatDateFr(input: string): string {
			return moment(input).format('DD-MM-YYYY');
		},
		changeToFormatDateEn(input: string): string {
			return moment(input).format('YYYY-MM-DD');
		},
		/*------------------------------------------------------ */
		verifyResponseOk: function(responseData: any) {
			const tmpStr = JSON.stringify(responseData);
			if (tmpStr.startsWith('"Error:')) {
				this.errorMessage(responseData.substring(7)); // suppress "Error:
				return false;
			}
			return true;
		},
		openNotification(position: any = null, color: '#3f51b5', title: '', message: '') {
			//indigo = #3f51b5
			this.$vs.notification({
				color,
				position,
				width: null,
				icon: null, // `<i class='bx bx-select-multiple' ></i>`
				duration: 5000, //en ms ou null
				title: "<h1 style='font-weight: lighter'>" + title + '</h1>',
				text: "<h2 style='font-weight: lighter'>" + message + '</h2>'
			});
		},
		randNumber: function(min: number, max: number): number {
			return Math.floor(Math.random() * (max - min + 1) + min);
		},
		/**
         * @param {Array} tabDates Tableau de dates
         * @param {string} keyObject Clé de l'objet du tab
         * @param {boolean} isPriorityNewDate true -> retourne les dernières dates proche du présent
         */
		triDate(tabDates: any[], keyObject: string, isPriorityNewDate: boolean) {
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
		},
		getOwnUserData(){
			return new Promise((resolve, reject) => {
				const token: string | null = localStorage.getItem('SET_TOKEN');
				if (token && this.isDataOk(token)) {
					axiosApi
						.get("/user/own")
						.then((response: AxiosResponse) => {
							if(this.isObjectNotEmpty(response.data)){
								if (!response.data.error && response.data.user) {
									setTimeout(() => {
										this.setUser(response.data.user); //$store.state.auth.user
										this.setToken(token)
										resolve(response.data.user)//USER
									}, 1000);
								}
							}
						})
						.catch((error) => {
							reject(error);
						});
				}
			});
		},
		isObjectNotEmpty(objectTest: any) {
			return objectTest && typeof objectTest === 'object' && Object.keys(objectTest).length !== 0 ? true : false;
		},
		isDataOk(data: string | any[] | object | number | null | undefined) {
            if (typeof data === 'string') {
                return data && data !== null && data !== undefined /*&& data.length !== 0 && data !== ''*/
            } else {
                return data && data !== null && data !== undefined
            }
        },
        scrollToByRef(refName: string) {
            this.$nextTick(() => { //this.$nextTick to refresh DOM
                const el = this.$refs[refName];
                if (el) {
                    el.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        }
	}
});

import { Module, createNamespacedHelpers } from 'vuex';
import axiosApi from '@/plugins/axiosApi';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import qs from 'qs';

export default {
	state: {
		token: null, 
		user: {}
	},
	mutations: {
		SET_TOKEN(state, payload) {
			state.token = payload;
		},
		SET_USER(state, payload) {
			state.user = payload;
		}
	},
	actions: {
		authLogin: function({ commit, dispatch }, payload: InfosLoginInterface) {
			return new Promise((resolve, reject) => {
				axiosApi
					.post('/login', qs.stringify(payload))
					.then(async (response: AxiosResponse) => {
						await dispatch('setToken', response.data.token as string);
						resolve(response);
					})
					.catch((err) => {
						reject(err);
					});
			});
		},
		setToken: function({ commit }, token: string) {
			commit('SET_TOKEN', token);
			localStorage.setItem('SET_TOKEN', token); 
			axiosApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		},
		clearToken: function({ commit }) {
			commit('SET_TOKEN', null);
			localStorage.clear();
			axiosApi.defaults.headers.common['Authorization'] = null;
		}
	}
} as Module<any, any>;

interface InfosLoginInterface {
	email: string;
	password: string;
}

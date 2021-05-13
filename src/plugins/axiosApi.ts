import router from '@/router';
import axios from 'axios';
import store from '@/store/index'

const axiosApi = axios.create({
    baseURL: store.state.baseUrl,
    headers: {
        "Accept": 'application/json',
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    }
})

// Add a request interceptor
axiosApi.interceptors.request.use((config: any) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.common["Authorization"] = `Bearer ${token}`;
    }
    return config;
}, function(error) {
    return Promise.reject(error);
});

// Add a response interceptor
axiosApi.interceptors.response.use((response: any) => {
    return response;
}, error => {
    if (error.response.status) {
        switch (error.response.status) {
            case 401:
                localStorage.clear();
                router.replace({
                    path: "/login",
                    /*query: {
                        redirect: router.currentRoute.fullPath
                    }*/
                }).catch(()=>{});;
                break;
        }
        return Promise.reject(error.response);
    }
});

export default axiosApi;
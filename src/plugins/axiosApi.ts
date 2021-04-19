import router from '@/router';
import axios from 'axios';

const axiosApi = axios.create({
    baseURL: 'https://api-imie-e-commerce.herokuapp.com/',
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
                    query: {
                        redirect: router.currentRoute.fullPath
                    }
                });
                break;
        }
        return Promise.reject(error.response);
    }
});

export default axiosApi;
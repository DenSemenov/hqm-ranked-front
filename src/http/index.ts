import { notification } from 'antd';
import axios, { AxiosRequestHeaders } from 'axios';
import { stringify } from 'qs';

export const API_URL = "https://localhost:7199";

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
})

$api.interceptors.request.use((config) => {
    if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders
    }
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

$api.interceptors.response.use(
    (config) => {
        return config
    },
    async (error) => {
        const originalRequest = error.config
        if (error.response.status === 401 && error.config && !error.config.isRetry) {
            originalRequest.isRetry = true
        }
        if (error.response.data.error) {
            error.message = error.response.data.error
        } else if (error.response.status === 500) {
            error.message = 'Internal Server Error'
        } else if (error.response.status === 400) {
            notification.error({
                message: "",
                description: error.response.data.errorText
            })
        }
        throw error
    }
)

$api.defaults.paramsSerializer = (params) => { return stringify(params, { arrayFormat: 'repeat' }) }

export default $api

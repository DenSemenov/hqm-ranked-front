import { App, notification } from 'antd';
import axios, { AxiosRequestHeaders } from 'axios';
import { stringify } from 'qs';

export const API_URL = "https://api.hqmranked.com";


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
        if (error.response.status === 401) {
            notification.error({
                message: error.response.data.errorText,
            })
        }
        if (error.response.data.error) {
            error.message = error.response.data.error
            notification.error({
                message: error.response.data.error,
            })
        } else if (error.response.status === 500) {
            error.message = 'Internal Server Error'
            notification.error({
                message: 'Internal Server Error',
            })
        } else if (error.response.status === 400) {
            notification.error({
                message: error.response.data.errorText,
            })
        }
        throw error
    }
)

$api.defaults.paramsSerializer = (params) => { return stringify(params, { arrayFormat: 'repeat' }) }

export default $api

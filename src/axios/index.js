import axios from 'axios';
import qs from "qs";
import {
    Message
} from 'element-ui';
import store from '@/vuex/store';
store.commit("env");
console.log(store.state.env);
// axios 配置
axios.defaults.baseURL = store.state.env;
let baseURL = store.state.env;
axios.defaults.timeout = 10000; // 设置超时时间为3s
// 配置axios发送请求时携带cookie
axios.defaults.withCredentials = false;
// 设置content-type
// 这里处理的是 针对SpringMVC Controller 无法正确获得请求参数的问题
// axios.interceptors.request.use(
//     config => {
//         config.headers = {
//             'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
//         }
//         const data = config.data
//         if (!data) {
//             return config
//         }
//         return config
//     },
//     error => {
//         return Promise.reject(error)
//     }
// )
// 添加请求拦截器
axios.interceptors.request.use(function(config) {
    // 在发送请求之前做些什么
    // store.state.loading = true;
    // showLoading

    config.headers = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
    store.commit("showLoading")
    if (config.method === "post") {
        // 序列化
        config.data = qs.stringify(config.data);
        // 温馨提示,提交能直接接受json 格式,可以不用 qs 来序列化的
    }
    //   if (localStorage.token) {
    //     config.headers.Authorization = localStorage.token;
    //   }
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

axios.interceptors.response.use(response => {
    // 对响应数据做点什么
    store.commit("hideLoading");
    const res = response.data;
    if (res.status !== 0) {
        Message({
            message: res.statusinfo,
            type: 'error',
            duration: 5 * 1000
        })
        if (res.status == 999) {
            window.location.href = "/#/login";
        }
    }
    return response.data
}, error => {
    store.commit("hideLoading");
    // 对响应错误做点什么
    // 如果路由改变提示信息提示
    if (error.message.search('timeout') !== -1) { // 超时error捕获
        Message({
            message: "请求超时",
            type: 'error',
            duration: 3 * 1000
        })
    } else {
        Message({
            message: error.message,
            type: 'error',
            duration: 3 * 1000
        })
    }
    return Promise.reject(error)
});

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(`${baseURL}${url}`, {
                params: params
            })
            .then(response => {
                resolve(response);
            })
            .catch(err => {
                reject(err)
            })
    })
};

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}, header = {}) {
    return new Promise((resolve, reject) => {
        axios.post(`${baseURL}${url}`, data, header)
            .then(response => {
                resolve(response);
            }, err => {
                reject(err)
            })
    })
}

/**
 * 创建axios上传实例
 */
let instance = axios.create({
    timeout: 10000,
    headers:{"Conten-Tyep":"multipart/form-data"}
});
// 配置instance发送请求时携带cookie
instance.defaults.withCredentials = false;

instance.interceptors.response.use(response => {
    // 对响应数据做点什么
    store.commit("hideLoading");
    const res = response.data;
    if (res.status !== 0) {
        Message({
            message: res.statusinfo,
            type: 'error',
            duration: 5 * 1000
        })
        if (res.status == 999) {
            window.location.href = "/#/login";
        }
    }
    return response.data
}, error => {
    store.commit("hideLoading");
    // 对响应错误做点什么
    // 如果路由改变提示信息提示
    if (error.message.search('timeout') !== -1) { // 超时error捕获
        Message({
            message: "请求超时",
            type: 'error',
            duration: 3 * 1000
        })
    } else {
        Message({
            message: error.message,
            type: 'error',
            duration: 3 * 1000
        })
    }
    return Promise.reject(error)
});

/**
 * 封装上传请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function fileUpload(url, data = {}) {
    return new Promise((resolve, reject) => {
        instance.post(`${baseURL}${url}`, data, {
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            transformRequest: [function(data) {
                return data
            }],
            onUploadProgress: function(e) {
                var percentage = Math.round((e.loaded * 100) / e.total) || 0;
                if (percentage < 100) {
                    console.log(percentage + '%'); // 上传进度
                }
            }
        })
        .then(response => {
            resolve(response);
        }, err => {
            reject(err)
        })
    })
}

export default axios
/**
 * http请求拦截处理
 */
import axios from 'axios'
import {
    Message
} from 'element-ui'
const instanceInternet = axios.create();
instanceInternet.defaults.headers = {
    'Content-Type': 'application/json'
};
instanceInternet.interceptors.request.use(config => {
    // config.baseURL = window.vm.API.internet.baseURL;
    // //过滤拦截路径
    let bFilter = false;
    window.vm.API.internet.constObj.requestFilter.forEach((v, i) => {
        if (config.url.includes(v)) {
            bFilter = true;
        }
    })
    if (bFilter) { //拦截的请求
        let stateObj = window.vm.$store.state;
        let submitToken = stateObj.internetToken;
        config.headers['X-Authorization'] = submitToken;
        return config;
    } else {
        //清除登录信息并跳转到登录页面
        window.vm.commonFun.againLogin();
        return;
    }
}, error => {
    Message.error({
        message: '加载超时'
    })
    return Promise.reject(error);
});
// http响应拦截器
instanceInternet.interceptors.response.use(response => {
    return response;
}, error => {
    return Promise.reject(error);
})
export default instanceInternet;

/**
 * http请求拦截处理
 */
import axios from 'axios'
const instance = axios.create();
instance.defaults.headers = {
	'Content-Type':'application/x-www-form-urlencoded'
};
// http请求拦截器
instance.interceptors.request.use(config => {
    config.baseURL = window.vm.API.leansite.baseURL;
	if(config.method.toUpperCase() =="POST"){//post方式时，提交的参数转成string类型
		config.headers['Content-Type'] = 'application/json';
		//config.data = window.vm.qs.stringify(config.data);
	}
    //过滤拦截路径
	if(window.vm.API.leansite.constObj.requestFilter.indexOf(config.url) === -1){//拦截的请求
		let stateObj = window.vm.$store.state;
		if(stateObj.token && stateObj.token.length >0 ) {//token验证
			let submitToken = stateObj.token;
			config.headers.Authorization = encodeURIComponent(submitToken);
			return config;
	    }else{
	      	//清除登录信息并跳转到登录页面
	        window.vm.commonFun.againLogin();
	        return;
	    }
	}else{
		return config;
	}
}, error => {
    window.vm.$message({
        type: 'error',
        message: '加载超时!'
  	});
    return Promise.reject(error);
});
// http响应拦截器
instance.interceptors.response.use(
	response=>{
		if (response.data.code) {
	        switch (response.data.code) {
		        case 7001://token过期
		            window.vm.$message({
			            type: 'error',
			            message: '登录信息过期，请重新登录!'
		          	});
		           //清除token信息并跳转到登录页面
		           window.vm.commonFun.againLogin();
		        break;
		        case 7002://无操作权限
			    	window.vm.$message({
			            type: 'error',
			            message: '您没有操作权限！'
		          	});
		        break;
		        case 1005://数据加载延迟
			    	window.vm.$message({
			            type: 'error',
			            message: response.data.msg
		          	});
		        break;
		        case -1://未知错误
			    	window.vm.$message({
			            type: 'error',
			            message: response.data.msg
		          	});
		        break;
		        case -2://操作失败
			    	window.vm.$message({
			            type: 'error',
			            message: response.data.msg
		          	});
		        break;
		    }
	   }
		return response;
	}, error => {
		return Promise.reject(error);
	}
);
export default instance;

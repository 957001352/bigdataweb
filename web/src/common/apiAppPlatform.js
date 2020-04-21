import axios from 'axios'
/**
 * 运维中心接口api
 */
const interface_s = {
	baseURL: 'http://192.168.2.59:8880/',//非生产环境
	//prodBaseURL:window.configs.appPlatformAPI,//生产环境
	prodBaseURL:"http://192.168.2.159:8880/"//生产环境
};
//配置生产环境和非生产环境之间的切换
if(process.env.NODE_ENV == 'development') { //非生产环境
	interface_s.baseURL = interface_s.baseURL;
}else if(process.env.NODE_ENV == 'production') { //生产环境
	interface_s.baseURL = interface_s.prodBaseURL;
}
export default interface_s;

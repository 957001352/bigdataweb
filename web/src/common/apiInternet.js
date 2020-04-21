import axios from 'axios'
/**
 * 物联网平台接口api
 */
const interface_s = {
	baseURL: 'http://192.168.2.31:8070/',//非生产环境
	//prodBaseURL:window.configs.internetAPI,//生产环境
	prodBaseURL:"http://192.168.2.59:9050/",//生产环境
	//登录模块
	login: "api/auth/login", //登录
    devicesNumber: "api/plugins/telemetry", //overview
	//常量对象
	constObj: {
		pageIndex:0,
		pageSize:10,
		requestFilter: [ //拦截器不拦截的请求集合
            "api/auth/login",
            "api/plugins/telemetry",
            "api/asset/types",//资产类型，
            "api/device/types",//设备类型，
            "api/v1/",//保存设备属性
            "api/asset",//保存资产
            "api/device",//保存设备
            "api/tenant/assets",//搜索资产
            "api/tenant/devices",//搜索设备
            "api/assets",//删除资产
            "api/devices",//删除设备
            "api/auth/logout",//退出
            "internetPlatform",
            "Overview",
            "Asset",
            "CollectingDevice"
		],
		vueFilter: [ //拦截器不拦截的vue界面集合
		],
        internetToken:"LEANSITEPAAS-INTERNETTOKEN",//物联网中心token
	}
}
//配置生产环境和非生产环境之间的切换
if(process.env.NODE_ENV == 'development') { //非生产环境
	interface_s.baseURL = interface_s.baseURL;
}else if(process.env.NODE_ENV == 'production') { //生产环境
	interface_s.baseURL = interface_s.prodBaseURL;
}
export default interface_s;

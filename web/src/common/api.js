import axios from 'axios'
/**
 * Leansite Paas平台和用户中心接口api
 */
const interface_s = {
	baseURL: 'http://192.168.2.50:90/dhlk-web/',//非生产环境
	//prodBaseURL:window.configs.leansiteAPI,//生产环境
	//prodBaseURL:"http://192.168.2.163:90/dhlk-web/",//生产环境
	//登录模块
	getKaptcha:"kaptcha",//获取验证码
	login: "login", //登录

	getDepts:'org/findTreeList',//获取所有部门
	getUserByDeptId:'org/findPageUserByOrg',//根据部门id获取用户
	addAndEditDept:'org/save',//新增和编辑部门
	delDept:'org/delete',//删除部门
    getAllUserName:'user/findList',//获取用户列表中的所有用户名
    getLogFile:'logFile/searchLogFile',//获取日志文件
    downLogFile:'logFile/downZipFile',//下载日志文件  (单个下载)
    deleteUser:'user/delete',//根据id删除用户
    saveUser:'user/save',//添加和编辑保存
    isEnable:'user/isEnable',//是否禁用或启动  根据status  1为启动  0为禁用
    getUserOwnDep:'user/findOrg',//获取用户现在所属的部门
    getUserOwnRole:'role/selectRoleByUserId',//获取用户现在拥有的角色
    getAllRole:'role/findAllList',//获取所有角色
	getUsersPageByRoleId:'role/selectUserByRoleId',//根据角色id获取用户列表
	saveRole:'role/save',//新增或编辑角色
	deleteRoles:'role/delete',//删除角色
	getMenuByRoleId:'menu/getMenuCheckedListByRoleId',//根据角色id获取权限列表
	saveMenuState:'permissions/save',//保存权限
	getDeviceParameter:'devicesAttrSet/findList',//获取所有设备参数
	saveDeviceParameter:'devicesAttrSet/save',//保存设备参数
	deleteDeviceParameter:'devicesAttrSet/delete',//删除设备参数
	getNetworkDevice:'netDevices/findList',//获取所有网络设备
	saveNetworkDevice:'netDevices/save',//保存网络设备
	deleteNetworkDevice:'netDevices/delete',//删除网络设备
	getIndustryDevice:'productDevices/findList',//获取所有工业设备
	saveIndustryDevice:'productDevices/save',//保存工业设备
	deleteIndustryDevice:'productDevices/delete',//删除工业设备
    //设备管理(关联设备)
    // getRelationList:'productNet/findList',//获取关联设备列表
    deleteRelationDevices:'productNet/delete',//删除关联设备
    integratedMachineNotBind:'productNet/findNotComputerList',//未绑定一体机
    integratedMachine:'productNet/findComputerList',//已绑定一体机
    allIntegratedMachine:'',//所有一体机设备
    BIControl:'productNet/findBiList',//已绑定BI控制器
    BIControlNotBind:'productNet/findNotBiList',//未绑定BI控制器
    allBIControl:'',//所有BI控制器
    saveRelation:'productNet/save',//关联编辑保存
    getRelationList:'productNet/findList',//获取关联设备列表
	getNetworkDeviceTypeList:'dmNetType/findList',//获取网络设备分类列表

    //(设备类型)
    getDeviceTypeList:'devicesClassify/findList',//获取类型管理列表
    getDeviceAttrList:'devicesAttrSet/findList',//获取设备属性列表
    deleteDeveiceType:'devicesClassify/delete',//设备类型删除
    upLoadImg:'attachment/upload',//上传图片接口
    downImgById:'attachment/downByDataId',//下载图片
    getClassifyType:'dmClassifyType/findList',//获取上级类型列表
    saveAddDeviceType:'devicesClassify/save',//保存类型管理添加
    deleteDevicesTypeById:'devicesClassify/delete',//删除设备类型

	//待定接口
	getThirdApp: 'app/getAll', //获取主页第三方应用菜单
    getSysApp: '/app/getSysApp',//获取系统应用
    checkPhoneOrEmail:'/user/phoneAndEmailEnable',//验证手机号或邮箱
	//常量对象
	constObj: {
		pageIndex:1,
		pageSize:10,
		requestFilter: [ //拦截器不拦截的请求集合
			'login', //登录
			'kaptcha'//获取验证码
		],
		vueFilter: [ //拦截器不拦截的vue界面集合
		],
        loginInfo:'LEANSITEPAAS-USER',//user信息
        operationAuthority:'LEANSITEPAAS-OPTAUTHORITY',//功能操作权限
        token:"LEANSITEPAAS-TOKEN",//token
        roles:"LEANSITEPAAS-ROLES",//role
        loginUser:"LEANSITEPAAS-LOGINUSER",//登录信息,
	}
}
//配置生产环境和非生产环境之间的切换
if(process.env.NODE_ENV == 'development') { //非生产环境
	interface_s.baseURL = interface_s.baseURL;
}else if(process.env.NODE_ENV == 'production') { //生产环境
	interface_s.baseURL = interface_s.prodBaseURL;
}
export default interface_s;

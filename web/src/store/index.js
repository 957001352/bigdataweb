import Vue from 'vue'
import Vuex from 'vuex'
import api from "../common/api.js" //引入接口
Vue.use(Vuex)
let store = new Vuex.Store({
	state: {
		user:JSON.parse(sessionStorage.getItem(api.constObj.loginInfo))?JSON.parse(sessionStorage.getItem(api.constObj.loginInfo)):'',//存储用户信息
		operationAuthority:JSON.parse(sessionStorage.getItem(api.constObj.operationAuthority))?JSON.parse(sessionStorage.getItem(api.constObj.operationAuthority)):'',//功能操作权限
		roles:JSON.parse(sessionStorage.getItem(api.constObj.roles))?JSON.parse(sessionStorage.getItem(api.constObj.roles)):'',//角色列表
		token:JSON.parse(sessionStorage.getItem(api.constObj.token))?JSON.parse(sessionStorage.getItem(api.constObj.token)):'',//请求令牌
		internetToken:JSON.parse(sessionStorage.getItem(api.constObj.internetToken))?JSON.parse(sessionStorage.getItem(api.constObj.internetToken)):'',//物联网中心token
		loginUser:JSON.parse(localStorage.getItem(api.constObj.loginUser))?JSON.parse(localStorage.getItem(api.constObj.loginUser)):''//密码
	},
	//操作数据。注意mutations只能进行同步操作。
	mutations: {
		
		/**
		 * 移除所有存储的信息--谨慎使用
		 */
		removeAllInfo(state) {
			for(let i in state){
				state[i] = '';
			}
			sessionStorage.clear();
			localStorage.clear();
		},
		/**
		 * 批量移除存储的信息--推荐使用
		 * @param {Object} state 存储器对象
		 * params {Array} delArray 需要删除的信息名称数组
		 * @param {String} delArray[0].name 存储信息的名称
		 * @param {String} delArray[0].storeName 存储信息的store中的名称
		 */
		removeInfoByArray(state,delArray) {
			if(delArray && delArray.constructor == Array && delArray.length > 0){
				delArray.forEach((item,index)=>{
					state[item.storeName] = '';
					sessionStorage.removeItem(item.name);
				});
			}
		},
		/**
		 * 添加指定存储信息--推荐使用(sessionStorage)
		 * @param {Object} state 存储器对象
		 * @param {Object} storeObj 存储的对象信息
		 * @param {String} storeObj.name 存储信息的名称
		 * @param {String} storeObj.storeName 存储信息的store中的名称
		 * @param {Array || Object || String} storeObj.storeInfo 需要存储的信息
		 */
		saveStoreByName(state,storeObj) {
			if(!storeObj.name || storeObj.name.length == 0){
				alert("name参数不能为空，无法存储该信息!");
				return;
			}
			state[storeObj.storeName] = storeObj.storeInfo;
			sessionStorage.setItem(storeObj.name, JSON.stringify(storeObj.storeInfo));
		},
		/**
		 * 添加指定存储信息--推荐使用(localStorage)
		 * @param {Object} state 存储器对象
		 * @param {Object} storeObj 存储的对象信息
		 * @param {String} storeObj.name 存储信息的名称
		 * @param {String} storeObj.storeName 存储信息的store中的名称
		 * @param {Array || Object || String} storeObj.storeInfo 需要存储的信息
		 */
		saveStoreByNameLocal(state,storeObj) {
			if(!storeObj.name || storeObj.name.length == 0){
				alert("name参数不能为空，无法存储该信息!");
				return;
			}
			state[storeObj.storeName] = storeObj.storeInfo;
			localStorage.setItem(storeObj.name, JSON.stringify(storeObj.storeInfo));
		},
		/**
		 * 移除指定存储信息--推荐使用(sessionStorage)
		 * @param {Object} state 存储器对象
		 * @param {Object} storeObj.name 存储的信息的名称
		 * @param {String} storeObj.storeName 存储信息的store中的名称
		 */
		removeStoreByName(state,storeObj) {
			if(!storeObj.name || storeObj.name.length == 0){
				alert("name参数不能为空，无法删除存储的信息!");
				return;
			}
			state[storeObj.storeName] = '';
			sessionStorage.removeItem(storeObj.name);
		},
		/**
		 * 移除指定存储信息--推荐使用(localStorage)
		 * @param {Object} state 存储器对象
		 * @param {Object} storeObj.name 存储的信息的名称
		 * @param {String} storeObj.storeName 存储信息的store中的名称
		 */
		removeStoreByNameLocal(state,storeObj) {
			if(!storeObj.name || storeObj.name.length == 0){
				alert("name参数不能为空，无法删除存储的信息!");
				return;
			}
			state[storeObj.storeName] = '';
			localStorage.removeItem(storeObj.name);
		}
	}
});
export default store

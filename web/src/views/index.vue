<template>
<div class="index">
    <!--桌面-->
    <div class="main-block">
        <div v-for="app in thirdAppList" :class="app.available=='0'?'block-item noActive':'block-item'" @click="openDialog(app)" :title="app.available=='0'?'您没有'+app.appName+'的操作权限':app.appName">
            <img :src="app.appIcon" />
            <span class="demonstration">{{app.appName}}</span>
        </div>
    </div>
    <!--状态栏-->
    <div class="status-bar" >
        <!--状态栏系统菜单-->
        <div id="systemMenuDiv" v-show="systemMenuVisible" class="systemMenu" tabIndex='1'  @blur="systemMenuBlur">
            <ul class="leftMenus">
                <li v-for="menus in systemMenus" @click="alertComponent(menus)" :title="menus.appName">
                    <img :src="menus.appIcon" :alt="menus.appName" />
                </li>
            </ul>
            <ul class="rightMenus">
                <li v-for="menus in systemModuleList" @click="alertComponent(menus)">
                    <img :src="menus.appIcon" :tile="menus.appName" />
                    <span>{{menus.appName}}</span>
                </li>
            </ul>
        </div>
        <img class="menuLogo" @click="clickSystemMenu" src="../assets/img/logo_icon.png" alt="菜单图标" title="打开系统菜单" />
        <!--<el-input
			    placeholder="在此处搜索应用"
			    prefix-icon="el-icon-search"
			    v-model="searchApp">
			</el-input>-->
        <!--显示活动的app图标-->
        <el-tooltip v-if="activeApps.length > 0" v-for="app in activeApps" :content="`${app.appName}`" placement="top" visible-arrow="false" :key="`${app.appName}`" @click.native="clickMinimizedApp(app)">
            <img class="statusIcon" v-bind:src="app.appIcon" />
        </el-tooltip>
    </div>
    <!--弹框打开第三方应用-->
    <DialogUrl v-for="(app,index) in activeApps" v-if="app.isShowDialog==true && app.webSource == 2" width="80%" @callBackFun="closeParentDialog" :appObj="app" :key="`${app.appName}`" :ref="'dialogUrl'+app.appName"></DialogUrl>
    <!--弹框打开组件-->
    <DialogComponent v-for="(app,index) in activeApps" v-if="app.isShowDialog==true && app.webSource == 1" width="80%" @callBackFun="closeParentDialog" :appObj="app" :key="`${app.appName}`" :ref="'dialogComponent'+app.appName"></DialogComponent>
</div>
</template>

<script>
	import Vue from 'vue';
	import Bus from '../common/bus.js';
	import DialogUrl from '../components/DialogUrl.vue';//弹框打开第三方应用
	import DialogComponent from '../components/DialogComponent.vue';//弹框打开系统组件
	export default {
		name: 'index',
		components: {
			DialogUrl,
			DialogComponent
		},
		data() {
			return {
				timeStamp:new Date().getTime(),
				searchApp:"",//搜索应用
				systemMenuVisible:false,//是否显示状态栏系统菜单
				thirdAppList:[],//桌面第三方应用
				systemMenus:[//系统菜单项目
//					{ appName:'个人中心',appUrl:'',appIcon:require("../assets/img/yonghu.png")},
//					{ appName:'设置中心',appUrl:'/gerenzhongxin',appIcon:require("../assets/img/shezhi.png")},
					{ appName:'退出系统',appUrl:'/logout',appIcon:require("../assets/img/tuichu.png")}
				],
				systemModules:[//系统功能模块
					{ 
						appName:'用户中心',
						appUrl:'UserCenterHome',
						appIcon:require("../assets/img/yonghuzhongxin.png"),
                    	powerName:'userCenter',
                    	isAuth:true//是否有权限
					},
					{ 
						appName:'设备中心',
						appUrl:'DeviceCenterHome',
						appIcon:require("../assets/img/wulianwang.png"),
                    	powerName:'deviceCenter',
                    	isAuth:true//是否有权限
					},
					{ 
						appName:'监测管理',
						appUrl:'MonitorIndex',
						appIcon:require("../assets/img/wulianwang.png"),
                    	powerName:'userCenter',
                    	isAuth:true//是否有权限
					},
					{ 
						appName:'设备管理',
						appUrl:'InternetPlatform',
						appIcon:require("../assets/img/wulianwang.png"),
                    	powerName:'iot',
                    	isAuth:false//是否有权限
					},
					{ 
						appName:'运维中心',
						appUrl:this.API.appPlatform.baseURL,
						appIcon:require("../assets/img/yunweizhongxin.png"),
                    	powerName:'ops',
                    	isAuth:false//是否有权限
					},
					{ 
						appName:'数据中台',
						appUrl:"http://datalake.k8s.leansite-cloud.com/ui",
						appIcon:require("../assets/img/dataControl.png"),
                    	powerName:'dataControl',
                    	isAuth:true//是否有权限
					},
					{ 
						appName:'商业智能',
						appUrl:"http://bi.k8s.leansite-cloud.com/decision",
						appIcon:require("../assets/img/businessIntelligence.png"),
                    	powerName:'analysisControl',
                    	isAuth:true//是否有权限
					}
				],
				systemList:[],//系统应用
				activeApps: [],//状态栏显示打开的app数组
			}
		},
		computed:{
			systemModuleList:function(){
				let filterSystemModules = this.systemModules.filter(function(currentValue, index){
					return currentValue.isAuth == true;
				});
				return filterSystemModules;
			}
		},
		created() {
			if(!this.$store.state.token && this.$store.state.token.length <=0){
        		this.$router.push('/login');  // 正常登录
        		return;
        	}else{
        		this.getData();
        		this.getSystemData();
        	}
        	//重新加载数据
        	Bus.$on('reloadData', msg => {
                this.getData();
        		this.getSystemData();
            })
		},
		mounted(){
		},
		methods: {
	    	/**
	    	 * 系统菜单右侧权限
	    	 */
	    	menuPower(){
	    		var self = this;
	    		let powerList = this.$store.state.operationAuthority;
	    		if(powerList.length > 0){
	    			self.systemModules.forEach(function(item,index){
	    				let bMenuExist = self.hasPermission(item.powerName);
	    				if(bMenuExist){
	    					self.systemModules[index].isAuth = true;
	    				}
	    			});
	    		}
	    		if(this.systemList.length >0){
	    			this.systemList.forEach((item,index)=>{
	    				this.systemModules.forEach((item2,index2)=>{
	    					if(item.appName == item2.appName){
		    					this.systemModules[index2].isAuth = true;	
		    				}	
	    				});
	    			});
	    		}
	    	},
			/**
			 * 系统菜单失去焦点事件
			 */
			systemMenuBlur(e){
				this.systemMenuVisible = false;
			},
			/**
			 * 获取系统应用列表数据
			 */
			getSystemData() {
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getSysApp,
					params: {
						'roleNames':this.$store.state.roles.toString(),
					}
				}).then((res) => {
					var resData = res.data;
					if(resData.status == 200) {
						this.systemList = resData.data;
						this.menuPower();//左侧菜单权限
					} else {
						this.$message({
							type: 'error',
							message: '查询失败，请刷新重试！'
						});
					}
				}).catch((err) => {
					this.$message({
						type: 'error',
						message: '请求异常，请检查网络！'
					});
				})
			},
			/**
			 * 获取应用列表数据
			 */
			getData() {
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getThirdApp,
					params: {
						'roleNames':this.$store.state.roles.toString(),
					}
				}).then((res) => {
					var resData = res.data;
					if(resData.status == 200) {
						this.thirdAppList = resData.data;
					} else {
						this.$message({
							type: 'error',
							message: '查询失败，请刷新重试！'
						});
					}
				}).catch((err) => {
					this.$message({
						type: 'error',
						message: '请求异常，请检查网络！'
					});
				})
			},
			/**
			 * 打开桌面的第三方app
			 */
			openDialog(appObj){
				if(appObj.available == "0"){//没有操作权限
					this.$alert('您没有'+appObj.appName+"的操作权限，请联系管理员!", '操作提示', {
			          confirmButtonText: '确定',
			          callback: action => {}
			        });
			        return;
				}
				let searchIndex = -1;
				if(this.activeApps.length > 0){
					searchIndex = this.activeApps.findIndex((value)=>value.appName==appObj.appName);
				}
				if(searchIndex ==-1){
					if(this.activeApps.length >= 20){
			            this.$message({
			              type: 'info',
			              message: '最多只能同是打开20个应用/功能'
			            });
			            return;
					}
					let chioceApp = {};
					for(let i=0;i<this.thirdAppList.length;i++){
						if(this.thirdAppList[i].appName == appObj.appName){
							chioceApp = this.thirdAppList[i];
							break;
						}
					}
					let appObject = {
						appName:appObj.appName,//APP名称
						appIcon:appObj.appIcon,//app图标
						webSource:2,//打开的网页来源  1=本项目；2=第三方项目
						appUrl:appObj.appUrl,
						isActive:true,//状态栏中显示的app是否处于活动状态
						isShowDialog:true,//是否显示弹框
						isMinimize:false//是否缩小弹框
					};
					let pushIndex = this.activeApps.length>0?this.activeApps.length:0;
					this.$set(this.activeApps,pushIndex,appObject);
				}
			},
			/**
			 * 新增状态栏数据处理
			 * SystemMenu组件回调
			 */
			openComponent(appObj){
				let searchIndex = -1;
				if(this.activeApps.length > 0){
					searchIndex = this.activeApps.findIndex((value)=>value.appName==appObj.appName);
				}
				if(searchIndex ==-1){
					if(this.activeApps.length >= 20){
			            this.$message({
			              type: 'info',
			              message: '最多只能同是打开20个应用/功能'
			            });
			            return;
					}
					let appObject = {
						appName:appObj.appName,//APP名称
						appIcon:appObj.appIcon,//app图标
						webSource:1,//打开的网页来源  1=本项目；2=第三方项目
						appUrl:appObj.appUrl,
						isActive:true,//状态栏中显示的app是否处于活动状态
						isShowDialog:true,//是否显示弹框
						isMinimize:false//是否缩小弹框
					};
					let pushIndex = this.activeApps.length>0?this.activeApps.length:0;
					this.$set(this.activeApps,pushIndex,appObject);
				}
			},
			/**
			 * 关闭桌面的第三方应用和系统组件弹框
			 */
			closeParentDialog(appObj){
				let searchIndex = -1;
				if(this.activeApps.length > 0){
					searchIndex = this.activeApps.findIndex((value)=>value.appName==appObj.appName);
				}
				if(searchIndex !=-1){
					this.$delete(this.activeApps, searchIndex);
				}
			},
			/**
			 * 点击底部状态栏中缩小的app图标
			 */
			clickMinimizedApp(appObj){
				if(this.activeApps.length > 0){
					let searchIndex = -1;
					for(let i=0;i<this.activeApps.length;i++){
						if(this.activeApps[i].appName == appObj.appName){
							searchIndex = i;
							break;
						}
					}
					if(searchIndex != -1){
						let editApp = this.activeApps[searchIndex];
						editApp.isMinimize = true;
						let oRefs = null;
						if(appObj.webSource == 1){//显示本项目模块
							oRefs = this.$refs['dialogComponent'+appObj.appName][0];
							oRefs.moduleDialogVisible= false;
						}else{//显示第三方应用
							oRefs = this.$refs['dialogUrl'+appObj.appName][0];
							oRefs.dialogVisible= false;
						}
						setTimeout(()=>{
							oRefs.isminimize= false;
							if(appObj.webSource == 1){
								oRefs.moduleDialogVisible= true;
							}else{
								oRefs.dialogVisible= true;
							}
						},0);
					}
				}
			},
			/**
			 * 点击系统菜单logo
			 */
			clickSystemMenu(){
				this.systemMenuVisible = !this.systemMenuVisible;
				setTimeout(()=>{
					if(this.systemMenuVisible){
						let elDiv = document.getElementById('systemMenuDiv');
						elDiv.focus();	
						elDiv.style.borderColor="transparent !important";
					}
				},0);
				
			},
			/**
	         * 点击弹出组件
	         */
			alertComponent(menuObj) {
				this.systemMenuVisible = false;
				this.timeStamp=new Date().getTime();
				switch (menuObj.appName){
					case "退出系统":
						this.logout();
						break;
					case "运维中心":
						this.openDialog(menuObj);
						break;
					case "数据中台":
						window.open(menuObj.appUrl,'_blank');
						break;
					case "商业智能":
						window.open(menuObj.appUrl,'_blank');
						break;
					default:
						this.openComponent(menuObj);
						break;
				}
			},
			/**
			 * 退出系统
			 */
			logout(){
				this.$confirm('确定退出系统吗?', '操作提示', {
		          confirmButtonText: '退出系统',
		          cancelButtonText: '继续使用',
		          type: 'warning'
		        }).then(() => {//退出系统
		          this.logoutRequest();
		        });
			},
           /**
             * 退出系统请求
             */
            logoutRequest(){
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.logout+"/id="+this.$store.state.user.userId,
				}).then((res) => {
					var resData = res.data;
					this.commonFun.againLogin();
				}).catch((err) => {
					this.commonFun.againLogin();
				});
            },
		}
	}
</script>
<style lang="scss" scoped type="text/css">
.index {
    height: 100vh;
    width: 100vw;
    overflow-y: auto;
    overflow-x: auto;
    .main-block {
        width: 100vw;
        height: 95vh;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-start;
        align-content: flex-start;
        background: #FFFFFF url(../assets/img/index_bg.png) no-repeat center;
        background-size: cover;
        .block-item {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: 10vh;
            cursor: pointer;
            margin-top: 3.5vh;
            margin-left: 2vw;
            img {
                width: 80px;
                height: 80px;
                margin-bottom: 10px;
            }
        }
        .block-item.noActive {
            opacity: 0.3;
        }
    }
    .status-bar {
        width: 100%;
        height: 5vh;
        line-height: 5vh;
        background-color: #31353f;
        position: fixed;
        z-index: 9999;
        .systemMenu {
            width: 346px;
            height: 39vh;
            background-color: #31353f;
            box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.1);
            position: absolute;
            left: 0;
            top: -39vh;
            .leftMenus{
					display: inline-block;
				    width: 17.4%;
				    padding: 5% 0 0;
				    text-align: center;
				    cursor: pointer;
				    position: absolute;
				    bottom: 0;
				    overflow-y: auto;
				    li{
				    	height: 51px;
    					line-height: 51px;
				    }
				    li:hover{
				    	background-color: #4c5363;
				    }
				}
				.rightMenus{
					display: inline-block;
				    cursor: pointer;
				    height: 91%;
				    padding: 5% 0;
				    width: 82.6%;
				    text-align: left;
				    border-left: 1px solid #4c5363;
				    border-bottom: 1px solid #4c5363;
				    float: right;
				    overflow-y: auto;
				    li{
				    	padding-left: 8.5%;
				    	height: 42px;
				    	line-height: 42px;
				    	span{
				    		margin-left: 10px;
				    		color: #ffffff;
				    	}
				    }
				    li:hover{
				    	background-color: #4c5363;
				    }
				}
        }
        #systemMenuDiv:focus{
        	outline-color: transparent;
        }
    	img.menuLogo{
			width: 30px;
		    height: 30px;
		    padding: 10px 15px;
		    cursor: pointer;
		    margin-right: 10px;
		    background-color: #202020;
		}
		img.menuLogo:hover{
			background-color: #202020;
		}
		.el-input{
			width:276px;
			height: 36px;
			line-height: 36px;
			background-color: #eeeeee;
			border-radius: 4px;
			margin-right: 10px;
		}
		.el-tooltip{
			cursor: pointer;
			margin: 0 5px;
			padding: 0 8px;
			height: 33px;
			border: none;
			border-bottom: 3px solid #a0a9b5;
			img.statusIcon{
				cursor: pointer;
				width: 40px;
				height: 40px;
			}
		}
		.el-tooltip:hover{
			background-color: #4c5363;
		}
    }
}

::-webkit-scrollbar {
    width: 1px;
    background-color: transparent;
}
</style>

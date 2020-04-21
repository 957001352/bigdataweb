<template>
    <el-container class="networkDeviceList">
	  	<el-aside class="outAside" width="320px">
            <div class="leftAsideTitle">
                <span>设备列表</span>
                <el-button type="text" v-if="hasPermission('netDevices/insert')" icon="el-icon-plus"  style="padding-left: 10px;" @click="editHandle('add')">添加设备</el-button>
            </div>
            <div class="leftAsideSearch">
                <el-input
	            	class="searchDept"
	            	prefix-icon="el-icon-search"
				  	placeholder="search"
				  	@input="filterNetworkDevice"
				  	v-model="filterText">
				</el-input>
            </div>
            <div class="tableDiv">
		  		<el-table ref="singleTable" :data="filterNetworkTableData" class="table" highlight-current-row :show-header=false  :row-style="{background:'#f0f0f0'}" @row-click="handleClick">
	                <el-table-column  align="left">
	                    <template slot-scope="scope">
	                    	<div class="listDiv">
		                        <p class="topP">
									<img src="../../assets/img/deviceCenter/liebiaotubiao.png" alt="图标">
		                        	<span>{{scope.row.name}}</span>
		                        	<i class="iconfont leansite-shouchang rightListIcon"></i>
		                        </p>
		                        <p class="mediumP">{{scope.row.license}}</p>
		                        <p class="bottomP">{{scope.row.note}}</p>
	                        </div>
	                    </template>
	                </el-table-column>
	            </el-table>
            </div>
	  	</el-aside>
	  	<el-container class="rightContainer" v-if="!networkDeviceVisble && !chioceDeviceVisble" >
            <el-header>
	        	<el-row>
				  <el-col :span="16" class="leftHeader">
				  	<span class="showName">{{oChioceObject.name}}</span>
				  	<span class="showStatus">
				  		<i :class="['iconfont','leansite-xuanzhongzhuangtai',oChioceObject.status==0?'gray':'green']"></i>{{oChioceObject.status==0?'离线':'在线中'}}
				  	</span>
				  </el-col>
				  <el-col :span="8" class="rightHeader">
				  	<el-button type="text" v-if="hasPermission('netDevices/update')" icon="el-icon-edit"  @click="editHandle('edit')">编辑</el-button>
				  	<el-button type="text" v-if="hasPermission('netDevices/delete')" icon="el-icon-delete" class="batchDel" @click="handleDelete">删除</el-button>
				  </el-col>
				</el-row>
	        </el-header>
	        <div class="showOtherInfo">
				<p>{{oChioceObject.license}}</p>
				<p>{{oChioceObject.note}}</p>
			</div>
			<div class="table-title"><span>-</span> 软件版本</div>
	        <div class="container">
	            <el-table :data="oChioceObject.softList" class="table" ref="multipleTable" height="264" empty-text="暂无数据">
	                <el-table-column prop="name" label="软件名称" align="center" min-width="100"></el-table-column>
	                <el-table-column prop="version" label="软件版本号"  align="center" min-width="100"></el-table-column>
	                <el-table-column prop="url" label="云端地址"  align="center" min-width="200"></el-table-column>
	            </el-table>
	        </div>
			<div class="table-title"><span>-</span> 关联网络设备({{oChioceObject.netDevicesList.length}})</div>
	        <div class="container">
	            <el-table v-if="oChioceObject.netDevicesList" :data="oChioceObject.netDevicesList" class="table" ref="multipleTable" height="264" empty-text="暂无数据">
	                <el-table-column prop="name" label="网络设备名称" align="center" min-width="180"></el-table-column>
	                <el-table-column prop="status" label="网络设备连接状态"  align="center" min-width="300"></el-table-column>
	            </el-table>
	        </div>
			<div class="table-title"><span>-</span> 故障信息(2)</div>
	        <div class="container">
	            <el-table  :data="relationDeviceData" class="table" ref="multipleTable" height="264" empty-text="暂无数据">
	                <el-table-column prop="relationDevice" label="工业资产" align="center" min-width="200"></el-table-column>
	                <el-table-column prop="status" label="故障"  align="center" min-width="300"></el-table-column>
	            </el-table>
	        </div>
	   </el-container>
	   <el-container class="rightContainer" v-if="!networkDeviceVisble && chioceDeviceVisble" >
	   		<ChioceNetworkDeviceType @ChioceNetworkDeviceTypeCallBack="ChioceDeviceCallBack"></ChioceNetworkDeviceType>
	   </el-container>
	   <el-container class="rightContainer" v-if="networkDeviceVisble && !chioceDeviceVisble" >
	   		<NetworkDeviceAddAndEdit :chioceDevice="oChioceDevice" :parameterObj="oEditChioceObject" @NetworkDeviceEditCallBack="NetworkDeviceEditCallBack"></NetworkDeviceAddAndEdit>
	   </el-container>
	</el-container>
</template>

<script>
	import NetworkDeviceAddAndEdit from "./NetworkDeviceAddAndEdit.vue";
	import ChioceNetworkDeviceType from "./ChioceNetworkDeviceType.vue";
    export default {
        name: 'NetworkDeviceList',//网络设备列表
        components: {
			NetworkDeviceAddAndEdit,
			ChioceNetworkDeviceType
		},
        data() {
            return {
            	filterNetworkTableData:[],//过滤后的网络设备数据
            	networkTableData:[],
				relationDeviceData:[
					{
						relationDevice:'大数据一体机',
						lastTime:'2020.03.25 15:36',
						status:0,
					},
					{
						relationDevice:'大数据一体机',
						lastTime:'2020.03.25 15:36',
						status:0,
					},
					{
						relationDevice:'大数据一体机',
						lastTime:'2020.03.25 15:36',
						status:0,
					},
					{
						relationDevice:'大数据一体机',
						lastTime:'2020.03.25 15:36',
						status:0,
					},
					{
						relationDevice:'大数据一体机',
						lastTime:'2020.03.25 15:36',
						status:0,
					}
				],
				networkDeviceVisble:false,//是否显示网络设备的添加或编辑界面
				chioceDeviceVisble:false,//是否显示选择类型的界面
				filterText:'',//搜索设备文本
				oChioceObject:{
					name:'网络设备名称',
					netDevicesList:[],
					softList:[]
				},//表格选中的数据
				oEditChioceObject:{
					netDevicesList:[],
					softList:[]
				}//表格选中的数据--编辑参数时使用
            }
        },
        created() {

        },
        mounted(){
			this.getNetworkDeviceRequest();        	
        },
        methods: {
            /**
             * 监听左侧搜索文本框input事件
             */
             filterNetworkDevice(){
             	if(this.filterText.length == 0){
                	this.filterNetworkTableData = this.networkTableData;
                }else{
                	this.filterNetworkTableData = this.networkTableData;
                	this.filterNetworkTableData = this.filterNetworkTableData.filter((currentValue,index,arr)=>{
	                	return currentValue.name.indexOf(this.filterText) !=-1;
	                })	
                }
            },
            /**
             * 	监听左侧表格的click事件
             */
            handleClick(row, column, event) {
		        this.oChioceObject = row;
		        this.oEditChioceObject = row;
		    },
            /**
             * 监听 删除 按钮click事件
             */
            handleDelete() {
            	this.$confirm('确定删除：'+this.oChioceObject.name+"   ？", '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          this.deleteRequest(this.oChioceObject.id);//批量删除请求
		        }).catch(() => {});
            },
            /**
             * 监听添加或编辑按钮点击事件
             * @param {String} optType 操作类型 add/edit
             */
            editHandle(optType){
                if(optType == "add"){
                    this.oEditChioceObject ={};
                    this.chioceDeviceVisble = true;
                    this.networkDeviceVisble = false;
                }else{
                	this.chioceDeviceVisble = false;
                	this.networkDeviceVisble = true;
                }
            },
	        /*
	         * NetworkDeviceAddAndEdit组件回调方法--子组件回调数据的方法
	         * @param {Number} optType 操作类型 0:刷新表格数据;1:返回到选择设备类型界面;2:不刷新数据,返回至列表界面
	         */
	        NetworkDeviceEditCallBack(optType){
				this.networkDeviceVisble = false;
				this.oEditChioceObject ={};
                switch (optType){
                	case 0:
                		this.chioceDeviceVisble = false;
                		this.getNetworkDeviceRequest();
                		break;
                	case 1:
                	this.chioceDeviceVisble = true;
                		break;
                	case 2:
                		this.chioceDeviceVisble = false;
                		break;
                }
			},
            /**
             * ChioceNetworkDeviceType 组件回调方法
             * @return {Object|Boolean} object=选中的数据对象;boolean 是否接收数据
             */
            ChioceDeviceCallBack(returnParam){
            	if(typeof returnParam == 'object'){
            		this.oChioceDevice = returnParam;
            		this.networkDeviceVisble = true;
            	}else{
            		this.oChioceDevice = {};
            		this.networkDeviceVisble = false;
            	}
            	this.chioceDeviceVisble = false;
            },
			/**
			 * 获取所有网络设备请求
			 */
			getNetworkDeviceRequest() {
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getNetworkDevice
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.networkTableData = resData.data;
						this.filterNetworkTableData = resData.data;
						if(resData.data.length > 0){
							this.oChioceObject = resData.data[0];
							this.oEditChioceObject = resData.data[0];
							this.$refs.singleTable.setCurrentRow(resData.data[0])
						}
					}
				});
			},
            /**
             * 批量删除网络设备请求
             */
            deleteRequest(paramsId){
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.deleteNetworkDevice,
					params:{
						ids:paramsId //逗号分隔
					}
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.$message({
							type: 'success',
							message: '删除设备成功！'
						});
						this.getNetworkDeviceRequest();
					} else if(resData.code == 1000) {
						this.$message({
							type: 'error',
							message: '删除设备失败：'+resData.msg
						});
					}else {
						this.$message({
							type: 'error',
							message: '删除失败！'
						});
					}
				}).catch((err) => {
					this.$message({
						type: 'error',
						message: '请求异常，请检查网络！'
					});
				})
            }
        }
    }

</script>

<style lang="scss" scoped type="text/css">
    .networkDeviceList {
	    height: 100%;
	    background-color: #f0f0f0;
	    .outAside{
	    	background-color: #f0f0f0;
	    	position:relative;
	    	border-right: solid 1px #b4b4b4;
	    	/deep/ .current-row > td {
			   background: #FFFFFF !important;
			}
	    	/deep/ .el-table td, .el-table th.is-leaf,.el-table--border, .el-table--group{
			  border-color: #b4b4b4; 
			}
			/deep/ .el-table--border::after, .el-table--group::after, .el-table::before{
			  background-color: #b4b4b4;
			}
            .leftAsideTitle{
            	padding: 5px 16px;
                display: flex;
                align-items: center;
                justify-content:space-between;
                span{
                	font-size: 14px;
                	color: #323232;
                }
                .el-button{
                	color:#006fe6;
                }
            }
            .leftAsideSearch{
            	padding: 0 16px 10px;
            	border-bottom: solid 1px #b4b4b4;
            	.el-input{
            		border-radius: 4px;
					border: solid 1px #969696;
            	}
            }
            .tableDiv{
            	height: calc(100vh - 190px);
			    height: -webkit-calc(100vh - 190px);
			    height: -moz-calc(100vh - 190px);
	            overflow-y: auto;
		    	.el-table{
		    		.listDiv{
		    			padding:3px 8px 5px 5px;
		    			.topP{
		    				img{
		    					width: 15px;
								height: 17px;
								vertical-align: text-top;
		    				}
		    				span{
		    					margin-left: 20px;
							    font-size: 14px;
							    width: 200px;
							    overflow: hidden !important;
							    text-overflow:ellipsis;
							    white-space: nowrap;
							    color: #323232;
							    display: inline-block;
		    				}
		    				.rightListIcon{
								margin-left: 26px;
							    font-size: 16px;
							    color: #969696;
							    vertical-align: super;
		    				}
		    			}
		    			.mediumP{
		    				padding-left: 38px;
		    				font-size: 12px;
							color: #006fe6;
							width: 200px;
						    overflow: hidden !important;
						    text-overflow:ellipsis;
						    white-space: nowrap;
		    			}
		    			.bottomP{
		    				padding-left: 38px;
		    				font-size: 12px;
		    				color: #969696;
		    				width: 200px;
						    overflow: hidden !important;
						    text-overflow:ellipsis;
						    white-space: nowrap;
		    			}
		    		}
		    	}
	    	}
	    }
	    
        .rightContainer{
        	height: calc(100vh - 96px);
		    height: -webkit-calc(100vh - 96px);
		    height: -moz-calc(100vh - 96px);
			overflow-y: auto;
		    background-color: #FFF;
		    padding: 0 0 80px;
		    .el-header {
		        height: 83px !important;
		        line-height: 83px;
		        background-color: #ffffff;
	    		padding: 0 40px;
	    		.leftHeader{
	    			display: flex;
	    			.showName{
	    				max-width: 600px;
	    				display: inline-block;
	    				font-size: 36px;
	    				color: #323232;
	    				overflow: hidden !important;
						text-overflow:ellipsis;
						white-space: nowrap;
						margin-right: 31px;
	    			}
	    			.showStatus{
	    				font-size: 14px;
	    				color: #323232;
	    				i{
	    					font-size: 16px;
	    					margin-right: 8px;
	    				}
	    			}
	    		}
		        .el-col.rightHeader{
		        	text-align: right !important;
		        	.addRole{
		        		margin-right: 23px;
		        		font-size: 16px;
		        		color: #2c5ac2;
		        	}
		        	.batchDel{
		        		font-size: 16px;
		        		color: #ed5151;
		        	}
		        	.el-input{
		        		margin-left: 23px;
		        		width: 200px;
		        		.el-icon-search{
		        			color: #68c161;
		        		}
		        	}
	                .search{
	                    position: relative;
	                    left: -30px;
	                    top: -2px;
	                }
		        }
		    }
    		.showOtherInfo{
    			font-size: 14px;
				color: #969696;
    			padding: 0 40px;
    			p:first-child{
    				margin-bottom: 12px;
    			}
    			p:last-child{
    				max-width: 600px;
    				overflow: hidden !important;
					text-overflow:ellipsis;
					white-space: nowrap;
    			}
    		}
    		.table-title{
	        	height: 48px;
	        	line-height: 48px;
	        	margin: 24px 40px 0;
	        	padding:0 16px;
				background-color: #FFFFFF;
				border: solid 1px #bebebe;
				border-bottom:none;
		        span{
	            	font-weight: bold;
	            	font-size: 18px;
	            	margin-right: 10px;
	            }
	        }
			.container {
		    	background-color: #FFFFFF;
		        margin: 0 40px 0;
		        padding-left:22px;
	    		border: solid 1px #bebebe;
	    		border-top: none;
		        .pagination{
		        	margin:20px 0 0 22px;
		        }
		    }
        }
		    .gray{
		    	color: #969696;
		    }
		    .green{
		    	color: #65c728;
		    }
    }
</style>

<template>
    <el-container class="industryDeviceList">
	  	<el-aside class="outAside" width="320px">
            <div class="leftAsideTitle">
                <span>资产列表</span>
                <el-button type="text" v-if="hasPermission('productDevices/insert')" icon="el-icon-plus"  style="padding-left: 10px;" @click="editHandle('add')">添加资产</el-button>
            </div>
            <div class="leftAsideSearch">
                <el-input
	            	class="searchDept"
	            	prefix-icon="el-icon-search"
				  	placeholder="search"
				  	@input="filterIndustryDevice"
				  	v-model="filterText">
				</el-input>
            </div>
            <div class="tableDiv">
		  		<el-table ref="singleIndustryTable" :data="filterIndustryDeviceTableData" class="table" highlight-current-row :show-header=false :row-style="{background:'#f0f0f0'}" @row-click="handleClick">
	                <el-table-column  align="left">
	                    <template slot-scope="scope">
	                    	<div class="listDiv">
		                        <p class="topP">
									<img src="../../assets/img/deviceCenter/liebiaotubiao.png" alt="图标">
		                        	<span>{{scope.row.name}}</span>
		                        	<i class="iconfont leansite-shouchang rightListIcon"></i>
		                        </p>
		                        <p class="mediumP">{{scope.row.classifySet?scope.row.classifySet.classifyName:''}}</p>
		                        <p class="bottomP">{{scope.row.note}}</p>
	                        </div>
	                    </template>
	                </el-table-column>
	            </el-table>
            </div>
	  	</el-aside>
	  	<el-container class="rightContainer" v-if="!industryAddAndEditVisble && !chioceDeviceVisble">
	        <el-header>
	        	<el-row>
				  <el-col :span="16" class="leftHeader">
				  	<span class="showName">{{oChioceObject.name}}</span>
				  </el-col>
				  <el-col :span="8" class="rightHeader">
				  	<el-button type="text" v-if="hasPermission('productDevices/update')" icon="el-icon-edit" @click="editHandle('edit')">编辑</el-button>
				  	<el-button type="text" v-if="hasPermission('productDevices/delete')" icon="el-icon-delete" class="batchDel" @click="handleDelete">删除</el-button>
				  </el-col>
				</el-row>
	        </el-header>
	        <div class="showOtherInfo">
				<p>参数数量：{{oChioceObject.attrSet?oChioceObject.attrSet.length:0}}</p>
			</div>
			<div class="showDevices">
				<p>
					<span>图示</span>
					<span>类型ID</span>
					<span>描述</span>
				</p>
				<p>
					<span>
						<img v-show="oChioceObject.classifySet==null || oChioceObject.classifySet.imagePath.length==0" src="../../assets/img/defaultImg.png" alt="设备类型图"/>
						<img v-show="oChioceObject.classifySet!=null && oChioceObject.classifySet.imagePath.length>0" :src="baseUrl+oChioceObject.classifySet.imagePath" alt="设备类型图"/>
					</span>
					<span>{{oChioceObject.classifySet != null?oChioceObject.classifySet.classifyName:''}}</span>
					<span>{{oChioceObject.note}}</span>
				</p>
			</div>
			<div class="table-title"><span>-</span>参数</div>
	        <div class="container">
	            <el-table stripe :data="oChioceObject.attrSet" class="table" height="330" empty-text="暂无数据">
	                <el-table-column prop="name" label="名称" align="center" min-width="200"></el-table-column>
	                <el-table-column prop="attr" label="变量"  align="center" min-width="300"></el-table-column>
	            </el-table>
	        </div>
	   </el-container>
        <el-container class="rightContainer" v-if="!industryAddAndEditVisble && chioceDeviceVisble">
            <ChioceDevice @ChioceDeviceCallBack="ChioceDeviceCallBack"></ChioceDevice>
        </el-container>
        <el-container class="rightContainer" v-if="industryAddAndEditVisble && !chioceDeviceVisble">
            <IndustryDeviceListAddAndEdit :chioceDevice="oChioceDevice" :typeObj="oChioceObject" @IndustryDeviceEditCallBack=industryEditCallBack></IndustryDeviceListAddAndEdit>
        </el-container>
	</el-container>
</template>

<script>
    import IndustryDeviceListAddAndEdit from "./IndustryDeviceListAddAndEdit.vue";
    import ChioceDevice from "./ChioceDevice.vue";
    export default {
        name: 'IndustryDeviceList',//工业设备列表
        components: {
            IndustryDeviceListAddAndEdit,
			ChioceDevice
		},
        data() {
        	let baseImageUrl = this.API.leansite.baseURL;
        	let substrUrl = baseImageUrl.substr(0,baseImageUrl.length-1);
            return {
            	filterIndustryDeviceTableData:[],//过滤后的工业设备数据
            	industryDeviceTableData:[],
				baseUrl:substrUrl,//截取后的图片路径
				filterText:'',//搜索类型文本
				oChioceObject:{
					name:'工业设备名称',
					attrSet:[],
					classifySet:{
						imagePath:''
					}
				},//表格选中的数据
				oEditChioceObject:{
					attrSet:[],
					classifySet:{
						imagePath:''
					}
				},//表格选中的数据--编辑参数时使用
                industryAddAndEditVisble:false,//工业设备添加和编辑是否显示
                chioceDeviceVisble:false,//是否显示选择类型的界面
                oChioceDevice:{},//选中的设备类型数据
            }
        },
        created() {

        },
        mounted(){
        	this.getIndustryDeviceRequest();
        },
        methods: {
            /**
             * 监听左侧搜索文本框input事件
             */
             filterIndustryDevice(){
             	if(this.filterText.length == 0){
                	this.filterIndustryDeviceTableData = this.industryDeviceTableData;
                }else{
                	this.filterIndustryDeviceTableData = this.industryDeviceTableData;
                	this.filterIndustryDeviceTableData = this.filterIndustryDeviceTableData.filter((currentValue,index,arr)=>{
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
                    this.industryAddAndEditVisble = false;
                }else{
                	this.chioceDeviceVisble = false;
                	this.industryAddAndEditVisble = true;
                }
            },
            /*
            * IndustryDeviceListAddAndEdit组件回调方法--子组件回调数据的方法
            * @param {Number} optType 操作类型 0:刷新表格数据;1:返回到选择设备类型界面;2:不刷新数据,返回至列表界面
            */
            industryEditCallBack(optType){
				this.industryAddAndEditVisble = false;
				this.oChioceObject ={};
                switch (optType){
                	case 0:
                		this.chioceDeviceVisble = false;
                		this.getIndustryDeviceRequest();
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
             * ChioceDevice 组件回调方法
             * @return {Object|Boolean} object=选中的数据对象;boolean 是否接收数据
             */
            ChioceDeviceCallBack(returnParam){
            	if(typeof returnParam == 'object'){
            		this.oChioceDevice = returnParam;
            		this.industryAddAndEditVisble = true;
            	}else{
            		this.oChioceDevice = {};
            		this.industryAddAndEditVisble = false;
            	}
            	this.chioceDeviceVisble = false;
            },
			/**
			 * 获取所有工业设备请求
			 */
			getIndustryDeviceRequest() {
				let self = this;
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getIndustryDevice
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.industryDeviceTableData = resData.data;
						this.filterIndustryDeviceTableData = resData.data;
						if(resData.data.length > 0){
							this.oChioceObject = this.filterIndustryDeviceTableData[0];
							this.oEditChioceObject = this.oChioceObject;
							self.$refs.singleIndustryTable.setCurrentRow(resData.data[0])
						}
					} 
				});
			},
            /**
             * 批量删除工业设备请求
             */
            deleteRequest(paramsId){
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.deleteIndustryDevice,
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
						this.getIndustryDeviceRequest();
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
    .industryDeviceList {
	    height: 100%;
	    background-color: #f0f0f0;
	    .outAside{
	    	height: 100%;
            overflow: auto;
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
    		}
    		.showDevices{
    			margin-top: 25px;
    			padding: 0 40px;
    			p{

					border: solid 1px #bebebe;
					display: flex;
    				justify-content: space-evenly;
    				span{
    					font-size: 14px;
    					color: #323232;
    					border-right: solid 1px #bebebe;
    					display: inline-block;
					    text-align: center;
					    width: 33.33%;
    				}
    				span:last-child{
	    				border-right:none;
	    			}
	    			img{
	    				width: 80%;
						height: 91px;
	    			}
    			}
    			p:first-child{
    				height: 48px;
    				line-height: 48px;
    				background-color: #FFFFFF;
    			}
    			p:last-child{
    				border-top:none;
    				height: 92px;
    				line-height: 92px;
    				background-color: #FFFFFF;
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
		        height: 100%;
		        margin: 0 40px 0;
		        padding-left:22px;
	    		border: solid 1px #bebebe;
	    		border-top: none;
		        .pagination{
		        	margin:20px 0 0 22px;
		        }
		    }
        }
    }
</style>

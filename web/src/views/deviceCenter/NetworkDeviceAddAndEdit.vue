<template>
    <div class="networkDeviceAddAndEdit">
        <div class="top">
            <div>
                <span class="backMain" @click="cancelOpt(2)">网络设备</span>
                <span class="el-icon-arrow-right" v-show="pageType=='添加'">
                    <span></span>
                </span>
                <span class="backMain" @click="cancelOpt(1)" v-show="pageType=='添加'">选择类型</span>
                <span class="el-icon-arrow-right">
                    <span></span>{{pageType}}设备
                </span>
            </div>
            <div>{{pageType}}设备</div>
        </div>
        <div class="userMessageRight_bottom" >
            <div class="user_message tab">
                <div class="tab_header"><span>-</span>属性信息</div>
                <div class="formText">
                    <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="10px" class="submitForm">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="ruleForm.name" placeholder="请输入名称（2~50个字符）" style="width:260px;"></el-input>
                        </el-form-item>
                        <el-form-item label="SN" prop="name">
                            <el-input v-model="ruleForm.license" placeholder="请输入SN" style="width:260px;"></el-input>
                        </el-form-item>
                        
                        <el-form-item label="描述" prop="note">
                            <el-input type="textarea" v-model="ruleForm.note" placeholder="请输入描述(0~50个字符)" maxlength="200" show-word-limit></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="userMessageRight_bottom" >
            <div class="user_message tab">
                <div class="tab_header"><span>-</span>属性信息</div>
                <div class="formText">
                    <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="10px" class="submitForm">
                        <el-form-item label="IP地址" prop="ip">
                            <el-input v-model="ruleForm.ip" placeholder="请输入ip" style="width:260px;"></el-input>
                        </el-form-item>
                        <el-form-item label="子网掩码" prop="mask">
                            <el-input v-model="ruleForm.mask" placeholder="请输入子网掩码" style="width:260px;"></el-input>
                        </el-form-item>
                        <el-form-item label="默认网关" prop="gateway">
                            <el-input  v-model="ruleForm.gateway" placeholder="请输入默认网关"  style="width:260px;"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="tableTitle"><span>-</span>软件版本</div>
        <div class="container" v-if="ruleForm.softList.length > 0">
        	<div class="tipsMsg">
        		<i class="el-icon-warning"></i>
        		<ul>
        			<li>1.版本号不能重复</li>
        			<li>2.版本信息不能随意删除</li>
        		</ul>
        	</div>
        	<el-button type="primary" icon="el-icon-plus" @click="addVersion">添加版本</el-button>
        	<el-table :data="ruleForm.softList">
				<el-table-column label="软件名称" min-width="150">
					<editable-cell :show-input="row.editMode" slot-scope="{row}" v-model="row.name">
						<span slot="content">{{row.name}}</span>
					</editable-cell>
				</el-table-column>
				<el-table-column label="软件版本" min-width="150">
					<editable-cell :show-input="row.editMode" slot-scope="{row}" v-model="row.version">
						<span slot="content">{{row.version}}</span>
					</editable-cell>
				</el-table-column>
				<el-table-column label="云端地址" min-width="250">
					<editable-cell :show-input="row.editMode" slot-scope="{row}"  v-model="row.url">
						<span slot="content">{{row.url}}</span>
					</editable-cell>
				</el-table-column>
				<el-table-column label="操作" min-width="80" align="center">
                    <template slot-scope="scope">
                        <el-button  type="text" v-if="hasPermission('role:delete')" icon="el-icon-delete" class="deleteBtn" @click="handleDelete(scope.$index, scope.row)" title="删除"></el-button>
                    </template>
                </el-table-column>
			</el-table>
        </div>
        <div class="container" v-else>
        	<div class="emptyTipsMsg">
        		<i class="el-icon-warning"></i>
        		<span>请至少添加一条版本信息</span>
        	</div>
        	<div class="centerOpt">
        		<i class="el-icon-setting"></i>
        		<span>还没有添加版本信息</span>
        		<span>请在此添加第一条版本信息</span>
        		<el-button type="primary" icon="el-icon-plus" @click="addVersion">添加版本</el-button>
        	</div>
        </div>
        <div class="bottom">
            <p>*&nbsp;必填字段</p>
            <el-row >
                <el-button type="primary" @click="saveNetWorkDevice('ruleForm')">提交</el-button>
                <el-button @click="cancelOpt">取消</el-button>
            </el-row>
        </div>
    </div>
</template>

<script>
	import EditableCell from '../../components/EditableCell.vue'
    import baseValidator from "../../common/baseValidator.js"
    export default {
        name: "NetworkDeviceAddAndEdit",//网络设备添加或编辑
        components: {
        	EditableCell
		},
        props:{
			parameterObj:{//parameterObj用户信息
				type: Object,
				required:true
			},
			chioceDevice:{//选中的设备信息（仅添加时使用）
                type: Object,
                required:false
           }
		},
        data(){
            return{
            	pageType:'add',//页面类型 pageType=add 新增/pageType=edit 修改
                ruleForm: {
                	id:'',
                    name: '',
                    license:'',//对应SN码
                    note: '',
                    ip:'',
                    gateway:'',//网关
                    mask:'',//子网掩码
                    softList:[],
                    typeId:''//网络设备类型id
                },
                rules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                        {
                            validator:baseValidator.validateDeviceName,
                            trigger: 'blur'
                        }
                    ],
                    license: [
                        {required: true, message: '请输入SN', trigger: 'blur'},
                        {
                            validator:baseValidator.validateLicense,
                            trigger: 'blur'
                        }
                    ],
                    note: [
                        {required: false, message: '请输入描述', trigger: 'blur'},
                        {
                            validator:baseValidator.validateDeviceDesc,
                            trigger: 'blur'
                        }
                    ],
                    ip: [
                        {required: true, message: '请输入ip', trigger: 'blur'},
                        {
                            validator:baseValidator.validateIP,
                            trigger: 'blur'
                        }
                    ],
                    mask: [
                        {required: true, message: '请输入子网掩码', trigger: 'blur'},
                        {
                            validator:baseValidator.validateMask,
                            trigger: 'blur'
                        }
                    ],
                    gateway: [
                        {required: true, message: '请输入默认网关', trigger: 'blur'},
                        {
                            validator:baseValidator.validateGateway,
                            trigger: 'blur'
                        }
                    ]
                },

            }
        },
        mounted() {
			if(this.parameterObj.id){
				this.pageType = '编辑';
				this.setFormData();//表单赋值
			}else{
				this.ruleForm.typeId = this.chioceDevice.id;
				this.pageType ='添加';
			}
			this.ruleForm.softList = this.ruleForm.softList.map(row => {
				return {
					...row,
					editMode: false
				};
			});
		},
		methods: {
			/**
			 * 监听 添加变量 按钮点击事件 
			 */
			addVersion(){
				this.ruleForm.softList.push({
		          	"name": "软件名称",
		          	"version": "软件版本",
		          	"url": "https://XXX.XXX.XXX/XXX",
				});
			},
			/**
			 * 监听表格 删除 按钮点击事件 
			 */
			handleDelete(index,row){
				this.ruleForm.softList.splice(index,1);
			},
			/**
			 * 监听 提交按钮 click事件
			 * @param formName {Object} form表单名称
			 */
			saveNetWorkDevice(formName) {
				let self = this;
				this.$refs[formName].validate((valid) => {
					if(this.ruleForm.softList.length == 0){
						this.$message({
							type: 'warning',
							message: '您还没有添加版本信息!'
						});
						return;
					}
					if(valid) {
						this.saveNetWorkDeviceRequest();
					} else {
						return false;
					}
				});
			},
            /**
             * 监听取消按钮click事件
             * @param {Number} optType 操作类型 0:刷新表格数据;1:返回到选择设备类型界面;2:不刷新数据关闭，返回至列表界面
             */
            cancelOpt(optType) {
				this.resetForm();//重置表单
				this.$emit("NetworkDeviceEditCallBack",optType);
			},
			/*
			 * 重置表单
			 */
			resetForm(){
				this.pageType ='添加';
				this.$refs['ruleForm'].resetFields();
			},
			/**
			 * 表单赋值
			 */
			setFormData(){
				this.ruleForm.id=this.parameterObj.id;
				this.ruleForm.name=this.parameterObj.name;
				this.ruleForm.note=this.parameterObj.note;
				this.ruleForm.license=this.parameterObj.license;
				this.ruleForm.ip=this.parameterObj.ip;
				this.ruleForm.gateway=this.parameterObj.gateway;
				this.ruleForm.mask=this.parameterObj.mask;
				this.ruleForm.softList=this.parameterObj.softList;
				this.ruleForm.typeId=this.parameterObj.typeId;
			},
			/**
			 * 保存网络设备请求
			 */
			saveNetWorkDeviceRequest() {
            	let self =this;
                let submitForm = {
                    name: this.ruleForm.name,
                    license:this.ruleForm.license,
                    note: this.ruleForm.note,
                    ip:this.ruleForm.ip,
                    gateway:this.ruleForm.gateway,
                    mask:this.ruleForm.mask,
                    softList:this.ruleForm.softList,
                    typeId:this.ruleForm.typeId,
           		};
               if(this.pageType == "编辑"){
               		submitForm.id = this.ruleForm.id;
               }
	    		this.$axios.leansite({
            		method:'post',
                	url:this.API.leansite.saveNetworkDevice,
                	data:submitForm
                }).then((res) => {
                    var resData = res.data;
                    if(resData.code == 0){
                    	self.$message({
				            type: 'success',
				            message: this.pageType+'设备成功!'
				        });
				        self.resetForm();//重置表单
				        //调用父组件方法--isRefresh=true需要刷新父组件的数据
						self.$emit("NetworkDeviceEditCallBack",0);
                    } else if(resData.code == 1000) {
						this.$message({
							type: 'error',
							message: this.pageType+'设备失败：'+resData.msg
						});
					}else{
			          	self.$message({
				            type: 'error',
				            message: this.pageType+'设备失败，请退出重试！'
			          	});
                    }
                }).catch((err) => {
		          	self.$message({
			            type: 'error',
			            message: '请求异常，请检查网络！'
			        });
               });
			}
		}
    }
</script>

<style lang="scss" scoped type="text/css">
    .networkDeviceAddAndEdit {
    	margin: 0 40px 60px;
    	overflow-y: auto;
        .top{
            div{
                font-size: 14px;
                margin-top: 24px;
                .backMain{
                	cursor: pointer;
                }
                span{
                    color: #006fe6;
                    margin-right: 10px;
                 }
                .el-icon-arrow-right{
                    color: #969696;
                }
                &:last-child{
                     height: 36px;
                     font-family: MicrosoftYaHei-Bold;
                     font-size: 36px;
                     line-height: 36px;
                     color: #323232;
                     margin: 25px 0;
                 }
            }
        }
        .userMessageRight_bottom {
            margin-top:20px !important;
            .tab {
                border: solid 1px #bebebe;
                font-size: 14px;
                color: #323232;
                margin-bottom: 23px;
                padding-bottom:20px;
                .tab_header {
                    height: 48px;
                    line-height: 48px;
                    background-color: #FFFFFF;
                    border-bottom: solid 1px #bebebe;
                    border-bottom: none;
                    padding-left: 16px;
                    span{
                    	font-weight: bold;
                    	font-size: 18px;
                    	margin-right: 10px;
                    }
                }
                .formText{
                    margin: 0 auto;
                    padding: 0 16px;
                    .el-form{
                        width: 50%;
                    }
                }
            }
        }
        .tableTitle{
        	height: 48px;
        	line-height: 48px;
        	margin: 24px 0 0;
        	padding:0 16px;
			background-color: #FFFFFF;
			border: solid 1px #bebebe;
			border-bottom: none;
	        span{
            	font-weight: bold;
            	font-size: 18px;
            	margin-right: 10px;
            }
        }
        .container{
    		border: solid 1px #bebebe;
			border-top: none;
			padding: 16px;
        	.tipsMsg{
				display: flex;
			    align-items: center;
			    height: 64px;
			    background-color: #ffedb5;
			    border-radius: 3px;
			    border: solid 1px #e6dbb7;
			    i{
			    	padding: 0 15px;
					font-size: 20px;
			    }
			    ul li{
			    	list-style: none;
				    font-size: 14px;
				    font-weight: normal;
				    font-stretch: normal;
				    line-height: 24px;
				    letter-spacing: 0px;
				    color: #665e48;
			    }
            }
            .el-button{
            	margin: 15px 0 5px;
            }
            .emptyTipsMsg{
            	height: 32px;
            	line-height: 32px;
				background-color: #fcd3d2;
				border-radius: 3px;
				border: solid 1px #d6b4b4;
				i{
					font-size: 17px;
					color: #811211;
					margin: 0 10px 0 16px;
				}
				span{
					font-size: 14px;
					font-weight: normal;
					font-stretch: normal;
					line-height: 24px;
					letter-spacing: 0px;
					color: #811211;
				}
            }
            .centerOpt{
            	display: flex;
				justify-content: center;
			    align-items: center;
			    flex-direction: column;
			    height: 258px;
			    i{
			    	font-size: 50px;
			    }
			    span{
				    &:first-child{
				    	margin: 10px 0 16px;
				    	font-size: 14px;
						color: #323232;
				    }
				    &:last-child{
						font-size: 14px;
						color: #969696;
				    }
			    }
            }
        }
        .bottom{
        	padding: 23px 0;
            p{
                color: #d0021b;
            }
            div{
                margin-top: 20px;
                .el-button{
                    &:first-child{
                         width: 90px;
                         height: 32px;
                         background-color: #006fe6;
                         border-radius: 4px;
                     }
                    &:last-child{
                          width: 90px;
                          height: 32px;
                          border-radius: 4px;
                          border: solid 1px #006fe6;
                          color:  #006fe6;
                    }
                }
            }
        }
    }
</style>

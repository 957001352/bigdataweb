<template>
	<div class="roleListAdd">
		<el-form :model="roleForm" label-position="left" :rules="rules" ref="roleForm" label-width="100px" class="demo-roleForm" size="small">
			<el-row :gutter="15">
				<el-col :span="23">
					<el-form-item label="角色名称" prop="roleName">
						<el-input v-model="roleForm.roleName"  placeholder="请输入角色名"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="23">
					<el-form-item label="角色描述" prop="remark">
						<el-input v-model="roleForm.remark"  placeholder="请输入角色描述"></el-input>
					</el-form-item>
				</el-col>
				<!--<el-col :span="23">
					<el-form-item label="用户"  prop="userId">
						<el-cascader
							style="width: 100%;"
					
					    placeholder="请选择或搜索用户"
					    :options="deptUserList"
					    :props=treeProps 
					    @change="handleChange"
					    filterable></el-cascader>
					</el-form-item>
				</el-col>-->
			</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="cancelOpt">取 消</el-button>
			<el-button v-if="pageType == 'add'" type="primary" @click="addRole('roleForm')">保存</el-button>
			<el-button v-else-if="pageType == 'edit'" type="primary" @click="editRole('roleForm')">保存</el-button>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'RoleListAdd', //新增角色
		props:{
			roleObj:{//roleObj用户信息
				type: Object,
				required:true
			}
		},
		data() {
			return {
				roleForm: {
					id:'',//角色id  编辑提交时使用
					remark: '', //角色id
					roleName:'',//角色名
					//userId:'',//用户id 以逗号分隔
				},
				treeProps:{
					value:'userId',
					label:'deptName',
					children:'deptUserTobeanList',
					multiple: true
				},
				deptUserList: [],
				pageType:'add',//页面类型 pageType=add 新增/pageType=edit 修改
				rules: {
					roleName: [{
							required: true,
							message: '请输入角色名称',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 50,
							message: '角色名称必须在 2-50 个字符',
							trigger: 'blur'
						}
					],
					remark: [{
							required: true,
							message: '请输入角色描述',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 50,
							message: '角色名称必须在 1-50 个字符',
							trigger: 'blur'
						}
					]
//					,
//					userId: [{
//							required: true,
//							message: '请选择用户',
//							trigger: 'change'
//						}
//					]
				}
			}
		},
		created() {
		},
		mounted() {
			if(this.roleObj.id){
				this.pageType = 'edit';
				this.setFormData();//表单赋值
			}else{
				this.pageType ='add';
			}
			//this.getDeptAndUser();
		},
		computed: {
			
		},
		methods: {
			/**
			 * 表单赋值
			 */
			setFormData(){
				this.roleForm.id=this.roleObj.id;
				this.roleForm.roleName=this.roleObj.roleName;
				this.roleForm.remark=this.roleObj.remark;
				this.roleForm.userId=this.roleObj.userId;
			},
			/**
			 * 选择用户级联框 change事件 
			 * @param {Array} valArray 选中的值
			 */
			handleChange(chioceArray){
				let aUserId = [];
				chioceArray.forEach(function(item,index){
					if(item[item.length-1] && typeof item[item.length-1] == "number"){
						aUserId.push(item[item.length-1]);	
					}
				});
				this.roleForm.userId = aUserId.toString();
				console.log(this.roleForm.userId);
			},
			/**
			 * 添加角色
			 * @param formName {Object} form表单名称
			 */
			addRole(formName) {
				let self = this;
				this.$refs[formName].validate((valid) => {
					if(valid) {
		                self.$axios.leansite({
		            		method:'post',
		                	url:self.API.leansite.addRole, 
		                	data:self.roleForm
		                }).then((res) => {
		                    var resData = res.data;
		                    if(resData.status == "200"){
		                    	self.$message({
						            type: 'success',
						            message: '添加角色成功!'
						        });
						        self.resetForm();//重置表单
						        //调用父组件方法--isRefresh=true需要刷新父组件的数据
								self.$emit("RoleCallBack",true);
		                    }else{
					          	self.$message({
						            type: 'error',
						            message: '添加角色失败，请退出重试！'
					          	});
		                    }
		                }).catch((err) => {
							if(err.response.data.status == 500){
		                    	self.$message({
						            type: 'error',
						            message: '添加角色失败，'+err.response.data.message
					          	});
		                    }else{
					          	self.$message({
						            type: 'error',
						            message: '请求异常，请检查网络！'
						        });
		                    } 
		                })
					} else {
						return false;
					}
				});
			},
			/**
			 * 修改用户组信息
			 * @param formName {Object} form表单名称
			 */
			editRole(formName) {
				let self = this;
				this.$refs[formName].validate((valid) => {
					if(valid) {
		                self.$axios({
		            		method:'post',
		                	url:self.API.updateRoles, 
		                	data:self.roleForm
		                }).then((res) => {
		                    var resData = res.data;
		                    if(resData.status =="200"){
		                    	self.$message({
						            type: 'success',
						            message: '修改用户信息成功!'
						        });
						        self.resetForm();//重置表单
						        //调用父组件方法--isRefresh=true需要刷新父组件的数据
								self.$emit("RoleCallBack",true);
		                    }else{
					          	self.$message({
						            type: 'error',
						            message: '修改用户信息失败，请退出重试！'
					          	});
		                    }
		                }).catch((err) => {
		                	self.$message({
					            type: 'error',
					            message: '请求异常，请检查网络！'
					        });  
		                })
					} else {
						return false;
					}
				});
			},
			/*
			 * 取消
			 */
			cancelOpt(){
				this.resetForm();//重置表单
				//调用父组件方法--isRefresh=false不需要刷新父组件的数据
				this.$emit("RoleCallBack",false);
			},
			/*
			 * 重置表单
			 */
			resetForm(){
				this.pageType ='add';
				this.$refs['roleForm'].resetFields();
			},
			getDeptAndUser() {
			    this.$axios.leansite({
			     method: 'get',
			     url: this.API.leansite.getDeptAndUser,
			    }).then((res) => {
			     var resData = res.data;
			     if(resData.status == 200) {
			      this.deptUserList = resData.data;
			     } else {
			      this.$message({
			       type: 'error',
			       message: '获取角色列表失败，请退出重新打开！'
			      });
			     }
			    }).catch((err) => {
			     console.log('请求异常，请检查网络!');
			    });
			}
		}
	}
</script>
<style lang="scss" scoped type="text/css">
	.roleListAdd {
		.el-form{
			padding:0 48px 0;
		}
		.dialog-footer{
			margin-top:15px;
			text-align: center;
			.el-button{
				width: 130px;
			}
			.el-button:first-child{
				margin-right: 70px;
				background-color: #c4d4e7;
				color: #FFFFFF;
			}
		}
		.el-select{
			width:100%;
		}
	}
</style>

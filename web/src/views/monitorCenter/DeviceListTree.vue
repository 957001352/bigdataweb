<template>
    <div class="deviceListTree">
        <div class="leftAsideSearch">
        	<!--<el-button icon="el-icon-sort" @click="handleSort" title="按时间排序"></el-button>-->
            <el-input
            	class="searchDept"
            	prefix-icon="el-icon-search"
			  	placeholder="search"
			  	@input="filterIndustryDevice"
			  	v-model="filterText"
			  	clearable>
			</el-input>
        </div>
        <el-tree
  		  ref="orgTree"
	      :data="aDeptDatas.children"
	      node-key="id"
	      :props="defaultProps"
	      highlight-current
	      current-node-key="0"
	      :indent="10"
	      @node-click="treeClick"
	      :filter-node-method="filterNode"
	      :expand-on-click-node="false">
	       <span class="custom-tree-node" slot-scope="{ node, data }"  style="padding-right:10px;">
	        <i :class="node.level == 1?'iconfont leansite-zuzhijiagou':'el-icon-folder'" ></i>
	        <span style="display:inline-block;margin-left:5px;width: 220px;overflow: hidden !important;text-overflow:ellipsis;white-space: nowrap;" :title="node.label">{{ node.label }} （{{data.staffNum}}）人</span>
	      </span>
	   </el-tree>
	</div>
</template>

<script>
    export default {
        name: 'DeviceListTree',//树状设备列表
        components: {
		},
        data() {
            return {
            	aDeptDatas:{},//组织架构数据
		        defaultProps: {//tree与data字段映射
		          children: 'children',
		          label: 'title',
		          id:'id'
		        },
            	filterIndustryDeviceTableData:[],//过滤后的工业设备数据
            	industryDeviceTableData:[],
				filterText:'',//搜索类型文本
				oChioceDept:{
					title:'集团或部门名称'
				},//选中的部门
            }
        },
	    watch: {
	      filterText(val) {
	        this.$refs.orgTree.filter(val);
	      }
	    },
        created() {

        },
        mounted(){
        	this.getDeptData();
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
		        this.$emit('DeviceListCallBack',row);
		    },
            /**
             * 监听排序按钮click事件
             */
            handleSort(){
                
            },
			/**
			 * 部门树过滤搜索 
			 */
			filterNode(value, data) {
		        if (!value) return true;
		        return data.title.indexOf(value) !== -1;
		   },
			/**
			 * 部门树点击事件
			 */
			treeClick(nodeObj,nodes,nodeSelf){
				if(nodeObj.hasChildren){
					this.childData = nodeObj.children;
				}else{
					this.childData = [];
				}
				this.oChioceDept = nodeObj;
                this.pageObj.pageIndex = this.API.leansite.constObj.pageIndex;
			    this.getData();
			},
			/**
			 * 获取部门数据
			 */
			getDeptData() {
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getDepts,
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
                        this.aDeptDatas = resData.data;
                        if(this.aDeptDatas.hasChildren){
                        	this.oChioceDept =  resData.data.children[0];
                        }else{
                        	this.oChioceDept = this.aDeptDatas; 
                        }
					} else {
						this.$message({
							type: 'error',
							message: '获取部门失败，请刷新重试！'
						});
					}
				}).catch((err) => {
					this.$message({
						type: 'error',
						message: '请求异常，请检查网络！'
					});
				})
			},
            //获取首个部门
            getFirstDept(arr) {
            	if(arr.length > 0){
	                for(let i = 0;i < arr.length;i++ ){
	                    if(arr[i].hasChildren){
	                        this.getFirstDept(arr[i].children);
	                        return;
	                    }else{
	                        this.deptId = arr[i].id;
	                        this.getData();
	                        return;
	                    }
	                }
                }else{
                	this.deptId = null;
	                this.tableData = [];
                }
            }
        }
    }

</script>

<style lang="scss" scoped type="text/css">
    .deviceListTree {
	    height: 100%;
	    background-color: #f0f0f0;
        .leftAsideSearch{
		    padding: 0 15px 0;
		    height: 41px;
		    line-height: 41px;
		    border-bottom: solid 1px #b4b4b4;
		    display: flex;
		    align-items: center;
        	.el-button{
			    width: 32px;
			    height: 32px;
			    margin-right: 5px;
			    text-align: center;
			    padding: 0;
			    border-radius: 4px;
			    color: #323232;
			    border: solid 1px #323232;
        	}
		    /deep/ .el-input--medium .el-input__inner {
			    height: 31px;
			    line-height: 31px;
			}
			/deep/ .el-input--medium .el-input__icon {
			    line-height: 29px;
			}
        	.el-input{
        		width:290px;
			    line-height: 31px;
			    border: solid 1px #969696;
			    border-radius: 4px;
        	}
        }
        .el-tree{
    		width: 320px;
		    height: calc(100vh - 215px);
		    height: -webkit-calc(100vh - 215px);
		    height: -moz-calc(100vh - 215px);
        	overflow: auto;
		    background-color: #f0f0f0;
		    border-top: solid 1px #969696;
		    overflow-y: auto;
    	}
        /deep/ .el-tree-node>.el-tree-node__children{
            overflow: visible;
        }
        /deep/ .deptList .el-tree-node__content{
        	border: solid 1px #b4b4b4;
        }
    	/deep/ .el-tree-node__content{
	    	height: 33px !important;
	    	font-size: 14px;
	    }
	    /deep/ .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
	    		background-color: #FFFFFF;
	    		color: #3f78f6;
	    }
        /deep/ .custom-tree-node{
            line-height: 12px;
            span{
                overflow: visible !important;
            }
        }
    }
</style>

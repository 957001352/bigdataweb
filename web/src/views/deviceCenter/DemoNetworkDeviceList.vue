<template>
    <el-container class="roleList">
	  	<el-aside class="outAside" width="320px">
            <div class="leftAsideTitle">
                <span>设备列表</span>
                <el-button type="text" v-if="hasPermission('dept:add')" icon="el-icon-plus"  style="padding-left: 10px;">添加设备</el-button>
            </div>
            <div class="leftAsideSearch">
                <el-input
	            	class="searchDept"
	            	prefix-icon="el-icon-search"
				  	placeholder="search"
				  	@input="filterRole"
				  	v-model="filterText">
				</el-input>
            </div>
	  		<el-table ref="singleTable" :data="filterNetworkTableData" class="table" highlight-current-row :show-header=false  :row-style="{background:'#f0f0f0'}" @current-change="handleCurrentChange">
                <el-table-column  align="left">
                    <template slot-scope="scope">
                    	<div class="listDiv">
	                        <p class="topP">
	                        	<i class="iconfont leansite-bumen leftListIcon"></i>
	                        	<span>{{scope.row.name}}</span>
	                        	<i class="iconfont leansite-bumen rightListIcon"></i>
	                        </p>
	                        <p class="mediumP">{{scope.row.desc}}</p>
	                        <p class="bottomP">{{scope.row.address}}</p>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
	  	</el-aside>
	  	<el-container class="rightContainer" >
	        
	   </el-container>
	</el-container>
</template>

<script>
    export default {
        name: 'NetworkDeviceList',//网络设备列表
        components: {

		},
        data() {
            return {
            	networkTableData:[
					{
						name:'1大数据一体机1',
						desc:'大数据一体机',
						address:'部署DF-llOT os'
					},
					{
						name:'2大数据一体机大数据一体机大数2',
						desc:'大数据一体机',
						address:'部署DF-llOT os'
					},
					{
						name:'3大数据一体机大数据一体机大数据一体机大数据一体机',
						desc:'大数据一体机',
						address:'部署DF-llOT os'
					}
				],
				filterNetworkTableData:[],//过滤后的网络设备数据
				filterText:'',//搜索设备文本
				oChioceObject:{},//表格选中的数据
            }
        },
        created() {

        },
        mounted(){
        	setTimeout(()=>{
        		this.filterNetworkTableData = this.networkTableData;
        		this.$refs.singleTable.setCurrentRow(this.filterNetworkTableData[0])
        	},3000);
        	
        },
        methods: {
            /**
             * 角色搜索过滤
             */
             filterRole(){
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
             * 	当表格的当前行发生变化的时候会触发该事件
             */
            handleCurrentChange(currentRow, oldCurrentRow) {
		        this.oChioceObject = currentRow;
		    }
        }
    }

</script>

<style lang="scss" scoped type="text/css">
    .roleList {
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
	    	.el-table{
	    		.listDiv{
	    			padding:3px 8px 5px 5px;
	    			.topP{
	    				.leftListIcon{
	    					font-size: 15px;
    						color: #969696;
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
	    					margin-left: 27px;
						    font-size: 15px;
						    color: #969696;
	    				}
	    			}
	    			.mediumP{
	    				padding-left: 38px;
	    				font-size: 12px;
						color: #006fe6;
	    			}
	    			.bottomP{
	    				padding-left: 38px;
	    				font-size: 12px;
	    				height: 12px;
	    				color: #969696;
	    			}
	    		}
	    	}
	    }
	    
        .rightContainer{
    		overflow: hidden;
    		min-height: 640px;
    		background-color: #FFF;
        }
    }
</style>

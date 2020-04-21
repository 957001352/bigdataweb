<template>
	<div class="eventBox">
		<div class="event_header">
			<el-dropdown>
			  <span class="el-dropdown-link">
			   		 筛选<i class="el-icon-arrow-down el-icon--right"></i>
			  </span>
			  <el-dropdown-menu slot="dropdown">
			    <el-dropdown-item>黄金糕</el-dropdown-item>
			    <el-dropdown-item>狮子头</el-dropdown-item>
			    <el-dropdown-item>螺蛳粉</el-dropdown-item>
			  </el-dropdown-menu>
			</el-dropdown>
			<!--<span class="el-icon-guide"> 筛选</span>-->
			<span class="el-icon-delete"> 删除</span>
		</div>
		<div class="event_body">
			<div class="table-title"><span>-</span>所有时间</div>
			<div class="container">
				<el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" @selection-change="handleSelectionChange" show-overflow-tooltip>
					<el-table-column type="selection" align="center" width="55">
					</el-table-column>
					<el-table-column label="严重程度" align="center" width="">
						<template slot-scope="scope">
							<i class="el-icon-time" style="color: #f62447;font-size: 18px;" v-if="scope.row.date=='警告'"></i>
							<i class="el-icon-time" style="color: #ffcd06;font-size: 18px;" v-if="scope.row.date=='严重'"></i>
							<i class="el-icon-info" style="color: #006fe6;font-size: 18px;" v-if="scope.row.date=='提示'"></i>
        					<span style="margin-left: 10px">{{ scope.row.date }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="name" align="center" label="时间" width="" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="address" align="center" label="描述" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="date" label="状态" align="center" width="" show-overflow-tooltip>
						
					</el-table-column>
					<el-table-column prop="name" label="来源" align="center" width="" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="address" label="变量" align="center" show-overflow-tooltip>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'Event',
		components: {
			// EditableCell
		},
		props: {},
		data() {
			return {
				tableData: [{
					date: '严重',
					name: '王小虎上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄',
					address: '上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄'
				}, {
					date: '警告',
					name: '警告',
					address: '上海市普陀区金沙江路 1518 弄'
				}, {
					date: '提示',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}, {
					date: '警告',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}, {
					date: '严重',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}, {
					date: '提示',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}, {
					date: '严重',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}],
				multipleSelection: []
			}
		},
		mounted() {

		},
		methods: {
			handleSelectionChange(val) {
				this.multipleSelection = val;
			}
		}

	}
</script>
<style lang="scss">
	.eventBox {
		background: #fff;
		width: 100%;
		height: calc(100vh - 171px);
		height: -webkit-calc(100vh - 171px);
		height: -moz-calc(100vh - 171px);
		margin-top: -15px;
		.event_header {
			width: 100%;
			height: 44px;
			line-height: 44px;
			text-align: right;
			background-color: #ffffff;
			box-shadow: -1px 0px 5px 0px rgba(0, 0, 0, 0.2);
			/deep/ .el-dropdown-link {
			    cursor: pointer;
			    color: #006fe6;
			}
			/deep/ .el-icon-arrow-down {
			    font-size: 12px;
			}
			span {
				color: #006fe6;
			}
			.el-icon-delete{
				margin: 0 40px 0 16px;
					color: #f62447;
			}
		}
		.event_body {
			width: 95%;
			margin: 0 auto;
			div.table-title {
				margin-top: 24px;
				height: 48px;
				line-height: 48px;
				border-radius: 3px 3px 0 0;
				/*margin: 24px 40px 0;*/
				padding: 0 16px;
				background-color: #FFFFFF;
				border: solid 1px #bebebe;
				/*border-bottom:none;*/
				span {
					font-weight: bold;
					font-size: 18px;
					margin-right: 10px;
				}
			}
			.container {
				border: 1px solid #bebebe;
				border-top: none;
				border-radius: 0 0 3px 3px;
				/*min-height: 787px;*/
				.el-table {
					width: 98%;
					margin: 0 auto;
					text-align: center;
					/deep/ .el-table-column {
						border: solid 1px #969696;
					}
				}
			}
		}
	}
</style>
<template>
	<div class="Asset">
		<div class="overview">
			<div class="header">
				<span class="fl">资产信息</span>
				<div class="fr">
					<span class="el-icon-plus" @click="addAssets()">新增资产</span>
					<span @click="delAllAssets"><img :src="require('../../assets/img/internetPlatform/shanchu.png')" alt=""> 批量删除</span>
					<div>
						<input type="text" v-model="searchInp" @keyup.enter="searchEnterFun" placeholder="请输入资产名称">
						<span id="dividingLine"></span>
						<img @click="searchAssets" :src="require('../../assets/img/internetPlatform/sousuo.png')" alt="">
					</div>
				</div>
			</div>
			<div class="con">
				<el-table @selection-change="handleSelectionChange" class="assetsTable" :height="tableDataHeight" :data="tableData" stripe highlight-current-row style="width: 100%;" :cell-style="cellStyle" :header-cell-style="headerStyle">
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="name" width="180" label="资产名称" show-overflow-tooltip></el-table-column>
					<el-table-column prop="type" width="180" label="资产类型" show-overflow-tooltip></el-table-column>
					<el-table-column prop="name" width="200" label="资产ID" show-overflow-tooltip>
						<template slot-scope="scope">
							{{scope.row.id.id}}
						</template>
					</el-table-column>
					<el-table-column prop="createdTime" width="180" label="创建时间" show-overflow-tooltip>
						<template slot-scope="scope">
							{{scope.row.createdTime | momentDate}}
						</template>
					</el-table-column>
					<el-table-column prop="name" min-width="130" label="说明" show-overflow-tooltip>
						<template slot-scope="scope">
							{{scope.row.additionalInfo==null?'':scope.row.additionalInfo.description}}
						</template>
					</el-table-column>
					<el-table-column label="操作" width="240">
						<template slot-scope="scope">
							<el-button type="text" @click="addAssets(scope.row)" size="small" class="detailsBtn">
								<img :src="require('../../assets/img/internetPlatform/bianji.png')" alt="">编辑</el-button>
							<el-button type="text" size="small" @click="delAssets(scope.row)" class="delBtn"><i class="el-icon-error"></i>删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<el-drawer :modal='false' :visible.sync="drawer" :with-header="false" size="900px" :modal-append-to-body="false" :destroy-on-close='true' direction="rtl">
			<div>
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="资产详情" name="first">
						<el-form :rules="rules" label-position="left" label-width="110px" :model="currentTableData">
							<el-form-item label="资产名称：" prop="name">
								<el-input v-model="currentTableData.name" maxlength="6" placeholder="请输入六位以内字符"></el-input>
							</el-form-item>
							<el-form-item label="资产类型：" prop="type">
								<el-select v-model="currentTableData.type" filterable allow-create default-first-option style="width:100%">
									<el-option v-for="(item,index) in currentTableDataType" :key="index" :label="item.type" :value="item.type">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="资产ID：">
								<el-input title="请勿修改" readonly v-model="currentTableData.id==null?'':currentTableData.id.id"></el-input>
							</el-form-item>
							<el-form-item label="说明：">
								<el-input v-model="currentTableData.additionalInfo==null?'':currentTableData.additionalInfo.description" maxlength="30" placeholder="请输入三十位以内字符"></el-input>
							</el-form-item>
						</el-form>
						<div class="saveAssets">
							<button @click="cancelAssets">取消</button>
							<button @click="saveAssets">保存</button>
						</div>
					</el-tab-pane>
					<el-tab-pane label="属性" name="second">
						<el-select v-model="addAttributeSel" placeholder="请选择" @change="changeAttribute">
							<el-option label="服务端属性" value="SERVER_SCOPE"></el-option>
						</el-select>
						<span class="addAttribute" @click="addAttribute">+新增属性</span>
						<el-table :data="tableDataAttribute" stripe highlight-current-row style="width: 100%;" :cell-style="cellStyle" :header-cell-style="headerStyle" :height="attrTableHeight">
							<el-table-column prop="key" label="键" show-overflow-tooltip>
							</el-table-column>
							<el-table-column prop="lastUpdateTs" label="更新时间" show-overflow-tooltip>
								<template slot-scope="scope">
									{{scope.row.lastUpdateTs | momentDate}}
								</template>
							</el-table-column>
							<el-table-column prop="value" label="值" show-overflow-tooltip>
								<template slot-scope="scope">
									{{String(scope.row.value)}}
								</template>
							</el-table-column>
							<el-table-column prop="name" label="操作" show-overflow-tooltip>
								<template slot-scope="scope">
									<el-button type="text" @click="editAttribute(scope.row)" size="small" class="detailsBtn">
										<img :src="require('../../assets/img/internetPlatform/bianji.png')" alt="">编辑</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane label="遥测" name="third">
						<div class="telemetry">
							<p v-if="telemetryList.length===0">暂无数据</p>
							<div v-for="(item, index) in telemetryList" :key="index" :class="{'active':item.active,'empty':item.empty}">
								<p><em :title="item.name">{{item.name}}</em><span>{{item.time}}</span></p>
								<div>{{item.num}}</div>
								<span @click="telemetryDetails(index,item.name)">数据详情</span>
							</div>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
		</el-drawer>
		<el-dialog :title="editAttrFlag?'编辑属性':'添加属性'" :visible.sync="attributeVisible" width="500px" :modal="false" :close-on-click-modal="false">
			<el-form :model="currentAttribute" label-position="left" label-width="110px" size="small" style="margin:25px auto 0">
				<el-form-item label="键" label-width="50px">
					<el-input v-model="currentAttribute.key" :disabled="editAttrFlag" maxlength="10" placeholder="请输入十位以内字符"></el-input>
				</el-form-item>
				<el-form-item label="值" label-width="50px">
					<el-input v-model="currentAttribute.value" maxlength="10" placeholder="请输入十位以内字符"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="attributeVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveAttribute">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="添加资产" :visible.sync="dialogFormVisible" width="500px" :modal="false" :close-on-click-modal="false">
			<el-form :rules="rules" :model="currentTableData" label-position="left" label-width="110px" size="small" style="margin:25px auto 0">
				<el-form-item label="名称" prop="name">
					<el-input v-model="currentTableData.name" maxlength="6" placeholder="请输入六位以内字符"></el-input>
				</el-form-item>
				<el-form-item label="资产类型" prop="type">
					<el-select v-model="currentTableData.type" filterable allow-create default-first-option style="width:100%">
						<el-option v-for="(item,index) in currentTableDataType" :key="index" :label="item.type" :value="item.type">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="说明">
					<el-input v-model="currentTableData.additionalInfo==null?'':currentTableData.additionalInfo.description" maxlength="30" placeholder="请输入三十位以内字符"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveAssets">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="数据详情" :visible.sync="centerDialogVisible" center width="1004px" :modal="false" @closed="closeSialog">
			<div id="telemetryDetailsCharts"></div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'Asset', //资产中心
		components: {},
		props: ['ajaxMsg'],
		data() {
			return {
				tableData: [], //资产列表
				currentTableData: {
					name: "",
					type: "",
					label: "",
					additionalInfo: {
						description: "",
						gateway: false
					}
				}, //当前资产
				multipleSelection: [],
				tableDataHeight: 0, //资产列表高度
				currentTableDataType: [], //资产类型
				searchInp: '', //资产搜索
				rules: {
					name: [{
						required: true,
						message: '请填写资产名称',
						trigger: 'blur'
					}],
					type: [{
						required: true,
						message: '请填写资产类型',
						trigger: 'blur'
					}],
				}, //添加资产规则
				dialogFormVisible: false, //添加资产,
				attributeVisible: false, //添加属性,
				editAttrFlag: false, //是否编辑属性,
				attrTableHeight: 0, //属性列表高度
				currentAttribute: {
					key: '',
					value: '',
					type: ""
				}, //添加属性,
				drawer: false, //抽屉
				activeName: 'first', //抽屉tab栏
				addAttributeSel: 'SERVER_SCOPE', //属性类型下拉框
				tableDataAttribute: [], //属性表格,
				telemetryList: [],
				centerDialogVisible: false, //遥测详情
				telemetryDetailsCharts: null,
				telemetryDetailsOption: {
					color: ['#3c70d7', '#7ea6f2', '#D4E8FF', '#7DE5D2', '#FEAE7B', '#003399', '#3366cc', '#0087cb', '#3399ff', '#017890', '#587498', '#74828f', '#666633', '#99cccc', '#a1bad0', '#c25b56', '#ff9933', '#d0a727', '#f9ca79', '#d9ccb9'],
					tooltip: {
						trigger: 'axis',
						backgroundColor: 'rgba(240, 244, 251, 0.8)',
						textStyle: {
							color: '#505050',
							fontFamily: 'Microsoft YaHei',
							align: 'left'
						},
						axisPointer: {
							type: 'line'
						}
					},
					legend: {
						type: 'scroll',
						width: '70%',
						data: [],
						icon: 'pin',
						textStyle: {
							fontSize: '14px',
							fontFamily: 'Microsoft YaHei',
						},
						itemGap: 30,
						right: 10,
						top: '10px',
					},
					grid: {
						left: '40px',
						right: '26px',
						bottom: '40px',
						top: '50px'
					},
					xAxis: {
						type: 'category',
						nameGap: 10,
						data: [],
						axisLine: { //坐标轴轴线相关设置。
							lineStyle: {
								color: '#d8d8d8'
							}
						},
						axisLabel: { //坐标轴刻度标签的相关设置。
							color: '#505050'
						},
						axisTick: { //坐标轴刻度相关设置。
							show: false,
							alignWithLabel: false
						},
						splitLine: { //坐标轴在 grid 区域中的分隔线
							lineStyle: {
								color: '#eee'
							}
						},
						name: ''
					},
					yAxis: {
						name: '',
						nameTextStyle: {
							// align: 'left',
							fontFamily: 'Microsoft YaHei',
							align: 'right'
						},
						type: 'value',
						nameGap: 20,
						axisLine: {
							show: false
						},
						axisLabel: {
							color: '#505050',
							margin: 40,
							align: 'left'
						},
						splitLine: {
							lineStyle: {
								color: '#eee'
							}
						},
						axisTick: {
							show: true,
							lineStyle: {
								color: '#eee'
							}
						}
					},
					series: [{
						name: 'part1',
						type: 'line',
						smooth: true,
						symbol: 'none',
						areaStyle: {
							color: '#CEDBF5'
						},
						lineStyle: {
							color: '#5884DD'
						},
						// barWidth: 43,
						stack: 'Assets',
						data: []
					}],
				},
			}
		},
		created() {},
		mounted() {
			this.$nextTick(() => {
				//获取所有资产
				this.getAssets();
				window.addEventListener('resize', this.resize)
			})
		},
		destroyed() {
			window.removeEventListener('resize', this.resize);
		},
		computed: {},
		methods: {
			//遥测详情
			telemetryDetails(index, name) {
				this.telemetryList.forEach((v, i) => {
					if(i === index) {
						v.active = true;
					} else {
						v.active = false;
					}
				})
				this.centerDialogVisible = true;
				this.$nextTick(() => {
					this.telemetryDetailsCharts && this.telemetryDetailsCharts.clear();
					this.telemetryDetailsOption.xAxis.data = [];
					this.telemetryDetailsOption.series[0].data = [];
					this.telemetryDetailsCharts = this.$echarts.init(document.getElementById('telemetryDetailsCharts'));
					this.telemetryDetailsCharts && this.telemetryDetailsCharts.setOption(this.telemetryDetailsOption);
					this.getTelemetryDetails(name);
					window.addEventListener("resize", () => {
						this.telemetryDetailsCharts.resize();
					});
				})
			},
			//获取遥测接口
			getTelemetryDetails(name) {
				this.$axios.internet({
					loading: {
						isShow: false,
					},
					method: 'get',
					url: `${this.ajaxMsg.url}api/plugins/telemetry/ASSET/${this.currentTableData.id.id}/values/timeseries?interval=&limit=100&agg=NONE&keys=${name}&startTs=${(new Date()).getTime() - 86400000}&endTs=${(new Date()).getTime()}`,
					//请求头配置
					headers: {
						'X-Authorization': this.ajaxMsg.Authorization
					}
				}).then(res => {
					this.telemetryDetailsOption.xAxis.data = [];
					this.telemetryDetailsOption.series[0].data = [];
					Object.values(res.data)[0].forEach((v, i) => {
						this.telemetryDetailsOption.xAxis.data.push(this.$moment(v.ts).format('YYYY-MM-DD HH:mm:ss'));
						this.telemetryDetailsOption.series[0].data.push(v.value);
					})
					this.telemetryDetailsCharts.setOption(this.telemetryDetailsOption, true);
				}).catch(function(err) {
					console.log(err.response);
				})
			},
			//关闭遥测
			closeSialog() {
				this.telemetryList.forEach((v, i) => {
					v.active = false;
				})
			},
			//获取遥测
			getTelemetry() {
				this.$axios.internet({
					loading: {
						isShow: false,
					},
					method: 'get',
					url: `${this.ajaxMsg.url}api/plugins/telemetry/ASSET/${this.currentTableData.id.id}/values/timeseries?keys=`,
					//请求头配置
					headers: {
						'X-Authorization': this.ajaxMsg.Authorization
					}
				}).then(res => {
					let arr = [];
					for(let k in res.data) {
						arr.push({
							name: k,
							time: this.$moment(res.data[k][0].ts).format('YYYY-MM-DD HH:mm:ss'),
							num: res.data[k][0].value,
							active: false,
							empty: false
						})
					}
					if(arr.length % 3 == 2) {
						arr.push({
							name: '',
							time: '',
							num: '',
							active: false,
							empty: true
						})
					}
					this.telemetryList = [...arr];
					arr = null;
					setTimeout(() => {
						if(document.querySelector('#pane-third').style.display != 'none') {
							console.log(document.querySelector('#pane-third').style.display)
							this.getTelemetry();
						}
					}, 5000)
				}).catch(function(err) {
					console.log(err.response);
				})
			},
			//获取资产类型
			getCurrentTableDataType() {
				this.$axios.internet({
					loading: {
						isShow: false,
					},
					method: 'get',
					url: `${this.ajaxMsg.url}api/asset/types`,
					//请求头配置
					headers: {
						'X-Authorization': this.ajaxMsg.Authorization
					}
				}).then(res => {
					this.currentTableDataType = res.data;
				}).catch(function(err) {
					console.log(err.response);
				})
			},
			//保存属性
			saveAttribute() {
				this.$axios.internet({
					loading: {
						isShow: false,
					},
					method: 'post',
					url: `${this.ajaxMsg.url}api/plugins/telemetry/ASSET/${this.currentTableData.id.id}/${this.addAttributeSel}`,
					//请求头配置
					headers: {
						'X-Authorization': this.ajaxMsg.Authorization,
						'Content-Type': 'application/json'
					},
					data: JSON.stringify({
						[this.currentAttribute.key]: this.currentAttribute.value
					})
				}).then(res => {
					this.changeAttribute();
				}).catch(function(err) {
					console.log(err.response);
				})
				this.attributeVisible = false;
			},
			//编辑属性
			editAttribute(row) {
				this.editAttrFlag = true;
				this.attributeVisible = true;
				this.currentAttribute = { ...row
				};
			},
			//添加属性
			addAttribute() {
				this.editAttrFlag = false;
				this.attributeVisible = true;
				this.currentAttribute = {
					key: '',
					value: '',
					type: ''
				}
			},
			//切换属性
			changeAttribute() {
				this.$axios.internet({
					loading: {
						isShow: false,
					},
					method: 'get',
					url: `${this.ajaxMsg.url}api/plugins/telemetry/ASSET/${this.currentTableData.id.id}/values/attributes/${this.addAttributeSel}`,
					//请求头配置
					headers: {
						'X-Authorization': this.ajaxMsg.Authorization
					}
				}).then(res => {
					this.tableDataAttribute = res.data;
					this.$nextTick(() => {
						this.attrTableHeight = document.querySelector('.el-tabs').offsetHeight - 170;
					})
					this.attributeVisible = false;
				}).catch(function(err) {
					console.log(err.response);
				})
			},
			//点击tab
			handleClick(tab, event) {
				if(this.activeName === 'second') {
					this.changeAttribute();
				} else if(this.activeName === 'third') {
					this.getTelemetry();
				}
			},
			//取消保存
			cancelAssets() {
				this.drawer = false;
			},
			//保存资产
			saveAssets() {
				if(this.currentTableData.name.trim() === '' || this.currentTableData.type.trim() === '') {
					this.$message({
						type: 'warning',
						message: '请填写完整'
					});
					return;
				}
				this.$axios.internet({
					loading: {
						isShow: false,
					},
					method: 'post',
					url: `${this.ajaxMsg.url}api/asset`,
					//请求头配置
					headers: {
						'X-Authorization': this.ajaxMsg.Authorization,
						'Content-Type': 'application/json'
					},
					data: JSON.stringify(this.currentTableData)
				}).then(res => {
					this.$message({
						type: 'success',

						message: '添加资产成功!'
					});
					this.getAssets();
					this.drawer = false
				}).catch((err) => {
					let resData = err.response.data;
					if(resData) {
						this.$message({
							type: 'error',
							message: '添加资产失败，' + resData.message
						});
					} else {
						this.$message({
							type: 'error',
							message: '添加资产失败。'
						});
					}

					console.log(err.response);
				})
			},
			//搜索资产
			searchAssets() {
				this.$axios.internet({
					loading: {
						isShow: false,
					},
					method: 'get',
					url: `${this.ajaxMsg.url}api/tenant/assets?limit=1000&textSearch=${this.searchInp}`,
					//请求头配置
					headers: {
						'X-Authorization': this.ajaxMsg.Authorization
					}
				}).then(res => {
					this.tableData = res.data.data;
					this.$message({
						type: 'success',
						message: '搜索成功'
					});
				}).catch(function(err) {
					console.log(err.response);
				})
			},
			/**
			 * 按回车键搜索
			 */
			searchEnterFun(e) {
				var keyCode = window.event ? e.keyCode : e.which;
				if(keyCode == 13) {
					this.searchAssets()
				}
			},
			//新增资产
			addAssets(row) {
				if(row !== undefined) {
					this.currentTableData = { ...row
					};
					this.currentTableData.additionalInfo = this.currentTableData.additionalInfo == null ? {
						description: "",
						gateway: false
					} : this.currentTableData.additionalInfo;
					if(this.activeName === 'second') {
						this.changeAttribute();
					} else if(this.activeName === 'third') {
						this.getTelemetry();
					}
					this.drawer = true;
				} else {
					this.currentTableData = {
						name: "",
						type: "",
						label: "",
						additionalInfo: {
							description: "",
							gateway: false
						}
					};
					this.getCurrentTableDataType();
					this.dialogFormVisible = true;
				}
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			//删除所有
			delAllAssets() {
				if(this.multipleSelection.length == 0) {
					this.$message({
						type: 'warning',
						message: '请选择要删除的项'
					});
					return;
				}
				var axioxFn = []
				this.multipleSelection.forEach((v, i) => {
					axioxFn[i] = new Promise((resolve, reject) => {
						this.$axios.internet({
							loading: {
								isShow: false,
							},
							method: 'delete',
							url: `${this.ajaxMsg.url}api/asset/${v.id.id}`,
							//请求头配置
							headers: {
								'X-Authorization': this.ajaxMsg.Authorization
							}
						}).then(res => {
							resolve(res)
						}).catch(function(err) {
							reject(err)
						})
					})
				})
				Promise.all(axioxFn).then(res => {
					this.getAssets();
					this.$message({
						type: 'success',
						message: '删除成功'
					});
				}).catch((error) => {
					this.getAssets();
					this.$message({
						type: 'warning',
						message: '删除失败'
					});
				})
			},
			//删除资产
			delAssets(row) {
				if(row.id.id) {
					this.$confirm('删除此资产?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					}).then(() => {
						this.$axios.internet({
							loading: {
								isShow: false,
							},
							method: 'delete',
							url: `${this.ajaxMsg.url}api/asset/${row.id.id}`,
							//请求头配置
							headers: {
								'X-Authorization': this.ajaxMsg.Authorization
							}
						}).then(res => {
							this.getAssets();
							this.$message({
								type: 'success',
								message: '删除成功'
							});
						}).catch(function(err) {
							console.log(err.response);
						})
					}).catch(() => {

					});
				}
			},
			//获取所有资产
			getAssets() {
				this.$axios.internet({
					loading: {
						isShow: false,
					},
					method: 'get',
					url: `${this.ajaxMsg.url}api/tenant/assets?limit=1000&textSearch=`,
					//请求头配置
					headers: {
						'X-Authorization': this.ajaxMsg.Authorization
					}
				}).then(res => {
					this.tableData = res.data.data;
					this.dialogFormVisible = false;
					this.$nextTick(() => {
						this.tableDataHeight = document.querySelector('.con').offsetHeight - 105;
					})
				}).catch(function(err) {
					console.log(err.response);
				})
			},
			// 改变表格样式
			cellStyle({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				let style = {
					'text-align': 'center',
					'font-size': '14px',
					'height': '70px',
					'background-color': '#ffffff',
					'color': '#303030',
					// 'border-left': 'solid 1px #d8d8d8',
				}
				if(window.innerWidth > 1660) {
					if(rowIndex % 2 != 0) {
						style['background-color'] = '#f2f4f6';
					}
				} else if(window.innerWidth > 1440) {
					style['height'] = '52px';
					if(rowIndex % 2 != 0) {
						style['background-color'] = '#f2f4f6';
					}
				} else {
					style['height'] = '20px';
					if(rowIndex % 2 != 0) {
						style['background-color'] = '#f2f4f6';
					}
				}
				return style;
			},
			headerStyle({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				let style = {
					'background-color': '#f2f4f6',
					'font-size': '16px',
					'font-weight': 'normal',
					'color': '#101010',
					'text-align': 'center',
					'height': '70px',
				}
				if(window.innerWidth > 1440) {
					style['height'] = '52px';
					style['font-size'] = '14px';
				} else {
					style['height'] = '20px';
					style['font-size'] = '14px';
				}
				return style;
			},
			resize() {
				document.querySelector('.con') == null ? '' : this.tableDataHeight = document.querySelector('.con').offsetHeight - 105;
				document.querySelector('.con') == null ? '' : this.attrTableHeight = document.querySelector('.el-tabs').offsetHeight - 170;
			}
		}
	}
</script>

<style lang="scss" scoped type="text/css">
	/deep/ .el-message-box__btns button:nth-child(2) {
		background-color: #fff;
	}
	
	.Asset {
		/deep/ .el-drawer__body {
			height: 100%;
		}
		height: 100%;
		.overview {
			width: 100%;
			height: 100%;
			background-color: #ffffff;
			border-radius: 16px;
			padding: 0 40px;
			overflow: hidden;
			box-sizing: border-box;
			.header {
				text-align: left;
				height: 60px;
				line-height: 60px;
				border-bottom: solid 1px #d9e3f3;
				padding: 0 40px;
				margin: 0 -40px;
				position: relative;
				background-color: #fff;
				.fl {
					font-size: 16px;
					font-weight: bold;
					color: #424956;
				}
				.fr {
					float: right;
					span {
						font-family: 'MicrosoftYaHei';
						font-size: 16px;
						color: #2c5ac2;
						cursor: pointer;
						&:nth-of-type(2) {
							margin-left: 24px;
							color: #ed5151;
						}
					}
					>div {
						display: inline-block;
						width: 201px;
						height: 32px;
						margin-left: 24px;
						background-color: #f2f4f6;
						border-radius: 4px;
						overflow: hidden;
						vertical-align: middle;
						img {
							float: right;
							margin: 6px 10px 0 0;
							width: 18px;
							height: 18px;
						}
					}
					input {
						float: left;
						background-color: #f2f4f6;
						outline: none;
						border: none;
						height: 100%;
						padding: 0px 18px;
						box-sizing: border-box;
						font-size: 14px;
						width: 80%;
					}
				}
			}
			.con {
				padding: 28px 0;
				height: calc(100% - 60px);
				box-sizing: border-box;
			}
		}
		/deep/ .el-table {
			td .cell {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			button {
				width: 80px;
				height: 30px;
				font-size: 14px;
				padding: 0;
				margin: 10px 0;
				border-radius: 4px;
				border: solid 1px #68c161;
				background-color: transparent;
				i {
					margin-right: 6px;
				}
				&.detailsBtn {
					color: #6ecd8b;
				}
				&.delBtn {
					color: #ed5151;
					border: solid 1px #ed5151;
					margin-left: 20px;
				}
				img {
					vertical-align: middle;
					margin-right: 6px;
				}
			}
		}
		/deep/ .el-drawer__wrapper {
			position: absolute;
		}
		/deep/ .el-drawer {
			top: 0px;
			height: 100%;
			@media screen and (max-width: 1080px) {
				width: 600px !important;
			}
			>section>div {
				height: 100%;
				>div {
					height: 100%;
					.el-tabs__content {
						height: calc( 100% - 100px);
					}
				}
			}
		}
		/deep/ .el-tabs__item:focus.is-active.is-focus:not(:active) {
			box-shadow: none;
		}
		/deep/ .el-tabs__header {
			height: 60px;
			line-height: 60px;
			margin-bottom: 30px;
		}
		/deep/ .el-tabs__nav-scroll {
			padding: 0 40px;
		}
		/deep/ .el-tabs__item {
			font-size: 16px;
		}
		/deep/ .el-tabs__item.is-active {
			color: #3f78f6;
		}
		/deep/ .el-tabs__active-bar {
			background-color: #3f78f6;
		}
		/deep/ .el-tabs__content {
			padding: 0 42px;
		}
		/deep/ .el-form {
			width: 410px;
			margin: 10px 0 0 32px;
		}
		.saveAssets {
			position: absolute;
			bottom: 12%;
			display: flex;
			justify-content: center;
			width: calc(100% - 84px);
			button {
				width: 130px;
				height: 32px;
				background-color: #c4d4e7;
				border-radius: 4px;
				font-family: 'MicrosoftYaHei';
				font-size: 14px;
				color: #ffffff;
				outline: none;
				border: none;
				&:last-child {
					margin-left: 133px;
					background-color: #3c70d7;
				}
			}
		}
		.el-select {
			width: 140px;
		}
		/deep/ .el-input--medium .el-input__inner {
			height: 32px;
			line-height: 32px;
			background-color: #f2f4f6;
			border-radius: 4px;
			border: none;
		}
		.addAttribute {
			float: right;
			display: inline-block;
			margin: 16px 0 30px;
			font-size: 16px;
			color: #2c5ac2;
			cursor: pointer;
		}
		.telemetry {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			align-content: flex-start;
			height: 100%;
			overflow: auto;
			>div {
				width: 253px;
				height: 140px;
				background-color: #3c70d7;
				border-radius: 10px;
				overflow: hidden;
				color: #fff;
				padding: 23px 20px;
				box-sizing: border-box;
				margin-bottom: 50px;
				&.active {
					width: 289px;
					height: 160px;
				}
				&.empty {
					visibility: hidden;
				}
				>div {
					margin: 18px 0 8px;
					font-family: 'GrayDesign';
					font-size: 30px;
					text-align: center;
				}
				>span {
					font-size: 14px;
					display: block;
					text-align: center;
					position: relative;
					cursor: pointer;
					&::after {
						position: absolute;
						content: '|';
						color: #aee4fa;
						left: 68px;
					}
					&::before {
						position: absolute;
						content: '|';
						color: #aee4fa;
						right: 68px;
					}
				}
			}
			p {
				font-family: 'MicrosoftYaHei';
				font-size: 14px;
				span {
					font-family: 'Helvetica';
					font-size: 12px;
					color: #8ab1ff;
					float: right;
					margin-top: 5px;
				}
			}
			em {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				width: 100px;
				display: inline-block;
				cursor: pointer;
			}
		}
		/deep/ .el-dialog {
			overflow: hidden;
			margin: 0 auto !important;
			top: 50%;
			background-color: #ffffff;
			border-radius: 16px;
			border: none;
			transform: translateY(-50%);
			text-align: center;
		}
		/deep/ .el-dialog--center .el-dialog__body {
			padding: 18px 40px;
		}
		/deep/ .el-dialog__header {
			height: 50px;
			line-height: 50px;
			background-color: #fff;
			border-bottom: solid 1px #d9e3f3;
			padding: 0px 40px;
			text-align: left;
			span {
				font-size: 16px;
				color: #202020;
			}
		}
		/deep/ .el-dialog__headerbtn {
			top: 15px;
		}
		/deep/ .el-dialog__close {
			color: #202020;
			font-size: 22px;
		}
		/deep/ .el-dialog__footer {
			padding: 10px 20px 30px;
		}
		/deep/ .el-message-box__btns button.el-button,
		/deep/ .el-dialog__footer button.el-button {
			width: 130px;
			height: 32px;
			color: #ffffff;
			font-size: 14px;
			border: none;
			padding: 0;
		}
		/deep/ .el-message-box__btns button.el-button--default,
		/deep/ .el-dialog__footer button.el-button--default {
			background-color: #c4d4e7;
			border-radius: 4px;
		}
		/deep/ .el-message-box__btns button.el-button--primary,
		/deep/ .el-dialog__footer button.el-button--primary {
			background-color: #3c70d7;
			border-radius: 4px;
		}
		#telemetryDetailsCharts {
			height: 392px;
		}
	}
	
	#dividingLine {
		position: relative;
		top: -13px;
		border-left: solid 1px #cccccc;
	}
	
	/deep/ .el-table tr {
		height: 70px;
	}
	/*/deep/ .el-table tr:hover{
	 	box-shadow: 0px 1px 12px 0px rgba(37, 69, 134, 0.6);
	 }*/
	
	/deep/ .el-table__row:hover {
		box-shadow: 0px 1px 12px 0px rgba(37, 69, 134, 0.3);
	}
</style>
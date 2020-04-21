<template>
	<div class="outputBox">
		<div class="event_body">
			<div class="table-title"><span>-</span> 输出事件</div>
			<div class="container">
				<el-form inline :rules="rules" label-position="top" ref="form" :model="sizeForm" label-width="80px" >
					<el-form-item label="开始时间" prop="date1" style="width:200px;">
						<el-date-picker type="date" placeholder="选择日期" v-model="sizeForm.date1" ></el-date-picker>
					</el-form-item>
					<el-form-item label="结束时间" prop="date2" style="width:200px;">
						<el-date-picker type="date" placeholder="选择日期" v-model="sizeForm.date2" ></el-date-picker>
					</el-form-item>
					<el-form-item label="属性" prop="region" style="width: 100%;">
						<el-select v-model="sizeForm.region" placeholder="请下拉选择属性">
							<el-option label="区域一" value="shanghai"></el-option>
							<el-option label="区域二" value="beijing"></el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<!--<el-col :span="11">
							<el-time-picker placeholder="选择时间" v-model="sizeForm.date2" style="width: 100%;"></el-time-picker>
						</el-col>-->
			</div>
			<div class="bottom">
				<p>*&nbsp;必填字段</p>
				<el-button type="primary" @click="onSubmit">生成excel</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'output',
		components: {
			// EditableCell
		},
		props: {
			deviceObject: { //deviceObject设备信息
				type: Object,
				required: true
			},
		},
		data() {
			return {
				sizeForm: {
					region: '',
					date1: '',
					date2: ''
				},
				rules: {
         
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ]
        }
			}
		},
		mounted() {

		},
		methods: {
			onSubmit() {
				console.log('submit!');
			}
		}

	}
</script>

<style lang="scss" scoped type="text/css">
	.outputBox {
		background: #fff;
		width: 100%;
		height: calc(100vh - 171px);
		height: -webkit-calc(100vh - 171px);
		height: -moz-calc(100vh - 171px);
		overflow: hidden;
		.event_body {
			width: 95%;
			margin: 20px auto;
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
				overflow: hidden;
				/*min-height: 787px;*/
				.el-form-item {
					width: 70%;
					margin: 17px;
					/deep/ .el-form-item__label {
						padding: 0!important;
					}
				}
			}
			.bottom {
				p {
					color: #d0021b;
					margin: 23px 0;
				}
				div {
					margin-top: 20px;
					.el-button {
						width: 90px;
						height: 32px;
						background-color: #006fe6;
						border-radius: 4px;
					}
				}
			}
		}
	}
</style>
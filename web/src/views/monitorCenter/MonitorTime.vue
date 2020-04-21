<template>
	<div class="monitorMenu">
		<div v-for="(menu,index) in menuList" @click="menuClick(index)">
			<p>
				<img :src="menu.img" alt="图标" />
			</p>
			<span>{{menu.name}}</span>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'MonitorTime', //监测管理菜单页
		components: {},
		data() {
			return {
				menuList: [{
						name: '时序',
						img: require('../../assets/img/monitorCenter/timeOrder.png'),
						componentName: 'MonitorTime'
					},
					{
						name: '事件',
						img: require('../../assets/img/monitorCenter/events.png'),
						componentName: 'Event'
					},
					{
						name: '输出',
						img: require('../../assets/img/monitorCenter/output.png'),
						componentName: ''
					},
					{
						name: '信息',
						img: require('../../assets/img/monitorCenter/msg.png'),
						componentName: ''
					},
					{
						name: '文件',
						img: require('../../assets/img/monitorCenter/file.png'),
						componentName: ''
					}
				],
			}
		},
		created() {

		},
		mounted() {

		},
		methods: {
			/**
			 * 监听div控件click事件
			 * 新增tab并打开
			 * @param {Number} selectIndex 选中项的下标
			 */
			menuClick(selectIndex) {
				this.$emit("MonitorMenuCallBack", this.menuList[selectIndex]);
			}
		}
	}
</script>

<style lang="scss" scoped type="text/css">
	.monitorMenu {
		width: 100%;
		height: calc(100vh - 171px);
		height: -webkit-calc(100vh - 171px);
		height: -moz-calc(100vh - 171px);
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		div {
			width: 17%;
			text-align: center;
			p {
				height: 320px;
				line-height: 320px;
				text-align: center;
				border-radius: 3px;
				border: solid 1px #595959;
				img {
					width: 88px;
					height: 88px;
				}
			}
			span {
				color: #323232;
				display: block;
				margin-top: 42px;
			}
		}
	}
</style>
<template>

<div class="Overview">
    <div class="deviceOverview">
        <ul>
            <li v-for="(item,index) in deviceOverviewList" :key="index">
                <img :src="item.icon" alt="">
                <div class="deviceOverviewName" v-cloak>{{item.name}}</div>
                <span v-cloak>{{item.details}}</span>
                <div class="deviceOverviewNum" v-cloak v-if="index === 1">{{item.num.split('/')[0]}}<em>/{{item.num.split('/')[1]}}</em></div>
                <div class="deviceOverviewNum" v-cloak v-else-if="index === 2">{{item.num.split('/')[0]}}<em style="margin-left: 10px;">{{item.num.split('/')[1]}}</em></div>
                <div class="deviceOverviewNum" v-cloak v-else>{{item.num}}</div>
            </li>
        </ul>
    </div>
    <div class="overview">
        <p class="header"><span>设备消息数</span>
            <el-select v-model="deviceMessageModel" placeholder="请选择" class="fr" @change="getDeviceMessage">
                <el-option label="月" value="month"></el-option>
                <el-option label="天" value="day"></el-option>
            </el-select>
        </p>
        <div id="deviceMessage">
        </div>
    </div>
    <div class="overview">
        <p class="header timeLine"><span>设备在线时长排行榜</span></p>
        <div id="deviceTime">
        </div>
    </div>
</div>
</template>

<script>
import bus from '../../common/bus';
export default {
    name: 'Overview', //物联网平台
    components: {},
    props: ['ajaxMsg'],
    data() {
        return {
            //资产总数 设备在线数 设备在线时长
            deviceOverviewList: [{
                icon: require('../../assets/img/internetPlatform/zichanzongshu.png'),
                name: '资产总数',
                details: 'The total number of assets',
                num: '0'
            }, {
                icon: require('../../assets/img/internetPlatform/shebei.png'),
                name: '设备在线数',
                details: 'Device on line number',
                num: '0/0'
            }, {
                icon: require('../../assets/img/internetPlatform/shijian.png'),
                name: '设备在线时长',
                details: 'Device online time',
                num: '0/h'
            }],
            deviceMessageModel: 'month',
            // 设备消息数echarts
            deviceMessageCharts: null,
            // 设备消息数option
            deviceMessageOption: {
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
                    nameTextStyle: {
                        color: '#505050',
                        fontFamily: 'Microsoft YaHei',
                        align: 'right'
                    },
                    nameGap: 20,
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
                        align: 'left',
                        fontFamily: 'Microsoft YaHei',
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
                    type: 'bar',
                    stack: 'device',
                    data: []
                }, ],
            },
            // 设备在线时长排行榜echarts
            deviceTimeCharts: null,
            // 设备在线时长排行榜option
            deviceTimeOption: {
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
                grid: {
                    left: '40px',
                    right: '26px',
//                     bottom: '20px',
                       top: '40px'
                },
                yAxis: {
//              	position:'right',
                    type: 'category',
                    nameGap: 10,
                    data: [],
                    axisLine: { //坐标轴轴线相关设置。
                        lineStyle: {
                            color: '#d8d8d8'
                        }
                    },
                    axisLabel: { //坐标轴刻度标签的相关设置。
                        color: '#505050',
                        margin: 10,
                        align: 'right'
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
                    name: '',
                },
                xAxis: {
                    name: '时',
                    nameTextStyle: {
                        color: '#505050',
                        fontFamily: 'Microsoft YaHei',
                        align: 'right'
                    },
                    type: 'value',
                    nameGap: 20,
                    axisLine: { //坐标轴轴线相关设置。
                        lineStyle: {
                            color: '#d8d8d8'
                        }
                    },
                    axisLabel: { //坐标轴刻度标签的相关设置。
                        color: '#505050',
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
                },
                series: [{
                    name: '在线时长',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: function(params) {
                                var colorList = ['red', '#7ea6f2', '#D4E8FF', '#7DE5D2', '#FEAE7B', '#003399', '#3366cc', '#0087cb', '#3399ff', '#017890', '#587498', '#74828f', '#666633', '#99cccc', '#a1bad0', '#c25b56', '#ff9933', '#d0a727', '#f9ca79', '#d9ccb9'];
                                return colorList[params.dataIndex]
                            }
                        }
                    },
                    barWidth: 20,
                    data: []
                }, ],
            },
        }
    },
    created() {


		},
		mounted() {
			this.$nextTick(() => {
				//获取上面三个块 设备在线时长
				this.getDeviceOverviewList();
				// 获取设备消息数
				this.getDeviceMessage();
				//画图设备消息数
				this.deviceMessageCharts && this.deviceMessageCharts.clear();
				this.deviceMessageCharts = this.$echarts.init(document.getElementById('deviceMessage'));
				this.deviceMessageCharts && this.deviceMessageCharts.setOption(this.deviceMessageOption);
				//画图在线时辰
				this.deviceTimeCharts && this.deviceTimeCharts.clear();
				this.deviceTimeCharts = this.$echarts.init(document.getElementById('deviceTime'));
				this.deviceTimeCharts && this.deviceTimeCharts.setOption(this.deviceTimeOption);
				//动态图
				window.addEventListener("resize", this.eventListener);
			})
			bus.$on("resize", this.eventListener)
		},
		destroyed() {
			window.removeEventListener('resize', this.eventListener);
			this.deviceMessageCharts = null;
			this.deviceTimeCharts = null;
			bus.$off();
		},
		computed: {

    },
    methods: {
        //获取上面三个块
        getDeviceOverviewList() {
            this.$axios.internet({
                loading: {
                    isShow: false,
                },
                method: 'get',
                url: `${this.ajaxMsg.url}api/plugins/telemetry/online/devicesNumber`,
                //请求头配置
                headers: {
                    'X-Authorization': this.ajaxMsg.Authorization
                }
            }).then(res => {
                this.deviceOverviewList[0].num = res.data.assetsTotal;
                this.deviceOverviewList[1].num = res.data.onlineNumber + '/' + res.data.divicesTotal;
            }).catch(function(err) {
                console.log(err);
            })
            this.$axios.internet({
                loading: {
                    isShow: false,
                },
                method: 'get',
                url: `${this.ajaxMsg.url}api/plugins/telemetry/online/devicesHours`,
                //请求头配置
                headers: {
                    'X-Authorization': this.ajaxMsg.Authorization
                }
            }).then(res => {
                this.deviceOverviewList[2].num = this.sToH(res.data.totalHours) + '/h';
                this.getDeviceTime(res.data);
            }).catch(function(err) {
                console.log(err);
            })
        },
        // 获取设备消息数
        getDeviceMessage() {
            this.$axios.internet({
                loading: {
                    isShow: false,
                },
                method: 'get',
                url: `${this.ajaxMsg.url}api/plugins/telemetry/${this.deviceMessageModel}/Number`,
                //请求头配置
                headers: {
                    'X-Authorization': this.ajaxMsg.Authorization
                }
            }).then(res => {
                this.deviceMessageOption.xAxis.name = this.deviceMessageModel === 'month' ? '日' : '时';
                this.deviceMessageOption.xAxis.data = [];
                this.deviceMessageOption.series = [];
                res.data.forEach((v, i) => {
                    v.deviceSet.forEach((vD, iD) => {
                        if (i === 0) {
                            this.deviceMessageOption.series.push({
                                name: vD.name,
                                type: 'bar',
                                stack: 'device',
                                data: [vD.number]
                            })
                        } else {
                            let index = this.deviceMessageOption.series.findIndex(item => item.name === vD.name);
                            this.deviceMessageOption.series[index].data.push(vD.number);
                        }
                    })
                    this.deviceMessageOption.xAxis.data.push(this.deviceMessageModel === 'month' ? this.$moment(v.ts).format('DD') : this.$moment(v.ts).format('HH'));
                })
                this.deviceMessageCharts.setOption(this.deviceMessageOption, true)
            }).catch(function(err) {
                console.log(err);
            })
        },
        //时间转换
        sToH(s) {
            return Math.ceil((s / 3600) * 1000) / 1000;
        },
        // 获取设备在线时长
        getDeviceTime(res) {
            this.deviceTimeOption.yAxis.data = [];
            this.deviceTimeOption.series[0].data = [];
            this.deviceTimeOption.grid.left = '40px';
            this.deviceTimeOption.grid.bottom = '40px';
            res.devicesRes.forEach((v, i) => {
                this.deviceTimeOption.yAxis.data.push(v.name);
                this.deviceTimeOption.series[0].data.push(this.sToH(v.totaltime));
            })
            this.deviceTimeCharts && this.deviceTimeCharts.setOption(this.deviceTimeOption, true);
        },
        eventListener() {
            setTimeout(() => {
                this.deviceMessageCharts && this.deviceMessageCharts.resize();
                this.deviceTimeCharts && this.deviceTimeCharts.resize();
            }, 0)
        }
    }
}
</script>

<style lang="scss" scoped type="text/css">

.Overview {
    height: 100%;
    .el-select {
        width: 201px;
        /deep/ .el-input--medium .el-input__inner {
            background-color: #f2f4f6;
            border-radius: 4px;
            border: none;
            height: 32px;
        }
    }
    .deviceOverview {
        ul {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
        li {
            width: calc( 100% / 3);
            float: left;
            height: 240px;
            background-color: #ffffff;
            
            border-radius: 16px;
            &:nth-of-type(2) {
                margin: 0 30px;
            }
            img {
                display: block;
                margin: 24px auto 0px;
            }
            div,
            span {
                text-align: center;
                display: block;
            }
            .deviceOverviewName {
                font-family: 'MicrosoftYaHei';
                font-size: 16px;
                font-weight: bold;
                color: #424956;
            }
            span {
                font-family: 'Helvetica';
                font-size: 14px;
                color: #929fae;
                margin: 6px 0 33px 0;
            }
            .deviceOverviewNum {
                font-family: 'GrayDesign-Medium';
                font-size: 50px;
                color: #303030;
            }
            em {
                font-size: 20px;
            }
        }
        li:hover{
        	box-shadow: 0px 15px 25px 0px rgba(49, 59, 87, 0.12);
        }
    }
    .overview {
        width: 100%;
        background-color: #ffffff;
        border-radius: 16px;
        margin: 30px auto;
        padding: 0 40px;
        overflow: hidden;
        box-sizing: border-box;
        &:last-child {
            margin-bottom: 0;
        }
        p.header {
            text-align: left;
            height: 60px;
            line-height: 60px;
            border-bottom: solid 1px #d9e3f3;
            padding: 0 40px;
            margin: 0 -40px;
            position: relative;
            background-color: #fff;
            span {
                font-size: 16px;
                font-weight: bold;
                color: #424956;
            }
            .fr {
                float: right;
            }
        }
    }
    #deviceMessage,
    #deviceTime {
        min-height: 267px !important;
    }
    
    
}
/deep/ .el-tabs__content{
	height: 84%!important;
}
</style>



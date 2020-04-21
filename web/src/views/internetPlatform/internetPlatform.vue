<template>
<div class="internetPlatform">
    <el-container>
        <el-header>
            <img src="../../assets/img/logo.png" alt="平台logo">
            <span>物联网平台</span>
        </el-header>
        <el-container class="platformContainer">
            <el-tabs tab-position="left" style="width: 100%;" v-model="activeName" @tab-click="asideClick" :lazy="true" class="plantFormClass">
                <el-tab-pane v-for="(item,index) in asideList" :key="index" :name="item.name" class="plantFormClassItem">
                    <span slot="label"><img style="margin-right: 15px;" :src="item.isactive ? item.icon[1]:item.icon[0]" alt="" >{{item.name}}</span>
                    <component v-if="activeName === item.name&&ajaxMsg.Authorization!=''" :is="item.com" :ajaxMsg="ajaxMsg" />
                </el-tab-pane>
            </el-tabs>
        </el-container>
    </el-container>
</div>
</template>

<script>
import bus from '../../common/bus';
export default {
    name: 'internetPlatform', //物联网平台
    components: {
        Overview: () =>
            import ('@/views/internetPlatform/Overview.vue'), //
        Asset: () =>
            import ('@/views/internetPlatform/Asset.vue'), //
        CollectingDevice: () =>
            import ('@/views/internetPlatform/CollectingDevice.vue'), //
    },
    props: {
        username: { //用户名
            type: String,
            required: true
        },
        leansiteToken: { //token信息
            type: String,
            required: true
        }
    },
    data() {
        return {
            ajaxMsg: {
                url: process.env.NODE_ENV !== 'development' ? this.API.internet.prodBaseURL : this.API.internet.baseURL, //接口ip
                Authorization: '', //接口令牌
            },
            activeName: '信息总览', //当前侧边栏
            //侧边栏
            asideList: [{
                    icon: [require('../../assets/img/internetPlatform/shouye1.png'), require('../../assets/img/internetPlatform/shouye2.png')],
                    name: '信息总览',
                    com: 'Overview',
                    isactive: true
                }, {
                    icon: [require('../../assets/img/internetPlatform/zichan1.png'), require('../../assets/img/internetPlatform/zichan2.png')],
                    name: '资产中心',
                    com: 'Asset',
                    isactive: false
                },
                {
                    icon: [require('../../assets/img/internetPlatform/caijishebei1.png'), require('../../assets/img/internetPlatform/caijishebei2.png')],
                    name: '采集设备',
                    com: 'CollectingDevice',
                    isactive: false
                },
            ],
        }
    },
    created() {},
    mounted() {
        this.loginCheck()
        bus.$on("loginout", this.loginout)
    },
    beforeDestroy() {
        bus.$off();
    },
    computed: {

    },
    methods: {
        //退出
        loginout() {
            this.$axios.internet({
                loading: {
                    isShow: false,
                },
                method: 'post',
                url: `${this.ajaxMsg.url}api/auth/logout`,
                //请求头配置
                headers: {
                    'X-Authorization': this.ajaxMsg.Authorization
                }
            }).then(res => {

            }).catch(function(err) {
                console.log(err.response);
            })
        },
        //点击侧边栏
        asideClick(index) {
            this.$nextTick(() => {
                this.asideList.forEach((v, i) => {
                    if (this.activeName == v.name) {
                        v.isactive = true;
                    } else {
                        v.isactive = false;
                    }
                })

            });
        },
        async loginCheck() {
            let self = this;
            await this.$axios.internet({
                url: `${this.ajaxMsg.url}api/auth/login`, //不需要再添加ip和端口
                method: 'post', //提交方式：get和post，同 params 和 data配合使用
                data: {
                    "username": '',
                    "password": "",
                    "leansitetoken": this.leansiteToken
                }
            }).then((res) => {
                var resData = res.data;
                if (resData.token && resData.token.length > 0) {
                    this.$store.commit('saveStoreByName', {
                        name: this.API.internet.constObj.internetToken,
                        storeName: 'internetToken',
                        storeInfo: 'Bearer ' + resData.token
                    });
                    this.ajaxMsg.Authorization = 'Bearer ' + resData.token;
                } else {
                    self.$alert("打开物联网中心失败,请关闭重新打开!");
                }
            }).catch(function(err) {
                console.log(err);
            })
        }
    }
}
</script>

<style lang="scss" scoped type="text/css">
.internetPlatform {
    min-width: 900px;
    min-height: 570px;
    position: relative;
    a:link {
        text-decoration: none;
        /* 指正常的未被访问过的链接*/
    }
    a:visited {
        text-decoration: none;
        /*指已经访问过的链接*/
    }
    a:hover {
        text-decoration: none;
        /*指鼠标在链接*/
    }
    a:active {
        text-decoration: none;
        /* 指正在点的链接*/
    }
    height: 100%;
    header {
    	display: none;
        height: 60px;
        background-color: #ffffff;
        >img {
            margin: 12px 21px 0 0;
            max-width: 130px;
        }
        >span {
            font-family: 'MicrosoftYaHei';
            font-size: 16px;
            color: #101010;
            vertical-align: -webkit-baseline-middle;
        }
    }
    .el-container {
        height: 100%;
        min-height: 570px;
    }
    .platformContainer {
        background-color: #eef1f7;
        height: calc(100% - 60px);
        width: 100%;
    }
    /deep/ .plantFormClass>.el-tabs__header.is-left {
        width: 180px;
        margin-right: 0px;
        background-color: #ffffff;
        overflow: hidden;
    }
    /deep/ .el-tabs--left .el-tabs__item.is-left {
        text-align: center;
        width: 100%;
        height: 54px;
        line-height: 54px;
        background-color: #fff;
        border-left: 3px solid #fff;
    }
    /deep/ .el-tabs--left .el-tabs__active-bar.is-left,
    /deep/ .el-tabs--left .el-tabs__nav-wrap.is-left::after {
        left: 0px;
        right: auto;
        height: 54px;
        background-color: #61adf8;
        width: 3px;
        float: left;
    }
    /deep/ .plantFormClass>div>div>div>div>.el-tabs__item.is-active {
        color: #3f78f6;
        background-color: #eef1f7 !important;
    }
    /deep/ .plantFormClass>.el-tabs__content {
        float: right;
        padding: 30px;
        width: calc(100% - 180px);
        height: 94%;
        box-sizing: border-box;
        overflow: auto;
    }
    /deep/ .el-tab-pane {
        height: 100%;
    }
}
</style>

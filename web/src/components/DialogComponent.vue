<template>
<el-dialog ref="systemModuleDialog" 
	:width="width" 
	class="systemModuleDialog" 
	:title="appObj.appName" 
	:fullscreen="isfullscreen" 
	:modal="false" 
	:visible.sync="moduleDialogVisible" 
	:append-to-body="false" 
    :show-close="false" 
    :class="isminimize? 'isminimize': ''" 
    center>
    <div v-show="!isminimize" slot="title" class="medium">
        <div class="centers">
        	<img src="../assets/img/daohang-logo.png" alt="平台logo"/>
        	<span>{{appObj.appName}}</span>
        </div>
        <div class="icons">
            <i class="el-icon-minus" @click="minimize"></i>
            <i :class="isfullscreen? 'iconfont leansite-suoxiao' : 'iconfont leansite-fangda' " style="font-size: 16px" @click="IsFullscreen"></i>
            <i class="el-icon-close" @click="closeDialog"></i>
        </div>
    </div>
    <div v-show="!isminimize" class="dialogBody">
        <currComponent :is="currTag"  :username="username" :leansiteToken="leansiteToken"></currComponent>
    </div>
</el-dialog>
</template>

<script>
import Vue from 'vue';
import bus from '../common/bus';
import UserCenterHome from '../views/userCenter/UserCenterHome.vue';
import DeviceCenterHome from '../views/deviceCenter/DeviceCenterHome.vue';
import InternetPlatform from '../views/internetPlatform/internetPlatform.vue';
import MonitorIndex from '../views/MonitorCenter/MonitorIndex.vue';
export default {
    name: 'DialogComponent', //弹框打开组件
    props: {
        width: { //显示宽度
            type: String,
            default: '70%'
        },
        appObj: { //选中的第三方应用对象
            type: Object,
            required: true
        }
    },
    components:{
    	UserCenterHome,
    	InternetPlatform,
    	DeviceCenterHome,
    	MonitorIndex
    },
    data() {
        return {
        	timeStamp:new Date().getTime(),
            isfullscreen: true, // 全屏
            isminimize: false, // 最小化
            moduleDialogVisible: false, // 隐藏弹窗
            username: this.$store.state.user.username,
            leansiteToken: this.$store.state.token,
            currTag:''
        }
    },
    created() {
        this.openDialog();
    },
    watch: {
        moduleDialogVisible(val) {
            if (val) {
                const el = this.$refs.systemModuleDialog.$el.querySelector('.el-dialog')
                el.style.left = 0
                el.style.top = 0
            }
        }
    },
    methods: {
        /**
         * 最小化
         */
        minimize() {
            this.moduleDialogVisible = false;
            this.isminimize = !this.isminimize
            if (this.isfullscreen) this.isfullscreen = !this.isfullscreen
        },
        /**
         * 关闭弹窗
         */
        closeDialog() {
            this.$emit('callBackFun', this.appObj);
            this.moduleDialogVisible = false;
            if (this.appObj.appName === '物联网') {
                bus.$emit("loginout", true);
            }
        },
        /**
         * 全屏
         */
        IsFullscreen() {
            this.isfullscreen = !this.isfullscreen
			const elDialogBody = this.$refs.systemModuleDialog.$el.querySelector('.dialogBody');
			if(this.isfullscreen){
				elDialogBody.style.height = "95%";
			}else{
				elDialogBody.style.height = "75%";
			}
            if (this.isfullscreen) this.$emit('isfullscreen')
            if (this.appObj.appName === '物联网') {
                bus.$emit("resize", true);
            }
        },
        /**
         * 加载组件,打开弹窗
         */
        openDialog() {
        	this.timeStamp=new Date().getTime();
        	this.currTag = this.appObj.appUrl;
            this.moduleDialogVisible = true;
        }
    },
    mounted() {

    },
    destroyed() {

    }
}
</script>
<style lang="scss" type="text/css" scoped>
	.el-dialog {
		/*margin-top: 10vh!important;*/
		/*height: 60vh;*/
	}

	.no_select {
		-webkit-touch-callout: none;
		/* iOS Safari */
		-webkit-user-select: none;
		/* Chrome/Safari/Opera */
		-khtml-user-select: none;
		/* Konqueror */
		-moz-user-select: none;
		/* Firefox */
		-ms-user-select: none;
		/* Internet Explorer/Edge */
		user-select: none;
		/* Non-prefixed version, currently */
	}
	.isminimize {
		left: 80px;
    	bottom: -355px;
		top: auto;
		right: auto;
		overflow: hidden;
		.el-dialog {
			margin: 0 !important;
			width: 240px !important;
			height: 40px;
			top: 0 !important;
			left: 0 !important;
		}
		.el-dialog__header {
			cursor: auto!important;
			.el-dialog__headerbtn {
				display: none;
			}
		}
		.dialogFooter {
			position: absolute;
			bottom: 0;
		}
	}

.systemModuleDialog {
    min-height: 600px;
    /*max-height: calc(100% - 15vh);*/
    .is-fullscreen {
        width: 100% !important;
        left: 0 !important;
        top: 0 !important;
        margin-top: 0 !important;
        overflow: hidden;
        position: relative;
        .el-dialog__header {
            cursor: auto!important;
        }
        .el-dialog__body {
            height: 100%;
            .dialogBody {
                /*height: 100%!important;*/
                max-height: none!important;
                padding-bottom: 50px!important;
            }
        }
        .dialogFooter {
            position: absolute;
            bottom: 0;
            width: 100%;
            background: #fff;
        }
    }
    .el-dialog {
        .el-dialog__header {
            width: 100%;
            height: 48px;
            line-height: 48px;
            padding: 0 20px !important;
            color: #303030;
            border-bottom: solid 1px #d9e3f3 !important;
            display: flex;
            @extend .no_select;
            cursor: auto;
            background: #323232!important;
            .medium {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content:space-between;
                align-items: center;
                background:#323232;
                .centers {
                	img{
                		height: 25px;
                		margin-left: 25px;
                	}
                    span {
                        text-align: left;
                        font-size: 16px;
                        color: #fff;
                        vertical-align: middle;
                        margin-left: 20px
                    }
                }
                .icons {
                    height: 21px;
                    display: flex;
                    justify-content: flex-end;
                    i {
                        color: #fff;
                        font-size: 18px;
                        display: block;
                        padding: 0 7px;
                    }
                    i:hover {
                        background: #dcdfe6;
                        cursor: pointer;
                    }
                    .el-icon-close:hover {
                        background: #f00;
                        color: #fff;
                    }
                }
            }
            .horn {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: space-between;
                div {
                    i {
                        color: #5f6368;
                        font-size: 20px!important;
                    }
                }
                .lefts {
                    flex: 4;
                    margin-top: 3px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    span {
                        font-size: 16px;
                        color: #606266;
                    }
                }
                .centers {
                    flex: 1;
                }
                .rights {
                    flex: 1;
                }
                i:hover {
                    cursor: pointer;
                    color: #000;
                }
            }
            .el-dialog__headerbtn {
                top: 0;
                font-size: 24px;
            }
        }
        .el-dialog__body {
            padding: 1px !important;
            .dialogBody {
            	height: 100%;
                overflow: auto;
                background: #f7f9fc;
                &::-webkit-scrollbar {
                    width: 4px;
                    height: 8px;
                }
                &::-webkit-scrollbar-thumb {
                    background: transparent;
                    border-radius: 4px;
                }
                &:hover::-webkit-scrollbar-thumb {
                    background: hsla(0, 0%, 53%, .4)
                }
                &:hover::-webkit-scrollbar-track {
                    background: hsla(0, 0%, 53%, .1)
                }
            }
            .dialogFooter {
                padding: 10px 15px;
                border-top: 1px solid #ccc;
                text-align: right;
                .el-button {
                    padding: 7px 15px;
                }
            }
        }
    }
    .systemModuleDialog {
        .el-select {
            width: 100%;
        }
        .el-date-editor {
            width: 100%;
        }
    }
    /deep/ .el-dialog--center {
    	height: 100%;
    	overflow: hidden !important;
        .el-dialog__header {
            height: 48px;
            padding: 0 20px !important;
            color: #303030;
            border-bottom: solid 1px #d9e3f3 !important;
        }
        .el-dialog__body {
            padding: 0;
            height: calc(100% - 50px);
        }
    }
}
/deep/ .el-dialog__header{
	background: #323232;
}
</style>

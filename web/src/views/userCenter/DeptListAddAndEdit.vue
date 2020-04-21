<template>
<div class="DeptListAddAndEdit">
    <div class="container">
        <el-table stripe :data="tableData" class="table" ref="multipleTable" @selection-change="handleSelectionChange" :cell-style="cellStyle" :header-cell-style="{background:'#f2f4f6',color:'#101010'}">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="nickname"  label="员工姓名" align="center" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="username"  label="用户" align="center" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="mobile" label="电话" align="center" min-width="120"></el-table-column>
            <!-- <el-table-column prop="email" label="邮箱" align="center" min-width="200" show-overflow-tooltip></el-table-column> -->
            <!-- <el-table-column prop="lastLoginTime" label="最后登录时间" align="center" min-width="180" show-overflow-tooltip></el-table-column> -->
        </el-table>
        <Pagination :pageIndex="pageObj.pageIndex" :total="pageObj.total" :pageSize="pageObj.pageSize" @PageTurning="PageTurning"></Pagination>
    </div>
    <div slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="cancelOpt">取 消</el-button>
        <el-button v-if="pageType == 'add'" type="primary" @click="addUser('userForm')">保存</el-button>
        <el-button v-else-if="pageType == 'edit'" type="primary" @click="editUser('userForm')">保存</el-button>
    </div>
</div>
</template>

<script>
import Pagination from '../../components/Pagination.vue';
export default {
    name: 'DeptListAddAndEdit',
    props: {
        userObj: { //userObj用户信息
            type: Object,
            required: true
        },
        deptId: { //部门id
            type: String,
            required: true
        }
    },
    components: {
        Pagination, //分页组件
    },
    data() {
        return {
            self: this,
            pageType: 'add', //页面类型 pageType=add 新增/pageType=edit 修改
            tableData: [],
            multipleSelection: [], //选中项
            pageObj: {
                pageIndex: this.API.leansite.constObj.pageIndex, //当前页码
                total: 0, //数据总数
                pageSize: this.API.leansite.constObj.pageSize, //页大小
            },
            userDialogVisible: false, //是否显示用户信息弹框
            searchText: '', //搜索字段
            dialogTitle: '添加用户'
        }
    },

    created() {
        this.getData();
    },
    methods: {
        /**
         * 添加用户
         * @param formName {Object} form表单名称
         */
        addUser(formName) {
            if(this.multipleSelection.length == 0 ){
        	    this.$message({
                    type: 'warning',
                    message: '您还没有选择用户!'
                });
            	return;
            }
            let userId = '';
            this.multipleSelection.forEach((v, i) => {
                userId += v.userId + ',';
            })
            let self = this;
            self.$axios.leansite({
                method: 'post',
                url: self.API.leansite.addDeptUsers,
                data: {
                    userId: userId.slice(0, userId.length - 1),
                    deptId: this.deptId
                }
            }).then((res) => {
                var resData = res.data;
                if (resData.code == 0) {
                    self.$message({
                        type: 'success',
                        message: '添加部门成功!'
                    });
                    //调用父组件方法--isRefresh=true需要刷新父组件的数据
                    self.$emit("UserCallBack", true);
                }else if(resData.code == 1000) { {
                    self.$message({
                        type: 'error',
                        message: '添加部门失败：'+resData.msg
                    });
                }
            });
        },
        /**
         * 修改用户组信息
         * @param formName {Object} form表单名称
         */
        editUser(formName) {
            let self = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    self.$axios.leansite({
                        method: 'post',
                        url: self.API.leansite.updateUser,
                        data: self.userForm
                    }).then((res) => {
                        var resData = res.data;
                        if (resData.code == 0) {
                            self.$message({
                                type: 'success',
                                message: '修改部门信息成功!'
                            });
                            self.resetForm(); //重置表单
                            //调用父组件方法--isRefresh=true需要刷新父组件的数据
                            self.$emit("UserCallBack", true);
                        } else if(resData.code == 1000) { {
		                    self.$message({
		                        type: 'error',
		                        message: '修改部门失败：'+resData.msg
		                    });
		                }
                    });
                } else {
                    return false;
                }
            });
        },
        /*
         * 取消
         */
        cancelOpt() {
            //调用父组件方法--isRefresh=false不需要刷新父组件的数据
            this.$emit("UserCallBack", false);
        },
        /*
         * 分页组件回调方法--子组件回传数据的方法
         * @page_obj {Object} 分页信息
         * page_obj.page_index 当前页下标
         * page_obj.page_size 页大小
         */
        PageTurning(page_obj) {
            this.pageObj.pageIndex = page_obj.page_index;
            this.pageObj.pageSize = page_obj.page_size;
            this.getData();
        },
        /**
         * 获取列表数据
         */
        getData() {
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.notGroupUser,
                params: {
                    'param': this.searchText.trim(),
                    'pageNum': this.pageObj.pageIndex,
                    'pageSize': this.pageObj.pageSize
                }
            }).then((res) => {
                var resData = res.data;
                if (resData.status == 200) {
                    this.tableData = resData.data.records;
                    this.pageObj.total = resData.data.total;
                } else {
                    this.$message({
                        type: 'error',
                        message: '查询失败，请刷新重试！'
                    });
                }
            }).catch((err) => {
                this.$message({
                    type: 'error',
                    message: '请求异常，请检查网络！'
                });
            })
        },
        /**
         * 多选
         */
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        /**
         * 改变隔行变色 颜色
         */

        cellStyle({
            row,
            column,
            rowIndex,
            columnIndex
        }) {
            let style = {
                'text-align': 'center',
                'font-size': '14px',
                // 'height': '70px',
                'background-color': '#ffffff',
                'color': '#303030',

            }
            if (rowIndex % 2 != 0) {
                style['background-color'] = '#f2f4f6';
            }
            return style;
        },
    }


}
</script>

<style lang="scss" scoped type="text/css">
.DeptListAddAndEdit {
    height: 100%;
    border-radius: 16px;
    overflow: hidden;
    .el-header {
        height: 60px;
        line-height: 60px;
        background-color: #ffffff;
        border-bottom: 1px solid #d9e3f3;
        padding: 0 40px;
        .leftHeader {
            span {
                font-size: 16px;
                color: #424956;
            }
        }
        .el-col.rightHeader {
            text-align: right !important;
            .addUser {
                margin-right: 23px;
                font-size: 16px;
                color: #2c5ac2;
            }
            .batchDel {
                font-size: 16px;
                color: #ed5151;
            }
            .el-input {
                margin-left: 23px;
                width: 200px;
                outline: none;
                color: #6ecd8b;
                .el-icon-search {
                    color: #6ecd8b;
                    outline: none;
                }
            }
            .search {
                position: relative;
                left: -30px;
                top: -2px;
            }
        }
    }
    .container {
        background-color: #FFFFFF;
        height: 100%;
        padding: 0px 0 0;
        .el-table {
            color: #303030;
            font-size: 14px;
            .warning-row {
                background: #f2f4f6;
            }
            .edit {
                border: solid 1px #68c161;
                color: #6ecd8b;
                font-size: 14px;
                padding: 9px 7px;
                width: 80px;
                height: 30px;
                padding-top: 8px;
                .edit-img {
                    margin-right: 6px;
                }
            }
            .delete {
                border-radius: 4px;
                border: solid 1px #ec5555;
                color: #ed5151;
                font-size: 14px;
                padding: 9px 7px;
                width: 80px;
                height: 30px;
                padding-top: 8px;
            }
        }
    }
    .el-main {
        padding: 30px;
    }
    .dialog-footer {
        margin-top: 15px;
        text-align: center;
        .el-button {
            width: 130px;
        }
        .el-button:first-child {
            margin-right: 70px;
            color: #FFFFFF;
            background-color: #c4d4e7;
        }
    }
}

/deep/ .el-dialog {
    background-color: #ffffff;
    box-shadow: 0px 1px 20px 0px rgba(0, 0, 0, 0.2);
    border-radius: 16px;
    .el-dialog__header {
        padding: 12px 40px;
        border-bottom: 1px solid #d9e3f3;
    }
}
</style>

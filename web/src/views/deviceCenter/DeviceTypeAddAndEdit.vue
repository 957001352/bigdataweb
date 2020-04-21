<template>
    <div class="deviceTypeAddAndEdit">
        <div class="top">
            <div>
                <span class="backMain" @click="cancelOpt">类型管理</span>
                <span class="el-icon-arrow-right">
                    <span></span>{{pageType}}类型
                </span>
            </div>
            <div>{{pageType}}类型</div>
        </div>
        <div class="userMessageRight_bottom">
            <div class="user_message tab">
                <div class="tab_header"><span class="el-icon-minus" style="font-size: 14px; font-weight: 800;"></span>
                    属性信息
                </div>
                <div class="tab_body">
                    <div class="formText">
                        <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="10px"
                                 class="submitForm">
                            <el-form-item label="上级类型" prop="preType">
                                <el-select v-model="dmClassifyTypeName" placeholder="请选择上级类型" value-key="id"
                                           @change="typeManagementChange">
                                    <el-option v-for="item in typeManagement" :key="item.id" :label="item.name"
                                               :value="item"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="类型ID" prop="classifyId">
                                <el-input v-model="ruleForm.classifyId" placeholder="请输入文本描述，至少一个字符"
                                          style="width:260px;"></el-input>
                            </el-form-item>
                            <el-form-item label="名称" prop="classifyName">
                                <el-input v-model="ruleForm.classifyName" placeholder="请输入文本描述，至少一个字符"
                                          style="width:260px;"></el-input>
                            </el-form-item>
                            <el-form-item label="描述" prop="describe">
                                <el-input type="textarea" v-model="ruleForm.describe" placeholder="请输入描述,不得多于50字"
                                          maxlength="50"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="pictureUpload" style="float: right">
                        <!--                        :on-change="onUploadChange"-->
                        <label>
                            <el-upload
                                class="avatar-uploader"
                                :action='baseUrl+"/attachment/upload"'
                                :show-file-list="false"
                                @change="uploadChange"
                                :on-success="handleAvatarSuccess"
                                ref="imgMes"
                                :before-upload="beforeAvatarUpload">
                                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            </el-upload>
                            <span class="el-icon-plus"
                                  style="display: inline-block;color: white;margin: 0 15px 0 45px; width: 100px;height: 37px;border-radius: 5px;background-color: #409EFF;text-align: center;line-height: 35px">选择图片</span>
                        </label>
                        <el-button type="primary" @click="uploadImage" style="border:solid 1px #409EFF;">确定上传
                        </el-button>
                        <el-button @click="deleteImage" style="color: #409EFF;border:solid 1px #409EFF; ">删除图片
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="userMessageRight_bottom">
            <div class="user_message tab">
                <div class="tab_header">添加参数</div>
                <div class="tab_body tab_body_addParams">
                    <div class="formText paramsFormText">
                        <el-form label-position="top" :model="ruleForm"  label-width="10px"
                                 class="submitForm">
                            <el-form-item label="参数">
                                <el-select v-model="region" placeholder="请选择参数" @change="selectChange" value-key="id">
                                    <el-option v-for="(item,index) in parameter" :key="item.id" :label="item.name"
                                               :value="item"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="变量">
                                <el-select v-model="variable" multiple placeholder="请选择变量 (可多选)" value-key="id"
                                           @change="arrChange">
                                    <el-option v-for="(item,index) in variableArr" :key="item.id" :label="item.attr"
                                               ref="var" :value="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <el-button @click="addParams">添加参数</el-button>
                        <el-table stripe :data="paramsTableData" class="table" with="100%" ref="multipleTable" min-height="300px" empty-text="暂无数据">
                            <el-table-column prop="name" label="参数" align="center" ></el-table-column>
                            <el-table-column prop="attr" label="变量" align="center" ></el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom">
            <p>*&nbsp;必填字段</p>
            <el-row>
                <el-button type="primary" @click="saveTypeInfo('ruleForm')">提交</el-button>
                <el-button @click="cancelOpt">取消</el-button>
            </el-row>
        </div>
    </div>
</template>

<script>
    import baseValidator from "../../common/baseValidator.js"

    export default {
        name: "DeviceTypeAddAndEdit",//设备类型添加或编辑
        props: {
            typeObj: {//typeObj用户信息
                type: Object,
                required: true
            }
        },
        data() {
            let baseImageUrl = this.API.leansite.baseURL;
            let substrUrl = baseImageUrl.substr(0, baseImageUrl.length - 1)
            return {
                pageType: 'add',//页面类型 pageType=add 新增/pageType=edit 修改
                region: "",
                ruleForm: {
                    classifyId: '',
                    classifyName: '',
                    describe: '',
                    dmClassifyType: {//上级类型管理选中数据

                    },
                    classifyDetails: [],//参数以及变量的ID
                },
                rules: {
                    preType: [
                        {required: true, message: '请选择上级类型', trigger: 'change'}
                    ],
                    classifyId: [
                        {required: true, message: '请输入类型ID', trigger: 'blur'}
                    ],
                    classifyName: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    describe: [
                        {required: true, message: '请输入描述', trigger: 'blur'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
                    ],
                    // params: [
                    //     {required: true, message: '请选择参数', trigger: 'blur'}
                    // ],
                    // variable: [
                    //     {required: true, message: '请选择变量', trigger: 'blur'}
                    // ],
                },
                baseUrl: substrUrl,//图片路径
                imageUrl: '',
                dmClassifyTypeName: '',//上级绑定的name
                classifyDetailsIdArr: {},//接受每次被点击的参数以及变量的ID
                variable: '',//变量绑定的值
                variableArr: [],//变量集合，是根据参数变化的
                paramsTableData: [],//添加参数显示的值(table表格的值)
                acceptParamsTableData: {},//接受每次点击选择的参数和变量的值，在添加之后显示在table中
                parameter: {},//设备所有参数
                variable: {},//设备所有参数所对应的变量
                file: {},//选择的文件
                typeManagement: [
                    {
                        "id": 1,
                        "name": "string",
                        "status": 0
                    },
                    {
                        "id": 2,
                        "name": "test2",
                        "status": 0
                    },
                ],//上级类型管理
                paramsId: '',//监听选择到的id
                upLoadImageFlag:'false',
            }
        },
        mounted() {
            if (this.typeObj.id) {
                this.pageType = '编辑';
                this.setFormData();//表单赋值
            } else {
                this.pageType = '添加';
            }
            this.getDeviceAttrListRequest();
            this.getClassifyTypeRequest();
        },
        methods: {
            uploadChange(val) {
//              console.log(val)
            },
            /**
             * 点击添加参数
             */
            addParams() {
                this.ruleForm.classifyDetails;
                this.paramsTableData.push(this.acceptParamsTableData);
            },

            /**
             * 点击确定上传（图片）
             */
            uploadImage() {
                let formData = new FormData()
                formData.append('file', this.file)

                if (this.ruleForm.id) {
                    formData.append('dataId', this.ruleForm.id)
                    formData.append('isAdd', false)
                } else {
                    formData.append('isAdd', true)
                }
                this.upLoadImageRequest(formData);
            },
            /**
             * 删除图片
             */
            deleteImage() {
                this.imageUrl = ''
            },
            /**
             * 表单赋值
             */
            setFormData() {
                this.ruleForm.id = this.typeObj.id;
                this.ruleForm.classifyName = this.typeObj.classifyName;
                this.ruleForm.describe = this.typeObj.describe;
                this.ruleForm.classifyId = this.typeObj.classifyId;
                this.ruleForm.factoryId = this.typeObj.factoryId;
                this.ruleForm.classifyDetails = this.typeObj.classifyDetails;
                this.ruleForm.attrSet = this.typeObj.attrSet;
                this.ruleForm.nameCount = this.typeObj.nameCount;
                this.ruleForm.dmClassifyType = this.typeObj.dmClassifyType;
                if (this.typeObj.dmClassifyType.name) {
                    this.dmClassifyTypeName = this.typeObj.dmClassifyType.name;//回显是给上级分类赋值
                }
                this.paramsTableData = this.typeObj.attrSet;
                console.log(this.typeObj)
                this.imageUrl = this.baseUrl + this.typeObj.imagePath;
                console.log(this.imageUrl)
            },
            /**
             * 保存类型信息
             * @param formName {Object} form表单名称
             */
            saveTypeInfo(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid){
                    	if(this.upLoadImageFlag==true){
                    		this.saveTypeRequest();
                    	}else{
                    		this.$message({
                            type: 'error',
                            message: "请确认上传图片！"
                        });
                    	}
                        
                    } else {
                        return false;
                    }
                })

            },
            /*
             * 重置表单
             */
            resetForm() {
                this.pageType = 'add';
                this.$refs['ruleForm'].resetFields();
            },
            /**
             * 保存类型请求
             */
            saveTypeRequest() {
                let self = this;
                this.$axios.leansite({
                    method: 'post',
                    url: this.API.leansite.saveAddDeviceType,
                    data: this.ruleForm
                }).then((res) => {
                    var resData = res.data;
                    if (resData.code == 0) {
                        self.$message({
                            type: 'success',
                            message: this.pageType + '类型成功!'
                        });
                        // self.resetForm();//重置表单
                        //调用父组件方法--isRefresh=true需要刷新父组件的数据
                        self.$emit("TypeEditCallBack", true);
                    } else if (resData.code == 1000) {
                        this.$message({
                            type: 'error',
                            message: this.pageType + '类型失败：' + resData.msg
                        });
                    } else {
                        self.$message({
                            type: 'error',
                            message: this.pageType + '类型失败，请退出重试！'
                        });
                    }
                }).catch((err) => {
                    console.log(err)
                    this.$message({
                        type: 'error',
                        message: '请求异常，请检查网络！'
                    });
                });
            },
            /**
             * 取消
             */
            cancelOpt() {
                // //调用父组件方法--isRefresh=false不需要刷新父组件的数据
                this.$emit("TypeEditCallBack", false);
            },
            /**
             * 上传图片
             */
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
                console.log(URL.createObjectURL(file.raw))
            },
            beforeAvatarUpload(file) {
                // console.log(file)
                this.file = file;
                //     const isIMAGE = (file.raw.type === 'image/jpeg' || file.raw.type === 'image/png'|| file.raw.type === 'image/gif');
                const isJPG = file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 PNG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            /**
             * 获取设备属性  (参数,变量)
             */
            getDeviceAttrListRequest() {
                this.$axios.leansite({
                    method: 'get',
                    url: this.API.leansite.getDeviceAttrList,
                    params: {}
                }).then((res) => {
                    var resData = res.data;
                    if (resData.code == 0) {
                        this.parameter = resData.data;
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
             * 监听参数选择
             */
            selectChange(val) {
                this.variableArr = val.attrDetails;
                this.variable = '';
                this.classifyDetailsIdArr.attrSetId = val.id;
                this.acceptParamsTableData.name = val.name;
            },
            /**
             * 监听变量选择
             */
            arrChange(val) {
                var arrId = [];
                var arrName = [];
                var acceptId = [];
                val.forEach((item, index) => {
                    let oChioce = {
                        attrDetailId: item.id,
                        attrSetId: item.attrSetId
                    };
                    acceptId.push(oChioce)
                    arrName.push(item.attr)
                })
                this.classifyDetailsIdArr = acceptId;
                this.ruleForm.classifyDetails = acceptId;

                console.log(this.ruleForm)
                this.acceptParamsTableData.attr = arrName.toString();
            },
            /**
             * 上传图片接口
             */
            upLoadImageRequest(fileObj) {
                this.$axios.leansite({
                    method: 'POST',
                    url: this.API.leansite.upLoadImg,
                    data: fileObj,
                    heards: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((res) => {
                    var resData = res.data;
                    if (resData.code == 0) {
                        this.ruleForm.id = resData.data.dataId;
                        this.upLoadImageFlag = true;
                        this.$message({
                            type: 'success',
                            message: '上传成功！'
                        });
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
             * 获取上级类型管理列表
             */
            getClassifyTypeRequest() {
                this.$axios.leansite({
                    method: 'get',
                    url: this.API.leansite.getClassifyType,
                }).then((res) => {
                    var resData = res.data;
                    if (resData.code == 0) {
                        this.typeManagement = resData.data;
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
             * 监听上级类型管理
             */
            typeManagementChange(val) {
                // console.log()
                this.ruleForm.dmClassifyType = val;//将选中的值赋给表单（对象格式 包括ID name status）
            }
        }
    }
</script>

<style lang="scss" scoped type="text/css">
    .deviceTypeAddAndEdit {
        width: 95%;
        margin: 0 40px;

    .top {

    div {
        font-size: 14px;
        margin-top: 24px;

    .backMain {
        cursor: pointer;
    }

    span {
        color: #006fe6;
        margin-right: 10px;
    }

    .el-icon-arrow-right {
        color: #969696;
    }

    &:last-child {
        height: 36px;
        font-family: MicrosoftYaHei-Bold;
        font-size: 36px;
        line-height: 36px;
        color: #323232;
        margin: 25px 0;
    }

    }
    }
    .userMessageRight_bottom {
        margin-top: 20px !important;

    .tab {
        width: 100%;
        border: solid 1px #bebebe;
        border-radius: 3px;
        font-size: 14px;
        color: #323232;
        margin-bottom: 23px;
        padding-bottom: 20px;

    .tab_header {
        height: 48px;
        line-height: 48px;
        /*background-color: #f0f0f0;*/
        /*border-bottom: solid 1px #bebebe;*/
        padding-left: 16px;
    }

    .tab_body {
        width: 100%;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
    .formText {
        width: 50%;
        margin: 0 auto;
        padding: 0 16px;
        float: left;

    /deep/ .el-form {
        width: 90%;
    }

    }
    }
    .tab_body_addParams {
        width: 90%;
        display: block;

    .formText {
        width: 100%;
        margin: 0 auto;
        padding: 0 16px;
        float: left;

    /deep/ .el-form {
        width: 90%;
    }

    }
    }
    .paramsFormText {
        min-width: 56%;
    }

    .pictureUpload {
        /*width: 40%;*/
        width: 424px;
        height: 280px;
        background-color: #f0f0f0;
        float: right;
        margin: 24px 24px 0 0;

    /deep/ .avatar-uploader .el-upload {
        width: 424px;
        height: 280px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        line-height: 280px;
        overflow: hidden;
        margin-bottom: 10px;

    img {
        display: inline-block;
        width: 389px;
        height: 150px;
    }

    }
    /deep/ .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    /deep/ .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    /deep/ .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

    }
    }
    }
    .tableTitle {
        height: 48px;
        line-height: 48px;
        margin: 24px 0 0;
        padding: 0 16px;
        background-color: #f0f0f0;
        border: solid 1px #bebebe;
    }

    .container {
        border: solid 1px #bebebe;
        border-top: none;
        padding: 16px;

    .tipsMsg {
        display: flex;
        align-items: center;
        height: 64px;
        background-color: #ffedb5;
        border-radius: 3px;
        border: solid 1px #e6dbb7;

    i {
        padding: 0 15px;
        font-size: 20px;
    }

    ul li {
        list-style: none;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 24px;
        letter-spacing: 0px;
        color: #665e48;
    }

    }
    .el-button {
        margin: 15px 0 5px;
    }

    }
    .bottom {
        padding: 23px 0;

    p {
        color: #d0021b;
    }

    div {
        margin-top: 20px;

    .el-button {

    &:first-child {
        width: 90px;
        height: 32px;
        background-color: #006fe6;
        border-radius: 4px;
    }

    &:last-child {
        width: 90px;
        height: 32px;
        border-radius: 4px;
        border: solid 1px #006fe6;
        color: #006fe6;
    }

    }
    }
    }
    }

</style>

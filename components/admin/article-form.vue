<template>
    <el-form ref="form" :model="contents" label-width="80px" style="width:100%;margin-top:20px;"
    :rules='rules'
    v-if='Object.keys(this.contents).length'>
        <el-form-item label="文章标题" prop='title'>
            <el-input v-model="contents.title"></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="lable">
            <el-select v-model="contents.lable" placeholder="请选择文章标签">
                <el-option :label="item.lable" :value="item._id" v-for='(item,index) in lablesList' :key='index'></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="图片" prop="imgUrl">
           <el-upload
                v-loading.fullscreen.lock="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                ref='upload'
                :action="domain"
                :http-request="upqiniu"
                :before-upload="beforeUpload"
                :on-remove="removeFile"
                :limit='1'
                list-type='picture'
            >
                <img v-if="contents.imgUrl" :src="contents.imgUrl" width="150" height="150">
                <i v-if="!contents.imgUrl" class="el-icon-plus"></i>
            </el-upload>
        </el-form-item>
        <el-form-item label="文章简介" prop="description">
            <el-input type="textarea" v-model="contents.description" :autosize="{ minRows: 2, maxRows: 3}"></el-input>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
            <mavon-editor v-model="contents.content" fontSize='14px' :toolbars='toolbars' />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitArticle('form')">提交</el-button>
            <el-button @click="clearForm('form')">还原或清空</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    props: {
        contents: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            domain: 'https://upload-z2.qiniup.com', // 华南地区上传地址
            qiniuaddr: 'http://image.xuanspace.cn', // 外链默认域名 现在测试一个月
            toolbars: {
                bold: true, // 粗体
                italic: true, // 斜体
                header: true, // 标题
                underline: true, // 下划线
                mark: true, // 标记
                strikethrough: true, // 中划线
                quote: true,
                ol: true, // 有序列表
                ul: true, // 无序列表
                link: true, // 链接
                code: true,
                table: true,
                undo: true, // 上一步
                redo: true, // 下一步
                alignleft: true, // 左对齐
                aligncenter: true, // 居中
                alignright: true, // 右对齐
                fullscreen: true
            },
            rules: {
                title: [
                    { required: true, message: '标题不能为空' }
                ],
                content: [
                    { required: true, message: '内容不能为空' }
                ],
                lable: [
                    { required: true, message: '标签不能为空' }
                ],
                description: [
                    { required: true, message: '简介不能为空' }
                ]
            },
            lablesList: [],
            loading: false,
            isReEdit: false
        }
    },
    created() {
        this.getLablesList()
    },
    methods: {
        async getLablesList() {
            const { data: { list } } = await this.$axios.get('/lables/list')
            this.lablesList = list
        },
        async upqiniu(req) { // 上传文件到七牛云
            this.loading = true
            let filetype = '' // 区分文件类型
            if (req.file.type === 'image/png') {
                filetype = 'png'
            } else if (req.file.type === 'image/svg+xml'){
                filetype = 'svg'
            } else {
                filetype = 'jpg'
            }
            const keyname = 'z_img' + Date.now() + Math.floor(Math.random() * 100) + '.' + filetype // 重命名要上传的文件
            const { data: { token } } = await this.$axios.get('/qiniu/token')
            const formdata = new FormData()
            formdata.append('file', req.file)
            formdata.append('token', token)
            formdata.append('key', keyname)
            const { data: { key } } = await this.$axios.post(this.domain, formdata)
            this.contents.imgUrl = this.qiniuaddr + '/' + key
            this.loading = false
            this.isReEdit = true
        },
        async beforeUpload(file) {
            if (this.contents.imgUrl) {
                try {
                    await this.$confirm('此操作将删除服务器原有的图片，是否继续？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    await this.reloadFile(this.contents.imgUrl)
                } catch(err) {
                    console.log(err)
                }
            }
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/svg+xml'
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!')
            }
            return isJPG && isLt2M
        },
        removeFile() {
            this.reloadFile(this.contents.imgUrl)
        },
        clearForm(form) {
            if (this.contents.imgUrl && this.isReEdit) {
                this.$refs['upload'].clearFiles() // 清空上传列表
                this.reloadFile(this.contents.imgUrl) // 删除已经上传的文件
            }
            this.$refs[form].resetFields()
        },
        async reloadFile(imgUrl) { // 删除已经上传的文件
            const key = imgUrl.substring(imgUrl.lastIndexOf('/') + 1)
            const { data: { info } } = await this.$axios.post('/qiniu/delete', { key })
            if (info.statusCode === 200) {
                await this.$notify.warning('图标已经移除')
                if (this.contents.imgUrl) {
                    this.contents.imgUrl = ''
                }
            }
        },
        async submitArticle(form) {
            if (this.contents.lable) {
                this.contents.lable = this.getLableId(this.contents.lable)
                this.$emit('submitArticle', this.$refs[form], this.getLablename(this.contents.lable))
            }
        },
        getLableId(labelname) {
            return this.lablesList.find(item => item._id === labelname || item.lable === labelname)._id
        },
        getLablename(labelId) {
            return this.lablesList.find(item => item._id === labelId || item.lable === labelId).lable
        }
    }
}
</script>

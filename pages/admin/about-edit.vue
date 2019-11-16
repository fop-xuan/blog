<template>
    <div>
        <el-form :model="contents" :rules="rules" ref="ruleForm" label-width="100px" style="margin-top:50px;">
            <el-form-item label="内容" prop="content">
                <mavon-editor v-model="contents.content" fontSize='14px' :toolbars='toolbars' />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交修改</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            contents: {
                content: ''
            },
            rules: {
                content: [
                    { required: true, message: '请输入内容' }
                ]
            },
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
            }
        }
    },
    created() {
        this.getContent()
    },
    methods: {
        async getContent() {
            const { data: { contents: { content } } } = await this.$axios.get('/about/data')
            if (content) {
                this.contents.content = content
            }
        },
        async submitForm(form) {
            const valid = await this.$refs[form].validate()
            if (valid) {
                const { data } = await this.$axios.post('/about/update', {
                    content: this.contents.content
                })
                if (data.code) {
                    this.$notify.success({
                        title: '提示',
                        message: '修改成功！'
                    })
                }
            }
        },
        resetForm(form) {
            this.$refs[form].resetFields()
        }
    }
}
</script>

<style>

</style>

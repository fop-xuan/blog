<template>
    <div class="article-add">
        <h2 class="title"><i class="el-icon-document"></i>新文章编辑</h2>
        <article-form
            :contents='contents'
            @submitArticle='submitArticle'
            ref="articleForm"
        ></article-form>
    </div>
</template>

<script>
import articleForm from '@/components/admin/article-form'
export default {
    data() {
        return {
            contents: {
                lable: '',
                title: '',
                description: '',
                content: '',
                imgUrl: ''
            }
        }
    },
    methods: {
        async submitArticle(form) {
            try {
                await form.validate()
                const { data } = await this.$axios.post('/articles/add', this.contents)
                this.$notify({
                    title: '提示',
                    message: data.msg,
                    type: data.type
                })
                form.resetFields() // 清空表单
                this.$refs['articleForm'].$refs['upload'].clearFiles() // 清空上传列表
                if (!data.code) {
                    this.$refs['articleForm'].reloadFile(this.contents.imgUrl) // 删除已经上传的文件
                }
            } catch(err) {
                console.log(err)
            }
            
        }
    },
    components: {
        articleForm
    }
}
</script>

<style lang='less' scoped>
    .article-add{
        .title{
            text-align: center;
        }
    }
</style>

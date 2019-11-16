<template>
    <div class="admin-list">
        <table-template
            @handleEdit='handleEdit'
            @handleDelete='handleDelete'
            @changePage='changePage'
            :tableData='tableData'
            :limit='limit'
            :totalCount='totalCount'
            :page='page'
        ></table-template>
        <el-dialog
            title="修改文章"
            :visible.sync="dialogTableVisible"
            center
            fullscreen
        >
            <article-form
                ref="articleForm"
                :contents='activeContent'
                @submitArticle='submitArticle'
            ></article-form>
        </el-dialog>
    </div>
</template>

<script>
import articleForm from '@/components/admin/article-form'
import tableTemplate from '@/components/admin/table-template'
export default {
       data() {
        return {
            tableData: {
                titleList: [
                    {
                        prop: 'title',
                        label: '文章标题'
                    },
                    {
                        prop: 'postTime',
                        label: '发表时间'
                    },
                    {
                        prop: 'readNum',
                        label: '阅读数量'
                    },
                    {
                        prop: 'lable',
                        label: '所属标签'
                    },
                    {
                        prop: 'imgUrl',
                        label: '图片链接'
                    }
                ],
                dateList: null
            },
            dialogTableVisible: false,
            activeContent: {},
            edit_index: 0,
            totalCount: this.$store.state.count.articles,
            limit: 6,
            page: 1
        }
    },
    created() {
        this.getArticleList()
    },
    methods: {
        async getArticleList() {
            const { data } = await this.$axios.get('/articles/list', { params: {
                limit: this.limit,
                page: this.page
            }})
            if (data.code) {
                data.list.forEach(item => {
                    item.lable = item.lable.lable
                })
                this.tableData.dateList = data.list
            } else {
                console.log(data)
            }
        },
        async handleEdit(index, row) {
            this.activeContent = row
            this.edit_index = index
            this.dialogTableVisible = true
        },
        async submitArticle(form, name) {
            try {
                await form.validate()
                const { data } = await this.$axios.post('/articles/edit', this.activeContent)
                this.$notify({
                    type: data.type,
                    message: data.msg,
                    title: '提示'
                })
                this.$refs['articleForm'].$refs['upload'].clearFiles() // 清空上传列表
                if (!data.code) {
                    this.$refs['articleForm'].reloadFile(this.activeContent.imgUrl) // 删除已经上传的文件
                }
                if (data.code) {
                    this.dialogTableVisible = false
                    this.renderEditedArticleList(name)
                }
            } catch(err) {
                console.log(err)
            }
        },
        renderEditedArticleList(name) {
            this.activeContent.lable = name
            this.tableData.dateList.splice(this.edit_index, 1, this.activeContent)
        },
        async handleDelete(index, row) {
            try {
                await this.$confirm('此操作将永久删除分类, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                const { data } = await this.$axios.post('/articles/delete', { _id: row._id })
                this.$notify({
                    title: '提示',
                    message: data.msg,
                    type: data.type
                })
                if (data.code) {
                    if (row.imgUrl) {
                        const key = row.imgUrl.substring(row.imgUrl.lastIndexOf('/') + 1)
                        const { data: { info } } = await this.$axios.post('/qiniu/delete', { key })
                        if (info.statusCode !== 200) {
                            this.$notify.warning('在服务器图标移除失败,请手动进入服务器删除')
                        }
                    }
                    this.renderDeletedArticleList(index)
                }
            } catch(err) {
                console.log(err)
            } 
        },
        renderDeletedArticleList(index) {
            this.tableData.dateList.splice(index, 1)
        },
        changePage(page) { // 请求翻页数据
            this.page = page
            this.getArticleList() // 重新获取列表数据
        }
    },
    components: {
        articleForm,
        tableTemplate
    }
}
</script>

<style>

</style>

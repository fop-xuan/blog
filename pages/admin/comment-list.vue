<template>
    <div class="comment-list">
        <div class="table-warp" v-for='(comments,index) in commentData' :key='index'>
            <p class="title">所属文章：{{comments.title}}</p>
            <el-table :data="comments.comments" stripe>
                <el-table-column prop="commentUser" label="发表评论的用户名"></el-table-column>
                <el-table-column prop="commentTime" label="评论时间"></el-table-column>
                <el-table-column prop="commentValue" label="评论内容"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type='info' size='mini' @click='lookreply(scope.$index, scope.row, comments._id, index)'>查看回复</el-button>
                        <el-button type='danger' size='mini' @click='deleteComment(scope.$index, scope.row, comments._id, index)'>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="所有回复" :visible.sync="dialogTableVisible">
            <el-table :data="replysState.replys">
                <el-table-column prop="replyUser" label="回复的用户"></el-table-column>
                <el-table-column prop="replyTime" label="回复时间"></el-table-column>
                <el-table-column prop="replyValue" label="回复内容"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type='danger' size='mini' @click='deleteReply(scope.$index, scope.row)'>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            commentData: [],
            dialogTableVisible: false,
            replysState: {}
        }
    },
    created() {
        this.getCommentData()
    },
    methods: {
        async getCommentData() {
            const { data } = await this.$axios.get('/articles/all-comments')
            if (data.code) {
                this.commentData = data.info.filter(item => { // 没评论的不要
                    if (item.comments.length) {
                        item.comments.forEach(item => {
                            item.commentTime = this.$moment(item.commentTime).format('lll')
                        })
                        return item.comments.length
                    }
                })
            }
        },
        async deleteComment(index, row, id, articleIndex) {
            try {
                await this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                const { data } = await this.$axios.post('/articles/delete-comment', {
                    commentId: row._id,
                    _id: id
                })
                if (data.code) {
                    this.renderDeleteCommentData(index, articleIndex)
                }
            } catch(err) {
                console.log(err)
            }
        },
        renderDeleteCommentData(index, articleIndex) {
            this.commentData[articleIndex].comments.splice(index, 1)
        },
        lookreply(index, row, id, articleIndex) {
            if (row.replys.length) {
                row.replys.forEach(item => {
                    item.replyTime = this.$moment(item.replyTime).format('lll')
                })
                this.replysState = {
                    replys: row.replys,
                    commentId: row._id,
                    articleId: id,
                    commentIndex: index,
                    articleIndex: articleIndex
                }
                this.dialogTableVisible = true
            } else {
                this.$notify({
                    title: '提示',
                    message: '这条评论中没有回复信息',
                    type: 'error'
                })
            }
        },
        async deleteReply(index, row) {
            try {
                await this.$confirm('此操作将永久删除该回复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                const { commentId, articleId } = this.replysState
                const { data } = await this.$axios.post('/articles/delete-reply', {
                    commentId,
                    _id: articleId,
                    replyId: row._id
                })
                if (data.code) {
                    this.renderDeleteReplys(index)
                }
            } catch(err) {
                console.log(err)
            }
        },
        renderDeleteReplys(index) {
            const { commentIndex, articleIndex } = this.replysState
            this.commentData[articleIndex].comments[commentIndex].replys.splice(index, 1)
        }
    }
}
</script>

<style lang='less'>
.table-warp{
    margin: 50px 0;
    .title{
        margin-bottom: 10px;
        font-size: 22px;
        font-weight: 700;
    }
}
</style>

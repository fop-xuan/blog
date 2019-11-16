<template>
    <div class="comment">
        <div class="input-warp">
            <el-tooltip class="item" effect="dark" :content="commentTips" :disabled="!isComment" placement="top-start">
                <el-input
                type="textarea"
                :rows="5"
                placeholder="请文明用语~"
                v-model="commentValue"
                resize='none'
                ref='textarea'
                :disabled='isComment'
                ></el-input>
            </el-tooltip>
            <el-button type='info' :disabled="isPost" @click='postComment'>发送要说的话~</el-button>
        </div>
        <div class="comment-list-warp">
            <p class="comment-count">当前共{{this.comments.length}}条评论</p>
            <el-divider>评论列表</el-divider>
            <ul class="comment-list">
                <li class="comment-item" v-for='(comment,commentIndex) in comments' :key='commentIndex'>
                    <div class="comment-info">
                        <div class="left">
                            <p class="user-info">
                                <img
                                :src="comment.commentUser === 'admin'?adminImg:userImg"
                                width='30' height='30'>
                            {{comment.commentUser}}：
                            </p>
                            <time class="comment-time">
                                <i class="el-icon-time"></i>
                                {{$moment(comment.commentTime).format('LLL')}}
                            </time>
                        </div>
                        <div class="right">
                            <el-link type="info"
                            style='font-size:12px'
                            @click='replyComment(comment.commentUser,comment._id)'>
                                回复
                            </el-link>
                        </div>
                    </div>
                    <p class="comment-content">{{comment.commentValue}}</p>
                    <ul class="comments-child" v-if='comment.replys.length'>
                        <li class="comment-item" v-for='(reply,index) in comment.replys' :key='index'>
                            <div class="comment-info">
                                <div class="left">
                                    <p class="user-info">
                                        <img
                                        :src="reply.replyUser === 'admin'?adminImg:userImg"
                                        width='30' height='30'>
                                        {{reply.replyUser}}：
                                    </p>
                                    <time class="comment-time">
                                        <i class="el-icon-time"></i>
                                        {{$moment(reply.replyTime).format('LLL')}}
                                    </time>
                                </div>
                                <div class="right">
                                    <el-link type="info"
                                    style='font-size:12px'
                                    @click='replyComment(reply.replyUser,comment._id)'>
                                        回复
                                    </el-link>
                                </div>
                            </div>
                            <p class="comment-content">{{reply.replyValue}}</p>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    props: {
        _id: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            commentValue: '',
            commentTips: '登录之后才能发布自己的评论哦',
            comments: [],
            userImg: require('@/assets/img/userImg.jpg'),
            adminImg: require('@/assets/img/logo.png'),
            replyTarget: '',
            commentId: ''
        }
    },
    computed: {
        ...mapState(['userInfo']),
        isPost() {
            const len = `@${this.replyTarget}:`.length
            const matchTab = /\S/.test(this.commentValue.substring(len))
            if (this.commentValue && this.commentValue.charAt(0) !== '@') {
                return false
            } else if (this.commentValue.charAt(0) === '@' && matchTab) {
                return false
            } else {
                return true
            }
        },
        isComment() {
            if (this.userInfo) {
                return false
            } else {
                return true
            }
        }
    },
    async created() {
        const { data: { comments } } = await this.$axios.get('/articles/comments-list', {
            params: { _id: this._id }
        })
        if (comments) {
            this.comments = comments.reverse()
        }
    },
    methods: {
        postComment() {
            if (this.commentValue.charAt(0) === '@' && this.replyTarget) {
                this.replyHandle()
            } else {
                this.commentHandle()
            }
        },
        async commentHandle() {
            const { data } = await this.$axios.post('/articles/post-comment', {
                commentValue: this.commentValue,
                _id: this._id
            })
            if (data.code) {
                this.renderPostComment(data.id)
            }
        },
        renderPostComment(id) {
            this.comments.unshift({
                commentTime: Date.now(),
                commentUser: this.userInfo.username,
                commentValue: this.commentValue,
                replys: [],
                _id: id
            })
            this.commentValue = ''
        },
        replyComment(replyUser,id) {
            if (!this.userInfo) {
                return
            }
            this.commentId = id
            this.replyTarget = replyUser
            this.commentValue = `@${replyUser}:`
            this.$refs.textarea.focus()
        },
        async replyHandle() {
            const { data: { code } } = await this.$axios.post('/articles/post-reply',{
                replyValue: this.commentValue,
                replyTarget: this.replyTarget,
                _id: this._id,
                commentId: this.commentId
            })
            if (code) {
                this.renderReplyComment()
            }
        },
        renderReplyComment() {
            const index = this.comments.findIndex(item => item._id === this.commentId)
            this.comments[index].replys.push({
                replyTarget: this.replyTarget,
                replyTime: Date.now(),
                replyUser: this.userInfo.username,
                replyValue: this.commentValue
            })
            this.commentValue = ''
        }
    }
}
</script>

<style lang='less'>
.comment{
    margin-top: 24px;
}
.input-warp{
    text-align: right;
    button{
        margin-top: 20px;
        background: #4fc08d;
        color: #fff;
    }
}
.comment-list-warp{
    padding-top: 10px;
}
.comment-count{
    font-weight: 550;
    font-size: 13px;
}
.comment-item{
    padding: 10px;
    transition: background-color .3s;
    &:hover{
        background-color: #eee;
    }
}
.comment-info{
    &::after{
        content: '';
        display: block;
        clear: both;
    }
    .left{
        float: left;
    }
    .right{
        float: right;
    }
    .user-info{
        font-size: 13px;
        color: #333;
    }
    .comment-time{
        font-size: 11px;
        color: #666;
        margin-left: 5px;
    }
}
.comment-content{
    word-wrap: break-word;
    white-space: pre-wrap;
    padding: 10px;
    line-height: 20px;
    font-size: 13px;
    color: #666;
}
.user-info{
    line-height: 30px;
    height: 30px;
    box-sizing: border-box;
    img{
        border-radius: 50%;
    }
}
.comments-child{
    border-left: 2px solid #999;
    .comment-item{
        padding: 5px;
        &:hover{
            background-color: #ddd;
        }
    }
}
@media all and (min-width:375px) {
    .comments-child{
        margin-left: 6px;
    }
}
@media all and (min-width:768px) {
    .comments-child{
        margin-left: 12px;
    }
}
</style>

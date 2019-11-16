<template>
<client-only>
    <z-container v-if='contents'>
        <div slot='left' class="left-content">
            <z-about></z-about>
            <z-articleNav :nav="nav"></z-articleNav>
        </div>
        <div class="content-warp" slot='right'>
            <div class="article-message">
                <h2><i class="el-icon-document"></i>{{contents.title}}</h2>
                <z-articleInfo
                :postTime='contents.postTime'
                :readNum='contents.readNum'
                :lable='contents.lable'
                :description='contents.description'
                ></z-articleInfo>
            </div>
            <mavon-editor class="text-warp" v-html="content" />
            <el-divider></el-divider>
            <div class="money-wrap">
                <p>坚持原创技术分享，您的支持将鼓励我继续创作！</p>
                <el-button type="danger" style="font-weight:550" @click="isSupport = !isSupport">赞许支持</el-button>
                <transition name='show-qrcode'>
                    <div class="qrcode-wrap" v-show='isSupport'>
                        <span><img src="@/assets/img/d40ade099b1e18cfbfab200105b673c.jpg"> <i>微信支付</i> </span>
                        <span><img src="@/assets/img/e809ef034f275f492a51e32d2b0da53.jpg"> <i>支付宝支付</i></span>
                    </div>
                </transition>
            </div>
            <el-divider></el-divider>
            <div class="pre-next-wrap">
                <nuxt-link :to="'/article/'+prev._id" v-if="prev" class="prev">
                    <el-link type='info' style="font-size:13px">
                        <i class="el-icon-arrow-left"></i>
                        {{prev.title}}
                    </el-link>
                </nuxt-link>
                <nuxt-link :to="'/article/'+ next._id" v-if="next" class="next">
                    <el-link type='info' style="font-size:13px">
                        {{next.title}}
                        <i class="el-icon-arrow-right"></i>
                    </el-link>
                </nuxt-link>
            </div>
            <z-comment :_id='contents._id'></z-comment>
        </div>
    </z-container>
</client-only>
</template>

<script>
import zContainer from '@/components/front/z-container'
import zAbout from '@/components/front/z-about'
import zArticleInfo from '@/components/front/z-articleInfo'
import zArticleNav from '@/components/front/z-articleNav'
import getMKTitles from '@/assets/getMKTitles'
import zComment from '@/components/front/z-comment'
import marked from 'marked'
import hljs from 'highlight.js'
marked.setOptions({
    highlight: function(code) {
        return hljs.highlightAuto(code).value
    }
})
const renderer = new marked.Renderer()
export default {
    head() {
        return {
            title: '周炫博客-文章',
            meta: [
                { hid: 'description', name: 'description', content: this.contents.description },
                { hid: 'keywords', name: 'keywords', content: `${this.contents.lable.lable}技术，前端技术` },
            ]
        }
    },
    async asyncData({ $axios, params, error }) {
        const { data: { contents, nextPrevArr } } = await $axios.get('/articles/determine-content', {
            params: { _id: params.id }
        })
        if (!contents) {
            return error({
                statusCode: 404
            })
        } else {
            let index = 0
            let { content } = contents
            renderer.heading = (text, level) => {
                return `<h${level} id="title-${index++}">${text}</h${level}>`
            }
            content = marked(content, { renderer: renderer })
            const { nav } = getMKTitles(contents.content)
            return {
                contents,
                nav,
                content,
                next: nextPrevArr[0],
                prev: nextPrevArr[1],
            }
        }
    },
    data() {
        return {
            isSupport: false
        }
    },
    components: {
        zContainer,
        zAbout,
        zArticleInfo,
        zArticleNav,
        zComment
    }
}
</script>

<style lang='less'>
    @media all and (max-width:767px){
        .content-warp{
            h2{
                font-size: 18px!important;
            }
            h3{
                font-size: 16px!important;
            }
        }
    }
    .content-warp{
        .article-info{
            padding-top: 10px;
            .article-description{
                font-size: 13px;
                margin:  5px 0;
                margin-left: 0;
            }
        }
    }
    .article-message{
        text-align: center;
    }
    .money-wrap{
        text-align: center;
        font-size: 13px;
        p{
            font-size: 14px;
            margin-bottom: 15px;
        }
    }
    .qrcode-wrap{
        margin-top: 10px;
        span{
            margin: 10px;
            display: inline-block;
            img{
                width: 150px;
                height: 150px;
            }
            i{
                margin-top: 5px;
                display: block;
            }
        }
    }
    .show-qrcode-enter,.show-qrcode-leave-to{
        transform: translateY(30px);
        opacity: 0;
    }
    .show-qrcode-leave-active,.show-qrcode-enter-active{
        transition: .3s;
    }
    .pre-next-wrap{
        &::after{
            content: '';
            display: block;
            clear: both;
        }
        .el-link--inner{
            i{
                font-weight: 800;
            } 
        }
        .next{
            float: right;
        }
        .prev{
            float: left;
        }
    }
</style>

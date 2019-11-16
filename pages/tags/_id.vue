<template>
   <z-container>
        <div slot='left' class="left-content">
            <z-about></z-about>
        </div>
        <div slot='right' class="tagsAndFile">
            <div class="tags-index"  v-if='lables.length'>
                <h2 class="tags-title">标签</h2>
                <p class="tags-count">目前总共{{count.lables}}个标签</p>
                <div class="tags-list">
                    <nuxt-link
                    :to="{path: '/tags/'+lable._id,query:{tag:lable.lable}}" 
                    v-for='lable in lables'
                    :key='lable._id'>{{lable.lable}}</nuxt-link>
                </div>
            </div>
            <div class="tags-content" v-if='contents.length'>
                <h2 class="tag-name" v-if="$route.query"><span>{{$route.query.tag}}</span>标签</h2>
                <el-timeline>
                    <el-timeline-item
                    v-for='(content,index) in contents' :key='index'
                    :timestamp="$moment(content.postTime).format('YYYY-MM-DD')"
                    placement="top">
                        <nuxt-link :to="'/article/'+content._id" class="timeline-a">{{content.title}}</nuxt-link>
                    </el-timeline-item>
                </el-timeline>

            </div>
        </div>
   </z-container>
</template>

<script>
import zContainer from '@/components/front/z-container'
import zAbout from '@/components/front/z-about'
import { mapState } from 'vuex'
export default {
    head() {
        return {
            title: '周炫博客-标签分类',
            meta: [
                { hid: 'description', name: 'description', content: `周炫的个人网站原创博客首页,记录生活的瞬间,分享学习的心得,感悟生活,留住感动,静静寻觅生活的美好,博客交流,前端开发,开发,交流,学习,${this.lableName}` },
            ]
        }
    },
    computed: {
        ...mapState(['count'])
    },
    async asyncData({ $axios, params, error }) {
        let lables = []
        let contents = []
        if (!params.id) {
            const { data: { list } } = await $axios.get('/lables/list')
            lables = list
        } else {
            const { data: { data } } = await $axios.get('/articles/simple-content', {
               params: { lable: params.id }
            })
            contents = data
            if (!contents.length) {
                error({ statusCode: 404 })
            }
        }
        return {
            lables,
            contents
        }
    },
    components: {
        zContainer,
        zAbout
    }
}
</script>

<style lang='less'>
    .tagsAndFile{
        .tags-title{
            font-weight: 400;
        }
        .tags-count{
            line-height: 35px;
        }
    }
    .tags-index{
        text-align: center;
    }
    .tags-list{
        margin-top: 10px;
        a{
            display: inline-block;
            box-sizing: border-box;
            padding-bottom: 5px;
            margin: 15px;
            color: #666;
            border-bottom: 1px solid #999;
            transition: .2s color;
            &:hover{
                color: rgb(79, 192, 141)
            }
        }
    }
    .tags-content{
        .tag-name{
            color: #999;
            text-align: center;
            margin-bottom: 40px;
            font-size: 1.2em;
            span{
                color: #333;
                font-size: 1.4em;
                margin-right: 3px;
            }
        }
    }
    @media all and (min-width:1240px){
        .tags{
            padding:40px 120px;
        }
    }
</style>

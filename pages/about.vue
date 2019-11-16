<template>
<client-only>
    <z-container>
        <div slot='left' class="left-content">
            <z-about></z-about>
        </div>
        <div slot="right" class="content-warp">
            <h2 class="title">关于</h2>
            <p class="time">最后更新时间：{{$moment(contents.updateTime).format('YYYY-MM-DD')}}</p>
            <mavon-editor class="text-warp" v-html="contents.content" />
            <z-wx class="wx-warp"></z-wx>
        </div>
    </z-container>
</client-only>
</template>

<script>
import zContainer from '@/components/front/z-container'
import zAbout from '@/components/front/z-about'
import zWx from '@/components/front/z-wx'
import marked from 'marked'
export default {
    head() {
        return {
            title: '周炫博客-关于自己',
            meta: [
                { hid: 'description', name: 'description', content: '个人简介 个人博客 周炫 爱生活、爱艺术、爱lol、爱音乐、爱潮流、爱编程。人生百态，笑口常开，秉承自我，谨慎独行。寻找生活的美好。我的技能树 HTML/CSS/JS/Vue/node/koa/express' },
            ]
        }
    },
    async asyncData({ $axios }) {
        const { data: { contents } } = await $axios.get('/about/data')
        contents.content = marked(contents.content)
        return {
            contents
        }
    },
    components: {
        zContainer,
        zAbout,
        zWx
    }
}
</script>

<style lang='less'>
.content-warp{
    padding: 20px 50px;
    .title, .time{
        text-align: center;
    }
    .time{
        font-size: 14px;
        color: #999;
        margin: 20px 0;
    }
}
.wx-warp{
    margin-top: 30px;
    img{
        width: 55%;
    }
}
</style>

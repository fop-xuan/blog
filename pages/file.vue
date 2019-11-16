<template>
    <z-container>
        <div slot='left' class="left-content">
            <z-about></z-about>
        </div>
        <div slot='right' class="tagsAndFile">
            <el-timeline v-if='contents'>
                <h2 class="file-time">{{time}}年-历程</h2>
                <el-timeline>
                    <el-timeline-item
                    v-for="(content,index) in contents"
                    :key="index"
                    :timestamp="$moment(content.postTime).format('MMMDo')"
                    placement="top">
                        <nuxt-link :to="'/article/'+ content._id" class="timeline-a">{{content.title}}</nuxt-link>
                    </el-timeline-item>
                </el-timeline>
            </el-timeline>
            <div class="noFind" v-else>
                <p>后面没有任何内容啦......</p>
                <img src="@/assets/img/nodatadefault.4a03bc2.png" width="200" height="200">
            </div>
            <div class="next-prev-btn">
                <span @click="prev">上一年</span>
                <span  v-show="contents" @click="next">下一年</span>
            </div>
            </el-pagination>
        </div>
    </z-container>
</template>

<script>
import zContainer from '@/components/front/z-container'
import zAbout from '@/components/front/z-about'
export default {
    head() {
        return {
            title: '周炫博客-心路历程'
        }
    },
    watchQuery: ['time'],
    async asyncData({ $axios, query, error }) {
        const newTime = new Date().getFullYear()
        const time = query.time
        const { data } = await $axios.get('/articles/year-articles', {
            params: { time: time || newTime }
        })
        if (data.code) {
            return {
                contents: data.info,
                time: time || newTime
            }
        } else {
            return {
                contents: null,
                time: time || newTime
            }
        }
    },
    methods: {
        prev() {
            const time = this.$route.query.time || this.time
            if (Number(time) <  Number(new Date().getFullYear())) {
                this.$router.push({
                    name: 'file',
                    query: { time: Number(time) + 1 }
                })
            }
        },
        next() {
            const time = this.$route.query.time || this.time
            this.$router.push({
                name: 'file',
                query: { time: Number(time) - 1 }
            })
        }
    },
    components: {
        zContainer,
        zAbout
    }
}
</script>

<style lang='less'>
    .file-time{
        margin: 20px 0px 40px 0;
    }
    .noFind{
        text-align: center;
        margin: 50px 0;
        p{
            color: #999;
            margin: 30px 0;
        }
    }
    .next-prev-btn{
        text-align: center;
        span{
            display: inline-block;
            line-height: 20px;
            background: #999;
            padding: 3px;
            width: 40px;
            height: 20px;
            font-size: 12px;
            cursor: pointer;
            color: #fff;
            margin:0 5px;
            transition: .2s background, .2s box-shadow;
            &:hover{
                box-shadow: 0 0 15px rgb(194, 191, 191);
                background: rgb(79, 192, 141);
            }
        }
    }
</style>

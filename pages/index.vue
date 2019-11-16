<template>
    <z-container>
      <div slot='left' class="left-content">
        <!-- 点击排行，友情链接，联系我 -->
        <z-about></z-about>
        <z-clickRank></z-clickRank>
        <z-wx></z-wx>
      </div>
      <div slot='right'>
        <transition name='flip'>
          <z-articlesList :list='list' v-if='reload'>
          </z-articlesList>
        </transition>
        <el-pagination
            class="pagination"
            @current-change='changePage'
            :current-page='currentPage'
            layout="prev, pager, next"
            hide-on-single-page
            background
            :page-size='5'
            :total="$store.state.count.articles">
        </el-pagination>
      </div>
    </z-container>
</template>

<script>
import zArticlesList from '@/components/front/z-articlesList'
import zContainer from '@/components/front/z-container'
import zAbout from '@/components/front/z-about'
import zClickRank from '@/components/front/z-clickRank'
import zWx from '@/components/front/z-wx'
export default {
  watchQuery: ['page'],
  head() {
    return {
      meta: [
        { hid: 'keywords', name: 'keywords', content: '周炫,个人博客,博客系统,前端博客,vue博客,nuxt博客,IT,技术,博客,JavaScript,node,koa,express' },
      ]
    }
  },
  async asyncData( { $axios, query } ) {
    const { data } = await $axios.get('/articles/simple-content', {
      params: {
        page: query.page,
        limit: 5
      }
    })
    let list = []
    if (data.code) {
      list = data.data
    }
    return {
      list
    }
    
  },
  data() {
    return {
      reload: true
    }
  },
  computed: {
    currentPage() {
      if (this.$route.query.page) {
        return parseInt(this.$route.query.page)
      } else {
        return 1
      }
    }
  },
  methods: {
    changePage(page) {
      this.$router.push({
        path: '/',
        query: { page }
      })
      window.scrollTo(0, 0)
      this.reload = false
      this.$nextTick(() => {
        this.reload = true
      })
    }
  },
  components: {
    zArticlesList,
    zContainer,
    zAbout,
    zClickRank,
    zWx
  }
}
</script>
<style lang="less">
.pagination{
  text-align: center;
  .number{
    &:hover{
      color: #4fc08d!important;
    }
    &.active{
      background-color: #4fc08d!important;
      color: #fff!important;
    }
  }
}
.flip-enter,.flip-leave-to{
  transform: translateY(40px);
  opacity: 0;
}
.flip-enter-active,.flip-leave-active{
  transition: .6s transform cubic-bezier(0,1.11,.6,1.01), 1s opacity;
}
</style>


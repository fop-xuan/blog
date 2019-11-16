<template>
    <div class="search">
        <el-input v-model="searchVal" placeholder="请输入关键字..." @keyup.enter.native="searchHandle">
            <i slot="suffix" style="cursor:pointer" class="el-input__icon el-icon-search" @click='searchHandle'></i>
        </el-input>
        <transition name='show-search-content'>
            <div class="search-content" v-if="info.length">
                <el-card class="box-card" v-for="(article,index) in info" :key='index'>
                    <h4 class="title" @click='goArticle(article._id)'>{{article.title}}</h4>
                    <p class="description">{{article.description}}
                    </p>
                    <p class="lable-warp" @click='goLable(article.lable._id)'>
                        <i class="icon-label"></i>
                        <span>{{article.lable.lable}}</span>
                    </p>
                </el-card>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    data() {
        return {
            info: [],
            searchVal: ''
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (vm.$route.query.searchVal) {
                vm.searchVal = vm.$route.query.searchVal
            }
            vm.searchHandle()
        })
    },
    methods: {
        async searchHandle() {
            this.$router.push({
                query: { searchVal: this.searchVal }
            })
            if (this.searchVal !== '') {
                const { data } = await this.$axios.get('/articles/search', {
                    params: { searchVal: this.searchVal }
                })
                if (data.code) {
                    this.info = data.info
                }
            }
        },
        goArticle(id) {
            this.$router.push({
                name: 'article-id',
                params: { id }
            })
        },
        goLable(id) {
            this.$router.push({
                name: 'tags-id',
                params: { id }
            })
        }
    }
}
</script>

<style lang='less'>
.box-card{
    .title{
        cursor: pointer;
    }
    text-align: left;
    margin-top: 20px;
    .description{
        border-left: 2px solid #666;
        padding-left: 5px;
        color: #666;
        line-height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        -webkit-line-clamp: 2;
    }
}
.lable-warp{
    cursor: pointer;
    &::before{
        position: absolute;
        left: -20px;
        top: 0px;
        content: '';
        display: inline-block;
        border: 10px solid transparent;
        border-right-color: #262a30;
    }
    margin-left: 10px;
    position: relative;
    display: inline-block;
    color: #fff;
    background-color: #262a30;
    padding-right: 4px;
    height: 20px;
    line-height: 20px;
    margin-top: 15px;
    font-size: 12px;
    span{
        vertical-align: middle;
    }
    i{
        vertical-align: middle;
        margin-right: 0px;
    }
}
.show-search-content-enter,.show-search-content-leave-to{
    transform: translateY(-30px);
    opacity: 0;
}
.show-search-content-enter-active,.show-search-content-leave-active{
    transition: .5s;
}
</style>

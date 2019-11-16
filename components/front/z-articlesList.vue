<template>
    <div class="warp">
        <el-card shadow='hover' v-for='(item,index) in list' :key='index' class="card">
            <nuxt-link class="article-title" slot="header" :to="{'name':'article-id', params:{id: item._id} }">{{item.title}}</nuxt-link>
            <el-image :src="item.imgUrl" lazy></el-image>
            <z-articleInfo
            :postTime='item.postTime'
            :readNum='item.readNum'
            :lable='item.lable'
            :description='item.description'
            ></z-articleInfo>
            <el-link type="info" icon="el-icon-reading" class="article-read" @click='go_article(item._id)'>阅读全文>></el-link>
        </el-card>    
    </div>
</template>

<script>
import zArticleInfo from '@/components/front/z-articleInfo'
export default {
    props: {
        list: {
            type: Array,
            default() {
                return []
            }
        }
    },
    methods: {
        go_article(_id) {
            this.$router.push({
                name: 'article-id',
                params: { id: _id }
            })
        }
    },
    components: {
        zArticleInfo
    }
}
</script>

<style lang='less'>
    .article-title{
        color: #000;
        display: inline-block;
        &:after{
            content: '';
            display: block;
            height: 2.2px;
            background: #999;
            transform: scaleX(0);
            transition: .5s ease;
        }
        &:hover{
            &:after{
                transform: scaleX(1)
            }
        }
    }
    .card{
        margin-bottom:25px;
        .el-card__header{
            padding: 10px 20px;
        }
        .el-card__body{
            &:after{
                content: '';
                display: block;
                clear: both;
            }
            padding: 10px;
            padding-bottom: 20px;
            box-sizing: border-box;
            position: relative;
            text-align: center;
            .el-image{
                width: 200px;
                height: 200px;
            }
        }
    }
    .article-read{
        font-size: 12px;
        position: absolute;
        right: 5px;
        bottom: 2px;
    }
    @media all and (min-width:768px){
        .card{
            .el-card__body{
                padding: 0;
                .el-image{
                    float: left;
                    width: 150px;
                    height: 150px;
                }
            }
        }
    }
</style>

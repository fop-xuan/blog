<template>
    <div class="article-info">
        <time class="article-time">发表于：{{$moment(postTime).format('YYYY-MM-DD')}} </time>
        <span class="article-readNum"> <i class="el-icon-view"></i> 阅读数量：{{readNum}}</span>
        <div class="link-warp">
            <nuxt-link :to="{name:'tags-id',params:{id:lable._id},query:{tag:lable.lable}}" class="article-sort">
                <i class="icon-label"></i>标签：{{lable.lable}}
            </nuxt-link>
        </div>
        <p class="article-description">{{description}}</p>
    </div>
</template>

<script>
export default {
    props: {
        postTime: {
            type: String,
            default: ''
        },
        readNum: {
            type: Number,
            default: 0
        },
        lable: {
            type: Object,
            default() {
                return {}
            }
        },
        description: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang='less'>
.article-title{
    font-size: 14px;
    font-weight: 550;
    cursor: pointer;
}
 .article-info{
    margin-top: 10px;
    font-size: 12px;
    line-height: 22px;
    .article-time{
        margin-right: 5px;
    }
    .article-sort{
        color: #999;
        font-size: 12px;
        margin: 5px 0;
        .icon-label{
            vertical-align: middle;
        }
        .el-link--inner{
            vertical-align: middle;
        }
    }
    .article-description{
        color: #999;
        line-height: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        -webkit-line-clamp: 2;
    }
}
@media all and (min-width:768px){
    .article-title{
        font-size: 16px;
    }
    .article-info{
        padding-top: 20px;
        box-sizing: border-box;
        line-height: 28px;
        font-size: 13px;
        margin-top: 0px;
        .article-sort{
            font-size: 13px;
        }
        .article-description{
            margin-left: 160px;
            line-height: 23px;
            font-size: 14px;
        }
    }
}
</style>

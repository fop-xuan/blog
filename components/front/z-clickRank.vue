<template>
    <div class="rank">
        <h4>点击排行</h4>
        <ul class="rank-list">
            <nuxt-link :to="'/article/'+rank._id" tag="li" class="rank-item" v-for='(rank,index) in ranks' :key='index'>
                <span>{{index+1}}</span><a>{{rank.title}}</a>
            </nuxt-link>
        </ul>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    computed: {
        ...mapState(['ranks'])
    }
}
</script>

<style lang='less'>
.rank{
    background-color: #fff;
    .rank-item{
        margin-bottom: 12px;
        white-space:nowrap;
        text-overflow: ellipsis;
        overflow:hidden;
        font-size: 14px;
        &:nth-of-type(1),&:nth-of-type(2),&:nth-of-type(3){
            span{
                background-color: rgb(79, 192, 141)
            } 
        }
        span{
            vertical-align: middle;
            font-size: 12px;
            width: 16px;
            text-align: center;
            line-height: 18px;
            height: 18px;
            display: inline-block;
            background-color: #666;
            color: #fff;
        }
        a{
            margin-left: 6px;
            vertical-align: middle;
            color: #666;
            &:hover{
                color: #4fc08d;
            }
        }
    }
}
</style>

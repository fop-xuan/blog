<template>
    <footer class="footer">
        <time>2016 — 2019</time>
        <span class="author">Design by 周炫</span>
        <nuxt-link v-if='userInfo' style="display:inline" to='/admin' tag='p'>
            <el-link type="info" v-if='userInfo.isAdmin' :underline="false">管理员进入后台</el-link>
        </nuxt-link> 
    </footer>
</template>

<script>
import { mapState } from 'vuex';
export default {
    computed: {
        ...mapState(['userInfo'])
    }
}
</script>

<style lang='less'>
    .footer{
        height: 70px;
        background-color:#262a30; 
        color: #999;
        padding-top: 15px;
        box-sizing: border-box;
        text-align: center;
        time{
            font-size: 14px;
            display: block;
        }
        .author{
            font-size: 14px;
        }
    }
    @media all and (max-width:768px) {
        .footer{
            margin-top: 20px;
        }
    }
</style>

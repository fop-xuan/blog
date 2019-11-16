<template>
    <client-only>
        <el-container class="admin">
            <el-header height='80px'>
                <div class="title"><i class="el-icon-setting"></i>个人博客管理</div>
                <div class="logo">
                    <i class="el-icon-user"></i>
                    <nuxt-link to='/' class="backfront">返回前台</nuxt-link>
                </div>
            </el-header>
            <el-container class="content">
                <el-aside width="250px">
                    <z-adminNav :adminNavList='adminNavList'></z-adminNav>
                </el-aside>
                <el-main>
                    <el-page-header
                    v-if='contentObj'
                    @back="goBack"
                    :content="contentObj.title">
                    </el-page-header>
                        <nuxt-child />
                </el-main>
            </el-container>
        </el-container>
    </client-only>
</template>

<script>
import zAdminNav from '@/components/admin/z-adminNav'
const adminNavList = [
    {
        title: '标签列表',
        name: 'admin-lable-list'
    },
    {
        title: '增加标签',
        name: 'admin-lable-add'
    },
    {
        title: '文章列表',
        name: 'admin-article-list'
    },
    {
        title: '增加文章',
        name: 'admin-article-add'
    },
    {
        title: '博主信息编辑',
        name: 'admin-about-edit'
    },
    {
        title: '评论管理',
        name: 'admin-comment-list'
    },
    {
        title: '密码修改',
        name: 'admin-change-paw'
    }
]
export default {
    layout: 'black',
    middleware: 'superPass',
    data() {
        return {
            adminNavList
        }
    },
    computed: {
        contentObj() {
            return this.adminNavList.find(item => this.$route.name === item.name)
        }
    },
    methods: {
        goBack() {
            this.$router.replace('/admin')
        }
    },
    components: {
        zAdminNav
    }
}
</script>

<style lang='less'>
    .el-page-header__content{
        font-size: 16px;
    }
    .el-header{
        background: #545c64;
        line-height: 80px;
        .title{
            float:left;
            color: #fff;
            font-size: 18px;
            i{
                margin-right: 10px;
                color: #fff;
                font-size: 40px;
                vertical-align: middle;
            }
        }
        .logo{
            color: #fff;
            float:right;
            margin-right: 30px;
            .backfront{
                text-decoration: none;
                color: #4fc08d;
                box-sizing: border-box;
            }
        }
    }
    .el-main{
        min-height: 800px;
    }
    .el-aside{
        background-color: #545c64;
        box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
    }
</style>

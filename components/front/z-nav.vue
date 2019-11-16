<template>
     <el-menu router background-color='#efefef'
     @select="handleSelect"
     active-text-color='#4fc08d'
     :default-active="$route.name"
     :mode='mode'
     class="nav-list" :class="{'active':fadeNav}">
        <el-menu-item  v-for='(item,listIndex) in routerList' :key='listIndex' :index='item.name' :route="{name: item.name}">
            <i :class="item.icon"></i>
            <span slot="title">{{item.title}}</span>
        </el-menu-item>
     </el-menu>
</template>

<script>
const routerList = [
                {
                    title: '首页',
                    icon: 'el-icon-s-home',
                    name: 'index'
                },
                {
                    title: '标签',
                    icon: 'icon-label',
                    name: 'tags-id'
                },
                {
                    title: '归档',
                    icon: 'el-icon-date',
                    name: 'file'
                },
                {
                    title: '关于',
                    icon: 'el-icon-user-solid',
                    name: 'about'
                },
                {
                    title: '搜索',
                    icon: 'el-icon-search',
                    name: 'search'
                }
            ]
let adaptView = null
if (process.client) {
    adaptView = require('@/assets/adaptView')
}
export default {
    props: {
        fadeNav: {
            type: Boolean,
            defalut: false
        }
    },
    data() {
        return {
            routerList: routerList,
            mode: 'vertical'
        }
    },
    created() {
        adaptView && adaptView()
    },
    methods: {
        handleSelect() {
            this.$emit('update:fadeNav', false)
        }
    }
}
</script>

<style lang='less'>
    .nav-list{
        max-height: 0px;
        overflow: hidden;
        transition: .4s ease-in-out;
        &.active{
            max-height: 500px;
        }
        li{
            transition: .2s;
            &:hover{
                color: #4fc08d;
            }
        }
    }
    @media all and (min-width: 768px){
        .nav-list{
            float: right;
            max-height:500px;
            border-right: none!important;
            li{
                background-color: #fff!important;
                padding: 0 5px!important;
                float: left;
            } 
        }
    }
    @media all and (min-width:960px){
        .nav-list{
            li{
                background-color: #fff!important;
                padding: 0 20px!important;
            } 
        }
    }
</style>

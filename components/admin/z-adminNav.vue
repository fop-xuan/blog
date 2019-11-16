<template>
    <el-menu
        :default-active="$route.name"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#4fc08d"
        :router='true'
        >
        <el-menu-item v-for='(nav,index) in adminNavList' :key='index' :index="nav.name" :route="{name: nav.name}">
            <i class="el-icon-view"></i>
            <span slot="title">{{nav.title}}</span>
        </el-menu-item>
    </el-menu>
</template>

<script>
export default {
    props: {
        adminNavList: {
            type: Array,
            default() {
                return []
            }
        }
    }
}
</script>

<style>

</style>

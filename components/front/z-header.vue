<template>
    <header class="header">
        <div class="nav-btn" @click='toggleNav' :class="{'nav-active':fadeNav}">
            <div class="icon"></div>
        </div>
        <div class="blogger">
            <span style='margin-right: 5px;'>周炫的个人博客</span>
            <div v-if='!userInfo' class="user-handle">
                <nuxt-link :to="{path:'/login',query:{name: $route.name,id: $route.params.id}}">登录</nuxt-link>
                <nuxt-link to='/register'>注册</nuxt-link>
            </div>
            <div v-else style="display:inline">
                <span class="username"> <i class="el-icon-user"></i>{{userInfo.username}}</span>
                <span style="font-size:14px;cursor: pointer;" @click='signoutHandle'>注销</span>
            </div>
        </div>
        <z-nav :fadeNav.sync='fadeNav'></z-nav>
    </header>
</template>

<script>
import zNav from './z-nav'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
    data() {
        return {
            fadeNav: false
        }
    },
    computed: {
        ...mapState(['userInfo']),
    },
    methods: {
        ...mapMutations(['setUserInfo']),
        ...mapActions(['signout']),
        toggleNav() { // 切换导航显示隐藏
            this.fadeNav = !this.fadeNav
        },
        async signoutHandle() {
            const isSignout = await this.signout()
            if (!isSignout) {
                 this.$notify.error({
                    title: '错误',
                    message: '注销失败'
                })
            }
        }
    },
    components: {
        zNav
    }
}
</script>

<style lang='less'>
.header{
    z-index: 1999;
    text-align: center;
    height: 60px;
    box-shadow: 0 1px 1px rgba(0,0,0,.04);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    line-height: 60px;
    background: #fff;
    box-sizing: border-box;
}
.nav-btn{
    transition: .5s background;
    border-radius: 50%;
    height: 40px;
    width: 40px;
    position: absolute;
    left: 5px;
    top:50%;
    margin-top: -20px;
    z-index: 50;
    .icon{
        transition: .4s width;
        width: 24px;
        height: 4px;
        background: #000;
        border-radius: 2px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -2px 0  0 -12px;
        &::before{
            content: '';
            border-radius: 2px;
            top: -8px;
            left: 0px;
            position: absolute;
            width: 24px;
            height: 4px;
            background: #000;
            transition: .5s background, .4s transform;
        }
        &::after{
            border-radius: 2px;
            top: 8px;
            left: 0px;
            content: '';
            position: absolute;
            width: 24px;
            height: 4px;
            background: #000;
            transition: .5s background, .4s transform;
        }
    }
}
.nav-active{
    .icon{
        width: 0;
        &::before{
            background-color: #4fc08d;
            transform: translateY(8px) rotate(45deg) ;
            -webkit-transform:translateY(8px) rotate(45deg) ;
        }
        &::after{
            background-color: #4fc08d;
            transform: translateY(-8px) rotate(-45deg)  ;
            -webkit-transform:translateY(-8px) rotate(-45deg)  ;
        }
    }
}
.blogger{
    font-size: 18px;
    display: inline;
    color: #909399;
}
.username{
    font-size: 14px;
}
.user-handle{
    a{
        font-size: 14px;
        &:first-of-type{
            color: #4fc08d
        }
        color: #999;
    }
    display: inline;
}
@media all and (min-width:768px){
    .header{
        padding: 0 3%;
    }
    .nav-btn{
        display: none;
    }
    .blogger{
        float: left;
    }
}
@media all and (min-width:1024px){
    .header{
        padding: 0 6%;
    }
}
</style>

<template>
    <div class="article-nav" ref='articleNav'>
        <h4>文章导航</h4>
        <client-only>
            <z-tree :nav='nav'></z-tree>
        </client-only>
    </div>
</template>

<script>
import zTree from '@/components/front/z-tree'
export default {
    props: {
        nav: {
            type: Array,
            default() {
                return []
            }
        }
    },
    mounted() {
        this.changePostion()
        window.addEventListener('scroll', this.changePostion)
    },
    methods: {
        changePostion() {
            if (window.pageYOffset > 318 && !this.position) {
                if(this.$refs.articleNav) {
                    this.position = true
                    this.$refs.articleNav.classList.add('positions')
                }
            } else if (window.pageYOffset <= 318 && this.position) {
                if (this.$refs.articleNav) {
                    this.position = false
                    this.$refs.articleNav.classList.remove('positions')
                }
            }
        }
    },
    destroyed() {
        window.removeEventListener('scroll', this.changePostion)
    },
    components: {
        zTree
    }
}
</script>

<style lang='less'>
    .article-nav{
        width: 260px;
        box-sizing: border-box;
        .el-tree-node__content{
            .el-tree-node__label{
                width: 180px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
           
        }
        background-color: #fff;
        &.positions{
            position: fixed;
            top: 80px;
        }
    }
</style>

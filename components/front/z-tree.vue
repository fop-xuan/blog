<template>
        <el-tree 
        ref="tree"
        :data="nav"
        node-key='index'
        :props="defaultProps"
        :highlight-current='true'
        @node-click="handleNodeClick"
        default-expand-all

        :expand-on-click-node='false'
        ></el-tree>
</template>

<script>
export default {
    props: {
        nav: {
            type: Array,
            default() {
                return []
            }
        }
    },
    computed: {
        titles() {
            const lables = document.querySelector('.text-warp').children 
            return [...lables].filter(item => item.id)
        }
    },
    mounted() {
        this.$nextTick(()=> {
            this.setCurrentNavItem()
            this.move = () => {
                this.setCurrentNavItem()
            }
            window.addEventListener('scroll', this.move)
        }) 
    },
    destroyed() {
        window.removeEventListener('scroll', this.move)
    },
    data() {
        return {
            defaultProps: {
                children: 'children',
                label: 'title'
            },
            move: null,
            isStopMove: false
        }
    },
    methods: {
        handleNodeClick(data) {
            const id = `#title-${data.index}`
            const targetEL = document.querySelector(id)
            const startTarget = Math.round(window.pageYOffset)
            const maxScroll = document.documentElement.offsetHeight - document.documentElement.clientHeight
            this.animate({
                startTarget: startTarget,
                target: targetEL.offsetTop,
                maxScroll: maxScroll
            })
        },
        animate(option) { // 执行运动
            const vm = this
            function animationFunc() {
                cancelAnimationFrame(vm.stop) // 每次开启之前，先停止
                vm.stop = requestAnimationFrame(animationFunc)
                const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
                if (option.target > option.maxScroll) { // 当目标的top大于滚动的最大高度时,不能超出滚动的最大高度
                    option.target = option.maxScroll
                }
                vm.speed = Math.round(((option.target + 15) - scrollTop) * 0.6)
                document.documentElement.scrollTop += document.body.scrollTop += vm.speed
                if (!vm.speed) {
                    cancelAnimationFrame(vm.stop)
                }
            }
            animationFunc()
        },
        setCurrentNavItem() {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            const index = parseInt(this.titles.filter(item => item.offsetTop <= (scrollTop + 2)).pop().id.substring(6))
            if (this.$refs.tree.setCurrentKey) {
                this.$refs.tree.setCurrentKey(index)
            }
        }
    }
}
</script>

<style lang='less'>
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
  color: #4fc08d;
}
</style>

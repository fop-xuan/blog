<template>
  <div class="default-wrap">
    <z-header></z-header>
    <main class="default-main">
      <transition name='fade'>
        <nuxt />
      </transition>
    </main>
    <el-backtop style='color:rgb(79, 192, 141);' :right='15' :visibility-height='318'></el-backtop>
    <z-footer></z-footer>
  </div>
</template>
<script>
import zHeader from '@/components/front/z-header'
import zFooter from '@/components/front/z-footer'
export default {
  components: {
    zHeader,
    zFooter
  }
}
</script>

<style lang='less'>
.default-main{
  padding: 0 15px;
  margin-top: 80px;
  box-sizing: border-box;
  min-height: 500px;
}
@media all and (min-width: 768px){
  .default-main{
    padding: 0;
    margin: 80px 25px 80px 25px;
  }
}
@media all and (min-width: 1024px){
  .default-main{
    margin: 80px auto;
    width: 960px;
  }
}
@media all and (min-width: 1240px) {
    .default-main{
      width: 1150px;
    }
}
</style>

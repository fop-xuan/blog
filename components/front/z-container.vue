<template>
    <div class="container">
      <aside class="left">
        <slot name='left'></slot>
      </aside>
      <div class="right">
        <slot name='right'></slot>
      </div>     
    </div>
</template>

<style lang='less' scoped>
.container{
  &::after{
    display: block;
    clear: both;
    content: '';
  }
  .left{
    float: left;
    width: 260px;
    display: none;
  }
}

@media all and (min-width: 768px) {
  .container{
    .left{
      display: block;
    }
    .right{
      float: right;
      width: 63%;
    }
  }  
}
@media all and (min-width: 960px) {
  .container{
    .left{
      display: block;
    }
    .right{
      float: right;
      width: 68%;
    }
  }  
}
@media all and (min-width:1024px) {
  .container{
    .right{
      float: right;
      width: 70%;
    }
  }
}
</style>

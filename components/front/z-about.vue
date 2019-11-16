<template>
    <div class="about">
        <img src="@/assets/img/logo.jpg">
        <p class="blogger">xuan</p>
        <p style='color:#909399;font-size:13px;line-height:30px'>热爱球鞋</p>
        <div class="info">
        <div class="articles-count">
            <span>{{count.articles}}</span>
            <span>文章</span>
        </div>
        <div class="lables-count">
            <span>{{count.lables}}</span>
            <span>标签</span>
        </div>
        </div>
        <div class="links-of-blogger">
        <a href="https://github.com/fop-xuan" target="_blank" class="icon-github"></a>
        <a href="http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=JRYWEhMQFBQRHGVUVAtGSkg" target="_blank" class="icon-envelop"></a>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['count'])
  }
}
</script>

<style lang='less'>
.about{
  background-color: #fff;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  img{
    width: 60%;
    border: 1px solid #eee;
    padding: 2px;
  }
  .blogger{
    color: #666;
    line-height: 30px;
  }
  .info{
    margin-top: 5px;
    div{
      text-align: center;
      display: inline-block;
      padding: 0 10px;
      span{
        display: block;
        &:nth-of-type(1){
          font-weight: 550;
        }
        &:nth-of-type(2){
          font-size: 13px;
          line-height: 25px;
          color: rgb(144, 147, 153);
        }
      }
    }
    .lables-count{
      border-left: 1px solid #eee;
    }
  }
  .links-of-blogger{
    margin-top: 8px;
    width: 60px;
    &::after{
      content: '';
      display: block;
      clear: both;
    }
    a{
      color: #666;
    }
    .icon-github{
      float: left;
    }
    .icon-envelop{
      float: right;
    }
  }
}
</style>

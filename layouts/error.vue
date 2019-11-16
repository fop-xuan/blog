<template>
    <div class="error">
        {{msg}}
    </div>
</template>

<script>
export default {
    data () {
        return {
            msg: '未找到相应页面或相应的资源不存在,请返回'
        }
    }
}
</script>

<style>
.error{
    font-size: 32px;
    text-align: center;
    padding-top: 15%;
}
</style>

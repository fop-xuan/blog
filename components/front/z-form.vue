<template>
    <div class="form-warp">
        <client-only>
            <vue-particles
            v-if='isBackground'
            class="particles"
            color="#409EFF"
            :linesWidth='1'
            linesColor='#000'
            :particlesNumber='50'
            ></vue-particles>
        </client-only>
        <el-form class="form-box" :model='model' :rules="rules" ref='loginForm'>
            <h3 class="title"> <i class="el-icon-s-custom"></i>{{title}}</h3>
            <slot></slot>
            <el-form-item style="text-align:right;">
                <el-button type="primary" @click="submitForm('loginForm')" @keyup.enter="submitForm('loginForm')">{{title}}</el-button>
                <el-button type="info" @click="clearForm('loginForm')">重置</el-button>
            </el-form-item>
            <nuxt-link v-if='isLogin' to='/register' style="font-size:12px;color:#666">还没账号？点击立即注册</nuxt-link>
        </el-form>
    </div>
</template>

<script>
const VALID_PASS = 'validPass'
export default {
    props: {
        model: {
            type: Object,
            default() {
                return {}
            }
        },
        rules: {
            type: Object,
            default() {
                return {}
            }
        },
        title: {
            type: String,
            default: ''
        },
        err: {
            type: String,
            default: '错误'
        },
        isLogin: {
            type: Boolean,
            default: false
        },
        isBackground: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        submitForm(form) { // 提交表单时验证
            this.$refs[form].validate(valid => { // validate form表单的校验方法
                if (valid) {
                    this.$emit(VALID_PASS, this.$refs[form])
                } else {
                    this.$notify.error({
                        title: '提示',
                        message: this.err
                    })
                }
            })
        },
        clearForm(form) { // 表单重置，清空表单
            this.$refs[form].resetFields()
        }
    }
}
</script>

<style lang='less'>
    .particles{
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        z-index: 1;
    }
    .form-warp{
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        overflow: hidden;
    }
    .form-box{
        box-shadow: 0 30px 50px 0 rgba(1, 1, 1, 0.2);
        position: relative;
        z-index: 2;
        box-sizing: border-box;
        width: 300px;
        background: #fff;
        padding: 10px;
        margin: 100px auto;
    }
    @media all and (min-width: 768px){
        .form-box{
            padding: 20px;
            width: 400px;
        }
    }
</style>

<template>
    <z-form title='用户注册' :model='model' :rules='rules' @validPass='validPass' :err='err'>
        <el-form-item prop='username'>
            <el-input v-model="model.username" placeholder="请输入账号" autocomplete='off'></el-input>
        </el-form-item>
        <el-form-item prop='password'>
            <el-input type="password" v-model="model.password" placeholder="密码" autocomplete='off'></el-input>
        </el-form-item>
        <el-form-item prop='checkPase'>
            <el-input type="password" v-model="model.checkPase" placeholder="确认密码" autocomplete='off'></el-input>
        </el-form-item>
    </z-form>
</template>

<script>
import zForm from '@/components/front/z-form.vue'
let encryption = null
if (process.client){
    encryption = require('@/assets/encryption')
}
export default {
    layout: 'black',
    data() {
        const validatePass = (rule, value, callback) => { // 自定义校验
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.model.password) {
                callback(new Error('两次输入的密码不一致！'))
            } else {
                callback()
            }
        }
        return {
            err: '信息有误，请重新输入一下吧',
            model: {
                username: '',
                password: '',
                checkPase: ''
            },
            rules: { // 校验规则
                username: [
                    { required: true, message: '用户名不能为空' }
                ],
                password: [
                    { required: true, message: '密码不能为空' },
                    { min: 6, max: 11, message: '长度6到11之间' }
                ],
                checkPase: [
                    { validator: validatePass, trigger: 'change' }
                ]
            }
        }
    },
    computed: {
        async getPublicKey () {
            const { publicKey } = await this.$axios.$get('/users/key')
            return publicKey
        }
    },
    methods: {
        async validPass() {
            const password = encryption(await this.getPublicKey, this.model.password)
            try {
                const info = await this.$axios.$post('/users/signup', {
                    username: this.model.username,
                    password: password
                })
                if (info.code) {
                    this.$router.push('/login')
                } else {
                    this.$notify({
                        title: '错误',
                        message: info.msg,
                        type: 'error'
                    })
                }
            } catch(err) {
                console.log(err)
            }
        }
    },
    components: {
        zForm
    }
}
</script>

<style lang='less'>
    .register{
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
    }
</style>

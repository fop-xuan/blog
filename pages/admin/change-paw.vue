<template>
    <div style="position:relative;height:500px">
        <z-form title='密码修改' :model='model' :rules='rules' @validPass='validPass' :err='err' :isBackground='false'>
            <el-form-item prop='password'>
                <el-input type="password" v-model="model.password" placeholder="密码" autocomplete='off'></el-input>
            </el-form-item>
            <el-form-item prop='checkPase'>
                <el-input type="password" v-model="model.checkPase" placeholder="确认密码" autocomplete='off'></el-input>
            </el-form-item>
        </z-form>
    </div>
</template>

<script>
import zForm from '@/components/front/z-form.vue'
let encryption = null
if (process.client){
    encryption = require('@/assets/encryption')
}
export default {
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
            model: {
                username: '',
                checkPase: ''
            },
            rules: {
                password: [
                    { required: true, message: '密码不能为空' },
                    { min: 6, max: 11, message: '长度6到11之间' }
                ],
                checkPase: [
                    { validator: validatePass, trigger: 'change' }
                ]
            },
            err: '两次密码不相同，请重新填写！'
        }
    },
    computed: {
        async getPublicKey () {
            const { publicKey } = await this.$axios.$get('/users/key')
            return publicKey
        }
    },
    methods: {
        async validPass(form) {
            const password = encryption(await this.getPublicKey, this.model.password)
            try {
                const info = await this.$axios.$post('/users/change', {
                    password: password
                })
                this.$notify.warning(info.msg)
                form.resetFields()
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

<style>

</style>

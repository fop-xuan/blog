<template>
    <z-form title='用户登录' :model='model' :rules='rules' @validPass='validPass' :err='err' :isLogin='true'>
        <el-form-item prop='username'>
            <el-input v-model="model.username" placeholder="请输入账号" autocomplete='off'></el-input>
        </el-form-item>
        <el-form-item prop='password'>
            <el-input type="password" v-model="model.password" placeholder="密码" autocomplete='off'></el-input>
        </el-form-item>
    </z-form>
</template>

<script>
import zForm from '@/components/front/z-form'
import { mapMutations, mapActions, mapState } from 'vuex'
let encryption = null
if (process.client){
    encryption = require('@/assets/encryption')
}
export default {
    layout: 'black',
    data() {
        return {
            err: '验证不通过，请输入完整用户名密码',
            model: {
                username: '',
                password: ''
            },
            rules: { // 校验规则
                username: [
                    { required: true, message: '请输入用户名' }
                ],
                password: [
                    { required: true, message: '请输入密码' }
                ]
            }
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (vm.userInfo) {
                vm.$notify({
                    title: '警告',
                    duration: 1000,
                    message: '已经登录，请不要重复登录',
                    type: 'warning'
                })
                vm.$router.replace(from.path)
            }
        })
    },
    computed: {
        ...mapState(['userInfo']),
        async getPublicKey () { // 获取公钥
            const { publicKey } = await this.$axios.$get('/users/key')
            return publicKey
        }
    },
    methods: {
        ...mapMutations(['setUserInfo']),
        ...mapActions(['signin']),
        async validPass() { // 提交登录
            const password = encryption(await this.getPublicKey, this.model.password)
            const isSignin = await this.signin({
                username: this.model.username,
                password: password
            })
            if (isSignin) {
                const { name, id } = this.$route.query
                if (name && name !== 'index') {
                    this.$router.replace({
                        name: name,
                        params: { id: id }
                    })
                } else {
                    this.$router.replace('/')
                }
            } else {
                this.$notify.error({
                    title: '错误',
                    message: '账号密码错误'
                })
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

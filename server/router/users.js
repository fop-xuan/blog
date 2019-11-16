const router = require('koa-router')()
const Users = require('../dbs/models/users')
const NodeRSA = require('node-rsa')

const key = new NodeRSA({ b: 512 })  
key.setOptions({ encryptionScheme: 'pkcs1' })

router.prefix('/users')

router.get('/key', (ctx) => {
    const publicKey = key.exportKey('public') //生成公钥
    ctx.body = { publicKey: publicKey }
})

router.post('/signup', async (ctx) => {
    const { username, password } = ctx.request.body
    const decryptPassword = key.decrypt(password, 'utf8') // 解密
    const user = await Users.findOne({ username: username })
    if (!user) {
        const userCreate = await Users.create({ username, password: decryptPassword })
        if (userCreate) {
            ctx.body = { code: 1, msg: '注册成功' }
        }
        return
    }
    ctx.body = { code: 0, msg: '用户已存在' }
})

router.post('/signin', async (ctx) => {
    const { username, password } = ctx.request.body
    const decryptPassword = key.decrypt(password, 'utf8') // 解密
    const user = await Users.findOne({
        username: username,
        password: decryptPassword
    })
    if (user) {
        ctx.session.userInfo = JSON.stringify({
            username: user.username,
            isAdmin: user.isAdmin
        })
        ctx.body = { code: 1, msg: {
            username: user.username,
            isAdmin: user.isAdmin
        } }
    } else {
        ctx.body = { code: 0, msg: '账号密码错误' }
    }
})

router.get('/signout', (ctx) => {
    ctx.session.userInfo = null
    if (!ctx.session.userInfo) {
        ctx.body = { code: 1, msg: '成功退出' }
    } else {
        ctx.body = { code: 0, msg: '退出失败' }
    }
})

router.post('/change', async ctx => {
    const { password } = ctx.request.body
    const { isAdmin } = JSON.parse(ctx.session.userInfo)
    const decryptPassword = key.decrypt(password, 'utf8') // 解密
    if (isAdmin) {
        const info = await Users.findOne({
            isAdmin,
            password: decryptPassword
        })
        if (info) {
            ctx.body = { code: 0, msg: '修改的密码不能和原密码相同！' }
            return
        }
        const res = await Users.updateOne({ isAdmin }, { password: decryptPassword })
        if(Object.values(res).every(item => item)) {
            ctx.body = { code: 1, msg: '修改成功' }
        } else {
            ctx.body = { code: 0, msg: '修改失败' }
        }
    } else {
        ctx.body = { code: 0, msg: '非法入侵，靠' }
    }
    
})

module.exports = router

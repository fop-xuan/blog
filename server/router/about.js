const router = require('koa-router')()
const about = require('../dbs/models/about')

router.prefix('/about')

router.post('/update', async (ctx) => {
    const { content } = ctx.request.body
    try {
        const info = await about.findOneAndUpdate({ content })
        if (info) {
            ctx.body = { code: 1, msg: '修改成功'  }
            return
        }
        about.create({ content }).then(() => {
            ctx.body ={ code: 1, msg: '修改成功'  }
        }).catch(() => {
            ctx.body ={ code: 0, message: '修改失败' }
        })
    } catch {
        ctx.body = { code: 0, message: '查询失败' }
    }
})

router.get('/data', async (ctx) => {
    const contents = await about.findOne({}, { _id: 0 })
    if (contents) {
        ctx.body = { code: 1, msg: 'ok', contents }
    } else {
        ctx.body = { code: 0, msg: 'err' }
    }
})


module.exports = router

const router = require('koa-router')()
const lables = require('../dbs/models/lables')

router.prefix('/lables')

router.post('/add', async (ctx) => {
    const { lable } = ctx.request.body
    const reg = new RegExp('\\b' + lable + '\\b', 'i')  // 不分大小写
    const info = await lables.findOne({ 'lable': reg })
    if (!info) {
        await lables.create({ lable })
        ctx.body = { code: 1, type: 'success', msg: '添加成功' }
    } else {
        ctx.body = { code: 0, type: 'error', msg: '标签已经存在' }
    }
    
})

router.get('/list', async (ctx) => {
    const list = await lables.find().sort({ _id: -1 })
    if (list) {
        ctx.body = { code:1, msg: 'ok', list: list}
    } else {
        ctx.body = { code:0, msg: 'error', list: []}
    }  
})

router.post('/edit', async (ctx) => {
    const { lable, _id } = ctx.request.body
    const reg = new RegExp('\\b' + lable + '\\b', 'i')  // 不分大小写
    const info = await lables.findOne({ 'lable': reg })
    if (info) {
        ctx.body = { code: 0, msg: '标签已经存在' }
        return
    }
    const result = await lables.updateOne({ _id },{ lable })
    if (result) {
        ctx.body = { code: 1, msg: '更新成功' }
    } else {
        ctx.body = { code: 0, msg: '更新失败' }
    }
})

router.post('/delete', async (ctx) => {
    const { _id } = ctx.request.body
    await lables.deleteOne({ _id })
    ctx.body = { code: 1, msg: 'ok' }
})

router.get('/count', async (ctx) => {
    const count = await lables.countDocuments()
    ctx.body = { code: 1, count }
})
module.exports = router
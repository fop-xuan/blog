const router = require('koa-router')()
const articles = require('../dbs/models/articles')

router.prefix('/articles')

router.post('/add', async (ctx) => {
    const contents = ctx.request.body
    const count = await articles.countDocuments()
    try {
        await articles.create({
            ...contents,
            id: count
        })
        ctx.body = { code: 1, msg: '新增成功', type: 'success' }
    } catch {
        ctx.body = { code: 0, msg: '新增失败', type: 'error' }
    }
})

router.get('/list', async (ctx) => {
    const { limit, page } = ctx.request.query
    const skip = (page  - 1 ) * limit
    try {
        const info = await articles.find({}, { comments: 0, postYear: 0 })
        .populate('lable')
        .limit(parseInt(limit))
        .skip(skip)
        .sort({ _id: -1 })
        ctx.body = { code: 1, msg: 'ok', list: info }
    } catch {
        ctx.body = { code: 0, msg: 'err', }
    }
})

router.post('/edit', async (ctx) => {
    const contents = ctx.request.body
    const info = await articles.updateOne({ _id: contents._id }, {
        content: contents.content,
        description: contents.description,
        imgUrl: contents.imgUrl,
        lable: contents.lable,
        title: contents.title
    })
    if (Object.values(info).every(item => item)) {
        ctx.body = { code: 1, msg: '更新成功', type: 'success' }
    } else {
        ctx.body = { code: 0, msg: '更新失败', type: 'error' }
    }
})

router.post('/delete', async (ctx) => {
    const { _id } = ctx.request.body
    const info = await articles.deleteOne({ _id })
    if (Object.values(info).every(item => item)) {
        ctx.body = { code: 1, msg: '删除成功', type: 'success' }
    } else {
        ctx.body = { code: 0, msg: '删除失败', type: 'error' }
    }
})

router.get('/count', async (ctx) => {
    const count = await articles.countDocuments()
    ctx.body = { code: 1, count }
})

router.get('/simple-content', async (ctx) => {
    const { page, limit, lable } = ctx.request.query
    const skip = (page  - 1 ) * limit || 0
    let queryCondition = {}
    if (lable) {
        queryCondition.lable =  lable
    }
    try {
        const data = await articles.find({}, { content: 0, comments: 0, postYear: 0 })
        .limit(parseInt(limit))
        .skip(skip)
        .populate('lable')
        .sort({ _id: -1 })
        .where(queryCondition)
        ctx.body = { code: 1, msg: '成功', data }
    } catch {
        ctx.body = { code: 0, msg: '失败' }
    }
})

router.get('/clickRank', async (ctx) => {
    const ranks = await articles.find({}, { title: 1 }).limit(5)
    ctx.body = { code: 1, msg: '成功', ranks }
})

router.get('/determine-content', async (ctx) => {
    const { _id } = ctx.request.query
    try {
        const contents = await articles
        .findOneAndUpdate({ _id },{ $inc: { readNum: 1 } },{ new: true, select: { imgUrl: 0, comments: 0 } })
        .populate('lable')
        const { postTime } = contents
        const next = articles.findOne({ postTime: { $gt: postTime }}, { title: 1 })
        const prev = articles.findOne({ postTime: { $lt: postTime }}, { title: 1 }).sort({ _id: -1 })
        const nextPrevArr = await Promise.all([next, prev])
        ctx.body = { code: 1, msg: '成功', contents, nextPrevArr }
    } catch {
        ctx.body = { code: 0, msg: '失败' }
    }
})

router.get('/comments-list', async (ctx) => {
    const { _id } = ctx.request.query
    try {
        const { comments } =  await articles.findById({ _id }, { comments: 1, _id: 0 })
        ctx.body = { code: 1, msg: '成功', comments }
    } catch {
        ctx.body = { code: 0, msg: '失败' }
    }
})

router.post('/post-comment', async (ctx) => {
    const { _id, commentValue } = ctx.request.body
    const { username } = JSON.parse(ctx.session.userInfo)
    try {
        const info = await articles.findOneAndUpdate({ _id }, {
            $push: { comments: {
                commentValue,
                commentUser: username
            }}
        }, { new: true })
        const id = info.comments.find(item => item.commentValue === commentValue && item.commentUser === username )._id
        ctx.body = { code: 1, msg: '成功', id }
    } catch {
        ctx.body = { code: 0, msg: '失败' }
    }
})

router.post('/post-reply', async (ctx) => {
    const { replyValue, replyTarget, _id, commentId } = ctx.request.body
    const { username } = JSON.parse(ctx.session.userInfo)
    try {
        const { comments } = await articles.findOne({ _id }, { comments: 1, _id: 0 })
        const index = comments.findIndex(comment => comment._id.toString() === commentId)
        comments[index].replys.push({
            replyValue,
            replyTarget,
            replyUser: username
        })
        const info = await articles.updateOne({ _id }, { comments: comments })
        if (Object.values(info).every(item => item)) {
            ctx.body = { code: 1, msg: '成功' }
        } else {
            ctx.body = { code: 0, msg: '失败' }
        }
    } catch {
        ctx.body = { code: 0, msg: '失败' }
    }
})

router.get('/all-comments', async (ctx) => {
    try {
        const info = await articles.find({}, { comments: 1, title: 1 })
        ctx.body = { code: 1, msg: '成功', info }
    } catch {
        ctx.body = { code: 0, msg: '失败' }
    }
})

router.post('/delete-comment', async (ctx) => {
    const { commentId, _id } = ctx.request.body
    try {
        await articles.updateOne({ _id }, {
            $pull: { comments: { _id: commentId } }
        })
        ctx.body = { code: 1, msg: '成功' }
    } catch {
        ctx.body = { code: 0, msg: '失败' }
    }
})

router.post('/delete-reply', async (ctx) => {
    const { commentId, _id, replyId } = ctx.request.body
    try {
        const { comments } = await articles.findOne({ _id }, { comments: 1, _id: 0 })
        const commentIndex = comments.findIndex(comment => comment._id.toString() === commentId)
        const index = comments[commentIndex].replys.findIndex(reply => reply._id.toString() === replyId)
        comments[commentIndex].replys.splice(index, 1)
        const info = await articles.updateOne({ _id }, { comments: comments })
        if (Object.values(info).every(item => item)) {
            ctx.body = { code: 1, msg: '成功' }
        } else {
            ctx.body = { code: 0, msg: '失败' }
        }
    } catch {
        ctx.body = { code: 0, msg: '失败' }
    }
})

router.get('/year-articles', async (ctx) => {
    const { time } = ctx.query
    const reg = new RegExp(time)
    try {
        const info = await articles.find({ postYear: reg }, { title: 1, postTime: 1 }).sort({ postTime: -1 })
        if (info.length) {
            ctx.body = { code: 1, msg: '成功', info }
        } else {
            ctx.body = { code: 0, msg: '失败' }
        }
    } catch {
        ctx.body = { code: 0, msg: '失败' }
    }
})

router.get('/search', async (ctx) => {
    const { searchVal } = ctx.request.query
    const reg = new RegExp(searchVal, 'i')
    const info = await articles.find({
        $or : [
            { description : { $regex : reg } },
            { title : { $regex : reg } },
            { content : { $regex : reg } }
        ]
    }, { description: 1, title: 1, lable: 1 }).populate('lable')
    ctx.body = { code: 1, msg: '成功', info }
})

module.exports = router

const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const bodyparser = require('koa-bodyparser')
const mongoose = require('mongoose')
const session = require('koa-generic-session')
const Redis = require('koa-redis')
const app = new Koa()

const dbConfig = require('./dbs/config/config')
const users = require('./router/users')
const lables = require('./router/lables')
const qiniu = require('./router/qiniu')
const articles = require('./router/articles')
const about = require('./router/about')
// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')

app.keys = ['keys', 'keyskeys'] // 对session做加密处理 值可以是任意字符串


app.use(session({ // 把session作为中间件使用
  key: 'z', // 存储的名称
  prefix: 'zpr', // 储存的数据key值的前缀
  store: new Redis() // session的存储方式 使用redis存储
}))
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))

mongoose.connect(dbConfig.dbs, { useNewUrlParser:true, useFindAndModify: false }, (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('mongodb connect success!')
  }
})

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST,
    port = process.env.PORT
  } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }
  app.use(users.routes(), users.allowedMethods())
  app.use(lables.routes(), lables.allowedMethods())
  app.use(qiniu.routes(), qiniu.allowedMethods())
  app.use(articles.routes(), articles.allowedMethods())
  app.use(about.routes(), about.allowedMethods())
  app.use(ctx => {
    ctx.req.session = ctx.session // 为了在客户端得到ctx.session
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()

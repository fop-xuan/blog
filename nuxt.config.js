
module.exports = {
  mode: 'universal',
  server: {
    host: '127.0.0.1',
    port: 80
  },
  /*
  ** Headers of the page
  */
  head: {
    title: '周炫的个人博客',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1,minimum-scale=1,user-scalable=no' },
      { hid: 'description', name: 'description', content: '周炫的个人网站原创博客首页,记录生活的瞬间,分享学习的心得,感悟生活,留住感动,静静寻觅生活的美好,博客交流,前端开发,开发,交流,学习' },
      { hid: 'keywords', name: 'keywords', content: '博客,web前端工程师,前端开发,前端简历,IT,技术,博客,WEB,vue,node,互联网,自媒体,新鲜科技,科技博客,独立博客,个人博客,原创博客,博客系统,原创独立博客' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#4fc08d' },
  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    { 'src': '@/assets/main.less', lang: 'less' }
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '@/plugins/element-ui', ssr: true },
    { src: '@/plugins/vue-particles', ssr: false },
    { src: '@/plugins/mavon-editor', ssr: false },
    '@/plugins/moment',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
  ],
  router: {
    scrollBehavior: function (to, from, savedPosition) {
      if (to.name === 'article-id') {
        return { x: 0, y: 0 }
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    },
    babel: {
      'plugins': [
        [
          'component',
          {
            'libraryName': 'element-ui',
            'styleLibraryName': 'theme-chalk'
          }
        ]
      ],
      'comments': true
    }
  }
}

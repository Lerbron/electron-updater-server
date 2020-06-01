const Koa = require('koa')
const Router = require('koa-router')
const serve = require('koa-static-server')
const compareVersions = require('compare-versions')

const app = new Koa()
const router = new Router()

app.use(serve({
  rootDir: 'public',
  rootPath: '/public'
}))

const getNewVersions = (version) => {
  const newVersion = {
    name: '0.1.1',
    pub_date: '2020-05-30T21:30:30+1:00',
    notes: "新增功能",
    url: 'http://127.0.0.1:3385/public/electronVue-0.1.1-mac.zip'
  }

  if (compareVersions(newVersion.name, version, ">")) {
    return newVersion
  }
  return null
}

router.get('/darwin', (ctx, next) => {
  // 处理mac更新
  let {
    version
  } = ctx.query
  let newVersion = getNewVersions(version)
  if (newVersion) {
    ctx.body = newVersion
    return null
  } else {
    ctx.status = 204
  }
})

router.get('/win32/RELEASES', (ctx, next) => {
  let newVersion= getNewVersions(ctx.query.version)
  if (newVersion) {
    // windows打包的release信息
    ctx.body= 'hello world'
  } else {
    ctx.body= 204
  }
})

// router.get('/win32/*.nupkg', (ctx, next) => {
//   ctx.redirect(`/public/${ctx.params[0]}.nupkg`)
// })

app.use(router.routes())
  .use(router.allowedMethods())

app.listen(3385)
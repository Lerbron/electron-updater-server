const Koa = require('koa')
const Router = require('koa-router')
const serve = require('koa-static-server')
const compareVersions = require('compare-versions')
const fs= require('fs')

const app = new Koa()
const router = new Router()

const getNewVersions = (version) => {
  const newVersion = {
    name: '1.0.2',
    pub_date: '2020-05-30T21:30:30+1:00',
    notes: "新增功能",
    url: 'http://127.0.0.1:3385/public/electronVue-0.1.1-mac.zip'
  }

  if (compareVersions.compare(newVersion.name, version, ">")) {
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

const newReleaseInfo= fs.readFileSync('./public/RELEASES', {encoding: 'utf8'})

router.get('/win32/RELEASES', (ctx, next) => {
  let newVersion= getNewVersions(ctx.query.version)
  if (newVersion) {
    // windows打包的release信息
    ctx.body= newReleaseInfo
  } else {
    ctx.body= 204
  }
})

router.get(/\/win32\/.+\.nupkg/, (ctx, next) => {
  let arr= ctx.request.url.split('/')
  let pathUrl= arr[arr.length - 1]
  ctx.redirect(`/public/${pathUrl}`)
})

app.use(serve({
  rootDir: 'public',
  rootPath: '/public'
}))

app.use(router.routes())
  .use(router.allowedMethods())

app.listen(3385)
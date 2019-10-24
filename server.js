const Koa = require('koa')
const path = require('path')
const fs = require('fs')

const app = new Koa()
app.use(require('koa-static')('./dist'));

const content = fs.readFileSync(path.resolve(__dirname, 'dist/index.html'), 'utf8');

app.use(function(ctx) {
  ctx.response.body = content
})

app.listen(80);
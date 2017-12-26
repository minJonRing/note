const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-session-minimal')
const mongoose = require('mongoose')

const db = mongoose.connect('mongodb://localhost:27017/note')

const user = require('./routes/user')
const index = require('./routes/index')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'ejs'
}))

// logger
app.use(async(ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

//session
app.use(session({
    key: 'session-id',
    cookie: {
        domain: "localhost",
        path: '/',
        maxAge: 1000 * 30,
        httpOnly: true,
        overwrite: false
    }
}))

let isSession = async(ctx, next) => {
    if (!ctx.session.id) {
        await next()
    } else {
        await ctx.redirect('/')
    }
}

// routes
app.use(index.routes(), index.allowedMethods())
app.use(user.routes(), user.allowedMethods())

// 404
app.use(async(ctx) => {
    if (ctx.status == 404) {
        await ctx.render('error');
    }
})

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app
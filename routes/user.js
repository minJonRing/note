const router = require('koa-router')()

router.prefix('/user')

let isSession = async(ctx, next) => {
    if (ctx.session.id) {
        await next()
    } else {
        await ctx.redirect('/')
    }
}

router.get('/', isSession, async(ctx, next) => {
    await ctx.render('user')
})



module.exports = router
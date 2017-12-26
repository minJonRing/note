const router = require('koa-router')()
const multer = require('koa-multer')
const formidable = require('formidable')
const path = require('path')
const article = require('../schema/article')

let storage = multer.diskStorage({
    destination: function(req, file, cd) {
        cd(null, 'public/upload/imges/')
    },
    filename: function(req, file, cd) {
        let fileFormat = (file.originalname).split(".");
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})

let upload = multer({ storage: storage })

router.get('/', async(ctx, next) => {
    await ctx.render('index')
}).get('/editor', async(ctx, next) => {
    await ctx.render('user')
}).post('/upload/img', async(ctx, next) => {
    let imgurl = [];
    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = path.join(process.cwd() + "/public/upload/images");
    form.keepExtensions = true;
    form.multiples = true;
    await new Promise((resolve, reject) => {
        form.parse(ctx.req, async(err, fields, files) => {
            if (err) { throw err; return }
            if (files.imgs.length) {
                for (img of files.imgs) {
                    let url = img.path.replace(/(D:\\vue\\note\\public)/, '').replace(/(\\)/g, '/');
                    imgurl.push(url)
                }
            } else {
                let url = files.imgs.path.replace(/(D:\\vue\\note\\public)/, '').replace(/(\\)/g, '/');
                imgurl.push(url)
            }
            resolve(imgurl)
        })
    })
    await next()
    ctx.body = { errno: 0, data: imgurl }
}).post('/opload/article', async(ctx, next) => {
    let form = new formidable.IncomingForm();
    var _data;
    await new Promise(function(resolve, reject) {
        form.parse(ctx.req, async function(err, fields, files) {
            if (err) { throw err; return; }
            let data = JSON.parse(fields.data);
            article.create(data, async(err, db) => {
                if (!err && db) {
                    resolve(_data = db)
                }
            })
        });
    })
    await next();
    ctx.body = { code: _data };
}).post('/get/article', async(ctx, next) => {
    let data;
    await new Promise((resolve, reject) => {
        article.find({}, async(err, db) => {
            if (!err && db) {
                resolve(data = db)
            }
        })
    })
    await next()
    ctx.body = { code: data }
}).post('/remove', async(ctx, next) => {
    let form = new formidable.IncomingForm();
    await new Promise(function(resolve, reject) {
        form.parse(ctx.req, async function(err, fields, files) {
            if (err) { throw err; return; }
            let _id = fields._id;
            article.findByIdAndRemove(_id, async(err, db) => {
                if (!err && db) {
                    resolve()
                }
            })
        });
    })
    await next()
    ctx.body = { code: 200 }
}).post('/updata', async(ctx, next) => {
    let form = new formidable.IncomingForm();
    await new Promise(function(resolve, reject) {
        form.parse(ctx.req, async function(err, fields, files) {
            if (err) { throw err; return; }
            let _id = fields._id;
            let data = JSON.parse(fields.data);
            article.findByIdAndUpdate(_id, data, async(err, db) => {
                if (!err && db) {
                    resolve()
                }
            })
        });
    })
    await next()
    ctx.body = { code: 200 }
})

router.post('/tqr', async(ctx, next) => {
    console.log(ctx)
    let arr = []
    for (let i of ctx.request.body.oc) {
        console.log(i)
        arr.push(i)
    }
    await next()
    ctx.body = arr
}).get('/tqr', async(ctx, next) => {
    await ctx.render('js')
})
module.exports = router
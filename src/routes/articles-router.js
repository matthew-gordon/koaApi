const Router = require('koa-router')
const ctrl = require('controllers').articles
const router = new Router()

router.param('slug', ctrl.bySlug)

router.get('/articles', ctrl.get)

router.get('/articles/:slug', ctrl.getOne)

module.exports = router.routes()

const Router = require('koa-router')
const ctrl = require('controllers').articles
const router = new Router()

const auth = require('middleware/auth-required-middleware')


router.param('slug', ctrl.bySlug)

router.get('/articles', ctrl.get)
router.post('/articles', auth, ctrl.post)

router.get('/articles/:slug', ctrl.getOne)

module.exports = router.routes()

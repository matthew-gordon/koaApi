const Router = require('koa-router')
const ctrl = require('controllers').articles
const router = new Router()

const auth = require('middleware/auth-required-middleware')

router.param('slug', ctrl.bySlug)

// ARTICLES API
router.get('/articles', ctrl.get)
router.get('/articles/:slug', ctrl.getOne)
router.post('/articles', auth, ctrl.post)
router.put('/articles/:slug', auth, ctrl.put)
router.del('/articles/:slug', auth, ctrl.del)

router.post('/articles/:slug/favorite', auth, ctrl.favorite.post)

module.exports = router.routes()

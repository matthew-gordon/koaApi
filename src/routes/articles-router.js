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

// FAVORITES API
router.post('/articles/:slug/favorite', auth, ctrl.favorite.post)
router.del('/articles/:slug/favorite', auth, ctrl.favorite.del)

module.exports = router.routes()

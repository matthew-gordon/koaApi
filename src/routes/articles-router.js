const Router = require('koa-router')
const ctrl = require('controllers').articles
const router = new Router()

const auth = require('middleware/auth-required-middleware')

// CUSTOM PARAMS
router.param('slug', ctrl.bySlug)
router.param('comment', ctrl.comments.byComment)

// FEED API
router.get('/articles/feed', auth, ctrl.feed.get)

// ARTICLES API
router.get('/articles', ctrl.get)
router.get('/articles/:slug', ctrl.getOne)
router.post('/articles', auth, ctrl.post)
router.put('/articles/:slug', auth, ctrl.put)
router.del('/articles/:slug', auth, ctrl.del)

// FAVORITES API
router.post('/articles/:slug/favorite', auth, ctrl.favorite.post)
router.del('/articles/:slug/favorite', auth, ctrl.favorite.del)

// COMMENTS API
router.get('/articles/:slug/comments', ctrl.comments.get)
router.post('/articles/:slug/comments', auth, ctrl.comments.post)
router.del('/articles/:slug/comments/:comment', auth, ctrl.comments.del)

module.exports = router.routes()

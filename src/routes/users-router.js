const Router = require('koa-router')
const ctrl = require('controllers').users
const router = new Router()

const auth = require('middleware/auth-required-middleware')

// AUTH API

// - LOGIN
router.post('/users/login', ctrl.login)

// - REGISTER
router.post('/users', ctrl.post)

// - GET USER
router.get('/user', auth, ctrl.get)

// - UPDATE USER
router.put('/user', auth, ctrl.put)

module.exports = router.routes()

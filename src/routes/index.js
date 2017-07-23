const Router = require('koa-router');
const router = new Router();
const api = new Router();

router.use('/api', api.routes());

module.exports = router;

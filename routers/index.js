/**
 * 路由彙總：掛載 sit 相關路由（health-check、run-test）。
 */
const router = require('koa-router')();
const sitRoutes = require('./sit');

router.use(sitRoutes.routes(), sitRoutes.allowedMethods());
module.exports = router;

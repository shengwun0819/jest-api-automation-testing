/**
 * SIT 路由：GET /health-check（健康檢查）、GET /run-test（單次執行 Jest）。
 */
const router = require('koa-router')();
const RunTest = require('../controllers/run-test');

const healthCheck = async (ctx) => {
  ctx.body = 'OK';
};

router.get('/health-check', healthCheck).get('/run-test', RunTest);

module.exports = router;

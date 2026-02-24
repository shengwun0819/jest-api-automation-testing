/**
 * SIT 路由：GET /health-check（健康檢查）、GET /run-test（單次執行 Jest，需 JWT 或略過）。
 */
const router = require('koa-router')();
const RunTest = require('../controllers/run-test');
const ValidateJWT = require('../middleware/validate-jwt');

const healthCheck = async (ctx) => {
  ctx.body = 'OK';
};

router.get('/health-check', healthCheck).get('/run-test', ValidateJWT, RunTest);

module.exports = router;

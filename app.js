require('dotenv').config();
/**
 * Koa 應用：掛載路由、錯誤處理，供 server.js 啟動。
 */
const Koa = require('koa');
const mount = require('koa-mount');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const path = require('path');

const routers = require('./routers/index');
const { logger } = require('./libs/logger');

const app = new Koa();
app.use(bodyParser());
app.use(routers.routes()).use(routers.allowedMethods());
app.use(mount('/reports', serve(path.join(__dirname, 'test_report'))));

app.on('error', (e) => logger.error(e.message));

module.exports = app;

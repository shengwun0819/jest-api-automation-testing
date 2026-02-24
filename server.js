/**
 * HTTP server 入口：載入 .env、讀取 config 的 PORT，啟動 Koa app 並 listen。
 */
require('dotenv').config();
const app = require('./app');
const { logger } = require('./libs/logger');
const config = require('./configs/config');

app.listen(config.PORT, '0.0.0.0');
logger.info(`API SIT server listening on http://localhost:${config.PORT}`);
logger.info(`STAGE=${config.STAGE}`);

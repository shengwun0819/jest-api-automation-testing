/**
 * JWT 驗證 middleware：保護 /run-test。未設 API_CALLER_PUBLIC_KEY 或 CODEBUILD_CI 時略過驗證。
 */
const jwt = require('jsonwebtoken');
const config = require('../configs/config.js');
const { logger } = require('../libs/logger');

module.exports = async (ctx, next) => {
  ctx.req.setTimeout(0);
  try {
    if (process.env.CODEBUILD_CI || !config.API_CALLER_PUBLIC_KEY) {
      return await next();
    }
    const { authorization } = ctx.request.headers;
    const token = (authorization || '').replace('Bearer ', '');
    jwt.verify(token, config.API_CALLER_PUBLIC_KEY, { algorithms: ['ES256', 'RS256'] });
    await next();
  } catch (e) {
    logger.error(e.message);
    ctx.status = 403;
    ctx.body = 'Forbidden';
  }
};

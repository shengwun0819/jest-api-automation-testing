/**
 * GET /run-test 的 controller：在 Worker 中執行 Jest 一次，回傳 pass/fail 與報告檔名。
 * 逾時 90 秒未完成會回 504。
 */
const { Worker } = require('worker_threads');
const path = require('path');

const { logger } = require('../libs/logger');

const RUN_TEST_TIMEOUT_MS = 90 * 1000; // 90 秒

module.exports = async (ctx) => {
  const stage = ctx.request.query.stage || 'dev';
  logger.log(`Run-test requested, stage=${stage}`);

  const testWorker = new Worker(path.join(__dirname, '../libs/test-woker.js'), {
    env: {
      ...process.env,
      STAGE: stage,
      USE_HTML_REPORTER: 'true',
    },
  });

  let testRes;
  try {
    testRes = await Promise.race([
      new Promise((res) => testWorker.once('message', res)),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Test run timed out.')), RUN_TEST_TIMEOUT_MS)
      ),
    ]);
  } catch (err) {
    testWorker.terminate();
    ctx.status = 504;
    ctx.body = { pass: false, error: err.message };
    return;
  }

  const numFailed = testRes.numFailedTests || 0;
  const numFailedSuites = testRes.numFailedTestSuites || 0;
  const pass = numFailed === 0 && numFailedSuites === 0;

  logger.log(
    `Run-test finished: pass=${pass}, failedTests=${numFailed}, failedSuites=${numFailedSuites}`
  );

  ctx.status = pass ? 200 : 500;
  ctx.body = {
    pass,
    numFailedTests: numFailed,
    numFailedTestSuites: numFailedSuites,
    reportFileName: testRes.reportFileName || null,
  };
};

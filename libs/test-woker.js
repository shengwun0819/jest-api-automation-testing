/**
 * Jest 測試 Worker：被 run-test controller 呼叫，在子行程中執行 Jest 並將結果 postMessage 回主行程。
 * 可選產生 HTML 報告（USE_HTML_REPORTER=true）。
 */
const { parentPort } = require('worker_threads');
const path = require('path');
const jest = require('jest');
const { logger } = require('./logger');

const projectRoot = path.join(__dirname, '..');

const jestOptions = {
  projects: [projectRoot],
  testNamePattern: '',
  verbose: true,
  runInBand: true,
  forceExit: true, // 避免 open handles 導致 Jest 不結束
};

(async () => {
  try {
    logger.debug('Test worker running');
    logger.debug(process.env.STAGE);

    const useHtmlReporter = process.env.USE_HTML_REPORTER === 'true';

    if (useHtmlReporter) {
      const now = new Date();
      const datetime = now.toISOString().slice(0, 19).replace(/:/g, '-').replace('T', '_');
      const reportDir = path.join(__dirname, '../test_report');
      const { results } = await jest.runCLI(
        {
          ...jestOptions,
          reporters: [
            [
              'jest-html-reporter',
              {
                includeFailureMsg: true,
                includeConsoleLog: true,
                pageTitle: `API SIT Report ${datetime}`,
                outputPath: path.join(reportDir, `report_${datetime}.html`),
              },
            ],
          ],
        },
        [projectRoot]
      );
      const obj = JSON.parse(JSON.stringify(results));
      obj.reportFileName = `report_${datetime}.html`;
      parentPort.postMessage(obj);
    } else {
      const { results } = await jest.runCLI({ ...jestOptions, reporters: [] }, [projectRoot]);
      parentPort.postMessage(JSON.parse(JSON.stringify(results)));
    }
  } catch (err) {
    console.error('Test worker error:', err);
    parentPort.postMessage({
      numFailedTests: 1,
      numFailedTestSuites: 1,
      reportFileName: null,
      error: err.message,
    });
  }
  process.exit();
})();

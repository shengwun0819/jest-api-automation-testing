/**
 * Jest 設定 for CI（舊版 jest-html-reporter）：與 package.json 的 jest 設定一致，輸出到 test_report/
 * 目前 CI 已改為使用 jest.config.allure.js + allure-summary-reporter。
 */
const base = require('./package.json').jest;

module.exports = {
  ...base,
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        includeFailureMsg: true,
        includeConsoleLog: true,
        pageTitle: 'API SIT Report (CI)',
        outputPath: 'test_report/jest-report-ci.html',
      },
    ],
  ],
};

/**
 * Jest 設定 for CI：與 package.json 的 jest 設定一致，並加上 jest-html-reporter 輸出到 reports/
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
        outputPath: 'reports/jest-report-ci.html',
      },
    ],
  ],
};

/**
 * Jest 設定 for Allure 報告：使用 allure-jest 環境與 jest-circus，結果寫入 allure-results。
 * 測試結束後由 allure-summary-reporter 自動產生報告至 test_report/report_{commit}_{result}_{time}.html（對齊 pytest_terminal_summary）。
 */
const base = require('./package.json').jest;

module.exports = {
  ...base,
  testRunner: 'jest-circus/runner',
  testEnvironment: 'allure-jest/node',
  reporters: ['default', '<rootDir>/reporters/allure-summary-reporter.js'],
};

/**
 * 專案設定：從環境變數讀取 PORT、TARGET_BASE_URL、STAGE 等，供測試與 server 使用。
 */
module.exports = {
  PORT: process.env.PORT || '3000',
  TARGET_BASE_URL: (process.env.TARGET_BASE_URL || 'http://127.0.0.1:5050').replace(/\/$/, ''),
  REQUEST_TIMEOUT: parseInt(process.env.REQUEST_TIMEOUT, 10) || 10000,
  STAGE: process.env.STAGE || 'dev',
};

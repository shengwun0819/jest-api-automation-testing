/**
 * 專案設定：從環境變數讀取 PORT、TARGET_BASE_URL、STAGE 等，供測試與 server 使用。
 */
module.exports = {
  PORT: process.env.PORT || '3000',
  API_CALLER_PUBLIC_KEY: process.env.API_CALLER_PUBLIC_KEY || '',
  TARGET_BASE_URL: (process.env.TARGET_BASE_URL || 'https://jsonplaceholder.typicode.com').replace(
    /\/$/,
    ''
  ),
  REQUEST_TIMEOUT: parseInt(process.env.REQUEST_TIMEOUT, 10) || 10000,
  STAGE: process.env.STAGE || 'dev',
};

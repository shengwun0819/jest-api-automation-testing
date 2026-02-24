/**
 * 不同環境（dev / test）的 target API domain。
 * 可透過環境變數 OVERRIDE_DOMAIN 或 TARGET_BASE_URL 覆寫；預設為範例公眾 API。
 */
module.exports = {
  dev: {
    TARGET_DOMAIN_NAME: process.env.OVERRIDE_DOMAIN || process.env.TARGET_BASE_URL,
  },
  test: {
    TARGET_DOMAIN_NAME: process.env.OVERRIDE_DOMAIN || process.env.TARGET_BASE_URL,
  },
};

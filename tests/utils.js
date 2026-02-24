/**
 * 測試輔助：logData（可選記錄請求）、sleep；base URL 由 config / stage-env 決定，供 api-client 使用。
 */
const logData = async (path, startTime, error) => {
  if (process.env.LOG_REQUEST) {
    const elapsed = Date.now() - startTime;
    const status = error ? (error.response && error.response.status) || 'N/A' : 200;
    const message = error ? error.message || '' : '';
    console.log(
      `[Response] path: ${path}, time: ${elapsed}ms, status: ${status}, message: ${message}`
    );
  }
};

module.exports = {
  logData,
};

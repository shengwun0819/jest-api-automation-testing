/**
 * 簡易 logger：log / debug / info / error，供 server 與 Worker 使用。
 */
exports.logger = {
  log: (data) => console.log(data),
  debug: (data) => {
    if (process.env.DEV) console.debug(data);
  },
  info: (data) => console.info(data),
  error: (e) => console.error(e),
};

/**
 * 測試用 HTTP client：依 config 的 TARGET_BASE_URL 呼叫 GET /posts、/users 等，供 Jest 測試使用。
 */
const axios = require('axios');
const $ = require('../configs/config.js');
const stageEnv = require('../configs/stage-env.js')[$.STAGE];
const { logData } = require('./utils.js');

const timeout = $.REQUEST_TIMEOUT;
const baseURL = (stageEnv.TARGET_DOMAIN_NAME || $.TARGET_BASE_URL).replace(/\/$/, '');

const errorParser = (e) => {
  if (e.response && e.response.data) {
    const err = e.response.data;
    throw {
      status: e.response.status,
      data: err,
      message: err.message || err.title || 'Request failed',
    };
  }
  throw e.toJSON ? e.toJSON() : e;
};

const get = async (path, config = {}) => {
  const url = path.startsWith('http') ? path : `${baseURL}${path}`;
  const startTime = Date.now();
  try {
    const ret = await axios.get(url, { timeout, ...config });
    logData(`GET ${path}`, startTime);
    return ret;
  } catch (e) {
    logData(`GET ${path}`, startTime, e);
    errorParser(e);
  }
};

const getPosts = async () => get('/posts');
const getPostById = async (id) => get(`/posts/${id}`);
const getUsers = async () => get('/users');

module.exports = {
  get,
  getPosts,
  getPostById,
  getUsers,
  baseURL,
};

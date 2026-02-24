/**
 * Jest globalSetup：在所有測試檔之前執行一次；此專案僅 log 目標 API，可擴充為環境檢查或設定。
 */
require('dotenv').config();

const $ = require('./configs/config');
const stages = require('./configs/stage-env');
const { logger } = require('./libs/logger');
const stageEnv = stages[$.STAGE];

module.exports = async () => {
  const target =
    stageEnv && stageEnv.TARGET_DOMAIN_NAME ? stageEnv.TARGET_DOMAIN_NAME : $.TARGET_BASE_URL;
  logger.log(`API SIT target: ${target}`);
};

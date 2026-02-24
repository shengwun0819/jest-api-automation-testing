/**
 * 驗證專案 config 與 stage-env：STAGE 為 dev/test、TARGET_DOMAIN_NAME 存在。
 */
const $ = require('../configs/config');
const stageEnv = require('../configs/stage-env');

describe('Config', () => {
  it('should have STAGE', () => {
    expect($.STAGE).toBeDefined();
    expect(['dev', 'test'].includes($.STAGE)).toBe(true);
  });

  it('should have TARGET_BASE_URL or stage env', () => {
    const env = stageEnv[$.STAGE];
    expect(env).toBeDefined();
    expect(env.TARGET_DOMAIN_NAME).toBeDefined();
    expect(typeof env.TARGET_DOMAIN_NAME).toBe('string');
  });
});

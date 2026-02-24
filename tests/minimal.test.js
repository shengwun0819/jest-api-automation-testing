/**
 * 最小測試：不 require 任何專案 config 或 api-client，只驗證 Jest 能執行。
 * 若此檔能跑過，代表問題在其它檔或主 jest 設定。
 */
describe('minimal', () => {
  it('passes', () => {
    expect(1).toBe(1);
  });
});

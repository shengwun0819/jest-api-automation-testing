/**
 * 簡單 smoke test：不依賴 config 或 API，確認 Jest 可執行基本斷言。
 */
describe('Simple test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2);
  });
});

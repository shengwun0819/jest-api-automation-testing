/**
 * GET /users 相關測試：驗證回傳陣列與欄位。目標為 TARGET_BASE_URL
 */
const { getUsers } = require('./api-client.js');

jest.setTimeout(30000);

describe('GET /users (JSONPlaceholder example)', () => {
  it('(POSITIVE) should get users list', async () => {
    const response = await getUsers();
    const { data } = response;
    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    data.forEach((user) => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('username');
    });
  });
});

/**
 * GET /posts 相關測試：列表、單筆、404。目標為 TARGET_BASE_URL（可為 JSONPlaceholder 或 mock_server）。
 */
const { getPosts, getPostById } = require('./api-client.js');

jest.setTimeout(30000);

describe('GET /posts (JSONPlaceholder example)', () => {
  it('(POSITIVE) should get posts list', async () => {
    const response = await getPosts();
    const { data } = response;
    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    data.forEach((post) => {
      expect(post).toHaveProperty('userId');
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('body');
    });
  });

  it('(POSITIVE) should get single post by id', async () => {
    const response = await getPostById(1);
    const { data } = response;
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('userId');
    expect(data).toHaveProperty('id', 1);
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('body');
  });

  it('(NEGATIVE) should return 404 for non-existent post', async () => {
    await expect(getPostById(99999)).rejects.toMatchObject({ status: 404 });
  });
});

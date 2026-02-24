/**
 * Mock API Server（與 pytest-automation-testing 概念一致）
 * 提供 GET /posts、GET /posts/:id、GET /users，不依賴外網。
 * 啟動：npm run mock 或 node mock_server/server.js
 */
const http = require('http');

const PORT = Number(process.env.MOCK_PORT) || 5050;

const MOCK_POSTS = [
  { userId: 1, id: 1, title: 'Mock post 1', body: 'Body 1' },
  { userId: 1, id: 2, title: 'Mock post 2', body: 'Body 2' },
];
const MOCK_USERS = [
  { id: 1, name: 'Mock User 1', email: 'mock1@example.com', username: 'mock1' },
  { id: 2, name: 'Mock User 2', email: 'mock2@example.com', username: 'mock2' },
];

function send(res, statusCode, body) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  const url = req.url || '';
  const path = url.split('?')[0];
  const method = req.method;

  if (method !== 'GET') {
    send(res, 405, { error: 'Method Not Allowed' });
    return;
  }

  if (path === '/posts' || path === '/posts/') {
    send(res, 200, MOCK_POSTS);
    return;
  }
  const postMatch = path.match(/^\/posts\/(\d+)$/);
  if (postMatch) {
    const id = parseInt(postMatch[1], 10);
    const post = MOCK_POSTS.find((p) => p.id === id);
    if (post) {
      send(res, 200, post);
    } else {
      send(res, 404, {});
    }
    return;
  }

  if (path === '/users' || path === '/users/') {
    send(res, 200, MOCK_USERS);
    return;
  }

  send(res, 404, { error: 'Not Found', path });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Mock API server at http://127.0.0.1:${PORT}`);
  console.log('  GET /posts, GET /posts/1, GET /users');
});

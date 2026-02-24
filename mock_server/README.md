# Mock API Server

與 [pytest-automation-testing 的 mock_server](https://github.com/your-username/pytest-automation-testing/tree/main/mock_server) 概念一致：提供本機 API，測試不依賴外網。

## 啟動

在專案根目錄：

```bash
npm run mock
# 或
node mock_server/server.js
```

預設監聽 `http://127.0.0.1:5050`，可設 `MOCK_PORT` 改變 port。

## 端點

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | /posts | 回傳 mock 文章列表 |
| GET | /posts/:id | 回傳單筆（id 1、2 有資料；其餘 404） |
| GET | /users | 回傳 mock 使用者列表 |

## 跑測試時使用 Mock

```bash
# Terminal 1
npm run mock

# Terminal 2
npm run test:mock
# 或
TARGET_BASE_URL=http://127.0.0.1:5050 npm test
```


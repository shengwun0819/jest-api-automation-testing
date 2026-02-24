# API Automation Testing Framework (Jest + Node.js)

以 Node.js 與 Jest 為基礎的 API SIT（System Integration Test）自動化測試框架範例，展示如何建立可擴展、可維護的 API 測試系統。

## 專案說明

- **Jest 測試框架**：使用 Jest 撰寫與執行 API 測試
- **多階段環境**：透過 `STAGE` 與 `configs/stage-env.js` 切換測試目標
- **API Client 封裝**：統一請求與錯誤解析（`tests/api-client.js`）
- **可選 HTTP 觸發**：可啟動 Koa 伺服器，以 GET `/run-test` 觸發「單次」測試並回傳結果（僅 API 整合測試，無壓測迴圈）
- **本機 Mock 選項**：內建 `mock_server/`

## 專案結構

```
.
├── configs/           # 設定
│   ├── config.js     # 環境變數
│   └── stage-env.js  # 不同環境 domain
├── controllers/       # HTTP 觸發用（僅 run-test：單次執行）
├── libs/              # 共用模組（logger, test-woker）
├── mock_server/       # 本機 Mock API（GET /posts, /users）
│   └── server.js
├── routers/           # 路由（health-check, run-test）
├── tests/             # Jest 測試與 API client
│   ├── api-client.js
│   ├── utils.js
│   ├── config.test.js
│   ├── get-posts.test.js
│   └── get-users.test.js
├── app.js
├── server.js
├── .env.sample
└── package.json
```

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 環境變數

```bash
cp .env.sample .env
```

編輯 `.env`，必要時修改 `TARGET_BASE_URL`、`STAGE`。可選：使用本機 Mock（見下方）則不需外網。

### 3. 執行測試

與 sygna 專案一樣，直接指定測試檔路徑執行：

```bash
# 跑單一測試檔（建議先試，確認有輸出）
npx jest ./tests/minimal.test.js --runInBand
npx jest ./tests/config.test.js --runInBand
npx jest ./tests/get-posts.test.js --runInBand

# 跑全部測試
npm test
# 或
npx jest --runInBand
```

**使用本機 Mock**：先 `npm run mock`，再設 `TARGET_BASE_URL=http://127.0.0.1:5050` 後跑測試，或直接：

```bash
npm run mock    # Terminal 1
npm run test:mock   # Terminal 2
```

**Allure 報告**：專案內建 Allure，可用一條指令跑測試並開報告：

```bash
npm run mock              # Terminal 1
npm run test:mock:allure:serve   # Terminal 2：跑測試 + 產生 Allure 報告 + 開瀏覽器
```

其餘指令見 `package.json` 的 `test:mock:allure`、`report:allure`、`report:allure:open` 等。

**建議**：使用 iTerm / Terminal.app 在專案目錄下執行測試。

### 4. 以 HTTP 觸發測試（可選）

先啟動本機伺服器：

```bash
npm start
```

再於另一終端呼叫：

```bash
# 執行一次測試並取得結果（需先 npm start）
curl "http://localhost:3000/run-test?stage=dev"

# 健康檢查
curl http://localhost:3000/health-check
```

## 環境變數說明

| 變數 | 說明 | 預設 |
|------|------|------|
| `PORT` | 本機伺服器埠 | 3000 |
| `TARGET_BASE_URL` | 測試目標 API 基底 URL；使用 Mock 時設為 `http://127.0.0.1:5050` | http://127.0.0.1:5050 |
| `STAGE` | 階段（對應 stage-env） | dev |
| `REQUEST_TIMEOUT` | 請求逾時（ms） | 10000 |
| `OVERRIDE_DOMAIN` | 覆寫目標網域 | - |
| `LOG_REQUEST` | 設為 1 可記錄請求日誌 | - |

## 自訂擴展

### 替換為自有 API

1. 在 `.env` 設定 `TARGET_BASE_URL` 為你的 API 基底 URL。
2. 在 `configs/stage-env.js` 依 `STAGE` 設定各環境的 `TARGET_DOMAIN_NAME`。
3. 在 `tests/api-client.js` 新增或修改對應的請求方法（如 `getVasp`、`postPermission` 等）。
4. 在 `tests/` 下新增或修改 `*.test.js`，使用 `api-client` 與 `expect` 撰寫案例。

### 新增測試檔

1. 在 `tests/` 建立 `*.test.js`。
2. 使用 `tests/api-client.js` 發送請求。
3. 使用 Jest 的 `expect` 做斷言。

## 測試報告

若透過 `/run-test` 觸發且啟用 HTML reporter，報告會寫入 `test_report/`，並可透過 `GET /reports/<檔名>` 存取（需先 `npm start`，靜態目錄為 test_report）。

## 授權

MIT License

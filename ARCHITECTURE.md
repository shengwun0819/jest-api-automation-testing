# 架構設計文件

本文說明以 Jest + Node.js 為基礎的 API SIT 自動化測試框架架構與設計取捨。

## 整體架構

```
┌─────────────────────────────────────────────────────────┐
│  Optional: Koa Server (health-check, run-test 單次執行)  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│  Test Execution Layer (Jest + globalSetup + *.test.js)  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│  API Client Layer (api-client.js + errorParser)         │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│  Config Layer (config.js + stage-env.js + .env)         │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│  Target API (TARGET_BASE_URL / stage-env)               │
└─────────────────────────────────────────────────────────┘
```

## 核心組件

### 1. 配置 (configs/)

- **config.js**：讀取 `PORT`、`TARGET_BASE_URL`、`REQUEST_TIMEOUT`、`STAGE`、`API_CALLER_PUBLIC_KEY` 等。
- **stage-env.js**：依 `STAGE` 提供該階段的 `TARGET_DOMAIN_NAME`，可被 `OVERRIDE_DOMAIN` 覆寫。

設計上不寫死公司網域或金鑰，僅使用環境變數與範例 URL。

### 2. API Client (tests/api-client.js)

- 職責：對目標 API 發送 HTTP 請求、統一 timeout、錯誤解析。
- 以 axios 為基礎，依 `config` 與 `stage-env` 決定 `baseURL`。
- `errorParser` 將 axios 錯誤轉成 `{ status, data, message }` 供測試斷言。

### 3. 測試 (tests/*.test.js)

- 使用 Jest，`setupFilesAfterEnv` 含 `jest-extended`（如 `expect.toBeArray()`、`toHaveProperty`）。
- `jest-global-setup.js` 僅做環境輸出，不依賴 AWS、DynamoDB 等外部服務。
- 範例測試針對公眾 API（JSONPlaceholder），可替換為自有 API 與資料。

### 4. 可選 Koa 伺服器

- **app.js**：Koa + bodyParser + 路由 + 靜態 test_report。
- **server.js**：啟動 app，監聽 `PORT`。
- **routers/sit.js**：`/health-check`、`/run-test`（僅單次執行，無 start/stop 壓測迴圈）。
- **controllers/run-test.js**：以 Worker 執行 Jest 一次，回傳 `pass`、失敗數、報告檔名（不包含 S3/Slack 等外部整合）。
- **middleware/validate-jwt.js**：若設定 `API_CALLER_PUBLIC_KEY` 則驗證 JWT；未設定或 `CODEBUILD_CI` 時略過。

## 測試執行流程

1. **直接執行**：`npm test` → Jest 載入 `globalSetup`、執行 `tests/**/*.test.js`。
2. **HTTP 觸發**：`GET /run-test?stage=dev` → middleware → `run-test` 建立 Worker → Worker 執行 Jest → 回傳 JSON 結果。

## 與原始企業版之差異（脫敏要點）

- 移除所有 AWS（DynamoDB、S3、SSM、Lambda）依賴與程式碼。
- 移除公司內部套件（如 @sygna/*、@coolbitx-technology/*）。
- 移除 Slack、S3 報告上傳、ngrok、devops-glue 等整合。
- 測試資料改為公眾 API（JSONPlaceholder），不依賴內部 VASP/Transfer 等領域模型。
- 環境與網域改為通用名稱（TARGET_BASE_URL、stage-env 範例 URL），無真實金鑰或內部網域。

## 擴展點

- **新增端點測試**：在 `api-client.js` 加方法，在 `tests/` 加 `*.test.js`。
- **多環境**：在 `stage-env.js` 增加 stage，並用 `STAGE` 與 `OVERRIDE_DOMAIN` 切換。
- **報告**：可在 Worker 內改用其他 Jest reporter，或於 `run-test` 中上傳至自有儲存（不包含在目前範例內）。

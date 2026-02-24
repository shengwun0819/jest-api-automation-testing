# 貢獻指南

感謝您對本專案的關注。本指南說明如何參與貢獻。

## 專案背景

本專案為 API 自動化測試框架範例，改寫自企業級 Jest SIT 專案。保留 Jest 測試架構與設計模式，移除公司專屬業務與機密資訊，作為可公開的學習與參考範例。

## 如何貢獻

### 1. 報告問題

若發現 bug 或有改進建議：

1. 先查看既有 Issues 是否已有相同問題。
2. 建立新 Issue，並盡量包含：問題描述、重現步驟、預期與實際行為、環境（Node 版本、OS）。

### 2. 提交 Pull Request

1. Fork 本專案。
2. 建立分支（例如 `feature/your-feature`）。
3. 提交變更並撰寫清楚 commit message。
4. 推送到分支並開啟 Pull Request。

### 3. 程式碼規範

- 使用專案內建的 ESLint / Prettier（若有設定）。
- 變數與函式命名語意清晰。
- 新增或修改測試時，請確保 `npm test` 通過。

### 4. 測試

提交前請確認：

- `npm test` 全部通過。
- 新功能若有對應測試一併提交。

## 開發建議

### 新增 API 測試

1. 在 `tests/api-client.js` 新增請求方法（或擴充既有方法）。
2. 在 `tests/` 新增 `*.test.js`，使用 `api-client` 與 Jest 斷言。
3. 若需新環境，在 `configs/stage-env.js` 與 `.env.sample` 中補充說明。

### 替換測試目標 API

修改 `.env` 的 `TARGET_BASE_URL` 與 `configs/stage-env.js` 即可，無需改動測試架構。

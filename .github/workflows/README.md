# GitHub Actions Workflows

## 可用的 Workflows

### 1. `test.yml` - API 測試流程

**觸發條件：**
- Push 到 `main` 或 `dev` 分支
- Pull Request 到 `main` 或 `dev` 分支
- 手動觸發（Actions 頁面 → API Tests → Run workflow）

**步驟：**
- 使用 **Node.js 20.x**（與 `package.json` 的 `engines` 一致）
- `npm ci` 安裝依賴
- `npm run lint` 執行 ESLint
- 啟動專案內 **Mock Server**（port 5050），不需真實 API 即可跑測試
- 使用 `jest.config.ci.js` 執行 Jest（`TARGET_BASE_URL=http://127.0.0.1:5050`），並產生 HTML 報告到 `reports/`
- 將 `reports/` 上傳為 Artifact（`jest-report-node20`），保留 7 天

### 2. `publish-report.yml` - 發布測試報告到 GitHub Pages

**觸發條件：**
- `test.yml`（API Tests）完成後自動觸發（成功或失敗皆會跑）

**步驟：**
- 下載 Artifact `jest-report-node20`
- 僅在 **main** 分支且有報告檔案時，部署到 GitHub Pages 的 `test-report/` 目錄

**報告網址（需先於 Repo Settings 啟用 GitHub Pages）：**
```
https://<username>.github.io/<repository>/test-report/jest-report-ci.html
```

## 與 pytest-automation-testing 的對應

| pytest 專案              | jest 專案說明                         |
|--------------------------|----------------------------------------|
| Python 3.13 + pip        | Node 20.x + npm ci                    |
| Mock Server (port 5050)  | Mock Server (port 5050)               |
| pytest + Allure 報告     | Jest + jest-html-reporter 報告        |
| allure-report artifact   | jest-report-node20 artifact            |
| publish-report → Pages   | publish-report → Pages（test-report/）|

## 可選：使用真實 API

目前 CI 一律使用 Mock Server，無需設定 Secrets。若未來要對接真實 API，可於 Repo **Settings → Secrets and variables → Actions** 新增：

- `TARGET_BASE_URL`：目標 API 的 base URL（例如 `https://api.example.com`）

並在 `test.yml` 的「Run tests」步驟改為依 Secret 決定是否啟動 Mock、或改為使用 `TARGET_BASE_URL` 環境變數（需自行在 workflow 中加條件與 `env`）。

## 查看結果

1. **Actions**：Repo → **Actions** → 選擇「API Tests」或「Publish Test Report」查看日誌。
2. **下載報告**：在該次 run 頁面底部 **Artifacts** 下載 `jest-report-node20`，解壓後開啟 `jest-report-ci.html`。
3. **GitHub Pages**：若已啟用並跑過 publish-report，可從上述 `test-report/jest-report-ci.html` 連結查看。

## 注意事項

- 測試與報告皆在 Ubuntu 環境執行，請確保程式在 Linux 下可跑。
- `reports/` 已列入 `.gitignore`，不會被 commit；CI 產生的報告僅透過 Artifacts 或 Pages 取得。

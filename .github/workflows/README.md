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
- 使用 `jest.config.allure.js` 執行 Jest（Allure 環境，`TARGET_BASE_URL=http://127.0.0.1:5050`），結果寫入 `allure-results/`
- 測試結束時 **allure-summary-reporter** 自動產生 `test_report/`（含 `report_{commit}_{result}_{time}.html` 與 `index.html`）
- 上傳 Artifacts：`allure-results-node20`、`test-report-node20`，保留 7 天

### 2. `publish-report.yml` - 發布 Allure 報告到 GitHub Pages

**觸發條件：**
- `test.yml`（API Tests）完成後自動觸發（成功或失敗皆會跑）

**步驟：**
- 下載 Artifact `test-report-node20`
- 僅在 **main** 分支且有報告檔案時，部署到 GitHub Pages 的 `test-report/` 目錄（可開 `index.html` 或具名報告）

**報告網址（需先於 Repo Settings 啟用 GitHub Pages，Source 選 GitHub Actions）：**
```
https://<username>.github.io/<repository>/test-report/
```

## 與 pytest-automation-testing 的對應

| pytest 專案              | jest 專案說明                         |
|--------------------------|----------------------------------------|
| Python 3.13 + pip        | Node 20.x + npm ci                    |
| Mock Server (port 5050)  | Mock Server (port 5050)               |
| pytest + Allure 報告     | Jest + **Allure**（allure-jest）       |
| allure-report / test_report | test_report（reporter 產出，含 index.html） |
| publish-report → Pages   | publish-report → Pages（test-report/）|

## 本機產生 Allure 報告

專案已內建 `allure-commandline`（需本機有 **Java**），可直接用 npm 指令：

| 指令 | 說明 |
|------|------|
| `npm run test:mock:allure` | 用 Mock 跑測試，結果寫入 `allure-results/` |
| `npm run report:allure` | 依 `allure-results/` 產生 `allure-report/` |
| `npm run report:allure:open` | 產生報告並用瀏覽器開啟 |
| **`npm run test:mock:allure:report`** | 跑測試＋產生報告 |
| **`npm run test:mock:allure:serve`** | 跑測試＋產生報告＋開瀏覽器 |

建議流程：先開一個終端執行 `npm run mock`，再在另一個終端執行 `npm run test:mock:allure:serve`。

## 可選：使用真實 API

目前 CI 一律使用 Mock Server，無需設定 Secrets。若未來要對接真實 API，可於 Repo **Settings → Secrets and variables → Actions** 新增 `TARGET_BASE_URL`，並在 `test.yml` 的「Run tests」步驟改為依 Secret 決定是否啟動 Mock。

## 查看結果

1. **Actions**：Repo → **Actions** → 選擇「API Tests」或「Publish Test Report」查看日誌。
2. **下載報告**：在該次 run 頁面底部 **Artifacts** 下載 `allure-report-node20`，解壓後開啟 `index.html`。
3. **GitHub Pages**：若已啟用並跑過 publish-report，從 `https://<username>.github.io/<repo>/test-report/` 查看。

## 注意事項

- 測試與報告皆在 Ubuntu 環境執行；報告由 reporter 呼叫 npx allure-commandline 產生，無需 CI 另裝 Allure。
- `allure-results/`、`allure-report/`、`test_report/` 已列入 `.gitignore`，不會被 commit。

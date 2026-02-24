/**
 * Jest 自訂 reporter：測試結束後自動產生 Allure 報告（對齊 pytest conftest.py 的 pytest_terminal_summary）。
 * 報告路徑：test_report/report_{commit_sha}_{success|failed}_{timestamp}.html
 * 時間與路徑不含 ':' 以利 GitHub Actions artifact。
 */
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const ALLURE_RESULTS_DIR = process.env.ALLURE_RESULTS_DIR || 'allure-results';
const TEST_REPORT_DIR = 'test_report';

function getTimeNow() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const y = now.getFullYear();
  const m = pad(now.getMonth() + 1);
  const d = pad(now.getDate());
  const h = pad(now.getHours());
  const min = pad(now.getMinutes());
  const sec = pad(now.getSeconds());
  return `${y}-${m}-${d}_${h}-${min}-${sec}`;
}

function getAllureReport(success) {
  const timeNow = getTimeNow();
  const result = success ? 'success' : 'failed';
  const commitSha = (process.env.COMMIT_SHA || process.env.GITHUB_SHA || 'local').replace(
    /:/g,
    '-'
  );
  const reportName = `report_${commitSha}_${result}_${timeNow}.html`;
  const reportDir = path.join(TEST_REPORT_DIR, `report_${commitSha}_${result}_${timeNow}`);
  return { reportDir, reportName, timeNow };
}

function runAllureGenerate(reportDir) {
  const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const result = spawnSync(
    npx,
    ['allure-commandline', 'generate', '--clean', '-o', reportDir, ALLURE_RESULTS_DIR],
    { stdio: 'pipe', encoding: 'utf8', shell: process.platform === 'win32' }
  );
  return result;
}

class AllureSummaryReporter {
  onRunComplete(_contexts, aggregatedResults) {
    const skip = process.env.ALLURE_SKIP_GENERATE === 'true';
    if (skip) return;

    const success =
      (aggregatedResults.numFailedTestSuites || 0) === 0 &&
      (aggregatedResults.numFailedTests || 0) === 0;

    const { reportDir, reportName } = getAllureReport(success);

    try {
      console.log(' ⚙️ Generating Allure report...');
      const startTime = Date.now();

      if (!fs.existsSync(ALLURE_RESULTS_DIR) || !fs.readdirSync(ALLURE_RESULTS_DIR).length) {
        console.log(' Allure results directory empty; skipping report generation.');
        return;
      }

      if (!fs.existsSync(TEST_REPORT_DIR)) {
        fs.mkdirSync(TEST_REPORT_DIR, { recursive: true });
      }
      if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
      }

      const run = runAllureGenerate(reportDir);
      if (run.status !== 0) {
        console.log(
          ' Allure CLI not available or failed; skipping local report generation.\n' +
            ' In CI, the workflow "Generate Allure Report" step will produce the report.'
        );
        if (run.stderr) console.error(run.stderr);
        return;
      }

      const indexPath = path.join(reportDir, 'index.html');
      const reportPath = path.join(reportDir, reportName);
      if (fs.existsSync(indexPath)) {
        fs.renameSync(indexPath, reportPath);
      }

      console.log(' ✓ Allure report generated successfully.');
      console.log(`\n ✔✔✔ Report saved as: ${reportDir} ✔✔✔`);

      const copyDest = path.join(TEST_REPORT_DIR, reportName);
      fs.copyFileSync(reportPath, copyDest);
      fs.copyFileSync(reportPath, path.join(TEST_REPORT_DIR, 'index.html'));
      console.log(' ✔✔✔ Report copy to: test_report ✔✔✔');

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`Allure report generation took ${duration} seconds`);
    } catch (e) {
      console.error(' ✘✘✘ Allure report generation failed:', e.message);
      if (e.stderr) console.error('Error details:', e.stderr);
      throw e;
    }
  }
}

module.exports = AllureSummaryReporter;

import * as path from 'path';
import { runTests } from 'vscode-test';

(async function main() {
  // The folder containing the Extension Manifest package.json
  // Passed to `--extensionDevelopmentPath`
  const extensionDevelopmentPath = process.cwd();

  // The path to test runner
  // Passed to --extensionTestsPath
  const extensionTestsPath = path.join(__dirname, './suite');

  // The path to the workspace file
  const workspace = path.resolve('test-fixtures', 'test.code-workspace');

  // Download VS Code, unzip it and run the integration test
  try {
    const exitCode = await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [workspace, '--disable-extensions']
    });
    process.exitCode = exitCode;
  } catch {
    process.exitCode = 1;
  }
})();

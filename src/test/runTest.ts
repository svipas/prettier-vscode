import * as path from "path";
import { runTests } from "vscode-test";

(async function main() {
	const extensionDevelopmentPath = process.cwd();
	const extensionTestsPath = path.join(__dirname, "./suite");
	const workspace = path.resolve("test-fixtures", "test.code-workspace");

	try {
		const exitCode = await runTests({
			extensionDevelopmentPath,
			extensionTestsPath,
			launchArgs: [workspace, "--disable-extensions"],
		});
		process.exitCode = exitCode;
	} catch {
		process.exitCode = 1;
	}
})();

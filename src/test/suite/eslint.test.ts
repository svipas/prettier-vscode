import * as assert from "assert";
import { workspace } from "vscode";
import { formatTestFile, readTestFile } from "./utils";

const workspaceFolder = workspace.workspaceFolders![2].uri;

suite("ESLint", () => {
	test("it formats with prettier-eslint", async () => {
		const { result: actualResult } = await formatTestFile(
			"actual.js",
			workspaceFolder
		);
		const expectedResult = await readTestFile("expected.js", workspaceFolder);
		assert.strictEqual(actualResult, expectedResult);
	});
});

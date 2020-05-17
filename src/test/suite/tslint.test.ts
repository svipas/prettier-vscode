import * as assert from "assert";
import { workspace } from "vscode";
import { formatTestFile, readTestFile } from "./utils";

const workspaceFolder = workspace.workspaceFolders![3].uri;

suite("TSLint", () => {
	test("it formats with prettier-tslint", async () => {
		const { result: actualResult } = await formatTestFile(
			"actual.ts",
			workspaceFolder
		);
		const expectedResult = await readTestFile("expected.ts", workspaceFolder);
		assert.strictEqual(actualResult, expectedResult);
	});
});

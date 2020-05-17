import * as assert from "assert";
import { workspace } from "vscode";
import { formatTestFile, readTestFile } from "./utils";

const workspaceFolder = workspace.workspaceFolders![4].uri;

suite("stylelint", () => {
	test("it formats with prettier-stylelint", async () => {
		const { result: actualResult } = await formatTestFile(
			"actual.css",
			workspaceFolder
		);
		const expectedResult = await readTestFile("expected.css", workspaceFolder);
		assert.strictEqual(actualResult, expectedResult);
	});
});

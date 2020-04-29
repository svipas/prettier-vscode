import * as assert from 'assert';
import { workspace } from 'vscode';
import { formatTestFile, readTestFile } from './utils';

const workspaceFolder = workspace.workspaceFolders![4].uri;

suite('stylelint', () => {
	test('it formats with prettier-stylelint', async () => {
		const actualResult = (await formatTestFile('actual.css', workspaceFolder)).result;
		const expectedResult = await readTestFile('expected.css', workspaceFolder);
		assert.strictEqual(actualResult, expectedResult);
	});
});

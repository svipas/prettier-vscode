import * as assert from 'assert';
import { workspace } from 'vscode';
import { ExtensionTest } from './extension-test';

const workspaceFolder = workspace.workspaceFolders![3].uri;

suite('TSLint', () => {
	test('it formats with prettier-tslint', async () => {
		const actualResult = (await ExtensionTest.format('actual.ts', workspaceFolder)).result;
		const expectedResult = await ExtensionTest.readFile('expected.ts', workspaceFolder);
		assert.strictEqual(actualResult, expectedResult);
	});
});

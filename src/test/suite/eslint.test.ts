import * as assert from 'assert';
import { workspace } from 'vscode';
import { ExtensionTest } from './extension-test';

const workspaceFolder = workspace.workspaceFolders![2].uri;

suite('ESLint', () => {
  test('it formats with prettier-eslint', async () => {
    const actualResult = (await ExtensionTest.format('actual.js', workspaceFolder)).result;
    const expectedResult = await ExtensionTest.readFile('expected.js', workspaceFolder);
    assert.strictEqual(actualResult, expectedResult);
  });
});

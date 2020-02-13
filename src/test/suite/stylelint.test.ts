import * as assert from 'assert';
import { workspace } from 'vscode';
import { ExtensionTest } from './extension-test';

const workspaceFolder = workspace.workspaceFolders![4].uri;

suite('stylelint', () => {
  test('it formats with prettier-stylelint', async () => {
    const actualResult = (await ExtensionTest.format('actual.css', workspaceFolder)).result;
    const expectedResult = await ExtensionTest.readFile('expected.css', workspaceFolder);
    assert.strictEqual(actualResult, expectedResult);
  });
});

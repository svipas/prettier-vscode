import * as assert from 'assert';
import { workspace } from 'vscode';
import { format, readTestFile } from './format.test';

const workspaceFolder = workspace.workspaceFolders![4].uri;

suite('stylelint', () => {
  test('it formats with prettier-stylelint', async () => {
    const actualResult = (await format('actual.css', workspaceFolder)).result;
    const expectedResult = await readTestFile('expected.css', workspaceFolder);
    assert.strictEqual(actualResult, expectedResult);
  });
});

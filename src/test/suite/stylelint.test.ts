import * as assert from 'assert';
import { workspace } from 'vscode';
import { extension } from '.';

const workspaceFolder = workspace.workspaceFolders![4].uri;

suite('stylelint', () => {
  test('it formats with prettier-stylelint', async () => {
    const actualResult = (await extension.format('actual.css', workspaceFolder)).result;
    const expectedResult = await extension.readFile('expected.css', workspaceFolder);
    assert.strictEqual(actualResult, expectedResult);
  });
});

import * as assert from 'assert';
import { workspace } from 'vscode';
import { extension } from '.';

const workspaceFolder = workspace.workspaceFolders![2].uri;

suite('ESLint', () => {
  test('it formats with prettier-eslint', async () => {
    const actualResult = (await extension.format('actual.js', workspaceFolder)).result;
    const expectedResult = await extension.readFile('expected.js', workspaceFolder);
    assert.strictEqual(actualResult, expectedResult);
  });
});

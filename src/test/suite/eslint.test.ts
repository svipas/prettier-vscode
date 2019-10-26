import * as assert from 'assert';
import { workspace } from 'vscode';
import { format, readTestFile } from './format.test';

const workspaceFolder = workspace.workspaceFolders![2].uri;

suite('ESLint', () => {
  test('it formats with prettier-eslint', async () => {
    const actualResult = (await format('actual.js', workspaceFolder)).result;
    const expectedResult = await readTestFile('expected.js', workspaceFolder);
    assert.strictEqual(actualResult, expectedResult);
  });
});

import * as assert from 'assert';
import { workspace } from 'vscode';
import { format, readTestFile } from './format.test';

const workspaceFolder = workspace.workspaceFolders![3].uri;

suite('TSLint', () => {
  test('it formats with prettier-tslint', async () => {
    const actualResult = (await format('actual.ts', workspaceFolder)).result;
    const expectedResult = await readTestFile('expected.ts', workspaceFolder);
    assert.strictEqual(actualResult, expectedResult);
  });
});

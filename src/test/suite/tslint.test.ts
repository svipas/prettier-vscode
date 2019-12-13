import * as assert from 'assert';
import { workspace } from 'vscode';
import { extension } from '.';

const workspaceFolder = workspace.workspaceFolders![3].uri;

suite('TSLint', () => {
  test('it formats with prettier-tslint', async () => {
    const actualResult = (await extension.format('actual.ts', workspaceFolder)).result;
    const expectedResult = await extension.readFile('expected.ts', workspaceFolder);
    assert.strictEqual(actualResult, expectedResult);
  });
});

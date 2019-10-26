import * as assert from 'assert';
import { workspace } from 'vscode';
import { format, readTestFile } from './format.test';

const workspaceFolder = workspace.workspaceFolders![5].uri;

suite('Ruby', () => {
  test('it formats Ruby', async () => {
    const actualResult = (await format('actual.rb', workspaceFolder)).result;
    const expectedResult = await readTestFile('expected.rb', workspaceFolder);
    assert.strictEqual(actualResult, expectedResult);
  });
});

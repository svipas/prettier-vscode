import * as assert from 'assert';
import { workspace } from 'vscode';
import { extension } from '.';

const workspaceFolder = workspace.workspaceFolders![0].uri;

suite('ignore', function() {
  test('it does not format file', async () => {
    const { result, source } = await extension.format('fileToIgnore.js', workspaceFolder);
    assert.strictEqual(result, source);
  });

  test('it does not format subfolder/*', async () => {
    const { result, source } = await extension.format('ignoreMe2/index.js', workspaceFolder);
    assert.strictEqual(result, source);
  });

  test('it does not format sub-subfolder', async () => {
    const { result, source } = await extension.format('ignoreMe/subdir/index.js', workspaceFolder);
    assert.strictEqual(result, source);
  });
});

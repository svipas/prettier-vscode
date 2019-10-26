import * as assert from 'assert';
import { join, posix } from 'path';
import * as prettier from 'prettier';
import { commands, Uri, window, workspace } from 'vscode';

/**
 * Loads and format a file.
 * @param filename path relative to base URI (a workspaceFolder's URI)
 * @param base base URI
 * @returns source code and resulting code
 */
export function format(filename: string, base: Uri): Promise<{ result: string; source: string }> {
  const absPath = join(base.fsPath, filename);
  return new Promise((resolve, reject) => {
    workspace.openTextDocument(absPath).then(doc => {
      const text = doc.getText();
      window.showTextDocument(doc).then(() => {
        console.time(filename);
        commands.executeCommand('editor.action.formatDocument').then(() => {
          console.timeEnd(filename);
          resolve({ result: doc.getText(), source: text });
        }, reject);
      }, reject);
    }, reject);
  });
}

export async function readTestFile(filename: string, uri: Uri): Promise<string> {
  const data = await workspace.fs.readFile(uri.with({ path: posix.join(uri.path, filename) }));
  return Buffer.from(data).toString();
}

/**
 * Compare prettier's output (default settings) with the output from extension.
 * @param file path relative to workspace root
 */
function formatSameAsPrettier(file: string) {
  return format(file, workspace.workspaceFolders![0].uri).then(result => {
    const prettierFormatted = prettier.format(result.source, { filepath: file });
    assert.strictEqual(result.result, prettierFormatted);
  });
}

suite('Prettier', () => {
  test('it formats JavaScript', () => formatSameAsPrettier('formatTest/ugly.js'));
  test('it formats TypeScript', () => formatSameAsPrettier('formatTest/ugly.ts'));
  test('it formats CSS', () => formatSameAsPrettier('formatTest/ugly.css'));
  test('it formats JSON', () => formatSameAsPrettier('formatTest/ugly.json'));
  test('it formats package.json', () => formatSameAsPrettier('formatTest/package.json'));
  test('it formats HTML', () => formatSameAsPrettier('formatTest/index.html'));
});

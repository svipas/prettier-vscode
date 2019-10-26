import * as assert from 'assert';
import { posix } from 'path';
import * as prettier from 'prettier';
import { commands, Uri, window, workspace } from 'vscode';

export function format(filename: string, uri: Uri): Promise<{ result: string; source: string }> {
  uri = uri.with({ path: posix.join(uri.fsPath, filename) });

  return new Promise((resolve, reject) => {
    workspace.openTextDocument(uri).then(doc => {
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
  const data = await workspace.fs.readFile(uri.with({ path: posix.join(uri.fsPath, filename) }));
  return Buffer.from(data).toString();
}

async function formatSameAsPrettier(path: string) {
  const { result, source } = await format(path, workspace.workspaceFolders![0].uri);
  const prettierFormatted = prettier.format(source, { filepath: path });
  assert.strictEqual(result, prettierFormatted);
}

suite('Prettier', () => {
  test('it formats JavaScript', () => formatSameAsPrettier('formatTest/ugly.js'));
  test('it formats TypeScript', () => formatSameAsPrettier('formatTest/ugly.ts'));
  test('it formats CSS', () => formatSameAsPrettier('formatTest/ugly.css'));
  test('it formats JSON', () => formatSameAsPrettier('formatTest/ugly.json'));
  test('it formats package.json', () => formatSameAsPrettier('formatTest/package.json'));
  test('it formats HTML', () => formatSameAsPrettier('formatTest/index.html'));
});

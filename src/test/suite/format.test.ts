import * as assert from 'assert';
import * as path from 'path';
import * as prettier from 'prettier';
import { commands, Uri, window, workspace } from 'vscode';

export function format(filename: string, uri: Uri): Promise<{ result: string; source: string }> {
  const extendedUri = uri.with({ path: path.join(uri.fsPath, filename) });
  return new Promise((resolve, reject) => {
    workspace.openTextDocument(extendedUri).then(doc => {
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
  const extendedUri = uri.with({ path: path.join(uri.fsPath, filename) });
  const data = await workspace.fs.readFile(extendedUri);
  return data.toString();
}

async function formatSameAsPrettier(filename: string) {
  const { result, source } = await format(`formatTest/${filename}`, workspace.workspaceFolders![0].uri);
  const prettierFormatted = prettier.format(source, { parser: getParserByFileName(filename) });
  assert.strictEqual(result, prettierFormatted);
}

function getParserByFileName(filename: string): prettier.ParserOption | undefined {
  const prettierSupportedLanguages = prettier.getSupportInfo(prettier.version).languages;
  const fileExtension = path.extname(filename);
  const prettierLanguage = prettierSupportedLanguages.find(lang => {
    return lang.filenames?.includes(filename) || lang.extensions.includes(fileExtension);
  });
  return prettierLanguage?.parsers[0];
}

suite('Prettier', () => {
  test('it formats JavaScript', () => formatSameAsPrettier('ugly.js'));
  test('it formats TypeScript', () => formatSameAsPrettier('ugly.ts'));
  test('it formats CSS', () => formatSameAsPrettier('ugly.css'));
  test('it formats JSON', () => formatSameAsPrettier('ugly.json'));
  test('it formats package.json', () => formatSameAsPrettier('package.json'));
  test('it formats HTML', () => formatSameAsPrettier('index.html'));
  test('it formats Vue', () => formatSameAsPrettier('ugly.vue'));
  test('it formats GraphQL', () => formatSameAsPrettier('ugly.graphql'));
});

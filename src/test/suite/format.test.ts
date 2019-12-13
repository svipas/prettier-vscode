import * as assert from 'assert';
import * as prettier from 'prettier';
import { workspace } from 'vscode';
import { extension } from '.';

async function formatSameAsPrettier(filename: string) {
  const { result, source } = await extension.format(`formatTest/${filename}`, workspace.workspaceFolders![0].uri);
  const prettierFormatted = prettier.format(source, { filepath: filename });
  assert.strictEqual(result, prettierFormatted);
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

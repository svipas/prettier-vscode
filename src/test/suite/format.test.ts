import * as assert from 'assert';
import * as prettier from 'prettier';
import { workspace } from 'vscode';
import { ExtensionTest } from './extension-test';

async function formatSameAsPrettier(filepath: string) {
  const { result, source } = await ExtensionTest.format(filepath, workspace.workspaceFolders![0].uri);
  const prettierFormatted = prettier.format(source, { filepath });
  assert.strictEqual(result, prettierFormatted);
}

suite('Prettier', () => {
  test('it formats JavaScript', () => formatSameAsPrettier('formatTest/ugly.js'));
  test('it formats TypeScript', () => formatSameAsPrettier('formatTest/ugly.ts'));
  test('it formats CSS', () => formatSameAsPrettier('formatTest/ugly.css'));
  test('it formats JSON', () => formatSameAsPrettier('formatTest/ugly.json'));
  test('it formats package.json', () => formatSameAsPrettier('formatTest/package.json'));
  test('it formats HTML', () => formatSameAsPrettier('formatTest/index.html'));
  test('it formats Vue', () => formatSameAsPrettier('formatTest/ugly.vue'));
  test('it formats GraphQL', () => formatSameAsPrettier('formatTest/ugly.graphql'));
});

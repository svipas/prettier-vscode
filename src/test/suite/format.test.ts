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
	test('it formats JavaScript', () => formatSameAsPrettier('format-test/ugly.js'));
	test('it formats TypeScript', () => formatSameAsPrettier('format-test/ugly.ts'));
	test('it formats CSS', () => formatSameAsPrettier('format-test/ugly.css'));
	test('it formats JSON', () => formatSameAsPrettier('format-test/ugly.json'));
	test('it formats package.json', () => formatSameAsPrettier('format-test/package.json'));
	test('it formats HTML', () => formatSameAsPrettier('format-test/index.html'));
	test('it formats Vue', () => formatSameAsPrettier('format-test/ugly.vue'));
	test('it formats GraphQL', () => formatSameAsPrettier('format-test/ugly.graphql'));
});

export const eslintLanguageIds = ['javascript', 'javascriptreact', 'typescript', 'typescriptreact', 'vue'];
export const tslintLanguageIds = ['typescript', 'typescriptreact'];
export const stylelintLanguageIds = ['css', 'less', 'scss'];

let prettierESLint: typeof import('prettier-eslint');
export function prettierEslintFormat(): typeof import('prettier-eslint') {
	if (!prettierESLint) {
		prettierESLint = require('prettier-eslint');
	}
	return prettierESLint;
}

let prettierTSLint: typeof import('prettier-tslint');
export function prettierTslintFormat(): typeof import('prettier-tslint').format {
	if (!prettierTSLint) {
		prettierTSLint = require('prettier-tslint');
	}
	return prettierTSLint.format;
}

let prettierStylelint: typeof import('prettier-stylelint');
export function prettierStylelintFormat(): typeof import('prettier-stylelint').format {
	if (!prettierStylelint) {
		prettierStylelint = require('prettier-stylelint');
	}
	return prettierStylelint.format;
}

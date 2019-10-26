// ESLint
export const eslintSupportedLanguageIds = ['javascript', 'javascriptreact', 'typescript', 'typescriptreact', 'vue'];
let prettierEslint: typeof import('prettier-eslint') | undefined;

export function requireLocalPrettierEslint(): typeof import('prettier-eslint') {
  if (prettierEslint) {
    return prettierEslint;
  }

  return (prettierEslint = require('prettier-eslint'));
}

// TSLint
export const tslintSupportedLanguageIds = ['typescript', 'typescriptreact'];
let prettierTslint: typeof import('prettier-tslint') | undefined;

export function requireLocalPrettierTslint(): typeof import('prettier-tslint') {
  if (prettierTslint) {
    return prettierTslint;
  }

  return (prettierTslint = require('prettier-tslint'));
}

// stylelint
export const stylelintSupportedLanguageIds = ['css', 'less', 'scss'];
let prettierStylelint: typeof import('prettier-stylelint') | undefined;

export function requireLocalPrettierStylelint(): typeof import('prettier-stylelint') {
  if (prettierStylelint) {
    return prettierStylelint;
  }

  return (prettierStylelint = require('prettier-stylelint'));
}

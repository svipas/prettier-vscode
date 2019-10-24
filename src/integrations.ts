// ESLint
export const eslintSupportedLanguageIds = ['javascript', 'javascriptreact', 'typescript', 'typescriptreact', 'vue'];
let prettierEslint: typeof import('prettier-eslint');

export function requireLocalPrettierEslint(): typeof prettierEslint {
  if (prettierEslint) {
    return prettierEslint;
  }

  return (prettierEslint = require('prettier-eslint'));
}

// TSLint
export const tslintSupportedLanguageIds = ['typescript', 'typescriptreact'];
let prettierTslint: typeof import('prettier-tslint');

export function requireLocalPrettierTslint(): typeof prettierTslint {
  if (prettierTslint) {
    return prettierTslint;
  }

  return (prettierTslint = require('prettier-tslint'));
}

// stylelint
export const stylelintSupportedLanguageIds = ['css', 'less', 'scss'];
let prettierStylelint: typeof import('prettier-stylelint');

export function requireLocalPrettierStylelint(): typeof prettierStylelint {
  if (prettierStylelint) {
    return prettierStylelint;
  }

  return (prettierStylelint = require('prettier-stylelint'));
}

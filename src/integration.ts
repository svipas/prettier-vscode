export class ESLint {
  private static prettierESLint: typeof import('prettier-eslint');
  static readonly languageIds = ['javascript', 'javascriptreact', 'typescript', 'typescriptreact', 'vue'];

  static get format(): typeof import('prettier-eslint') {
    if (!this.prettierESLint) {
      this.prettierESLint = require('prettier-eslint');
    }
    return this.prettierESLint;
  }
}

export class TSLint {
  private static prettierTSLint: typeof import('prettier-tslint');
  static readonly languageIds = ['typescript', 'typescriptreact'];

  static get format(): typeof import('prettier-tslint').format {
    if (!this.prettierTSLint) {
      this.prettierTSLint = require('prettier-tslint');
    }
    return this.prettierTSLint.format;
  }
}

export class Stylelint {
  private static prettierStylelint: typeof import('prettier-stylelint');
  static readonly languageIds = ['css', 'less', 'scss'];

  static get format(): typeof import('prettier-stylelint').format {
    if (!this.prettierStylelint) {
      this.prettierStylelint = require('prettier-stylelint');
    }
    return this.prettierStylelint.format;
  }
}

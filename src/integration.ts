const modules: {
  eslint?: typeof import('prettier-eslint');
  tslint?: typeof import('prettier-tslint');
  stylelint?: typeof import('prettier-stylelint');
} = {};

function loadModule<T>(name: 'eslint' | 'tslint' | 'stylelint'): T {
  return modules[name] ?? (modules[name] = require(`prettier-${name}`));
}

export const integration = {
  prettierESLint: {
    languageIds: ['javascript', 'javascriptreact', 'typescript', 'typescriptreact', 'vue'],
    getModule: () => loadModule<typeof import('prettier-eslint')>('eslint')
  },
  prettierTSLint: {
    languageIds: ['typescript', 'typescriptreact'],
    getModule: () => loadModule<typeof import('prettier-tslint')>('tslint')
  },
  prettierStylelint: {
    languageIds: ['css', 'less', 'scss'],
    getModule: () => loadModule<typeof import('prettier-stylelint')>('stylelint')
  }
};

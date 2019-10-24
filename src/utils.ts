import * as path from 'path';
import * as prettier from 'prettier';
import { Uri, window, workspace } from 'vscode';
import { requireLocalPrettier } from './requirePkg';

export function getConfig(uri?: Uri): prettier.PrettierVSCodeConfig {
  return workspace.getConfiguration('prettier', uri) as any;
}

export function getSupportedParser(languageId: string, filepath?: string): prettier.ParserOption {
  if (!filepath) {
    return getParserByLanguageId(languageId);
  }

  const supportedLanguage = allSupportedLanguages[languageId];
  if (!supportedLanguage) {
    return getParserByLanguageId(languageId);
  }

  const basename = path.basename(filepath);
  const extname = path.extname(filepath);
  let filenamesAndExtensionsEmptyParser: prettier.ParserOption = '';

  for (const lang of supportedLanguage) {
    if (lang.filenames.includes(basename)) {
      return lang.parsers[0];
    }
    if (lang.extensions.includes(extname)) {
      return lang.parsers[0];
    }
    if (lang.filenames.length === 0 && lang.extensions.length === 0) {
      filenamesAndExtensionsEmptyParser = lang.parsers[0];
    }
  }

  if (filenamesAndExtensionsEmptyParser) {
    return filenamesAndExtensionsEmptyParser;
  }

  return getParserByLanguageId(languageId);
}

const allSupportedLanguages: {
  [languageId: string]: {
    filenames: string[];
    extensions: string[];
    parsers: prettier.ParserOption[];
  }[];
} = getSupportedLanguages().reduce((obj: any, prettierLang) => {
  const { filenames = [], extensions = [], parsers = [], vscodeLanguageIds = [] } = prettierLang;
  vscodeLanguageIds.forEach(vscodeLangId => {
    if (obj[vscodeLangId]) {
      obj[vscodeLangId].push({ filenames, extensions, parsers });
    } else {
      obj[vscodeLangId] = [{ filenames, extensions, parsers }];
    }
  });
  return obj;
}, {});

// Returns all supported VS Code language ids from Prettier
export const allSupportedVSCodeLanguageIds: string[] = getSupportedLanguages().reduce((ids: string[], lang) => {
  if (lang.vscodeLanguageIds) {
    ids.push(...lang.vscodeLanguageIds);
  }
  return ids;
}, []);

export const eslintSupportedLanguageIds = ['javascript', 'javascriptreact', 'typescript', 'typescriptreact', 'vue'];
export const stylelintSupportedLanguageIds = ['css', 'less', 'scss'];
export const tslintSupportedLanguageIds = ['typescript', 'typescriptreact'];

// Mainly used for untitled files or for files without any extension to get the default parser
const allSupportedLanguageParsers: { [vscodeLangId: string]: prettier.ParserOption[] } = {
  javascript: ['babel', 'flow'],
  javascriptreact: ['babel', 'flow'],
  typescript: ['typescript'],
  typescriptreact: ['typescript'],
  json: ['json'],
  jsonc: ['json'],
  json5: ['json5'],
  css: ['css'],
  less: ['less'],
  scss: ['scss'],
  graphql: ['graphql'],
  markdown: ['markdown'],
  mdx: ['mdx'],
  html: ['html'],
  vue: ['vue'],
  yaml: ['yaml']
};

/**
 * Returns supported languages from local or bundled Prettier.
 */
function getSupportedLanguages(): prettier.PrettierSupportInfo['languages'] {
  if (window.activeTextEditor) {
    const localPrettier = requireLocalPrettier(window.activeTextEditor.document.fileName);
    if (localPrettier) {
      return localPrettier.getSupportInfo(localPrettier.version).languages;
    }
  }
  return prettier.getSupportInfo(prettier.version).languages;
}

function getParserByLanguageId(languageId: string): prettier.ParserOption {
  const parsers = allSupportedLanguageParsers[languageId];
  return parsers ? parsers[0] : '';
}

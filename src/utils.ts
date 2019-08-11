import { basename } from 'path';
import * as prettier from 'prettier';
import { Uri, workspace } from 'vscode';

export function getConfig(uri?: Uri): prettier.PrettierVSCodeConfig {
  return workspace.getConfiguration('prettier', uri) as any;
}

export function getParsersFromLanguageId(
  languageId: string,
  prettierInstance: typeof import('prettier'),
  path?: string
): prettier.ParserOption[] {
  const language = getSupportLanguages(prettierInstance).find(lang => {
    return (
      Array.isArray(lang.vscodeLanguageIds) &&
      lang.vscodeLanguageIds.includes(languageId) &&
      // Only for some specific filenames
      (lang.extensions.length > 0 ||
        (typeof path === 'string' && Array.isArray(lang.filenames) && lang.filenames.includes(basename(path))))
    );
  });

  return language ? language.parsers : [];
}

export const allEnabledLanguages: string[] = getSupportLanguages().reduce((ids: string[], lang) => {
  if (lang.vscodeLanguageIds) {
    ids.push(...lang.vscodeLanguageIds);
  }
  return ids;
}, []);

export const supportedLanguages = ['javascript', 'javascriptreact', 'typescript', 'typescriptreact', 'json', 'graphql'];
export const eslintSupportedLanguages = ['javascript', 'javascriptreact', 'typescript', 'typescriptreact', 'vue'];
export const stylelintSupportedParsers: prettier.ParserOption[] = ['css', 'less', 'scss'];
export const typescriptSupportedParser: prettier.ParserOption = 'typescript';

export function getGroup(group: string): prettier.PrettierSupportInfo['languages'] {
  return getSupportLanguages().filter(language => language.group === group);
}

function getSupportLanguages(prettierInstance: typeof import('prettier') = prettier) {
  if (prettierInstance.getSupportInfo) {
    return prettierInstance.getSupportInfo(prettierInstance.version).languages;
  } else {
    return prettier.getSupportInfo(prettierInstance.version).languages;
  }
}

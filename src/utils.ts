import * as childProcess from 'child_process';
import * as path from 'path';
import * as prettier from 'prettier';
import { promisify } from 'util';
import { Uri, workspace } from 'vscode';

export function getVSCodeConfig(uri?: Uri): prettier.PrettierVSCodeConfig {
  return workspace.getConfiguration('prettier', uri) as any;
}

export function getSupportedParser(
  languageId: string,
  filepath?: string
): prettier.ParserOption | prettier.PluginParserOption {
  if (!filepath) {
    return getParserByLanguageId(languageId);
  }

  const supportedLanguage = supportedLanguagesFromPrettier[languageId];
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

const prettierSupportedLanguages = prettier.getSupportInfo(prettier.version).languages;

const supportedLanguagesFromPrettier: {
  [languageId: string]: {
    filenames: string[];
    extensions: string[];
    parsers: prettier.ParserOption[];
  }[];
} = prettierSupportedLanguages.reduce((obj: any, prettierLang) => {
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

export const supportedPluginLanguageIds = ['php', 'jade', 'ruby', 'swift', 'xml'];

export const allSupportedLanguageIds = [
  ...prettierSupportedLanguages.reduce((ids: string[], lang) => {
    if (lang.vscodeLanguageIds) {
      ids.push(...lang.vscodeLanguageIds);
    }
    return ids;
  }, []),
  ...supportedPluginLanguageIds
];

const allSupportedLanguageParsers: {
  [key: string]: (prettier.ParserOption | prettier.PluginParserOption)[];
} = {
  // Prettier
  mongo: ['babel', 'flow'],
  javascript: ['babel', 'flow'],
  javascriptreact: ['babel', 'flow'],
  typescript: ['typescript'],
  typescriptreact: ['typescript'],
  json: ['json'],
  jsonc: ['json'],
  json5: ['json5'],
  css: ['css'],
  postcss: ['css'],
  less: ['less'],
  scss: ['scss'],
  graphql: ['graphql'],
  markdown: ['markdown'],
  mdx: ['mdx'],
  html: ['html'],
  vue: ['vue'],
  yaml: ['yaml'],
  // Plugins
  php: ['php'],
  jade: ['pug'],
  ruby: ['ruby'],
  swift: ['swift'],
  xml: ['xml']
};

function getParserByLanguageId(languageId: string): prettier.ParserOption | prettier.PluginParserOption {
  const parsers = allSupportedLanguageParsers[languageId];
  return parsers?.[0] ?? '';
}

export async function getGlobalNodeModulesPaths(): Promise<(string | undefined)[]> {
  const promisifiedExec = promisify(childProcess.exec);
  const executeCommand = async (cmd: string): Promise<string | undefined> => {
    try {
      let nodeModulesPath = (await promisifiedExec(cmd)).stdout.trim();
      if (nodeModulesPath.endsWith('node_modules')) {
        nodeModulesPath = nodeModulesPath.replace('node_modules', '');
      }
      return nodeModulesPath;
    } catch {}
  };

  return Promise.all([executeCommand('yarn global dir'), executeCommand('npm -g root')]);
}

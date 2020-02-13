import * as path from 'path';
import * as prettier from 'prettier';

type SupportedLanguagesFromPrettier = {
  [languageId: string]: {
    filenames: string[];
    extensions: string[];
    parsers: prettier.ParserOption[];
  }[];
};

export class Parser {
  static readonly supportedPluginLanguageIds = ['php', 'jade', 'ruby', 'swift', 'xml'];
  private static readonly prettierSupportedLanguages = prettier.getSupportInfo(prettier.version).languages;
  private static readonly allSupportedLanguageParsers: {
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
  private static cachedAllSupportedLanguageIds: string[];
  private static cachedSupportedLanguagesFromPrettier: SupportedLanguagesFromPrettier;

  static supportedParser(languageId: string, filepath?: string): prettier.ParserOption | prettier.PluginParserOption {
    if (!filepath) {
      return this.parserByLanguageId(languageId);
    }

    const supportedLanguage = this.supportedLanguagesFromPrettier[languageId];
    if (!supportedLanguage) {
      return this.parserByLanguageId(languageId);
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

    return this.parserByLanguageId(languageId);
  }

  static get supportedLanguageIds(): string[] {
    if (!this.cachedAllSupportedLanguageIds) {
      this.cachedAllSupportedLanguageIds = [
        ...this.prettierSupportedLanguages.reduce((ids: string[], lang) => {
          if (lang.vscodeLanguageIds) {
            ids.push(...lang.vscodeLanguageIds);
          }
          return ids;
        }, []),
        ...this.supportedPluginLanguageIds
      ];
    }

    return this.cachedAllSupportedLanguageIds;
  }

  private static get supportedLanguagesFromPrettier(): SupportedLanguagesFromPrettier {
    if (!this.cachedSupportedLanguagesFromPrettier) {
      this.cachedSupportedLanguagesFromPrettier = this.prettierSupportedLanguages.reduce((obj: any, prettierLang) => {
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
    }

    return this.cachedSupportedLanguagesFromPrettier;
  }

  private static parserByLanguageId(languageId: string): prettier.ParserOption | prettier.PluginParserOption {
    const parsers = this.allSupportedLanguageParsers[languageId];
    return parsers?.[0] ?? '';
  }
}

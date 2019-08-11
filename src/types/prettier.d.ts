declare module 'prettier' {
  type ParserOption =
    | 'none'
    | 'babel'
    | 'babel-flow'
    | 'flow'
    | 'typescript'
    | 'css'
    | 'scss'
    | 'less'
    | 'json'
    | 'json5'
    | 'json-stringify'
    | 'graphql'
    | 'markdown'
    | 'mdx'
    | 'html'
    | 'vue'
    | 'angular'
    | 'lwc'
    | 'yaml';

  type TrailingCommaOption = 'none' | 'es5' | 'all';

  interface PrettierConfig {
    printWidth: number;
    tabWidth: number;
    singleQuote: boolean;
    trailingComma: TrailingCommaOption;
    bracketSpacing: boolean;
    jsxBracketSameLine: boolean;
    parser: ParserOption;
    semi: boolean;
    useTabs: boolean;
    proseWrap: 'preserve' | 'always' | 'never';
    arrowParens: 'avoid' | 'always';
    rangeStart: number;
    rangeEnd: number;
    filepath: string;
    jsxSingleQuote: boolean;
    htmlWhitespaceSensitivity: 'css' | 'strict' | 'ignore';
    endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
    quoteProps: 'as-needed' | 'consistent' | 'preserve';
  }

  interface PrettierSupportInfo {
    languages: {
      name: string;
      since: string;
      parsers: ParserOption[];
      tmScope: string;
      aceMode: string;
      codemirrorMode: string;
      codemirrorMimeType: string;
      extensions: string[];
      linguistLanguageId: number;
      filenames?: string[];
      aliases?: string[];
      group?: string;
      vscodeLanguageIds?: string[]; // Since prettier v1.14.0
    }[];
  }

  function format(text: string, options?: Partial<PrettierConfig>): string;

  function resolveConfig(
    filePath: string,
    options?: {
      /**
       * Use cache, defaults to true.
       */
      useCache?: boolean;
      /**
       * Read `.editorconfig`, defaults to false.
       */
      editorconfig?: boolean;
    }
  ): Promise<PrettierConfig>;

  function clearConfigCache(): void;

  function getSupportInfo(version?: string): PrettierSupportInfo;

  const version: string;

  /**
   * Extension specific configuration
   */
  interface ExtensionConfig {
    /**
     * Use `prettier-eslint` instead of `prettier`.
     */
    eslintIntegration: boolean;
    /**
     * Use `prettier-tslint` instead of `prettier`.
     */
    tslintIntegration: boolean;
    /**
     * Use `prettier-stylelint` instead of `prettier`.
     */
    stylelintIntegration: boolean;
    /**
     * Path to a `.prettierignore` or similar file such as `.gitignore`.
     */
    ignorePath: string;
    /**
     * Require a config to format code.
     */
    requireConfig: boolean;
    /**
     * List of languages IDs to ignore.
     */
    disableLanguages: string[];
  }

  type PrettierVSCodeConfig = ExtensionConfig & PrettierConfig;
}

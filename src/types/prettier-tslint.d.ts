declare module 'prettier-tslint' {
  import { PrettierConfig } from 'prettier';

  type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

  interface PrettierTslintOptions {
    /**
     * The path of the file being formatted
     * can be used in instead of `tslintConfig` (tslint will be used to find the
     * relevant config for the file). Will also be used to load the `text` if
     * `text` is not provided.
     */
    filePath?: string;
    /**
     * The text (TypeScript code) to format.
     */
    text: string;
    /**
     * The path to the tslint module to use. Will default to `require.resolve('tslint')`
     */
    tslintPath?: string;
    /**
     * The config to use for formatting with TSLint.
     */
    tslintConfig?: object;
    /**
     * The options to pass for formatting with `prettier`.
     * If not provided, prettier-tslint will attempt to create the options based on the `tslintConfig`
     */
    prettierOptions?: Partial<PrettierConfig>;
    /**
     * The options to pass for formatting with `prettier`.
     * If the given option is not inferrable from the `tslintConfig`
     */
    fallbackPrettierOptions?: Partial<PrettierConfig>;
    /**
     * The level for the logs.
     */
    logLevel?: LogLevel;
    /**
     * Run Prettier last, defaults to false.
     */
    prettierLast?: boolean;
  }

  /**
   * Format TypeScript code with `prettier-tslint`
   * @returns the formatted code.
   */
  function format(options: PrettierTslintOptions): string;
}

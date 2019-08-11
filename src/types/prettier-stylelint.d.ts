declare module 'prettier-stylelint' {
  import { PrettierConfig } from 'prettier';

  type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

  interface PrettierStylelintOptions {
    /**
     * The path of the file being formatted
     * can be used in instead of `stylelintConfig` (styleling will be used to find the
     * relevant config for the file). Will also be used to load the `text` if
     * `text` is not provided.
     */
    filePath?: string;
    /**
     * The text (JavaScript code) to format.
     */
    text: string;
    /**
     * The path to the stylelint module to use. Will default to `require.resolve('stylelint')`
     */
    stylelintPath?: string;
    /**
     * The config to use for formatting with stylelint.
     */
    stylelintConfig?: object;
    /**
     * The options to pass for formatting with `prettier`.
     * If not provided, prettier-stylelint will attempt to create the options based on the `stylelintConfig`
     */
    prettierOptions?: Partial<PrettierConfig>;
    /**
     * The options to pass for formatting with `prettier`.
     * If the given option is not inferrable from the `stylelintConfig`
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

  function format(options: PrettierStylelintOptions): Promise<string>;
  function resolveConfig(
    file: string,
    options?: {
      useCache: boolean;
    }
  ): Promise<[PrettierConfig, object]>;
}

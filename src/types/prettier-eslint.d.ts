declare module 'prettier-eslint' {
	import { PrettierConfig } from 'prettier';

	type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

	interface PrettierEslintOptions {
		/**
		 * The path of the file being formatted
		 * can be used in instead of `eslintConfig` (eslint will be used to find the
		 * relevant config for the file). Will also be used to load the `text` if
		 * `text` is not provided.
		 */
		filePath?: string;
		/**
		 * The text (JavaScript code) to format.
		 */
		text: string;
		/**
		 * The path to the eslint module to use. Will default to `require.resolve('eslint')`
		 */
		eslintPath?: string;
		/**
		 * The config to use for formatting with ESLint.
		 */
		eslintConfig?: object;
		/**
		 * The options to pass for formatting with `prettier`.
		 * If not provided, prettier-eslint will attempt to create the options based on the `eslintConfig`
		 */
		prettierOptions?: Partial<PrettierConfig>;
		/**
		 * The options to pass for formatting with `prettier`.
		 * If the given option is not inferrable from the `eslintConfig`
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
	 * Format JavaScript code with `prettier-eslint`
	 * @returns the formatted code.
	 */
	function format(options: PrettierEslintOptions): string;
	export = format;
}

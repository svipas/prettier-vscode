import * as prettier from 'prettier';
import prettierEslint from 'prettier-eslint';
import * as prettierStylelint from 'prettier-stylelint';
import * as prettierTslint from 'prettier-tslint';
import {
  CancellationToken,
  DocumentFormattingEditProvider,
  DocumentRangeFormattingEditProvider,
  FormattingOptions,
  Range,
  TextDocument,
  TextEdit
} from 'vscode';
import { addToOutput, safeExecution, setUsedModule } from './errorHandler';
import { requireLocalPrettier } from './requirePkg';
import {
  eslintSupportedLanguages,
  getConfig,
  getParsersFromLanguageId,
  stylelintSupportedParsers,
  typescriptSupportedParser
} from './utils';

/**
 * Check if a given file has an associated prettier config.
 * @param filePath file's path
 */
async function hasPrettierConfig(filePath: string): Promise<boolean> {
  const { config } = await resolveConfig(filePath);
  return !!config;
}

type ResolveConfigResult = { config: prettier.PrettierConfig | null; error?: Error };

/**
 * Resolves the prettier config for the given file.
 * @param filePath file's path
 */
async function resolveConfig(filePath: string, options?: { editorconfig?: boolean }): Promise<ResolveConfigResult> {
  try {
    const config = await prettier.resolveConfig(filePath, options);
    return { config };
  } catch (error) {
    return { config: null, error };
  }
}

/**
 * Define which config should be used.
 * If a prettier config exists, it returns itself.
 * It merges prettier config into VS Code's config (`.editorconfig`).
 * Priority:
 * - `additionalConfig`
 * - `prettierConfig`
 * - `vscodeConfig`
 * @param hasPrettierConfig a prettierconfig exists
 * @param additionalConfig config we really want to see in. (range)
 * @param prettierConfig prettier's file config
 * @param vscodeConfig our config
 */
function mergeConfig(
  hasPrettierConfig: boolean,
  additionalConfig: Partial<prettier.PrettierConfig>,
  prettierConfig: Partial<prettier.PrettierConfig>,
  vscodeConfig: Partial<prettier.PrettierConfig>
) {
  if (hasPrettierConfig) {
    // Always merge our inferred parser in
    return { parser: vscodeConfig.parser, ...prettierConfig, ...additionalConfig };
  }
  return { ...vscodeConfig, ...prettierConfig, ...additionalConfig };
}
/**
 * Format the given text with user's configuration.
 * @param text text to format
 * @param path formatting file's path
 * @returns formatted text
 */
async function format(
  text: string,
  { fileName, languageId, uri, isUntitled }: TextDocument,
  customOptions: Partial<prettier.PrettierConfig>
): Promise<string> {
  const vscodeConfig: prettier.PrettierVSCodeConfig = getConfig(uri);
  const localPrettier = requireLocalPrettier(fileName);

  // This has to stay, as it allows to skip in sub workspaceFolders. Sadly noop.
  // wf1  (with "lang") -> glob: "wf1/**"
  // wf1/wf2  (without "lang") -> match "wf1/**"
  if (vscodeConfig.disableLanguages.includes(languageId)) {
    return text;
  }

  const dynamicParsers = getParsersFromLanguageId(languageId, localPrettier, isUntitled ? undefined : fileName);
  let useBundled = false;
  let parser: prettier.ParserOption = 'none';

  if (dynamicParsers.length !== 0) {
    const bundledParsers = getParsersFromLanguageId(languageId, prettier, isUntitled ? undefined : fileName);
    if (bundledParsers[0]) {
      parser = bundledParsers[0];
    }
    useBundled = true;
  } else if (dynamicParsers.includes(vscodeConfig.parser)) {
    parser = vscodeConfig.parser;
  } else {
    parser = dynamicParsers[0];
  }

  const hasConfig = await hasPrettierConfig(fileName);
  if (vscodeConfig.requireConfig && !hasConfig) {
    return text;
  }

  const { config: fileOptions, error } = await resolveConfig(fileName, { editorconfig: true });
  if (error) {
    addToOutput(`Failed to resolve config for ${fileName}. Falling back to the default config settings.`);
  }

  const prettierOptions = mergeConfig(hasConfig, customOptions, fileOptions || {}, {
    printWidth: vscodeConfig.printWidth,
    tabWidth: vscodeConfig.tabWidth,
    singleQuote: vscodeConfig.singleQuote,
    trailingComma: vscodeConfig.trailingComma,
    bracketSpacing: vscodeConfig.bracketSpacing,
    jsxBracketSameLine: vscodeConfig.jsxBracketSameLine,
    semi: vscodeConfig.semi,
    useTabs: vscodeConfig.useTabs,
    proseWrap: vscodeConfig.proseWrap,
    arrowParens: vscodeConfig.arrowParens,
    jsxSingleQuote: vscodeConfig.jsxSingleQuote,
    htmlWhitespaceSensitivity: vscodeConfig.htmlWhitespaceSensitivity,
    endOfLine: vscodeConfig.endOfLine,
    quoteProps: vscodeConfig.quoteProps,
    parser
  });

  if (vscodeConfig.tslintIntegration && typescriptSupportedParser === parser) {
    return safeExecution(
      () => {
        addToOutput(`Using local prettier-tslint@0.4.2 for ${languageId}.`);
        setUsedModule('prettier-tslint', '0.4.2', true);
        return prettierTslint.format({
          text,
          filePath: fileName,
          fallbackPrettierOptions: prettierOptions
        });
      },
      text,
      fileName
    );
  }

  const doesParserSupportEslint = eslintSupportedLanguages.includes(languageId);
  if (vscodeConfig.eslintIntegration && doesParserSupportEslint) {
    return safeExecution(
      () => {
        addToOutput(`Using local prettier-eslint@9.0.0 for ${languageId}.`);
        setUsedModule('prettier-eslint', '9.0.0', true);
        return prettierEslint({
          text,
          filePath: fileName,
          fallbackPrettierOptions: prettierOptions
        });
      },
      text,
      fileName
    );
  }

  if (vscodeConfig.stylelintIntegration && stylelintSupportedParsers.includes(parser)) {
    addToOutput(`Using local prettier-stylelint@0.4.2 for ${languageId}.`);
    setUsedModule('prettier-stylelint', '0.4.2', true);
    return safeExecution(
      prettierStylelint.format({
        text,
        filePath: fileName,
        prettierOptions
      }),
      text,
      fileName
    );
  }

  if (useBundled) {
    return safeExecution(
      () => {
        addToOutput(`Using bundled prettier@${prettier.version} for ${languageId}.`);
        setUsedModule('prettier', prettier.version, true);
        return prettier.format(text, prettierOptions);
      },
      text,
      fileName
    );
  }

  addToOutput(`Using local prettier@${localPrettier.version} for ${languageId}.`);
  setUsedModule('prettier', localPrettier.version, false);
  return safeExecution(() => localPrettier.format(text, prettierOptions), text, fileName);
}

function fullDocumentRange(document: TextDocument): Range {
  const lastLineId = document.lineCount - 1;
  return new Range(0, 0, lastLineId, document.lineAt(lastLineId).text.length);
}

export class PrettierEditProvider implements DocumentRangeFormattingEditProvider, DocumentFormattingEditProvider {
  constructor(private _fileIsIgnored: (filePath: string) => boolean) {}

  provideDocumentRangeFormattingEdits(
    document: TextDocument,
    range: Range,
    _options: FormattingOptions,
    _token: CancellationToken
  ): Promise<TextEdit[]> {
    return this._provideEdits(document, {
      rangeStart: document.offsetAt(range.start),
      rangeEnd: document.offsetAt(range.end)
    });
  }

  provideDocumentFormattingEdits(
    document: TextDocument,
    _options: FormattingOptions,
    _token: CancellationToken
  ): Promise<TextEdit[]> {
    return this._provideEdits(document, {});
  }

  private _provideEdits(document: TextDocument, options: Partial<prettier.PrettierConfig>): Promise<TextEdit[]> {
    if (!document.isUntitled && this._fileIsIgnored(document.fileName)) {
      return Promise.resolve([]);
    }

    return format(document.getText(), document, options).then(code => [
      TextEdit.replace(fullDocumentRange(document), code)
    ]);
  }
}

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
  eslintSupportedLanguageIds,
  getConfig,
  getSupportedParser,
  stylelintSupportedLanguageIds,
  tslintSupportedLanguageIds
} from './utils';

/**
 * Resolves the prettier config for the given file.
 * @param filePath file's path
 */
async function resolveConfig(
  filePath: string,
  options?: { editorconfig?: boolean }
): Promise<{ config?: prettier.PrettierConfig; error: Error | null }> {
  try {
    const config = await prettier.resolveConfig(filePath, options);
    return { config, error: null };
  } catch (error) {
    return { error };
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
 * @param additionalConfig config we really want to see in
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

  // This has to stay, as it allows to skip in sub workspaceFolders. Sadly noop.
  // wf1  (with "lang") -> glob: "wf1/**"
  // wf1/wf2  (without "lang") -> match "wf1/**"
  if (vscodeConfig.disableLanguages.includes(languageId)) {
    return text;
  }

  let parser: prettier.ParserOption = vscodeConfig.parser;
  if (parser === '') {
    parser = getSupportedParser(languageId, isUntitled ? undefined : fileName);
  }

  let configOptions: prettier.PrettierConfig | undefined;
  let hasConfig = false;
  if (vscodeConfig.requireConfig) {
    const { config, error } = await resolveConfig(fileName, { editorconfig: true });
    if (error != null) {
      addToOutput(`Failed to resolve config for ${fileName}. Falling back to the default settings.`);
    } else if (config == null) {
      addToOutput(`Prettier config is empty. Falling back to the default settings.`);
    } else {
      configOptions = config;
      hasConfig = true;
    }
  }

  const prettierOptions = mergeConfig(hasConfig, customOptions, configOptions || {}, {
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
    filepath: fileName,
    parser
  });

  const sendToOutput = (name: string, version: string, bundled: boolean) => {
    addToOutput(
      `Using ${name}@${version} (${bundled ? 'bundled' : 'local'})${
        hasConfig ? ' with Prettier config' : ''
      } to format code with ${parser} parser for ${languageId} language.`,
      fileName
    );
  };

  if (vscodeConfig.tslintIntegration && tslintSupportedLanguageIds.includes(languageId)) {
    return safeExecution(
      () => {
        sendToOutput('prettier-tslint', '0.4.2', true);
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

  if (vscodeConfig.eslintIntegration && eslintSupportedLanguageIds.includes(languageId)) {
    return safeExecution(
      () => {
        sendToOutput('prettier-eslint', '9.0.0', true);
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

  if (vscodeConfig.stylelintIntegration && stylelintSupportedLanguageIds.includes(languageId)) {
    sendToOutput('prettier-stylelint', '0.4.2', true);
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

  const localPrettier = requireLocalPrettier(fileName);
  if (localPrettier) {
    sendToOutput('prettier', localPrettier.version, false);
    setUsedModule('prettier', localPrettier.version, false);
    return safeExecution(() => localPrettier.format(text, prettierOptions), text, fileName);
  }

  return safeExecution(
    () => {
      sendToOutput('prettier', prettier.version, true);
      setUsedModule('prettier', prettier.version, true);
      return prettier.format(text, prettierOptions);
    },
    text,
    fileName
  );
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

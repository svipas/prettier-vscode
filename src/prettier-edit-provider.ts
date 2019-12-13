import * as prettier from 'prettier';
import { DocumentFormattingEditProvider, Range, TextDocument, TextEdit, workspace } from 'vscode';
import { errorHandler } from './error-handler';
import { integration } from './integration';
import { globalNodeModulesPaths } from './main';
import { getSupportedParser, getVSCodeConfig, supportedPluginLanguageIds } from './utils';

/**
 * Resolves the prettier config for the given file.
 * @param filePath file's path.
 */
async function resolvePrettierConfig(
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
 * @param hasPrettierConfig a prettier config exists.
 * @param prettierConfig config from prettier's config file.
 * @param vscodeConfig vscode config.
 */
function mergeConfig(
  hasPrettierConfig: boolean,
  prettierConfig: Partial<prettier.PrettierConfig>,
  vscodeConfig: Partial<prettier.PrettierConfig>
) {
  if (hasPrettierConfig) {
    // Always merge our inferred parser in.
    return { parser: vscodeConfig.parser, ...prettierConfig };
  }
  return { ...vscodeConfig, ...prettierConfig };
}

/**
 * Format the given text with user's configuration.
 * @param text text to format.
 * @param path formatting file's path.
 * @returns formatted text.
 */
async function format(text: string, { fileName, languageId, uri, isUntitled }: TextDocument): Promise<string> {
  const vscodeConfig: prettier.PrettierVSCodeConfig = getVSCodeConfig(uri);
  const workspaceFolderPaths: string[] = [];

  // This has to stay, as it allows to skip in sub workspaceFolders. Sadly noop.
  // wf1  (with "lang") -> glob: "wf1/**"
  // wf1/wf2  (without "lang") -> match "wf1/**"
  if (vscodeConfig.disableLanguages.includes(languageId)) {
    return text;
  }

  if (supportedPluginLanguageIds.includes(languageId)) {
    workspace.workspaceFolders?.forEach(wf => workspaceFolderPaths.push(wf.uri.fsPath));
    globalNodeModulesPaths.forEach(globalPath => globalPath && workspaceFolderPaths.push(globalPath));
  }

  let parser: prettier.ParserOption | prettier.PluginParserOption = vscodeConfig.parser;
  if (parser === '') {
    parser = getSupportedParser(languageId, isUntitled ? undefined : fileName);
  }

  let configOptions: prettier.PrettierConfig | undefined;
  let hasConfig = false;
  if (vscodeConfig.requireConfig) {
    const { config, error } = await resolvePrettierConfig(fileName, { editorconfig: true });
    if (error != null) {
      errorHandler.log(`Failed to resolve config for ${fileName}. Falling back to the default settings.`);
    } else if (config == null) {
      errorHandler.log(`Prettier config is empty. Falling back to the default settings.`);
    } else {
      configOptions = config;
      hasConfig = true;
    }
  }

  const prettierOptions = mergeConfig(hasConfig, configOptions || {}, {
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
    vueIndentScriptAndStyle: vscodeConfig.vueIndentScriptAndStyle,
    endOfLine: vscodeConfig.endOfLine,
    quoteProps: vscodeConfig.quoteProps,
    filepath: fileName,
    pluginSearchDirs: workspaceFolderPaths,
    parser
  });

  const sendToOutput = (name: string, version: string) => {
    errorHandler.log(
      `Using ${name}@${version}${
        hasConfig ? ' with Prettier config' : ''
      } to format code with ${parser} parser for ${languageId} language.`,
      fileName
    );
    errorHandler.setUsedModule(name, version);
  };

  const { prettierESLint, prettierStylelint, prettierTSLint } = integration;

  if (vscodeConfig.tslintIntegration && prettierTSLint.languageIds.includes(languageId)) {
    return errorHandler.safeExecution(
      () => {
        sendToOutput('prettier-tslint', '0.4.2');
        return prettierTSLint.getModule().format({
          text,
          filePath: fileName,
          fallbackPrettierOptions: prettierOptions
        });
      },
      text,
      fileName
    );
  }

  if (vscodeConfig.eslintIntegration && prettierESLint.languageIds.includes(languageId)) {
    return errorHandler.safeExecution(
      () => {
        sendToOutput('prettier-eslint', '9.0.1');
        return prettierESLint.getModule()({
          text,
          filePath: fileName,
          fallbackPrettierOptions: prettierOptions
        });
      },
      text,
      fileName
    );
  }

  if (vscodeConfig.stylelintIntegration && prettierStylelint.languageIds.includes(languageId)) {
    sendToOutput('prettier-stylelint', '0.4.2');
    return errorHandler.safeExecution(
      prettierStylelint.getModule().format({
        text,
        filePath: fileName,
        prettierOptions
      }),
      text,
      fileName
    );
  }

  return errorHandler.safeExecution(
    () => {
      sendToOutput('prettier', prettier.version);
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

export class PrettierEditProvider implements DocumentFormattingEditProvider {
  constructor(private readonly _fileIsIgnored: (filePath: string) => Promise<boolean>) {}

  provideDocumentFormattingEdits(document: TextDocument): Promise<TextEdit[]> {
    return this._provideEdits(document);
  }

  private async _provideEdits(document: TextDocument): Promise<TextEdit[]> {
    if (!document.isUntitled && (await this._fileIsIgnored(document.fileName))) {
      return [];
    }

    const formattedText = await format(document.getText(), document);
    return [TextEdit.replace(fullDocumentRange(document), formattedText)];
  }
}

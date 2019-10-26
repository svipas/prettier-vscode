import { Disposable, DocumentFilter, ExtensionContext, languages, workspace } from 'vscode';
import { configFileListener } from './configCacheHandler';
import { registerDisposables, setupErrorHandler } from './errorHandler';
import { ignoreFileHandler } from './ignoreFileHandler';
import { PrettierEditProvider } from './PrettierEditProvider';
import { allSupportedLanguageIds, getVSCodeConfig } from './utils';

let formatterHandler: undefined | Disposable;

function disposeFormatterHandler() {
  if (formatterHandler) {
    formatterHandler.dispose();
    formatterHandler = undefined;
  }
}

function formatterSelector(): string[] | DocumentFilter[] {
  const { disableLanguages } = getVSCodeConfig();
  let globalLanguageSelector = allSupportedLanguageIds;

  if (disableLanguages.length !== 0) {
    globalLanguageSelector = globalLanguageSelector.filter(lang => !disableLanguages.includes(lang));
  }

  // No workspace opened
  if (!workspace.workspaceFolders) {
    return globalLanguageSelector;
  }

  const untitledLanguageSelector: DocumentFilter[] = globalLanguageSelector.map(lang => ({
    language: lang,
    scheme: 'untitled'
  }));

  const fileLanguageSelector: DocumentFilter[] = globalLanguageSelector.map(lang => ({
    language: lang,
    scheme: 'file'
  }));

  return untitledLanguageSelector.concat(fileLanguageSelector);
}

export function activate(context: ExtensionContext) {
  const { fileIsIgnored } = ignoreFileHandler(context.subscriptions);
  const prettierEditProvider = new PrettierEditProvider(fileIsIgnored);

  const registerFormatter = () => {
    disposeFormatterHandler();

    const languageSelector = formatterSelector();
    formatterHandler = languages.registerDocumentFormattingEditProvider(languageSelector, prettierEditProvider);
  };

  registerFormatter();

  context.subscriptions.push(
    workspace.onDidChangeWorkspaceFolders(registerFormatter),
    { dispose: disposeFormatterHandler },
    setupErrorHandler(),
    configFileListener(),
    ...registerDisposables()
  );
}

export function deactivate() {}

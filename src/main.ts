import { Disposable, DocumentFilter, ExtensionContext, languages, workspace } from 'vscode';
import { configCacheHandler } from './config-cache-handler';
import { errorHandler } from './error-handler';
import { ignoreFileHandler } from './ignore-file-handler';
import { PrettierEditProvider } from './prettier-edit-provider';
import { allSupportedLanguageIds, getGlobalNodeModulesPaths, getVSCodeConfig } from './utils';

let formatterHandler: Disposable | undefined;
export let globalNodeModulesPaths: (string | undefined)[];

function disposeFormatterHandler() {
  formatterHandler?.dispose();
  formatterHandler = undefined;
}

function formatterSelector(): string[] | DocumentFilter[] {
  const { disableLanguages } = getVSCodeConfig();
  let globalLanguageSelector = allSupportedLanguageIds;

  if (disableLanguages.length !== 0) {
    globalLanguageSelector = globalLanguageSelector.filter(lang => !disableLanguages.includes(lang));
  }

  // No workspace opened.
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

export async function activate(context: ExtensionContext) {
  globalNodeModulesPaths = await getGlobalNodeModulesPaths();
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
    configCacheHandler.fileWatcher,
    ...errorHandler.disposables
  );
}

export function deactivate() {}

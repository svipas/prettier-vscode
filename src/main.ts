import * as vscode from 'vscode';
import { errorHandlerDisposables } from './error-handler';
import { ignoreFileHandler } from './ignore-file-handler';
import { allVSCodeLanguageIds } from './parser';
import { prettierConfigFileWatcher } from './prettier-config-file-watcher';
import { PrettierEditProvider } from './PrettierEditProvider';
import { getVSCodeConfig } from './utils';

let formatterHandler: vscode.Disposable | undefined;

function disposeFormatterHandler() {
	formatterHandler?.dispose();
	formatterHandler = undefined;
}

function formatterSelector(): string[] | vscode.DocumentFilter[] {
	const { disableLanguages } = getVSCodeConfig();
	let globalLanguageSelector: string[];

	if (disableLanguages.length !== 0) {
		globalLanguageSelector = allVSCodeLanguageIds.filter(lang => !disableLanguages.includes(lang));
	} else {
		globalLanguageSelector = allVSCodeLanguageIds;
	}

	// No workspace opened.
	if (!vscode.workspace.workspaceFolders) {
		return globalLanguageSelector;
	}

	const untitledLanguageSelector: vscode.DocumentFilter[] = globalLanguageSelector.map(lang => ({
		language: lang,
		scheme: 'untitled'
	}));

	const fileLanguageSelector: vscode.DocumentFilter[] = globalLanguageSelector.map(lang => ({
		language: lang,
		scheme: 'file'
	}));

	return untitledLanguageSelector.concat(fileLanguageSelector);
}

export async function activate(context: vscode.ExtensionContext) {
	const { fileIsIgnored } = ignoreFileHandler(context.subscriptions);
	const prettierEditProvider = new PrettierEditProvider(fileIsIgnored);

	const registerFormatter = () => {
		disposeFormatterHandler();

		const languageSelector = formatterSelector();
		formatterHandler = vscode.languages.registerDocumentFormattingEditProvider(languageSelector, prettierEditProvider);
	};

	registerFormatter();

	context.subscriptions.push(
		vscode.workspace.onDidChangeWorkspaceFolders(registerFormatter),
		{ dispose: disposeFormatterHandler },
		prettierConfigFileWatcher,
		...errorHandlerDisposables
	);
}

export function deactivate() {}

import * as vscode from 'vscode';
import { errorHandlerDisposables } from './errorHandler';
import { ignoreFileHandler } from './ignoreFileHandler';
import { allLanguageIds } from './parser';
import { prettierConfigFileWatcher } from './prettierConfigFileWatcher';
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
		globalLanguageSelector = allLanguageIds.filter(lang => !disableLanguages.includes(lang));
	} else {
		globalLanguageSelector = allLanguageIds;
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

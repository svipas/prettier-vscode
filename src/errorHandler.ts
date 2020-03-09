import * as vscode from 'vscode';
import { allLanguageIds } from './parser';
import { getVSCodeConfig } from './utils';

type EditorPart = 'debug' | 'output';

const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, -1);
statusBarItem.text = 'Prettier+';
statusBarItem.command = 'prettier-plus.open-output';
toggleStatusBar(vscode.window.activeTextEditor);

const outputChannel = vscode.window.createOutputChannel('Prettier+');
let prettierInformation: string | undefined;

function toggleStatusBar(editor: vscode.TextEditor | undefined) {
  if (!editor) {
    statusBarItem.hide();
    return;
  }

  // The function will be triggered everytime the active "editor" instance changes.
  // It also triggers when we focus on the output panel or on the debug panel.
  // Both are seen as an "editor".
  // The following check will ignore such panels.
  const textDocumentEditorPart = editor.document.uri.scheme as EditorPart;
  if (textDocumentEditorPart === 'debug' || textDocumentEditorPart === 'output') {
    return;
  }

  const { disableLanguages } = getVSCodeConfig(editor.document.uri);
  const score = vscode.languages.match(allLanguageIds, editor.document);

  if (score > 0 && !disableLanguages.includes(editor.document.languageId)) {
    statusBarItem.show();
  } else {
    statusBarItem.hide();
  }
}

function updateStatusBar(message: string) {
  statusBarItem.text = message;
  statusBarItem.tooltip = prettierInformation;
  statusBarItem.show();
}

export function setUsedModule(module: string, version: string) {
  prettierInformation = `${module}@${version}`;
}

/**
 * Append messages to the output channel and format it with a title.
 */
export function logMessage(message: string, filename?: string) {
  let title: string;
  if (filename) {
    title = `${filename} (${new Date().toLocaleString()}):`;
  } else {
    title = `${new Date().toLocaleString()}:`;
  }

  // Create a sort of title, to differentiate between messages
  outputChannel.appendLine(title);
  outputChannel.appendLine('-'.repeat(title.length));

  // Append actual output.
  outputChannel.appendLine(`${message}\n`);
}

/**
 * Execute a callback safely, if it doesn't work, return default and log messages.
 * @param cb The function to be executed.
 * @param defaultText The default value if execution of the callback failed.
 * @param filename The filename of the current document.
 * @returns formatted text or default text.
 */
export function safeExecution(
  cb: (() => string) | Promise<string>,
  defaultText: string,
  filename: string
): string | Promise<string> {
  if (cb instanceof Promise) {
    return cb
      .then(returnValue => {
        updateStatusBar('Prettier+: $(check)');
        return returnValue;
      })
      .catch((err: Error) => {
        logMessage(err.message, filename);
        updateStatusBar('Prettier+: $(x)');
        return defaultText;
      });
  }

  try {
    const returnValue = cb();
    updateStatusBar('Prettier+: $(check)');
    return returnValue;
  } catch (err) {
    logMessage(err.message, filename);
    updateStatusBar('Prettier+: $(x)');
    return defaultText;
  }
}

export const errorHandlerDisposables: vscode.Disposable[] = [
  vscode.window.onDidChangeActiveTextEditor(editor => toggleStatusBar(editor)),
  vscode.commands.registerCommand('prettier-plus.open-output', () => outputChannel.show())
];

import { commands, languages, StatusBarAlignment, TextEditor, window } from 'vscode';
import { allSupportedLanguageIds, getVSCodeConfig } from './utils';

type EditorPart = 'debug' | 'output';

// Create status bar item.
const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, -1);
statusBarItem.text = 'Prettier+';
statusBarItem.command = 'prettier-plus.open-output';
toggleStatusBarItem(window.activeTextEditor);

// Create output channel.
const outputChannel = window.createOutputChannel('Prettier+');

let prettierInformation: string | undefined;

function toggleStatusBarItem(editor: TextEditor | undefined) {
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
  const score = languages.match(allSupportedLanguageIds, editor.document);

  if (score > 0 && !disableLanguages.includes(editor.document.languageId)) {
    statusBarItem.show();
  } else {
    statusBarItem.hide();
  }
}

/**
 * Update status bar item message.
 */
function updateStatusBar(message: string) {
  statusBarItem.text = message;
  statusBarItem.tooltip = prettierInformation;
  statusBarItem.show();
}

/**
 * @param module module used.
 * @param version version of the module.
 */
function setUsedModule(module: string, version: string) {
  prettierInformation = `${module}@${version}`;
}

/**
 * Append messages to the output channel and format it with a title.
 */
function log(message: string, filename?: string) {
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
function safeExecution(
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
        log(err.message, filename);
        updateStatusBar('Prettier+: $(x)');
        return defaultText;
      });
  }

  try {
    const returnValue = cb();
    updateStatusBar('Prettier+: $(check)');
    return returnValue;
  } catch (err) {
    log(err.message, filename);
    updateStatusBar('Prettier+: $(x)');
    return defaultText;
  }
}

const disposables = [
  window.onDidChangeActiveTextEditor(editor => toggleStatusBarItem(editor)),
  commands.registerCommand('prettier-plus.open-output', () => outputChannel.show())
];

export const errorHandler = { disposables, setUsedModule, log, safeExecution };

import { PrettierVSCodeConfig } from 'prettier';
import {
  commands,
  Disposable,
  languages,
  OutputChannel,
  StatusBarAlignment,
  StatusBarItem,
  TextEditor,
  window
} from 'vscode';
import { allEnabledLanguages, getConfig } from './utils';

let statusBarItem: StatusBarItem;
let outputChannel: OutputChannel;
let prettierInformation: string;

const editorParts = ['debug', 'output'];

function toggleStatusBarItem(editor: TextEditor | undefined): void {
  if (!statusBarItem) {
    return;
  }

  if (!editor) {
    return statusBarItem.hide();
  }

  // The function will be triggered everytime the active "editor" instance changes
  // It also triggers when we focus on the output panel or on the debug panel
  // Both are seen as an "editor".
  // The following check will ignore such panels
  if (editorParts.some(part => editor.document.uri.scheme === part)) {
    return;
  }

  const score = languages.match(allEnabledLanguages, editor.document);
  const disabledLanguages: PrettierVSCodeConfig['disableLanguages'] = getConfig(editor.document.uri).disableLanguages;

  if (score > 0 && !disabledLanguages.includes(editor.document.languageId)) {
    statusBarItem.show();
  } else {
    statusBarItem.hide();
  }
}

export function registerDisposables(): Disposable[] {
  // Keep track whether to show/hide the statusbar
  return [window.onDidChangeActiveTextEditor(editor => toggleStatusBarItem(editor))];
}

/**
 * Update the `statusBarItem` message and show the `statusBarItem`
 * @param message the message to put inside the `statusBarItem`
 */
function updateStatusBar(message: string): void {
  statusBarItem.text = message;
  statusBarItem.tooltip = prettierInformation;
  statusBarItem.show();
}

/**
 * @param module the module used
 * @param version the version of the module
 * @param bundled it's bundled with the extension or not
 */
export function setUsedModule(module: string, version: string, bundled: boolean) {
  prettierInformation = `${module}@${version}${bundled ? ' (bundled)' : ''}`;
}

/**
 * Adds the filepath to the error message.
 * @param msg the original error message
 * @param fileName the path to the file
 * @returns enhanced message with the filename
 */
function addFilePath(msg: string, fileName: string): string {
  const lines = msg.split('\n');
  if (lines.length > 0) {
    lines[0] = lines[0].replace(/(\d*):(\d*)/g, `${fileName}:$1:$2`);
    return lines.join('\n');
  }
  return msg;
}

/**
 * Append messages to the output channel and format it with a title.
 * @param message the message to append to the output channel
 */
export function addToOutput(message: string): void {
  const title = `${new Date().toLocaleString()}:`;

  // Create a sort of title, to differentiate between messages
  outputChannel.appendLine(title);
  outputChannel.appendLine('-'.repeat(title.length));

  // Append actual output
  outputChannel.appendLine(`${message}\n`);
}

/**
 * Execute a callback safely, if it doesn't work, return default and log messages.
 * @param cb The function to be executed,
 * @param defaultText The default value if execution of the cb failed
 * @param fileName The filename of the current document
 * @returns {string} formatted text or defaultText
 */
export function safeExecution(
  cb: (() => string) | Promise<string>,
  defaultText: string,
  fileName: string
): string | Promise<string> {
  if (cb instanceof Promise) {
    return cb
      .then(returnValue => {
        updateStatusBar('Prettier: $(check)');
        return returnValue;
      })
      .catch((err: Error) => {
        addToOutput(addFilePath(err.message, fileName));
        updateStatusBar('Prettier: $(x)');
        return defaultText;
      });
  }

  try {
    const returnValue = cb();
    updateStatusBar('Prettier: $(check)');
    return returnValue;
  } catch (err) {
    addToOutput(addFilePath(err.message, fileName));
    updateStatusBar('Prettier: $(x)');
    return defaultText;
  }
}
/**
 * Setup the output channel and the `statusBarItem`
 * Create a command to show the output channel
 * @returns the command to open the output channel
 */
export function setupErrorHandler(): Disposable {
  // Setup the statusBarItem
  statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, -1);
  statusBarItem.text = 'Prettier';
  statusBarItem.command = 'prettier.open-output';

  toggleStatusBarItem(window.activeTextEditor);

  // Setup the outputChannel
  outputChannel = window.createOutputChannel('Prettier');

  return commands.registerCommand('prettier.open-output', () => outputChannel.show());
}

import * as vscode from 'vscode';
import { Parser } from './parser';
import { getVSCodeConfig } from './utils';

type EditorPart = 'debug' | 'output';

class StatusBarItem {
  private readonly statusBarItem: vscode.StatusBarItem;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, -1);
    this.statusBarItem.text = 'Prettier+';
    this.statusBarItem.command = 'prettier-plus.open-output';
    this.toggle(vscode.window.activeTextEditor);
  }

  toggle(editor: vscode.TextEditor | undefined) {
    if (!editor) {
      this.statusBarItem.hide();
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
    const score = vscode.languages.match(Parser.supportedLanguageIds, editor.document);

    if (score > 0 && !disableLanguages.includes(editor.document.languageId)) {
      this.statusBarItem.show();
    } else {
      this.statusBarItem.hide();
    }
  }

  update(message: string, tooltip?: string) {
    this.statusBarItem.text = message;
    this.statusBarItem.tooltip = tooltip;
    this.statusBarItem.show();
  }
}

export class ErrorHandler {
  private static readonly statusBarItem = new StatusBarItem();
  static readonly outputChannel = vscode.window.createOutputChannel('Prettier+');
  static prettierInformation?: string;

  static updateStatusBar(message: string) {
    this.statusBarItem.update(message, this.prettierInformation);
  }

  static setUsedModule(module: string, version: string) {
    this.prettierInformation = `${module}@${version}`;
  }

  /**
   * Append messages to the output channel and format it with a title.
   */
  static log(message: string, filename?: string) {
    let title: string;
    if (filename) {
      title = `${filename} (${new Date().toLocaleString()}):`;
    } else {
      title = `${new Date().toLocaleString()}:`;
    }

    // Create a sort of title, to differentiate between messages
    this.outputChannel.appendLine(title);
    this.outputChannel.appendLine('-'.repeat(title.length));

    // Append actual output.
    this.outputChannel.appendLine(`${message}\n`);
  }

  /**
   * Execute a callback safely, if it doesn't work, return default and log messages.
   * @param cb The function to be executed.
   * @param defaultText The default value if execution of the callback failed.
   * @param filename The filename of the current document.
   * @returns formatted text or default text.
   */
  static safeExecution(
    cb: (() => string) | Promise<string>,
    defaultText: string,
    filename: string
  ): string | Promise<string> {
    if (cb instanceof Promise) {
      return cb
        .then(returnValue => {
          this.updateStatusBar('Prettier+: $(check)');
          return returnValue;
        })
        .catch((err: Error) => {
          this.log(err.message, filename);
          this.updateStatusBar('Prettier+: $(x)');
          return defaultText;
        });
    }

    try {
      const returnValue = cb();
      this.updateStatusBar('Prettier+: $(check)');
      return returnValue;
    } catch (err) {
      this.log(err.message, filename);
      this.updateStatusBar('Prettier+: $(x)');
      return defaultText;
    }
  }

  static get disposables(): vscode.Disposable[] {
    return [
      vscode.window.onDidChangeActiveTextEditor(editor => this.statusBarItem.toggle(editor)),
      vscode.commands.registerCommand('prettier-plus.open-output', () => this.outputChannel.show())
    ];
  }
}

import glob from 'glob';
import Mocha from 'mocha';
import * as path from 'path';
import * as vscode from 'vscode';

export function run(testsRoot: string, cb: (error: any, failures?: number) => void): void {
  const mocha = new Mocha({
    ui: 'tdd',
    useColors: true,
    timeout: 10_000
  });

  glob('**/**.test.js', { cwd: testsRoot }, (err, files) => {
    if (err) {
      return cb(err);
    }

    // Add files to the test suite
    files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

    try {
      // Run the mocha test
      mocha.run(failures => cb(null, failures));
    } catch (err) {
      cb(err);
    }
  });
}

async function format(filename: string, uri: vscode.Uri): Promise<{ result: string; source: string }> {
  const extendedUri = uri.with({ path: path.join(uri.fsPath, filename) });
  const doc = await vscode.workspace.openTextDocument(extendedUri);
  const text = doc.getText();

  await vscode.window.showTextDocument(doc);

  console.time(filename);
  await vscode.commands.executeCommand('editor.action.formatDocument');
  console.timeEnd(filename);

  return { result: doc.getText(), source: text };
}

async function readFile(filename: string, uri: vscode.Uri): Promise<string> {
  const extendedUri = uri.with({ path: path.join(uri.fsPath, filename) });
  const data = await vscode.workspace.fs.readFile(extendedUri);
  return data.toString();
}

export const extension = { format, readFile };

import glob from 'glob';
import Mocha from 'mocha';
import * as path from 'path';
import { commands, Uri, window, workspace } from 'vscode';

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

function format(filename: string, uri: Uri): Promise<{ result: string; source: string }> {
  const extendedUri = uri.with({ path: path.join(uri.fsPath, filename) });
  return new Promise((resolve, reject) => {
    workspace.openTextDocument(extendedUri).then(doc => {
      const text = doc.getText();
      window.showTextDocument(doc).then(() => {
        console.time(filename);
        commands.executeCommand('editor.action.formatDocument').then(() => {
          console.timeEnd(filename);
          resolve({ result: doc.getText(), source: text });
        }, reject);
      }, reject);
    }, reject);
  });
}

async function readFile(filename: string, uri: Uri): Promise<string> {
  const extendedUri = uri.with({ path: path.join(uri.fsPath, filename) });
  const data = await workspace.fs.readFile(extendedUri);
  return data.toString();
}

export const extension = { format, readFile };

import * as prettier from 'prettier';
import { workspace } from 'vscode';

const prettierConfigFiles = [
  '.prettierrc',
  '.prettierrc.json',
  '.prettierrc.yaml',
  '.prettierrc.yml',
  '.prettierrc.js',
  'package.json',
  'prettier.config.js',
  '.editorconfig'
];

// Create a file watcher. Clears prettier's configuration cache on file change, create, delete.
const fileWatcher = workspace.createFileSystemWatcher(`**/{${prettierConfigFiles.join(',')}}`);
fileWatcher.onDidChange(prettier.clearConfigCache);
fileWatcher.onDidCreate(prettier.clearConfigCache);
fileWatcher.onDidDelete(prettier.clearConfigCache);

export const configCacheHandler = { fileWatcher };

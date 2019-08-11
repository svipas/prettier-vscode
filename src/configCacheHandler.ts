import * as prettier from 'prettier';
import { workspace } from 'vscode';

/**
 * Prettier reads configuration from files
 */
const prettierConfigFiles = [
  '.prettierrc',
  '.prettierrc.json',
  '.prettierrc.yaml',
  '.prettierrc.yml',
  '.prettierrc.js',
  'package.json',
  'prettier.config.js'
];

/**
 * Create a file watcher. Clears prettier's configuration cache on file change, create, delete.
 * @returns disposable file system watcher.
 */
export function configFileListener() {
  const fileWatcher = workspace.createFileSystemWatcher(`**/{${prettierConfigFiles.join(',')}}`);
  fileWatcher.onDidChange(prettier.clearConfigCache);
  fileWatcher.onDidCreate(prettier.clearConfigCache);
  fileWatcher.onDidDelete(prettier.clearConfigCache);
  return fileWatcher;
}

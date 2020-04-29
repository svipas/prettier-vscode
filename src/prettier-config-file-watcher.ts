import * as prettier from 'prettier';
import * as vscode from 'vscode';

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
export const prettierConfigFileWatcher = vscode.workspace.createFileSystemWatcher(
	`**/{${prettierConfigFiles.join(',')}}`
);
prettierConfigFileWatcher.onDidChange(prettier.clearConfigCache);
prettierConfigFileWatcher.onDidCreate(prettier.clearConfigCache);
prettierConfigFileWatcher.onDidDelete(prettier.clearConfigCache);

import * as fs from "fs";
import ignore from "ignore";
import * as path from "path";
import * as vscode from "vscode";
import { logMessage } from "./error-handler";
import { getVSCodeConfig } from "./utils";

interface Ignorer {
	ignores(filePath: string): boolean;
}

const nullIgnorer: Ignorer = { ignores: () => false };

/**
 * Create an ignore file handler. Will lazily read ignore files on a per-resource
 * basis, and cache the contents until it changes.
 */
export function ignoreFileHandler(disposables: vscode.Disposable[]) {
	let ignorers: { [key: string]: Ignorer } = {};
	disposables.push({ dispose: () => (ignorers = {}) });

	const unloadIgnorer = (ignoreUri: vscode.Uri) => {
		ignorers[ignoreUri.fsPath] = nullIgnorer;
	};

	const loadIgnorer = async (ignoreUri: vscode.Uri) => {
		let ignorer = nullIgnorer;

		if (!ignorers[ignoreUri.fsPath]) {
			const fileWatcher = vscode.workspace.createFileSystemWatcher(
				ignoreUri.fsPath
			);
			disposables.push(fileWatcher);
			fileWatcher.onDidCreate(loadIgnorer, null, disposables);
			fileWatcher.onDidChange(loadIgnorer, null, disposables);
			fileWatcher.onDidDelete(unloadIgnorer, null, disposables);
		}

		if (await isFileExists(ignoreUri.fsPath)) {
			const ignoreFileContents = await fs.promises.readFile(
				ignoreUri.fsPath,
				"utf-8"
			);
			ignorer = ignore().add(ignoreFileContents);
		}

		ignorers[ignoreUri.fsPath] = ignorer;
	};

	const getIgnorerForFile = async (
		fsPath: string
	): Promise<{ ignorer: Ignorer; ignoreFilePath: string }> => {
		const { ignorePath } = getVSCodeConfig(vscode.Uri.file(fsPath));
		const absolutePath = getIgnorePathForFile(fsPath, ignorePath);

		if (!absolutePath) {
			return { ignoreFilePath: "", ignorer: nullIgnorer };
		}

		if (!ignorers[absolutePath]) {
			await loadIgnorer(vscode.Uri.file(absolutePath));
		}

		if (await !isFileExists(absolutePath)) {
			// Don't log default value.
			if (ignorePath !== ".prettierignore") {
				logMessage(
					`Invalid "prettier.ignorePath" in your settings. The path ${ignorePath} doesn't exist.`,
					fsPath
				);
			}
			return { ignoreFilePath: "", ignorer: nullIgnorer };
		}

		return {
			ignoreFilePath: absolutePath,
			ignorer: ignorers[absolutePath],
		};
	};

	return {
		fileIsIgnored: async (filePath: string) => {
			const { ignorer, ignoreFilePath } = await getIgnorerForFile(filePath);
			return ignorer.ignores(
				path.relative(path.dirname(ignoreFilePath), filePath)
			);
		},
	};
}

function getIgnorePathForFile(
	filePath: string,
	ignorePath: string
): string | undefined {
	// Configuration `prettier.ignorePath` is set to `null`.
	if (!ignorePath) {
		return;
	}

	if (vscode.workspace.workspaceFolders) {
		const folder = vscode.workspace.getWorkspaceFolder(
			vscode.Uri.file(filePath)
		);
		if (folder) {
			return getPath(ignorePath, folder.uri.fsPath);
		}
	}
}

function getPath(fsPath: string, relativeTo: string) {
	return path.isAbsolute(fsPath) ? fsPath : path.join(relativeTo, fsPath);
}

async function isFileExists(path: string): Promise<boolean> {
	try {
		await fs.promises.stat(path);
		return true;
	} catch (err) {
		if (err.code === "ENOENT") {
			return false;
		}
		throw err;
	}
}

import * as fs from 'fs';
import ignore from 'ignore';
import * as path from 'path';
import { Disposable, Uri, workspace } from 'vscode';
import { errorHandler } from './error-handler';
import { getVSCodeConfig } from './utils';

interface Ignorer {
  ignores(filePath: string): boolean;
}

const nullIgnorer: Ignorer = { ignores: () => false };

/**
 * Create an ignore file handler. Will lazily read ignore files on a per-resource
 * basis, and cache the contents until it changes.
 */
export function ignoreFileHandler(disposables: Disposable[]) {
  let ignorers: { [key: string]: Ignorer } = {};
  disposables.push({ dispose: () => (ignorers = {}) });

  const unloadIgnorer = (ignoreUri: Uri) => (ignorers[ignoreUri.fsPath] = nullIgnorer);

  const loadIgnorer = async (ignoreUri: Uri) => {
    let ignorer = nullIgnorer;

    if (!ignorers[ignoreUri.fsPath]) {
      const fileWatcher = workspace.createFileSystemWatcher(ignoreUri.fsPath);
      disposables.push(fileWatcher);
      fileWatcher.onDidCreate(loadIgnorer, null, disposables);
      fileWatcher.onDidChange(loadIgnorer, null, disposables);
      fileWatcher.onDidDelete(unloadIgnorer, null, disposables);
    }

    if (await isFileExists(ignoreUri.fsPath)) {
      const ignoreFileContents = await fs.promises.readFile(ignoreUri.fsPath, 'utf8');
      ignorer = ignore().add(ignoreFileContents);
    }

    ignorers[ignoreUri.fsPath] = ignorer;
  };

  const getIgnorerForFile = async (fsPath: string): Promise<{ ignorer: Ignorer; ignoreFilePath: string }> => {
    const { ignorePath } = getVSCodeConfig(Uri.file(fsPath));
    const absolutePath = getIgnorePathForFile(fsPath, ignorePath);

    if (!absolutePath) {
      return { ignoreFilePath: '', ignorer: nullIgnorer };
    }

    if (!ignorers[absolutePath]) {
      await loadIgnorer(Uri.file(absolutePath));
    }

    if (await !isFileExists(absolutePath)) {
      // Don't log default value.
      if (ignorePath !== '.prettierignore') {
        errorHandler.log(
          `Invalid "prettier.ignorePath" in your settings. The path ${ignorePath} doesn't exist.`,
          fsPath
        );
      }
      return { ignoreFilePath: '', ignorer: nullIgnorer };
    }

    return {
      ignoreFilePath: absolutePath,
      ignorer: ignorers[absolutePath]
    };
  };

  return {
    fileIsIgnored: async (filePath: string) => {
      const { ignorer, ignoreFilePath } = await getIgnorerForFile(filePath);
      return ignorer.ignores(path.relative(path.dirname(ignoreFilePath), filePath));
    }
  };
}

function getIgnorePathForFile(filePath: string, ignorePath: string): string | undefined {
  // Configuration `prettier.ignorePath` is set to `null`.
  if (!ignorePath) {
    return;
  }

  if (workspace.workspaceFolders) {
    const folder = workspace.getWorkspaceFolder(Uri.file(filePath));
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
    if (err.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
}

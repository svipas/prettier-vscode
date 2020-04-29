import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export class ExtensionTest {
	static async format(filename: string, uri: vscode.Uri): Promise<{ result: string; source: string }> {
		const extendedUri = uri.with({ path: path.join(uri.fsPath, filename) });
		const doc = await vscode.workspace.openTextDocument(extendedUri);
		const text = doc.getText();

		await vscode.window.showTextDocument(doc);

		console.time(filename);
		await vscode.commands.executeCommand('editor.action.formatDocument');
		console.timeEnd(filename);

		return { result: doc.getText(), source: text };
	}

	static readFile(filename: string, uri: vscode.Uri): Promise<string> {
		const extendedUri = uri.with({ path: path.join(uri.fsPath, filename) });
		return fs.promises.readFile(extendedUri.fsPath, 'utf8');
	}
}

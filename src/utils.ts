import * as prettier from "prettier";
import * as vscode from "vscode";

export function getVSCodeConfig(
	uri?: vscode.Uri
): prettier.PrettierVSCodeConfig {
	return vscode.workspace.getConfiguration("prettier", uri) as any;
}

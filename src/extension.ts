import * as vscode from 'vscode';
import { swiftAddDocumentation } from './swift-add-documentation';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.info('Extension "swift-add-documentation" active');

    let disposable = vscode.commands.registerCommand('swift-add-documentation.register', swiftAddDocumentation);

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

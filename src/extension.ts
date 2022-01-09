import * as vscode from 'vscode';
import { swiftAddDocumentation } from './swift-add-documentation';
import { SwiftDocCompletionProvider } from './swiftDocCompletion';
import { swiftHandleShiftEnter, swiftHandleShiftOptEnter } from './swiftHandleEnter';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.info('Activating Swift Add Documentation');

    let addDocumentation = vscode.commands.registerCommand('swift-add-documentation.addDocumentation', swiftAddDocumentation);
    context.subscriptions.push(addDocumentation);
    vscode.commands.registerTextEditorCommand("swift-add-documentation.addCommentLine",
        (textEditor, edit, args) => {
            swiftHandleShiftEnter(textEditor, edit);
        });
    vscode.commands.registerTextEditorCommand("swift-add-documentation.addIndentedCommentLine",
        (textEditor, edit, args) => {
            swiftHandleShiftOptEnter(textEditor, edit);
        });
    const selector: vscode.DocumentSelector = { language: 'swift' };
    vscode.languages.registerCompletionItemProvider(selector, new SwiftDocCompletionProvider(), "/");
}

// this method is called when your extension is deactivated
export function deactivate() { }

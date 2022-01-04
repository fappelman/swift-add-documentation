import * as vscode from 'vscode';
import { extractSignature } from './Parser/extractSignature';
import { Editor } from './Util/editor';

export function swiftAddDocumentation() {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) { return; }
    const editor = new Editor(activeEditor);
    const type = extractSignature(editor);
    if (type) {
        console.log(type);
        let lineNumber = activeEditor.selection.active.line;
        var pos: vscode.Position;
        if (editor.currentLineIsEmpty) {
            // Insert on the next line
            pos = new vscode.Position(lineNumber + 1, 0);
        } else {
            // Insert on the current line
            pos = new vscode.Position(lineNumber, 0);
        }
        const snippet = new vscode.SnippetString(type.docTemplate());
        activeEditor.insertSnippet(snippet, pos);
    }
}

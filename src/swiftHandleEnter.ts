import * as vscode from 'vscode';
import { extractSignature } from './Parser/extractSignature';
import { Editor, LineType } from './Util/editor';

export function swiftHandleShiftEnter(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) { return; }
    const editor = new Editor(activeEditor);
    console.log(`Handle ShiftEnter`);
    const type = editor.lineType(editor.lineNumber);
    const spaces = "".padStart(editor.offset, " ");
    // If this is in a documentation block, insert a
    // new documentation line.
    if (type === LineType.documentationLine
        || type === LineType.emptyDocumentationLine) {
        edit.insert(textEditor.selection.active, `\n${spaces}/// `);
    } else if (type === LineType.commentLine) {
        edit.insert(textEditor.selection.active, `\n${spaces}// `);
    } else {
        edit.insert(textEditor.selection.active, "\n");
    }
}

function selection(editor: vscode.TextEditor, line?: number | undefined, column?: number | undefined): vscode.Selection {
    const position = editor.selection.active;
    var newPosition = position.with(line, column);
    var newSelection = new vscode.Selection(newPosition, newPosition);
    return newSelection;
}

export function swiftHandleShiftOptEnter(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) { return; }
    const editor = new Editor(activeEditor);
    console.log(`Handle ShiftOptEnter`);
    const type = editor.lineType(editor.lineNumber);
    // Get the position
    const lineNumber = activeEditor.selection.active.line;
    // Get the current line
    const currentLine = activeEditor.document.lineAt(lineNumber).text;
    // Get the position at the end of line
    const endOfLinePosition = currentLine.length;
    // The spaces at the start of the line
    const offsetSpaces = "".padStart(editor.offset, " ");

    // If this is in a documentation block, insert a
    // new documentation line.
    if (type === LineType.documentationLine || type === LineType.emptyDocumentationLine) {
        // Move the cursor to the end of the line
        activeEditor.selection = selection(activeEditor, undefined, endOfLinePosition);
        // The spaces after the doc comment
        var spacesAfter = " ";
        const variableRegex = /^\s*\/\/\/(\s+-\s+.+:\s)/;
        const variableMatch = variableRegex.exec(currentLine);
        if (variableMatch) {
            spacesAfter = "".padStart(variableMatch[1].length, " ");
        }
        // Insert the new comment
        edit.insert(textEditor.selection.active, `\n${offsetSpaces}///${spacesAfter}`);
    } else if (type === LineType.commentLine) {
        // Move the cursor to the end of the line
        activeEditor.selection = selection(activeEditor, undefined, endOfLinePosition);
        // Insert the new comment
        edit.insert(textEditor.selection.active, `\n${offsetSpaces}// `);
    } else {
        edit.insert(textEditor.selection.active, "\n");
    }
}

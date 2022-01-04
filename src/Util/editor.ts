import * as vscode from 'vscode';
import { commentRegex, emptyRegex } from '../Parser/regexPatterns';

const MAX_LINES_LOOKAHEAD = 10;

export class Editor {
    editor: vscode.TextEditor;

    constructor(editor: vscode.TextEditor) {
        this.editor = editor;
    }

    public get lineNumber(): number {
        return this.editor.selection.active.line;
    }

    public get lineCount(): number {
        return this.editor.document.lineCount;
    }

    public get currentLineIsCommentLine(): boolean {
        const currentLineNumber = this.lineNumber;
        const currentLine = this.editor.document.lineAt(currentLineNumber).text;
        const match = commentRegex.exec(currentLine);
        return match !== null;
    }

    public get previousLineIsCommentLine(): boolean {
        const previousLineNumber = this.lineNumber - 1;
        if (previousLineNumber < 0) { return false; }
        const previousLine = this.editor.document.lineAt(previousLineNumber).text;
        const match = commentRegex.exec(previousLine);
        return match !== null;
    }

    public get nextLineIsCommentLine(): boolean {
        const nextLineNumber = this.lineNumber + 1;
        if (nextLineNumber >= this.lineCount) { return false; }
        const nextLine = this.editor.document.lineAt(nextLineNumber).text;
        const match = commentRegex.exec(nextLine);
        return match !== null;
    }

    public get currentLineIsEmpty(): boolean {
        const currentLineNumber = this.lineNumber;
        const currentLine = this.editor.document.lineAt(currentLineNumber).text;
        const match = emptyRegex.exec(currentLine);
        return match !== null;
    }


    // Look up to MAX_LINES_LOOKAHEAD lines ahead and return the concatenated
    // result. Skip the comment lines and empty lines.
    // Limit leading white space to one space. Also for trailing whitespace.
    public lookaheadLine(): string {
        // Extract the current line
        var currentLine: number = this.currentLineIsEmpty ? this.lineNumber + 1 : this.lineNumber;
        var result: string = "";
        if ((currentLine) < this.lineCount) {
            result = this.editor.document.lineAt(currentLine).text;
        }

        // Concattenate up to MAX_LINES_LOOKAHEAD lines to the result
        for (let counter = 0; counter < MAX_LINES_LOOKAHEAD; counter++) {
            const index = currentLine + 1 + counter;
            if (index < this.lineCount) {
                const line = this.editor.document.lineAt(index).text;
                if (commentRegex.test(line)) { continue; }
                if (emptyRegex.test(line)) { continue; }

                result += line.replace(/^\s*/, ' ').replace(/\s*$/, ' ');
            }
        }
        return result;
    }

}

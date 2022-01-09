import * as vscode from 'vscode';
import { commentRegex, emptyRegex } from '../Parser/regexPatterns';

const MAX_LINES_LOOKAHEAD = 10;

export enum LineType {
    commentLine = "commentLine",                        // A line that starts with '//' and not '///'
    emptyDocumentationLine="emptyDocumentationLine",    // A line that starts with '///' and does have only white space following
    documentationLine="documentationLine",              // A line that starts with '///' and has not white space following
    codeLine="codeLine",                                // A non empty line that is not a comment or documentation line
    emptyLine="emptyLine",                              // A line with only whitespace
    nonExisting="nonExisting"                           // A line that does not exist
};

export class Editor {
    editor: vscode.TextEditor;

    constructor(editor: vscode.TextEditor) {
        this.editor = editor;
    }

    public get lineNumber(): number {
        return this.editor.selection.active.line;
    }

    public lineType(lineNumber: number): LineType {
        if (lineNumber >= this.lineCount) { return LineType.nonExisting; }
        const line = this.editor.document.lineAt(lineNumber).text;
        if (/^\s*\/\/\/\s*$/.test(line)) { return LineType.emptyDocumentationLine; }
        if (/^\s*\/\/\//.test(line)) { return LineType.documentationLine; }
        if (/^\s*\/\//.test(line)) { return LineType.commentLine; }
        if (/^\s*$/.test(line)) { return LineType.emptyLine; }
        return LineType.codeLine;
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

    // Get the offset for the current line
    public get offset(): number {
        const regex = /^(\s*)/;
        const currentLine = this.editor.document.lineAt(this.lineNumber).text;
        let match = regex.exec(currentLine);
        if (match) {
            return match[0].length;
        } else {
            return 0;
        }
    }

    // Look up to MAX_LINES_LOOKAHEAD lines ahead and return the concatenated
    // result. Skip the comment lines and empty lines.
    // Limit leading white space to one space. Also for trailing whitespace.
    public lookaheadLine(startingLine: number): string {
        // Extract the current line
        // var lineIndex: number = this.currentLineIsEmpty ? this.lineNumber + 1 : this.lineNumber;
        var lineIndex: number = startingLine;
        var result: string = "";

        // Concattenate up to MAX_LINES_LOOKAHEAD lines to the result
        for (let counter = 0; counter < MAX_LINES_LOOKAHEAD; counter++) {
            const index = lineIndex + counter;
            if (index < this.lineCount) {
                const line = this.editor.document.lineAt(index).text;
                if (commentRegex.test(line)) { continue; }
                if (emptyRegex.test(line)) { continue; }
                if (counter === 0) {
                    result += line.replace(/\s*$/, ' ');
                } else {
                    result += line.replace(/^\s*/, ' ').replace(/\s*$/, ' ');
                }
            }
        }
        return result;
    }

}

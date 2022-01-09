import * as nls from 'vscode-nls';
import * as vscode from 'vscode';

import { Editor, LineType } from './Util/editor';
import { extractSignature } from './Parser/extractSignature';

const localize = nls.loadMessageBundle();

export class SwiftDocCompletionItem extends vscode.CompletionItem {
	constructor(
		public readonly document: vscode.TextDocument,
		public readonly position: vscode.Position
	) {
		super('//', vscode.CompletionItemKind.Text);
		this.detail = localize('typescript.swiftDocCompletionItem.documentation', 'SwiftDOC comment');
		this.sortText = '\0';

		const line = document.lineAt(position.line).text;
		const prefix = line.slice(0, position.character).match(/\/\**\s*$/);
		const suffix = line.slice(position.character).match(/^\s*\**\//);
		const start = position.translate(0, prefix ? -prefix[0].length : 0);
		const range = new vscode.Range(start, position.translate(0, suffix ? suffix[0].length : 0));
		this.range = { inserting: range, replacing: range };
	}
}

export class SwiftDocCompletionProvider implements vscode.CompletionItemProvider {

	constructor(){
    }

	public async provideCompletionItems(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken,
        context: vscode.CompletionContext
	): Promise<vscode.CompletionItem[] | undefined> {

        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) { return undefined; }
        const editor = new Editor(activeEditor);

        // Identify the current line and the next line
        // The current line must be an empty document line, i.e.
        // a line with just '///' and the next line must contain
        // code
        const lineNumber = editor.lineNumber;
        const currentLineType = editor.lineType(lineNumber);
        const nextLineType = editor.lineType(lineNumber + 1);
        console.log(`Current line type = ${currentLineType}`);
        console.log(`Next line type = ${nextLineType}`);
        if (currentLineType !== LineType.emptyDocumentationLine
            || nextLineType !== LineType.codeLine) { return undefined; }

        // The line types match. Extract the signature from the code line
        const type = extractSignature(editor);

        // Did we find a valid signature
        if (!type) { return undefined; }

        // Yes a valid signature. The user entered '///' so far probably
        // with some spaces before it.
        console.log(type);

        // Set the offset to zero. We are already offsetted in the code and
        // the editor will take care of indenting the code block
        type.offset = 0;

        // The document has already two '/' characters and the third one that triggered
        // this snippet is not yet in the document. So there fore remove the
        // leading space plus two '/' characters from the snippet string.
        // Also the newline is already present so remove that from the end of the snippet
        // as well.
        var template = type.docTemplate().replace(/^\s*\/\//, '').replace(/\s*$/, '');
        console.log(template);

        // Create and return the snippet
        const snippet = new vscode.SnippetString(template);
        const item = new SwiftDocCompletionItem(document, position);
        item.insertText = snippet;
        return [item];
	}
}

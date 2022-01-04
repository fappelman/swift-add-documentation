import { SignatureMethodParser } from './methodSignatureParser';
import { Type } from '../Types/type';
import { SignatureVariableParser } from './variableSignatureParser';
import { Editor } from '../Util/editor';
import { SignatureObjectParser } from './objectSignatureParser';
import { SignatureEnumParser } from './enumSignatureParser';



export function extractSignature(editor: Editor): Type | undefined {
    // Extract the signature. The signature begins on either the current line
    // or the line just below. Return undefined if the signature is not found

    // Documentation should not be added if the documentation is
    // already there. The following situations are recognized
    // as situations where documentation should not be added:
    //
    // 1. The current line is not a comment line and the line above is
    // 2. The current line is a comment line
    //
    if (editor.currentLineIsCommentLine
        || (editor.currentLineIsCommentLine && editor.previousLineIsCommentLine)
    ) {
        return undefined;
    }

    // Try different parsers in a specific order.
    const lookahead = editor.lookaheadLine();
    var type: Type | undefined;

    // 1. Variable
    type = new SignatureVariableParser(lookahead).parse();
    if (type) { return type; }

    // 2. Object
    type = new SignatureObjectParser(lookahead).parse();
    if (type) { return type; }

    // 3. Enum
    type = new SignatureEnumParser(lookahead).parse();
    if (type) { return type; }

    // 4. Method
    type = new SignatureMethodParser(lookahead).parse();
    if (type) { return type; }

    // Not recognized
    return undefined;
}

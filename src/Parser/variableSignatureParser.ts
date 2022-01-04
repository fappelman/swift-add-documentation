import { Scope } from "../Types/scope";
import { Type } from "../Types/type";
import { Types } from "../Types/types";
import { Parser } from "./parser";

export enum VariableLetVar {
    let = "let",
    var = "var",
    unknown = "unknown"
}

export class VariableType {
    // Needed in case of type variable
    variableType: string | undefined;
    variableStatic: boolean = false;
    variableScope: Scope | undefined;
    letVar: VariableLetVar = VariableLetVar.unknown;

    constructor() {
    }

    public docTemplate(name: string, offset: number): string {
        var result: string[] = [ "/// ${1:Description}" ];

        const spaces = "".padStart(offset, " ");

        return result.map((value) => spaces + value).join("\n") + "\n";
    }
}

export class SignatureVariableParser extends Parser{
    fromString: string;
    offset: number = 0;
    scope: Scope | undefined;
    variableStatic: boolean = false;
    letVar: VariableLetVar = VariableLetVar.unknown;
    variableName: string | undefined;
    variableType: string | undefined;

    constructor(fromString: string) {
        super();
        this.fromString = fromString;
    }

    public parse(): Type | undefined {
        // There might be leading white space
        this.parseLeadingWhiteSpace();
        // The static keyword can be before or after the public keyword.
        // Therefore try in two places
        this.parseStatic(); // Attempt 1
        // A signature can start with 'public', 'private' or 'internal'
        this.parseScope();
        // The static keyword can be before or after the public keyword.
        // Therefore try in two places
        this.parseStatic(); // Attempt 2
        // Next is the mandatory 'let' or 'var' keyword.
        this.parseLetOrVar();
        if (this.letVar === VariableLetVar.unknown) { return undefined; }
        // Next is the name of the variable
        this.parseVariableName();
        if (!this.variableName) { return undefined; }
        // Next the type
        this.parseType();
        if (!this.variableType) {
            // There is no type. This means the next one must be an '='
            if (!/^\s*=/.exec(this.fromString)) {
                return undefined;
            }
        }
        // This is a variable.
        // Create the method type
        var result = new Type(Types.variable, this.variableName);
        const metadata = new VariableType();
        metadata.letVar = this.letVar;
        metadata.variableStatic = this.variableStatic;
        metadata.variableType = this.variableType;
        metadata.variableScope = this.scope;
        result.variableMetaData = metadata;
        result.offset = this.offset;
        return result;
    }

    // The leading whitespace defines the column number
    // where the documentation should be inserted
    private parseLeadingWhiteSpace() {
        const regex = /^(\s*)/;
        this.hasMatch(regex, (match) => {
            this.offset = match[1].length;
        });
    }

    // The method starts with an optional scope
    private parseScope() {
        const regex = /^(public|private|internal)\s+/;
        this.hasMatch(regex, (match) => {
            this.scope = match[1] as Scope;
        });
    }
    private parseStatic() {
        const regex = /^\s*static/;
        this.hasMatch(regex, (match) => {
            this.variableStatic = true;
        });
    }

    private parseLetOrVar() {
        const regex = /^\s*(let|var)/;
        this.hasMatch(regex, (match) => {
            if (match[1] === "let") {
                this.letVar = VariableLetVar.let;
            } else {
                this.letVar = VariableLetVar.var;
            }
        });
    }

    private parseVariableName() {
        const regex = /^\s*([a-zA-Z_][a-zA-Z_0-9_]*)/;
        this.hasMatch(regex, (match) => {
            this.variableName = match[1];
        });
    }

    private parseType() {
        // The type must start with a colon
        const regex = /^\s*:\s*/;
        const match = regex.exec(this.fromString);
        if (match) {
            this.fromString = this.fromString.replace(regex, '');
            // Loop over the string and continue until we have a white space
            // If the we are not in a dictionary we have found the
            // end of the type definition.
            var inArrayOrDict = false;
            var nextIsLiteral = false;
            loop:
            for (let index = 0; index < this.fromString.length; index++) {
                const element = this.fromString[index];
                switch (element) {
                    case "\n":
                    case " ":
                        if (inArrayOrDict === false && !nextIsLiteral) {
                            // Found end of the type
                            this.variableType = this.fromString.substring(0, index);
                            break loop;
                        }
                        break;
                    case `\\`:
                        if (nextIsLiteral) {
                            nextIsLiteral = false;
                        } else {
                            nextIsLiteral = true;
                        }
                        break;
                    case `[`:
                        if (!nextIsLiteral) {
                            inArrayOrDict = true;
                        } else {
                            nextIsLiteral = false;
                        }
                        break;
                    case `]`:
                        if (!nextIsLiteral) {
                            inArrayOrDict = false;
                        } else {
                            nextIsLiteral = false;
                        }
                        break;
                    default:
                        nextIsLiteral = false;
                        break;
                }
            }
        }
    }
}

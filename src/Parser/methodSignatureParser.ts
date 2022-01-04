import { regex } from "../Util/multilineRegex";
import { Argument } from "../Types/argument";
import { Type } from "../Types/type";
import { Types } from "../Types/types";
import { Parser } from "./parser";
import { Scope } from "../Types/scope";

export class MethodType {
    // Needed in case of type method
    methodArguments: Argument[] = [];
    methodType: string | undefined;
    methodAsync: boolean = false;
    methodThrows: boolean = false;
    methodStatic: boolean = false;
    methodScope: Scope | undefined;

    constructor() {
    }

    public docTemplate(name: string, offset: number): string {
        var result: string[] = [];
        if (name === "init") {
            result.push("/// ${1:Constructor}");
        } else {
            result.push("/// ${1:one-line summary}");
        }
        result.push("///");
        result.push("/// ${2:detailed description}");
        result.push("///");
        var positionCounter = 3;
        if (this.methodArguments) {
            if (this.methodArguments.length > 0) {
                result.push("/// - Parameters:");
                for (let index = 0; index < this.methodArguments.length; index++) {
                    const element = this.methodArguments[index];
                    result.push(`///   - ${element.name}: \${${positionCounter++}:${element.name} description}`);
                }
            }
        }

        if (this.methodType) {
            result.push(`/// - Returns: \${${positionCounter++}:description}`);
        }

        // Add the offset to each of the lines

        const spaces = "".padStart(offset, " ");

        return result.map((value) => spaces + value).join("\n") + "\n";
    }
}

export class SignatureMethodParser extends Parser {
    fromString: string;
    scope: Scope | undefined;
    hasFuncKeyword: boolean = false;
    methodName: string | undefined;
    methodArguments: Argument[] = [];
    methodThrows: boolean = false;
    methodAsync: boolean = false;
    methodStatic: boolean = false;
    methodType: string | undefined;
    offset: number = 0;

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
        // Next is the optional 'func' keyword. Only if the name is init
        // the func is not there
        this.parseFunc();
        // Next is the method name. This one is always there
        this.parseMethodName();
        if (!this.methodName) { return undefined; }
        // Unless the methodName is 'init' the func keyword must be present
        if (this.methodName !== "init"
            && this.methodName !== "init?"
            && this.hasFuncKeyword === false) { return undefined; }
        // Next are optional arguments
        this.parseArguments();
        // Next the optional async keyword
        this.parseAsync();
        // Next the optional throws keyword
        this.parseThrows();
        // Next the optional method type
        this.parseType();
        // Create the method type
        var result = new Type(Types.method, this.methodName);
        const metadata = new MethodType();
        metadata.methodAsync = this.methodAsync;
        metadata.methodThrows = this.methodThrows;
        metadata.methodType = this.methodType;
        metadata.methodArguments = this.methodArguments;
        metadata.methodStatic = this.methodStatic;
        metadata.methodScope = this.scope;
        result.methodMetaData = metadata;
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
        const regex = /^\s*(public|private|internal)\s+/;
        this.hasMatch(regex, (match) => {
            this.scope = match[1] as Scope;
        });
    }

    // The method must have the 'func' keyword unless the method name is
    // init which doesn't carry the func keyword.
    private parseFunc() {
        const regex = /^\s*func\s+/;
        this.hasMatch(regex, (match) => {
            this.hasFuncKeyword = true;
        });
    }

    private parseMethodName() {
        const regex = /^\s*([a-zA-Z_][a-zA-Z_0-9]*\??)\s*\(/;
        this.hasMatch(regex, (match) => {
            this.methodName = match[1];
        });
    }

    // Split on comma's but not on comma's between '(' and ')'
    private splitIntoArguments(): string[] {
        var result: string[] = [];
        var roundBracketCounter: number = 0;
        var startArgumentIndex = 0;
        loop:
        for (let index = 0; index < this.fromString.length; index++) {
            const element = this.fromString[index];
            switch (element) {
                case "(":
                    roundBracketCounter++;
                    break;
                case ")":
                    // This could be the end of the argument list
                    if (roundBracketCounter === 0) {
                        // Done. Are there arguments to be copied?
                        if (startArgumentIndex !== index) {
                            result.push(this.fromString.substring(startArgumentIndex, index));
                        }
                        // Remove the passed arguments from the string
                        this.fromString = this.fromString
                            .substring(index + 1);
                        break loop;
                    }
                    roundBracketCounter--;
                    break;
                case ",":
                    if (roundBracketCounter === 0) {
                        result.push(this.fromString.substring(startArgumentIndex, index));
                        startArgumentIndex = index + 1;
                    }
                default:
                    break;
            }
        }
        return result.map((value) =>
            value
                .replace(/^\s*/, '')
                .replace(/\s*$/, '')
        );
    }

    private parseArguments() {
        // If the list is empty we should just see a closing round bracket
        this.hasMatch(/^\s*\(/, (match) => { return; });
        // There are arguments. Peel of until we see the closing round bracket
        const splitted = this.splitIntoArguments();
        const argumentRegex = regex(
            /\s*/,   // Optional leading whitespace
            /([a-zA-Z_][a-zA-Z_0-9_]*)/,     // The name of the argument
            /(\s+[a-zA-Z_][a-zA-Z_0-9_]*)?/, // The optional internal name of the argument
            /\s*:\s*/,                       // The colon plus optional space. Leading space is discouraged
            /(.+)\s*$/,                      // The type
        );
        for (let index = 0; index < splitted.length; index++) {
            const element = splitted[index];
            const match = argumentRegex.exec(element);
            if (match) {
                this.methodArguments.push(new Argument(match[1], match[3]));
            }
        }
    }

    private parseAsync() {
        const regex = /^\s*async/;
        this.hasMatch(regex, (match) => {
            this.methodAsync = true;
        });
    }

    private parseThrows() {
        const regex = /^\s*throws/;
        this.hasMatch(regex, (match) => {
            this.methodThrows = true;
        });
    }

    private parseType() {
        // If the type is empty we should just see a closing round curly bracket
        this.hasMatch(/^\s*\{/, (match) => { return; });
        const regex = /^\s*->\s*(.+?)\s*{/;
        this.hasMatch(regex, (match) => {
            this.methodType = match[1];
        });
    }

    private parseStatic() {
        const regex = /^\s*static/;
        this.hasMatch(regex, (match) => {
            this.methodStatic = true;
        });
    }
}

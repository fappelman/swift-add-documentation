import { Scope } from "../Types/scope";
import { Type } from "../Types/type";
import { Types } from "../Types/types";
import { Parser } from "./parser";

export class EnumType {
    // Needed in case of type variable
    enumScope: Scope | undefined;

    constructor() {
    }

    public docTemplate(name: string, offset: number): string {
        var result: string[] = [ "/// ${1:Description}" ];

        const spaces = "".padStart(offset, " ");

        return result.map((value) => spaces + value).join("\n") + "\n";
    }
}

export class SignatureEnumParser extends Parser{
    fromString: string;
    offset: number = 0;
    scope: Scope | undefined;
    enumName: string | undefined;
    enumKeywordFound: boolean = false;

    constructor(fromString: string) {
        super();
        this.fromString = fromString;
    }

    public parse(): Type | undefined {
        // There might be leading white space
        this.parseLeadingWhiteSpace();
        // A signature can start with 'public', 'private' or 'internal'
        this.parseScope();
        // Next is the mandatory 'enum' keyword.
        this.parsEenumKeyword();
        if (this.enumKeywordFound === false) { return undefined; }
        this.parseEnumName();
        if (!this.enumName) { return undefined; }

        // This is a enum.
        // Create the method type
        var result = new Type(Types.enum, this.enumName);
        const metadata = new EnumType();
        metadata.enumScope = this.scope;
        result.enumMetaData = metadata;
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

    private parsEenumKeyword() {
        const regex = /^\s*enum\s/;
        this.hasMatch(regex, (match) => {
            this.enumKeywordFound = true;
        });
    }

    private parseEnumName() {
        const regex = /^\s*([a-zA-Z_][a-zA-Z_0-9_]*)/;
        this.hasMatch(regex, (match) => {
            this.enumName = match[1];
        });
    }

}

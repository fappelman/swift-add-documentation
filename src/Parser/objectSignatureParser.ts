import { Scope } from "../Types/scope";
import { Type } from "../Types/type";
import { Types } from "../Types/types";
import { Parser } from "./parser";

export enum ObjectStructClass {
    struct = "struct",
    class = "class",
    unknown = "unknown"
}

export class ObjectType {
    // Needed in case of type variable
    structClass: ObjectStructClass = ObjectStructClass.unknown;
    objectScope: Scope | undefined;

    constructor() {
    }

    public docTemplate(name: string, offset: number): string {
        var result: string[] = [ "/// ${1:Description}" ];

        const spaces = "".padStart(offset, " ");

        return result.map((value) => spaces + value).join("\n") + "\n";
    }
}

export class SignatureObjectParser extends Parser{
    fromString: string;
    offset: number = 0;
    scope: Scope | undefined;
    structClass: ObjectStructClass = ObjectStructClass.unknown;
    objectName: string | undefined;

    constructor(fromString: string) {
        super();
        this.fromString = fromString;
    }

    public parse(): Type | undefined {
        // There might be leading white space
        this.parseLeadingWhiteSpace();
        // A signature can start with 'public', 'private' or 'internal'
        this.parseScope();
        // The static keyword can be before or after the public keyword.
        // Therefore try in two places
        this.parseLetOrVar();
        if (this.structClass === ObjectStructClass.unknown) { return undefined; }
        // Next is the name of the struct/class
        this.parseObjectName();
        if (!this.objectName) { return undefined; }

        // This is a object.
        // Create the method type
        var result = new Type(Types.object, this.objectName);
        const metadata = new ObjectType();
        metadata.structClass = this.structClass;
        metadata.objectScope = this.scope;
        result.objectMetaData = metadata;
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

    private parseLetOrVar() {
        const regex = /^\s*(struct|class)/;
        this.hasMatch(regex, (match) => {
            if (match[1] === "struct") {
                this.structClass = ObjectStructClass.struct;
            } else {
                this.structClass = ObjectStructClass.class;
            }
        });
    }

    private parseObjectName() {
        const regex = /^\s*([a-zA-Z_][a-zA-Z_0-9_]*)/;
        this.hasMatch(regex, (match) => {
            this.objectName = match[1];
        });
    }

}

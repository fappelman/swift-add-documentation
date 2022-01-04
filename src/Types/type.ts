import { Argument } from "./argument";
import { VariableType } from "../Parser/variableSignatureParser";
import { MethodType } from "../Parser/methodSignatureParser";
import { Types } from "./types";
import { ObjectType } from "../Parser/objectSignatureParser";
import { EnumType } from "../Parser/enumSignatureParser";

export class Type {
    type: Types;
    name: string;
    offset: number = 0;

    // Needed in case of type variable
    variableMetaData: VariableType | undefined;

    // Needed in case of type method
    methodMetaData: MethodType | undefined;

    // Needed in case of type object
    objectMetaData: ObjectType | undefined;

    // Needed in case of type enum
    enumMetaData: EnumType | undefined;

    constructor(type: Types, name: string) {
        this.type = type;
        this.name = name;
    }

    public docTemplate(): string {
        switch (this.type) {
            case Types.method:
                if (this.methodMetaData) {
                    return this.methodMetaData.docTemplate(this.name, this.offset);
                }
            case Types.variable:
                if (this.variableMetaData) {
                    return this.variableMetaData.docTemplate(this.name, this.offset);
                }
            case Types.object:
                if (this.objectMetaData) {
                    return this.objectMetaData.docTemplate(this.name, this.offset);
                }
            case Types.enum:
                if (this.enumMetaData) {
                    return this.enumMetaData.docTemplate(this.name, this.offset);
                }
            default:
                break;
        }
        return "";
    }
}

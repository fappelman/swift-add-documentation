import { Type } from "../Types/type";


export abstract class Parser {
    abstract fromString: string;
    abstract parse(): Type | undefined;


    hasMatch(regex: RegExp, callback: (match: RegExpExecArray) => void) {
        const match = regex.exec(this.fromString);
        if (match) {
            callback(match);
            this.fromString = this.fromString.replace(regex, '');
        }
    }
}

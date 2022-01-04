import * as assert from 'assert';

import * as vscode from 'vscode';
import { SignatureMethodParser } from '../../Parser/methodSignatureParser';
import { Scope } from '../../Types/scope';

suite('Extension swift-add-documentation method Suite', () => {
	vscode.window.showInformationMessage('Start method tests.');

    const method1 = `
    init(variables variableArgument: [String: String]?,
        hostOverride overrideArgument: [String: String]?,
        defaultExecService: String?,
        deployHost: String?,
        defaultCommand: String?,
        comment: String?,
        fileName: String) {
            // Dummy
        }
    `;

	test('Method test constructor', () => {
        const type = new SignatureMethodParser(method1).parse();
        if (!type) {
            throw new Error("Type is undefined for case method1");
        }
        assert.strictEqual(type.name, "init");
        assert.strictEqual(type.offset, 5);
        const methodMetaData = type.methodMetaData;
        if (!methodMetaData) { throw new Error("methodMetaData not set"); }
        assert.strictEqual(methodMetaData.methodAsync, false);
        assert.strictEqual(methodMetaData.methodScope, undefined);
        assert.strictEqual(methodMetaData.methodStatic, false);
        assert.strictEqual(methodMetaData.methodThrows, false);
        assert.strictEqual(methodMetaData.methodType, undefined);
        if (!methodMetaData) { throw new Error("metaMethodData is undefined"); }
        const methodArguments = methodMetaData.methodArguments;
        assert.strictEqual(methodArguments.length, 7);
        assert.strictEqual(methodArguments[0].name, "variables");
        assert.strictEqual(methodArguments[0].type, "[String: String]?");
        assert.strictEqual(methodArguments[1].name, "hostOverride");
        assert.strictEqual(methodArguments[1].type, "[String: String]?");
        assert.strictEqual(methodArguments[2].name, "defaultExecService");
        assert.strictEqual(methodArguments[2].type, "String?");
        assert.strictEqual(methodArguments[3].name, "deployHost");
        assert.strictEqual(methodArguments[3].type, "String?");
        assert.strictEqual(methodArguments[4].name, "defaultCommand");
        assert.strictEqual(methodArguments[4].type, "String?");
        assert.strictEqual(methodArguments[5].name, "comment");
        assert.strictEqual(methodArguments[5].type, "String?");
        assert.strictEqual(methodArguments[6].name, "fileName");
        assert.strictEqual(methodArguments[6].type, "String");
	});

    const method2 = `
    public init?() {
            // Dummy
        }
    `;

	test('Method test optional constructor', () => {
        const type = new SignatureMethodParser(method2).parse();
        if (!type) {
            throw new Error("Type is undefined for case method2");
        }
        assert.strictEqual(type.name, "init?");
        assert.strictEqual(type.offset, 5);
        const methodMetaData = type.methodMetaData;
        if (!methodMetaData) { throw new Error("metaMethodData is undefined"); }
        assert.strictEqual(methodMetaData.methodAsync, false);
        assert.strictEqual(methodMetaData.methodScope, Scope.public);
        assert.strictEqual(methodMetaData.methodStatic, false);
        assert.strictEqual(methodMetaData.methodThrows, false);
        assert.strictEqual(methodMetaData.methodType, undefined);
        assert.deepStrictEqual(methodMetaData.methodArguments, []);
	});

    const method3 = `
       private func composeArguments(host: String) async throws -> [String] {
        // Implementation
    }
    `;

	test('Method test async throw', () => {
        const type = new SignatureMethodParser(method3).parse();
        if (!type) {
            throw new Error("Type is undefined for case method3");
        }
        assert.strictEqual(type.name, "composeArguments");
        assert.strictEqual(type.offset, 8);
        const methodMetaData = type.methodMetaData;
        if (!methodMetaData) { throw new Error("metaMethodData is undefined"); }
        assert.strictEqual(methodMetaData.methodAsync, true);
        assert.strictEqual(methodMetaData.methodScope, Scope.private);
        assert.strictEqual(methodMetaData.methodStatic, false);
        assert.strictEqual(methodMetaData.methodThrows, true);
        assert.strictEqual(methodMetaData.methodType, "[String]");
        assert.deepStrictEqual(methodMetaData.methodArguments.length, 1);
        assert.strictEqual(methodMetaData.methodArguments[0].name, "host");
        assert.strictEqual(methodMetaData.methodArguments[0].type, "String");
	});

    const method4 = `
    static internal func defaultEntry() -> DIDConfig? { nil }
    `;

    test('Method test static', () => {
        const type = new SignatureMethodParser(method4).parse();
        if (!type) {
            throw new Error("Type is undefined for case method4");
        }
        assert.strictEqual(type.name, "defaultEntry");
        assert.strictEqual(type.offset, 5);
        const methodMetaData = type.methodMetaData;
        if (!methodMetaData) { throw new Error("metaMethodData is undefined"); }
        assert.strictEqual(methodMetaData.methodAsync, false);
        assert.strictEqual(methodMetaData.methodScope, Scope.internal);
        assert.strictEqual(methodMetaData.methodStatic, true);
        assert.strictEqual(methodMetaData.methodThrows, false);
        assert.strictEqual(methodMetaData.methodType, "DIDConfig?");
        assert.deepStrictEqual(methodMetaData.methodArguments.length, 0);
	});
});

import * as assert from 'assert';

import * as vscode from 'vscode';
import { SignatureVariableParser, VariableLetVar } from '../../Parser/variableSignatureParser';
import { Scope } from '../../Types/scope';

suite('Extension swift-add-documentation variable Suite', () => {
	vscode.window.showInformationMessage('Start variable tests.');

    const variable1 = `
    let variables: [String: String]?
    `;

	test('Variable test let', () => {
        const type = new SignatureVariableParser(variable1).parse();
        assert(type !== null);
        if (!type) {
            throw new Error("Type is undefined for case variable1");
        }
        assert.strictEqual(type.name, "variables");
        assert.strictEqual(type.offset, 5);
        const variableMetaData = type.variableMetaData;
        if (!variableMetaData) { throw new Error("variableMetaData not set"); }
        assert.strictEqual(variableMetaData.variableScope, undefined);
        assert.strictEqual(variableMetaData.letVar, VariableLetVar.let);
        assert.strictEqual(variableMetaData.variableStatic, false);
        assert.strictEqual(variableMetaData.variableType, "[String: String]?");
	});

    const variable2 = `
    let variable = "defaultValue"
    `;

	test('Variable test without type', () => {
        const type = new SignatureVariableParser(variable2).parse();
        assert(type !== null);
        if (!type) {
            throw new Error("Type is undefined for case variable2");
        }
        assert.strictEqual(type.name, "variable");
        assert.strictEqual(type.offset, 5);
        const variableMetaData = type.variableMetaData;
        if (!variableMetaData) { throw new Error("variableMetaData not set"); }
        assert.strictEqual(variableMetaData.variableScope, undefined);
        assert.strictEqual(variableMetaData.letVar, VariableLetVar.let);
        assert.strictEqual(variableMetaData.variableStatic, false);
        assert.strictEqual(variableMetaData.variableType, undefined);
	});

    const variable3 = `
    public static let variables: [String: String]?
    `;

	test('Variable test static let', () => {
        const type = new SignatureVariableParser(variable3).parse();
        assert(type !== null);
        if (!type) {
            throw new Error("Type is undefined for case variable3");
        }
        assert.strictEqual(type.name, "variables");
        assert.strictEqual(type.offset, 5);
        const variableMetaData = type.variableMetaData;
        if (!variableMetaData) { throw new Error("variableMetaData not set"); }
        assert.strictEqual(variableMetaData.variableScope, Scope.public);
        assert.strictEqual(variableMetaData.letVar, VariableLetVar.let);
        assert.strictEqual(variableMetaData.variableStatic, true);
        assert.strictEqual(variableMetaData.variableType, "[String: String]?");
	});

    const variable4 = `
    private var variables: [String: String]?
    `;

	test('Variable test var', () => {
        const type = new SignatureVariableParser(variable4).parse();
        assert(type !== null);
        if (!type) {
            throw new Error("Type is undefined for case variable4");
        }
        assert.strictEqual(type.name, "variables");
        assert.strictEqual(type.offset, 5);
        const variableMetaData = type.variableMetaData;
        if (!variableMetaData) { throw new Error("variableMetaData not set"); }
        assert.strictEqual(variableMetaData.variableScope, Scope.private);
        assert.strictEqual(variableMetaData.letVar, VariableLetVar.var);
        assert.strictEqual(variableMetaData.variableStatic, false);
        assert.strictEqual(variableMetaData.variableType, "[String: String]?");
	});
});

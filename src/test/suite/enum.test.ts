import * as assert from 'assert';

import * as vscode from 'vscode';
import { SignatureEnumParser } from '../../Parser/enumSignatureParser';
import { Scope } from '../../Types/scope';

suite('Extension swift-add-documentation enum Suite', () => {
	vscode.window.showInformationMessage('Start enum tests.');

    const enum1 = `
    enum MyEnum {
        case case1
    }
    `;

	test('enum test base', () => {
        const type = new SignatureEnumParser(enum1).parse();
        assert(type !== null);
        if (!type) {
            throw new Error("Type is undefined for case enum1");
        }
        assert.strictEqual(type.name, "MyEnum");
        assert.strictEqual(type.offset, 5);
        const objectMetaData = type.enumMetaData;
        if (!objectMetaData) { throw new Error("objectMetaData not set"); }
        assert.strictEqual(objectMetaData.enumScope, undefined);
	});

    const enum2 = `
    private enum MyEnum2 {
        case case1
    }
    `;

	test('enum test scope', () => {
        const type = new SignatureEnumParser(enum2).parse();
        assert(type !== null);
        if (!type) {
            throw new Error("Type is undefined for case enum2");
        }
        assert.strictEqual(type.name, "MyEnum2");
        assert.strictEqual(type.offset, 5);
        const objectMetaData = type.enumMetaData;
        if (!objectMetaData) { throw new Error("objectMetaData not set"); }
        assert.strictEqual(objectMetaData.enumScope, Scope.private);
	});


});

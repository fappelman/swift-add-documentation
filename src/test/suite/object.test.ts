import * as assert from 'assert';

import * as vscode from 'vscode';
import { ObjectStructClass, SignatureObjectParser } from '../../Parser/objectSignatureParser';
import { Scope } from '../../Types/scope';

suite('Extension swift-add-documentation object Suite', () => {
	vscode.window.showInformationMessage('Start object tests.');

    const object1 = `
    class Example: Codable {
        // Implementation
    }
    `;

	test('Object test class', () => {
        const type = new SignatureObjectParser(object1).parse();
        assert(type !== null);
        if (!type) {
            throw new Error("Type is undefined for case object1");
        }
        assert.strictEqual(type.name, "Example");
        assert.strictEqual(type.offset, 5);
        const objectMetaData = type.objectMetaData;
        if (!objectMetaData) { throw new Error("objectMetaData not set"); }
        assert.strictEqual(objectMetaData.structClass, ObjectStructClass.class);
        assert.strictEqual(objectMetaData.objectScope, undefined);
	});

    const object2 = `
    struct Example2: Codable {
        // Implementation
    }
    `;

	test('Object test struct ', () => {
        const type = new SignatureObjectParser(object2).parse();
        assert(type !== null);
        if (!type) {
            throw new Error("Type is undefined for case object2");
        }
        assert.strictEqual(type.name, "Example2");
        assert.strictEqual(type.offset, 5);
        const objectMetaData = type.objectMetaData;
        if (!objectMetaData) { throw new Error("objectMetaData not set"); }
        assert.strictEqual(objectMetaData.structClass, ObjectStructClass.struct);
        assert.strictEqual(objectMetaData.objectScope, undefined);
	});

    const object3 = `
    public struct Example3: Codable {
        // Implementation
    }
    `;

	test('Object test public struct ', () => {
        const type = new SignatureObjectParser(object3).parse();
        assert(type !== null);
        if (!type) {
            throw new Error("Type is undefined for case object3");
        }
        assert.strictEqual(type.name, "Example3");
        assert.strictEqual(type.offset, 5);
        const objectMetaData = type.objectMetaData;
        if (!objectMetaData) { throw new Error("objectMetaData not set"); }
        assert.strictEqual(objectMetaData.structClass, ObjectStructClass.struct);
        assert.strictEqual(objectMetaData.objectScope, Scope.public);
	});
});

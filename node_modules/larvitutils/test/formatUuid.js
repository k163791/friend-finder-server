'use strict';

const assert = require('assert');
const utils = new (require(__dirname + '/../index.js'))();

describe('formatUuid', () => {
	it('Should convert a binary buffer to Uuid string', done => {
		const uuid = utils.formatUuid(Buffer.from('f9684592b24542fa88c69f16b9236ac3', 'hex'));

		assert.strictEqual(uuid, 'f9684592-b245-42fa-88c6-9f16b9236ac3');

		done();
	});

	it('Should trim a hex string and return its uuid value', done => {
		const uuidStr = '  0e7e26b7-f1804d65-9512-80b776a7509e    ';
		const formatted = utils.formatUuid(uuidStr);

		assert.strictEqual(formatted, '0e7e26b7-f180-4d65-9512-80b776a7509e');
		done();
	});

	it('Should add dashes to a hex string', done => {
		const uuidStr = '62be934b24c24944981c40d4163e3bc9';
		const formatted = utils.formatUuid(uuidStr);

		assert.strictEqual(formatted, '62be934b-24c2-4944-981c-40d4163e3bc9');
		done();
	});

	it('Should fail to format a malformed string', done => {
		const blaj = utils.formatUuid('blaj');
		const toShortHex = utils.formatUuid('62be934b24c2494981c40d4163e3bc9');
		const toLongHex = utils.formatUuid('62be934b24c24944981c40d4163e3bc93');

		assert.strictEqual(blaj, false);
		assert.strictEqual(toShortHex, false);
		assert.strictEqual(toLongHex, false);

		done();
	});

	it('Should format a upper case string to lower case', done => {
		const formatted = utils.formatUuid('80D7B01D-E5D8-43A4-B5F1-E2703506860A');

		assert.strictEqual(formatted, '80d7b01d-e5d8-43a4-b5f1-e2703506860a');

		done();
	});

	it('Should fail on anything but a string', done => {
		const test1 = utils.formatUuid([3, 4]);
		const test2 = utils.formatUuid({höhö: 'fippel'});

		assert.strictEqual(test1, false);
		assert.strictEqual(test2, false);

		done();
	});
});

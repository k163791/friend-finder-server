'use strict';

const assert = require('assert');
const utils = new (require(__dirname + '/../index.js'))();

describe('replaceAll', function () {
	it('Should replace all occurences of - to _ in an UUID', done => {
		const uuidStr = 'f9684592-b245-42fa-88c6-9f16b9236ac3';
		const newStr = utils.replaceAll('-', '_', uuidStr);

		assert.strictEqual(newStr, 'f9684592_b245_42fa_88c6_9f16b9236ac3');

		done();
	});

	it('Should leave a string unaltered if it have no occurences of the string to be replaced', done => {
		const uuidStr = 'f9684592b24542fa88c69f16b9236ac3';
		const newStr = utils.replaceAll('-', '_', uuidStr);

		assert.strictEqual(newStr, 'f9684592b24542fa88c69f16b9236ac3');

		done();
	});

	it('Should be able to replace to nothing', done => {
		const uuidStr = 'f9684592-b245-42fa-88c6-9f16b9236ac3';
		const newStr = utils.replaceAll('-', '', uuidStr);

		assert.strictEqual(newStr, 'f9684592b24542fa88c69f16b9236ac3');

		done();
	});

	it('Should not break if we pass RegExp unsafe char', done => {
		const uuidStr = 'f9684592-b245-42fa.88c6.9f16b9236ac3';
		const newStr = utils.replaceAll('.', 'poo', uuidStr);

		assert.strictEqual(newStr, 'f9684592-b245-42fapoo88c6poo9f16b9236ac3');

		done();
	});
});

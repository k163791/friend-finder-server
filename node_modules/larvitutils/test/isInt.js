'use strict';

const assert = require('assert');
const utils = new (require(__dirname + '/../index.js'))();

describe('isInt', function () {
	it('Should return false if input is a string', done => {
		const input = 'string';
		const checkedInt = utils.isInt(input);

		assert.strictEqual(checkedInt, false, 'Should return false if input is a string, but returned true.');

		done();
	});

	it('Should return false if input is a function', done => {
		function input() {};
		const checkedInt = utils.isInt(input);

		assert.strictEqual(checkedInt, false, 'Should return false if input is a function, but returned true.');

		done();
	});

	it('Should return false if input is a float', done => {
		const input = 1.5;
		const checkedInt = utils.isInt(input);

		assert.strictEqual(checkedInt, false, 'Should return false if input is a float, but returned true.');

		done();
	});

	it('Should return true if input is a float with a zero decimal', done => {
		const input = 1.0;
		const checkedInt = utils.isInt(input);

		assert.strictEqual(checkedInt, true, 'Should return true if input is a float with zero decimal, but returned false.');

		done();
	});

	it('Should return true if input is a int', done => {
		const input = 1;
		const checkedInt = utils.isInt(input);

		assert.strictEqual(checkedInt, true, 'Should return true if input is a int, but returned false.');

		done();
	});
});

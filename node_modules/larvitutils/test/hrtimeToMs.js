'use strict';

const assert = require('assert');
const utils = new (require(__dirname + '/../index.js'))();

describe('hrtimeToMs', function () {
	it('Test default amount of decimals', done => {
		const res = utils.hrtimeToMs(process.hrtime());
		assert.strictEqual(typeof res, 'string', 'res should be a string, but returned as ' + typeof res + ' and its value is ' + res);
		assert.strictEqual(res.split('.')[1].length, 2, 'The string length after the . should be 2, but is ' + res.split('.')[1].length);
		done();
	});

	it('Test custom amount of decimals', done => {
		const res = utils.hrtimeToMs(process.hrtime(), 4);
		assert.strictEqual(typeof res, 'string', 'res should be a string, but returned as ' + typeof res + ' and its value is ' + res);
		assert.strictEqual(res.split('.')[1].length, 4, 'The string length after the . should be 4, but is ' + res.split('.')[1].length);
		done();
	});
});

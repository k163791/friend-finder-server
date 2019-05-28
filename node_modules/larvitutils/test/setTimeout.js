'use strict';

const assert = require('assert');
const lUtils = new (require(__dirname + '/../index.js'))();

describe('setTimeout', function () {
	it('Wait about 100ms', done => {
		const start = new Date();
		lUtils.setTimeout(100).then(() => {
			const passedTime = new Date() - start;
			assert.strictEqual((passedTime - 100) >= 0, true);
			assert.strictEqual((passedTime - 110) < 0, true);
			done();
		});
	});

	it('Wait about 1ms', done => {
		const start = new Date();
		lUtils.setTimeout(1).then(() => {
			const passedTime = new Date() - start;
			assert.strictEqual((passedTime - 1) >= 0, true);
			assert.strictEqual((passedTime - 10) < 0, true);
			done();
		});
	});
});

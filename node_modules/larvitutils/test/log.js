'use strict';

const assert = require('assert');
const utils = new (require(__dirname + '/../index.js'))();

describe('log', function () {
	it('should log to info', done => {
		const oldStdout = process.stdout.write;
		const log = new utils.Log();

		let	outputMsg;

		process.stdout.write = function (msg) {
			outputMsg = msg;
		};

		log.info('flurp');

		process.stdout.write = oldStdout;

		assert.strictEqual(outputMsg.substring(19), 'Z [\u001b[1;32minf\u001b[0m] flurp\n');

		done();
	});

	it('should log to error', done => {
		const oldStderr = process.stderr.write;
		const log = new utils.Log();

		let	outputMsg;

		process.stderr.write = function (msg) {
			outputMsg = msg;
		};

		log.error('burp');

		process.stderr.write = oldStderr;

		assert.strictEqual(outputMsg.substring(19), 'Z [\u001b[1;31merr\u001b[0m] burp\n');

		done();
	});

	it('should not print debug by default', done => {
		const oldStdout = process.stdout.write;
		const log = new utils.Log();

		let	outputMsg = 'yay';

		process.stdout.write = function (msg) {
			outputMsg = msg;
		};

		log.debug('nai');

		process.stdout.write = oldStdout;

		assert.strictEqual(outputMsg, 'yay');

		done();
	});

	it('should print debug when given "silly" as level', done => {
		const oldStdout = process.stdout.write;
		const log = new utils.Log('silly');

		let	outputMsg = 'woof';

		process.stdout.write = function (msg) {
			outputMsg = msg;
		};

		log.debug('wapp');

		process.stdout.write = oldStdout;

		assert.strictEqual(outputMsg.substring(19), 'Z [\u001b[1;35mdeb\u001b[0m] wapp\n');

		done();
	});
});

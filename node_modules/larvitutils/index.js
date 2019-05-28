'use strict';

const topLogPrefix = 'larvitutils: index.js: ';

function Utils(options) {
	const that = this;

	if (!that) {
		throw new Error('This library must be instanciated.');
	}

	that.options = options || {};

	if (!that.options.log) {
		that.options.log = new that.Log();
	}

	that.log = that.options.log;
}

/**
 * Convert hrtime diff to milliseconds
 *
 * @param {array} prevTime - the output from process.hrtime() to diff to
 * @param {integer} precision - defaults to 2
 * @return {string} - time diff in milliseconds rounded to given precision
 */
Utils.prototype.hrtimeToMs = function hrtimeToMs(prevTime, precision) {
	const diff = process.hrtime(prevTime);

	if (precision === undefined) {
		precision = 2;
	}

	return ((diff[0] * 1000) + (diff[1] / 1000000)).toFixed(precision);
};

Utils.prototype.escapeRegExp = function escapeRegExp(str) {
	return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
};

/**
 * Formats an uuid string
 *
 * For example adds missing "-", trimming spaces etc
 *
 * @param {string} uuidStr - Can also take a buffer
 * @return {string} uuid string or false on failure
 */
Utils.prototype.formatUuid = function formatUuid(uuidStr) {

	// If a buffer, get the string representation
	if (Buffer.isBuffer(uuidStr)) {
		uuidStr = uuidStr.toString('hex');
	}

	// Now uuidStr MUST be a string
	if (typeof uuidStr !== 'string') {
		return false;
	}

	// Remove all but hex characters
	uuidStr = uuidStr.replace(/[^A-Fa-f0-9]/g, '').toLowerCase();

	// All uuid strings have exactly 32 hex characters!
	if (uuidStr.length !== 32) {
		return false;
	}

	// Add dashes in the right places
	uuidStr = uuidStr.substring(0, 8) + '-' + uuidStr.substring(8, 12) + '-' + uuidStr.substring(12, 16) + '-' + uuidStr.substring(16, 20) + '-' + uuidStr.substring(20);

	return uuidStr;
};

/**
 * Replace all occurances of a string in a string and return the result
 *
 * @param {string} search - What to search for
 * @param {string} replace - What to replace it with
 * @param {string} str - The string to perform this to
 * @return {string} - The result
 */
Utils.prototype.replaceAll = function replaceAll(search, replace, str) {
	const that = this;
	return str.replace(new RegExp(that.escapeRegExp(search), 'g'), replace);
};


Utils.prototype.setTimeout = async function lUtilsSetTimeout(ms) {
	return new Promise(resolve => {
		setTimeout(() => resolve(), ms);
	});
};

/**
 * Make a buffer from an uuid string
 *
 * @param {string} uuidStr - Can be with or without dashes, padded spaces etc will be trimmed
 * @return {buffer} or false on fail
 */
Utils.prototype.uuidToBuffer = function uuidToBuffer(uuidStr) {
	const logPrefix = topLogPrefix + 'uuidToBuffer() - ';

	if (typeof uuidStr !== 'string') {
		const stack = new Error().stack;
		this.log.warn(logPrefix + 'uuidStr is not a string, but a ' + (typeof uuidStr));
		this.log.verbose(logPrefix + stack);

		return false;
	}

	// Remove all but hex characters
	uuidStr = uuidStr.replace(/[^A-Fa-f0-9]/g, '');

	// All uuid strings have exactly 32 hex characters!
	if (uuidStr.length !== 32) {
		const stack = new Error().stack;
		this.log.warn(logPrefix + 'uuidStr should be exactly 32 characters after regex, but is: ' + uuidStr.length);
		this.log.verbose(logPrefix + stack);

		return false;
	}

	return new Buffer.from(uuidStr, 'hex'); // eslint-disable-line new-cap
};

/**
 * Check if input is an int
 *
 * @param {mixed} value - The value to check
 * @return {boolean} true or false
 */
Utils.prototype.isInt = function isInt(value) {
	const x = parseFloat(value);

	if (isNaN(value)) {
		return false;
	}

	return (x | 0) === x;
};

Utils.prototype.Log = function Log(options) {
	const that = this;

	that.options = options || {};

	if (typeof that.options === 'string') {
		that.options = {level: that.options};
	}

	if (!that.options.level) {
		that.options.level = 'info';
	}
};

Utils.prototype.Log.prototype.stdout = function stdout(lvl, msg) {
	console.log((new Date()).toISOString().substring(0, 19) + 'Z [' + lvl + '] ' + msg);
};

Utils.prototype.Log.prototype.stderr = function stderr(lvl, msg) {
	console.error((new Date()).toISOString().substring(0, 19) + 'Z [' + lvl + '] ' + msg);
};

Utils.prototype.Log.prototype.silly = function silly(msg) {
	if (this.options.level === 'silly') this.stdout('\x1b[1;37msil\x1b[0m', msg);
};

Utils.prototype.Log.prototype.debug = function debug(msg) {
	if (['silly', 'debug'].indexOf(this.options.level) !== -1) {
		this.stdout('\x1b[1;35mdeb\x1b[0m', msg);
	}
};

Utils.prototype.Log.prototype.verbose = function verbose(msg) {
	if (['silly', 'debug', 'verbose'].indexOf(this.options.level) !== -1) {
		this.stdout('\x1b[1;34mver\x1b[0m', msg);
	}
};

Utils.prototype.Log.prototype.info = function info(msg) {
	if (['silly', 'debug', 'verbose', 'info'].indexOf(this.options.level) !== -1) {
		this.stdout('\x1b[1;32minf\x1b[0m', msg);
	}
};

Utils.prototype.Log.prototype.warn = function warn(msg) {
	if (['silly', 'debug', 'verbose', 'info', 'warn'].indexOf(this.options.level) !== -1) {
		this.stderr('\x1b[1;33mwar\x1b[0m', msg);
	}
};

Utils.prototype.Log.prototype.error = function error(msg) {
	if (['silly', 'debug', 'verbose', 'info', 'error'].indexOf(this.options.level) !== -1) {
		this.stderr('\x1b[1;31merr\x1b[0m', msg);
	}
};

exports = module.exports = Utils;

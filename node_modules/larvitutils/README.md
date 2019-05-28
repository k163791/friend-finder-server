[![Build Status](https://travis-ci.org/larvit/larvitutils.svg)](https://travis-ci.org/larvit/larvitutils) [![Dependencies](https://david-dm.org/larvit/larvitutils.svg)](https://david-dm.org/larvit/larvitutils.svg)

# larvitutils

Misc utilities

## Loading of library

The library takes one parameter as option, "log". It is designed to take an instance of [winston](https://github.com/winstonjs/winston), but more exactly it should be an object with the methods "silly", "debug", "verbose", "info", "warn" and "error". An example of this can be found in the VERY simplified logging utility built in to this library. See documentation below.

Example of loading the library with no configured logger (using the default):

```javascript
const lUtils = new (require('larvitutils'))();
```

Example of loading the library with an instance of [winston](https://github.com/winstonjs/winston) as logger:

```javascript
const winston = require('winston');
const log = winston.createLogger({'transports':[new winston.transprots.Console()]});
const lUtils = new (require('larvitutils'))({log: log});
```

## Async setTimeout

```javascript
const lUtils = new (require('larvitutils'))();
await lUtils.setTimeout(1000);
console.log('1000ms later');
```

## Convert a buffer to an Uuid

```javascript
const lUtils = new (require('larvitutils'))();
const uuid = lUtils.formatUuid(new Buffer('f9684592b24542fa88c69f16b9236ac3', 'hex'));

console.log(uuid); // f9684592-b245-42fa-88c6-9f16b9236ac3
```

Example usecase: fetch a binary column from a database and convert to a readable Uuid string

## Format a hex string to uuid

```javascript
const lUtils = new (require('larvitutils'))();
const uuid = lUtils.formatUuid(' f9684592b24542fa88c69f16b9236ac3'); // Notice the starting space getting trimmed away

console.log(uuid); // f9684592-b245-42fa-88c6-9f16b9236ac3
```

## hrtimeToMs()

Used to convert hrtime() calls to milliseconds, since hrtime() output is messy (seconrds + nanoseconrds)

Usage:

```javascript
const lUtils = new (require('larvitutils'))();
const startTime = process.hrtime();

setTimeout(function() {
	console.log('benchmark took %d ms', lUtils.hrtimeToMs(startTime, 4));
 // benchmark took 34.0005 ms
}, 34);
```

## Uuid string to buffer

```javascript
const lUtils = new (require('larvitutils'))();
const uuidStr = 'f9684592-b245-42fa-88c6-9f16b9236ac3';

lUtils.uuidToBuffer(uuidStr); // Will return a buffer or false on failure
```

## Replace all for strings

```javascript
const lUtils = new (require('larvitutils'))();
const str = 'f9684592-b245-42fa-88c6-9f16b9236ac3';

lUtils.replaceAll('-', '_', str); // f9684592_b245_42fa_88c6_9f16b9236ac3
```

## Validate an uuid string

```javascript
const lUtils = new (require('larvitutils'))();
const validUuid = 'f9684592-b245-42fa-88c6-9f16b9236ac3';
const invalidUuid1 = false;
const invalidUuid2 = 'foobar';
const invalidUuid3 = {höhö: 'oveboll'};

lUtils.formatUuid(validUuid); // true
lUtils.formatUuid(invalidUuid1); // false
lUtils.formatUuid(invalidUuid2); // false
lUtils.formatUuid(invalidUuid3); // false
```

## Check if input is an int
```javascript
const lUtils = new (require('larvitutils'))();

lUtils.isInt(10); // true
lUtils.isInt(10.0); // true
lUtils.isInt(10.5); // false
lUtils.isInt('oveboll'); // false
```

## Simple logger

This is ment as a very simple replacement for winston

```javascript
const lUtils = new (require('larvitutils'))();
const log = new lUtils.Log();

log.info('Hello'); // prints to stdout "2018-08-08T20:02:34Z [inf] Hello
log.error('Hello'); // prints to stderr "2018-08-08T20:02:48Z [err] Hello
```

By default only info, warn and error are printed to screen. Set minimum level by string, like this:

```javascript
const lUtils = new (require('larvitutils'))();
const log = new lUtils.Log('debug');

log.debug('Hello'); // prints to stdout "2018-08-08T20:02:34Z [deb] Debug
```

Or disable output entirely

```javascript
const lUtils = new (require('larvitutils'))();
const log = new lUtils.Log('none');

log.error('Hello'); // prints nothing
```

All logging methods: silly, debug, verbose, info, warn and error.

function assert(mustBeTrue, message) {
    if (mustBeTrue === true) {
        return;
    }

    if (message === undefined) {
        message = 'Expected true but got ' + String(mustBeTrue);
    }
    throw new Error(message);
}

assert._isSameValue = function (a, b) {
    if (a === b) {
        // Handle +/-0 vs. -/+0
        return a !== 0 || 1 / a === 1 / b;
    }

    // Handle NaN vs. NaN
    return a !== a && b !== b;
};

assert.sameValue = function (actual, expected, message) {
    if (assert._isSameValue(actual, expected)) {
        return;
    }

    if (message === undefined) {
        message = '';
    } else {
        message += ' ';
    }

    message += 'Expected SameValue(«' + String(actual) + '», «' + String(expected) + '») to be true';

    throw new Error(message);
};

assert.notSameValue = function (actual, unexpected, message) {
    if (!assert._isSameValue(actual, unexpected)) {
        return;
    }

    if (message === undefined) {
        message = '';
    } else {
        message += ' ';
    }

    message += 'Expected SameValue(«' + String(actual) + '», «' + String(unexpected) + '») to be false';

    throw new Error(message);
};

assert.throws = function (expectedErrorConstructor, func, message) {
    if (typeof func !== "function") {
        throw new Error('assert.throws requires two arguments: the error constructor ' +
            'and a function to run');
        return;
    }
    if (message === undefined) {
        message = '';
    } else {
        message += ' ';
    }

    try {
        func();
    } catch (thrown) {
        if (typeof thrown !== 'object' || thrown === null) {
            message += 'Thrown value was not an object!';
            throw new Error(message);
        } else if (thrown.constructor !== expectedErrorConstructor) {
            message += 'Expected a ' + expectedErrorConstructor.name + ' but got a ' + thrown.constructor.name;
            throw new Error(message);
        }
        return;
    }

    message += 'Expected a ' + expectedErrorConstructor.name + ' to be thrown but no exception was thrown at all';
    throw new Error(message);
};

function runTheTest () {// Copyright 2016 Mozilla Corporation. All rights reserved.
// This code is governed by the license found in the LICENSE file.

/*---
description: Tests for existance and behavior of IntlPolyfill.DateTimeFormat.prototype.formatToParts
---*/

function reduce(parts) {
  return parts.map(part => part.value).join('');
}

function compareFTPtoFormat(locales, options, value) {
  const dtf = new IntlPolyfill.DateTimeFormat(locales, options);
  assert.sameValue(
    dtf.format(value),
    reduce(dtf.formatToParts(value)),
    `Expected the same value for value ${value},
     locales: ${locales} and options: ${options}`
  );
}

compareFTPtoFormat();
compareFTPtoFormat('pl');
compareFTPtoFormat(['pl']);
compareFTPtoFormat([]);
compareFTPtoFormat(['de'], undefined, 0);
compareFTPtoFormat(['de'], undefined, -10);
compareFTPtoFormat(['de'], undefined, 25324234235);
compareFTPtoFormat(['de'], {
  day: '2-digit'
}, Date.now());
compareFTPtoFormat(['de'], {
  day: 'numeric',
  year: '2-digit'
}, Date.now());
compareFTPtoFormat(['ar'], {
  month: 'numeric',
  day: 'numeric',
  year: '2-digit'
}, Date.now());
 }
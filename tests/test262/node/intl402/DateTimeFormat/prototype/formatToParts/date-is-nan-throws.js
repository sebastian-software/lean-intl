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

function runner() {    var passed = false;    runTheTest();    passed = true;    return passed;}function runTheTest () {// Copyright 2016 Leonardo Balter. All rights reserved.
// This code is governed by the license found in the LICENSE file.

/*---
description: >
  Throws a RangeError if date arg is cast to NaN
info: |
  IntlPolyfill.DateTimeFormat.prototype.formatToParts ([ date ])

  4. If _date_ is not provided or is *undefined*, then
    a. Let _x_ be *%Date_now%*().
  5. Else,
    a. Let _x_ be ? ToNumber(_date_).
  6. Return ? FormatDateTimeToParts(_dtf_, _x_).

  FormatDateTimeToParts(dateTimeFormat, x)

  1. Let _parts_ be ? PartitionDateTimePattern(_dateTimeFormat_, _x_).

  PartitionDateTimePattern (dateTimeFormat, x)

  1. If _x_ is not a finite Number, throw a *RangeError* exception.
---*/

var dtf = new IntlPolyfill.DateTimeFormat(["pt-BR"]);

assert.throws(RangeError, function() {
  dtf.formatToParts(NaN);
});

assert.throws(RangeError, function() {
  dtf.formatToParts("lol");
});
 }
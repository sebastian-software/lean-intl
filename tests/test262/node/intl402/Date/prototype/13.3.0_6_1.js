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

function runner() {    var passed = false;    runTheTest();    passed = true;    return passed;}function runTheTest () {// Copyright 2012 Mozilla Corporation. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
es5id: 13.3.0_6_1
description: >
    Tests that Date.prototype.toLocaleString & Co. throws the same
    exceptions as IntlPolyfill.DateTimeFormat.
author: Norbert Lindenberg
---*/

var functions = {
    toLocaleString: Date.prototype.toLocaleString,
    toLocaleDateString: Date.prototype.toLocaleDateString,
    toLocaleTimeString: Date.prototype.toLocaleTimeString
};
var locales = [null, [NaN], ["i"], ["de_DE"]];
var options = [
    {localeMatcher: null},
    {timeZone: "invalid"},
    {hour: "long"},
    {formatMatcher: "invalid"}
];

Object.getOwnPropertyNames(functions).forEach(function (p) {
    var f = functions[p];
    locales.forEach(function (locales) {
        var referenceError, error;
        try {
            var format = new IntlPolyfill.DateTimeFormat(locales);
        } catch (e) {
            referenceError = e;
        }
        if (referenceError === undefined) {
            throw new Error("Internal error: Expected exception was not thrown by IntlPolyfill.DateTimeFormat for locales " + locales + ".");
        }
        
        try {
            var result = f.call(new Date(), locales);
        } catch (e) {
            error = e;
        }
        if (error === undefined) {
            throw new Error("Date.prototype." + p + " didn't throw exception for locales " + locales + ".");
        } else if (error.name !== referenceError.name) {
            throw new Error("Date.prototype." + p + " threw exception " + error.name +
                " for locales " + locales + "; expected " + referenceError.name + ".");
        }
    });
    
    options.forEach(function (options) {
        var referenceError, error;
        try {
            var format = new IntlPolyfill.DateTimeFormat([], options);
        } catch (e) {
            referenceError = e;
        }
        if (referenceError === undefined) {
            throw new Error("Internal error: Expected exception was not thrown by IntlPolyfill.DateTimeFormat for options " +
                JSON.stringify(options) + ".");
        }
        
        try {
            var result = f.call(new Date(), [], options);
        } catch (e) {
            error = e;
        }
        if (error === undefined) {
            throw new Error("Date.prototype." + p + " didn't throw exception for options " +
                JSON.stringify(options) + ".");
        } else if (error.name !== referenceError.name) {
            throw new Error("Date.prototype." + p + " threw exception " + error.name +
                " for options " + JSON.stringify(options) + "; expected " + referenceError.name + ".");
        }
    });
});
 }
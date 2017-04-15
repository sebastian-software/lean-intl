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


//-----------------------------------------------------------------------------
function compareArray(a, b) {
  if (b.length !== a.length) {
    return false;
  }

  for (var i = 0; i < a.length; i++) {
    if (b[i] !== a[i]) {
      return false;
    }
  }
  return true;
}


"use strict";var __globalObject = Function("return this;")();function fnGlobalObject() {    return __globalObject;}function Test262Error(message) {  this.message = message || "";}IntlPolyfill.__applyLocaleSensitivePrototypes();function runner() {    var passed = false;    runTheTest();    passed = true;    return passed;}function runTheTest () {// Copyright 2016 Mozilla Corporation. All rights reserved.
// This code is governed by the license found in the LICENSE file.

/*---
esid: sec-intl.getcanonicallocales
description: Test IntlPolyfill.getCanonicalLocales for step 5. 
info: |
  9.2.1 CanonicalizeLocaleList (locales)
    5. Let len be ? ToLength(? Get(O, "length")).
compareArray.js
features: [Symbol]
---*/

var locales = {
  '0': 'en-US',
};

Object.defineProperty(locales, "length", {
  get: function() { throw new Test262Error() }
});

assert.throws(Test262Error, function() {
  IntlPolyfill.getCanonicalLocales(locales);
}, "should throw if locales.length throws");

var locales = {
  '0': 'en-US',
  '1': 'pt-BR',
};

Object.defineProperty(locales, "length", {
  get: function() { return "1" }
});

assert(compareArray(IntlPolyfill.getCanonicalLocales(locales), ['en-US']),
  "should return one element if locales.length is '1'");

var locales = {
  '0': 'en-US',
  '1': 'pt-BR',
};

Object.defineProperty(locales, "length", {
  get: function() { return 1.3 }
});

assert(compareArray(IntlPolyfill.getCanonicalLocales(locales), ['en-US']),
  "should return one element if locales.length is 1.3");

var locales = {
  '0': 'en-US',
  '1': 'pt-BR',
};

Object.defineProperty(locales, "length", {
  get: function() { return Symbol("1.8") }
});

assert.throws(TypeError, function() {
  IntlPolyfill.getCanonicalLocales(locales);
}, "should throw if locales.length is a Symbol");

var locales = {
  '0': 'en-US',
  '1': 'pt-BR',
};

Object.defineProperty(locales, "length", {
  get: function() { return -Infinity }
});

assert(compareArray(IntlPolyfill.getCanonicalLocales(locales), []),
  "should return empty array if locales.length is -Infinity");

var locales = {
  length: -Math.pow(2, 32) + 1
};

Object.defineProperty(locales, "0", {
  get: function() { throw new Error("must not be gotten!"); }
})

assert(compareArray(IntlPolyfill.getCanonicalLocales(locales), []),
  "should return empty array if locales.length is a negative value");

var count = 0;
var locs = { get length() { if (count++ > 0) throw 42; return 0; } };
var locales = IntlPolyfill.getCanonicalLocales(locs); // shouldn't throw 42
assert.sameValue(locales.length, 0);
 }
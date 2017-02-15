/* jshint node:true */

/* updating tests from tests/test262 */

var LIBS = {
  fs: require("fs"),
  path: require("path")
};
var SRC_262 = __dirname + "/../tests/test262";
var SRC_DIR = SRC_262 + "/test/intl402";
var DEST_DIR = SRC_262 + "/node/intl402";
var INCLUDE_DIR = SRC_262 + "/harness";

function processTest(content) {
  var includes = [
    LIBS.fs.readFileSync(LIBS.path.resolve(INCLUDE_DIR, "assert.js")).toString()
  ];
  content = content.replace(/includes\: \[(.*)]/g, function(all, path) {
    var p = LIBS.path.resolve(INCLUDE_DIR, path);
    includes.push(LIBS.fs.readFileSync(p).toString());
    return path;
  });

  // injecting includes at the top
  content = includes.join("\n") + "\n" + content;

  // fixup constructor lists
  content = content.replace(/(\[)("Collator",)/, "$1/*$2*/");

  content = content.replace(/\$ERROR\(/g, "throw new Error(");

  // Another IE 8 issue: [undefined].hasOwnProperty(0) is false, so we need
  // to work around this in at least one test
  content = content.replace(
    /^(\s*)(var.*)\[value\](.*)$/m,
    "$1var arr = [];\n$1arr[0] = value;\n$1$2arr$3"
  );

  // Make sure to use our version (not one the browser might have).
  content = content.replace(/\bIntl\b/g, "IntlPolyfill");

  var explainV8OptOut = "// This test is disabled to avoid the v8 bug outlined at https://code.google.com/p/v8/issues/detail?id=2694";
  var explainES6OptOut = "// This test is disabled because it relies on ES 2015 behaviour, which is not implemented in environments that need this polyfill";

  // Due to a bug in v8, we need to disable parts of the _L15 tests that
  // check the function property `length` is not writable
  content = content.replace(
    /^(\s*)(?=.*throw.*The length property.*function must not be writable)/gm,
    "$1" + explainV8OptOut + "\n$&//"
  );
  content = content.replace(
    /^(\s*)(?=.*throw.*The length property.*function must be configurable)/gm,
    "$1" + explainES6OptOut + "\n$&//"
  );

  // There's also part of the _L15 test that a JavaScript implementation
  // cannot possibly pass, so we need to disable these parts too
  var idxStart = content.search(
    /^(\s*)\/\/ The remaining sections have been moved to the end/m
  ),
    idxEnd = content.search(/^\s+\/\/ passed the complete test/m);

  if (idxStart > -1) {
    content = [
      content.slice(0, idxStart),
      "\n// Intl.js cannot pass the following sections of this test:\n",
      content.slice(idxStart + 1, idxEnd).replace(/^(?!$)/gm, "//$&"),
      idxEnd > -1 ? content.slice(idxEnd) : ""
    ].join("");
  }

  return content;
}

function listTests() {
  var tests = [], todo = ["."], doing, path;

  while (todo.length) {
    /*jshint loopfunc:true*/
    doing = todo.shift();
    path = LIBS.path.resolve(SRC_DIR, doing);
    stat = LIBS.fs.statSync(path);
    if (stat.isFile()) {
      tests.push(doing);
      continue;
    }
    if (stat.isDirectory()) {
      todo = todo.concat(
        LIBS.fs.readdirSync(path).map(function(a) {
          return LIBS.path.join(doing, a);
        })
      );
    }
  }
  return tests;
}

function isValidTest(testPath) {
  // Collator tests are not supported
  if (
    [
      "Collator",
      "localeCompare",
      "toLocaleLowerCase",
      "toLocaleUpperCase",
      "8.0_L15.js"
    ].some(function(name) {
      return testPath.indexOf(name) !== -1;
    })
  ) {
    return false;
  }
  // PluralRules tests are not supported
  if (
    ["PluralRules"].some(function(name) {
      return testPath.indexOf(name) !== -1;
    })
  ) {
    return false;
  }
  // Edge cases not implemented
  if (
    ["weird-cases.js"].some(function(name) {
      return testPath.indexOf(name) !== -1;
    })
  ) {
    return false;
  }
  // these are failing with: "Client code can adversely affect behavior: setter"
  // and they were in previous incarnations
  if (
    [
      "12.2.2_b.js",
      "12.3.2_TLT_2.js",
      "12.1.1_22.js",
      "9.2.6_2.js"
    ].some(function(name) {
      return testPath.indexOf(name) !== -1;
    })
  ) {
    return false;
  }
  // Initialization issues, probably related to the v1 vs v2 vs v3
  if (
    [
      "12.1.1_1.js",
      "11.1.1_1.js",
      "11.1.2.1_4.js",
      "11.3_a.js",
      "12.3_a.js",
      "12.1.2.1_4.js"
    ].some(function(name) {
      return testPath.indexOf(name) !== -1;
    })
  ) {
    return false;
  }
  // timeZone is not supported by this polyfill
  // Initialization issues, probably related to the v1 vs v2 vs v3
  if (
    ["12.3.3.js"].some(function(name) {
      return testPath.indexOf(name) !== -1;
    })
  ) {
    return false;
  }
  // other tests that are not very important
  // 1. testing for the name of the functions
  //    TODO: to enable this test we will have to revisit almost all property methods to make it behave
  //          correctly instead of using bind and Object.defineProperty()
  if (
    ["name.js"].some(function(name) {
      return testPath.indexOf(name) !== -1;
    })
  ) {
    return false;
  }
  return true;
}

module.exports = function(grunt) {
  grunt.registerTask(
    "update-tests",
    "refreshes the tests found in tests/test262",
    function() {
      var tests = listTests();
      tests.sort();
      tests.forEach(function(testPath) {
        if (!isValidTest(testPath)) {
          return;
        }
        var srcPath = LIBS.path.resolve(SRC_DIR, testPath),
          destPath = LIBS.path.resolve(DEST_DIR, testPath),
          content;

        content = '"use strict";' +
          // stuff defined in harness/*.js yet not pulled in via $INCLUDE()
          'var __globalObject = Function("return this;")();' +
          "function fnGlobalObject() {" +
          "    return __globalObject;" +
          "}" +
          "function Test262Error(message) {" +
          '  this.message = message || "";' +
          "}" +
          "IntlPolyfill.__applyLocaleSensitivePrototypes();" +
          "function runner() {" +
          "    var passed = false;" +
          "    runTheTest();" +
          "    passed = true;" +
          "    return passed;" +
          "}" +
          "function runTheTest () {" +
          grunt.file.read(srcPath) +
          " }";

        content = processTest(content);
        grunt.file.write(destPath, content);
      });
    }
  );
};

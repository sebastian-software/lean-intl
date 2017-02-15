# *Lean-Intl* - A leaner fork of Intl.js <br/>[![Sponsored by][sponsor-img]][sponsor] [![Version][npm-version-img]][npm] [![Downloads][npm-downloads-img]][npm] [![Build Status Unix][travis-img]][travis] [![Build Status Windows][appveyor-img]][appveyor] [![Dependencies][deps-img]][deps]

*Lean-Intl* is a lean polyfill for `Intl`-APIs for browsers which are not yet supporting this API. It's a
modern fork of [Intl.js](https://github.com/andyearnshaw/Intl.js) for modern development and tooling requirements.

[sponsor-img]: https://img.shields.io/badge/Sponsored%20by-Sebastian%20Software-692446.svg
[sponsor]: https://www.sebastian-software.de
[deps]: https://david-dm.org/sebastian-software/lean-intl
[deps-img]: https://david-dm.org/sebastian-software/lean-intl.svg
[npm]: https://www.npmjs.com/package/lean-intl
[npm-downloads-img]: https://img.shields.io/npm/dm/lean-intl.svg
[npm-version-img]: https://img.shields.io/npm/v/lean-intl.svg
[travis-img]: https://img.shields.io/travis/sebastian-software/lean-intl/master.svg?branch=master&label=unix%20build
[appveyor-img]: https://img.shields.io/appveyor/ci/swernerx/lean-intl/master.svg?label=windows%20build
[travis]: https://travis-ci.org/sebastian-software/lean-intl
[appveyor]: https://ci.appveyor.com/project/swernerx/lean-intl/branch/master


## Introduction

In December 2012, ECMA International published the first edition of Standard ECMA-402,
better known as the _ECMAScript Internationalization API_. This specification provides
the framework to bring long overdue localization methods to ECMAScript implementations.

All modern browsers and NodeJS (except Safari <= 10) have implemented this API. `Lean-Intl` fills the void of
availability for this API. It will provide the framework as described by the specification,
so that developers can take advantage of the native API
in environments that support it, or `Lean-Intl` for legacy or unsupported environments.


## Changes compared to Intl.js

 - Removed previous manual library publishing with [prepublish](https://github.com/sebastian-software/prepublish)
 - Updated ECMA Test Suite from 99 tests to 126 tests.
 - Removed special IE8 support in test suite. We are focusing on >= IE10 and other modern browsers.
 - Removed HTML output for test suite as we only test compatibility in NodeJS via CI.
 - Removed Bower support. That's the past. Either use Webpack or Fusebox, please.
 - Cleaned up Readme from old hints on using direct scripts and NodeJS support.
 - Prettified source code using [Prettier](https://github.com/jlongster/prettier) and ESLint.

TODO:

 - Cleanup custom Polyfills
 - Removed JSONP data which is only relevant for direct browser usage


## Getting started

Lean Intl is meanted to be used by module bundlers. We are not offering any pre-built browser-ready
scripts anymore. In todays landscape it's much better to rely on some kind of bundling for delivering
your frontend goods.

 - NodeJS is natively supporting Intl. Just make sure to install it with full ICU data for real i18n support. (On Mac this can be easily done via `brew install node --with-full-icu`)
 - For browsers install the package via NPM or Yarn. Then use tools like Webpack, Fusebox or Browserify for bundling.


## Status

Current progress is as follows:

### Implemented

 - All internal methods except for some that are implementation dependent
 - Checking structural validity of language tags
 - Canonicalizing the case and order of language subtags
 - __`Intl.NumberFormat`__
   - The `Intl.NumberFormat` constructor ([11.1](http://www.ecma-international.org/ecma-402/1.0/#sec-11.1))
   - Properties of the `Intl.NumberFormat` Constructor ([11.2](http://www.ecma-international.org/ecma-402/1.0/#sec-11.2))
   - Properties of the `Intl.NumberFormat` Prototype Object ([11.3](http://www.ecma-international.org/ecma-402/1.0/#sec-11.3))
   - Properties of Intl.NumberFormat Instances([11.4](http://www.ecma-international.org/ecma-402/1.0/#sec-11.4))
 - __`Intl.DateTimeFormat`__
   - The `Intl.DateTimeFormat` constructor ([12.1](http://www.ecma-international.org/ecma-402/1.0/#sec-12.1))
   - Properties of the `Intl.DateTimeFormat` Constructor ([12.2](http://www.ecma-international.org/ecma-402/1.0/#sec-12.2))
   - Properties of the `Intl.DateTimeFormat` Prototype Object ([12.3](http://www.ecma-international.org/ecma-402/1.0/#sec-12.3))
   - Properties of Intl.DateTimeFormat Instances([12.4](http://www.ecma-international.org/ecma-402/1.0/#sec-12.4))
 - Locale Sensitive Functions of the ECMAScript Language Specification
   - Properties of the `Number` Prototype Object ([13.2](http://www.ecma-international.org/ecma-402/1.0/#sec-13.2))
   - Properties of the `Date` prototype object ([13.3](http://www.ecma-international.org/ecma-402/1.0/#sec-13.3))

### Not Implemented

 - `BestFitSupportedLocales` internal function
 - Implementation-dependent numbering system mappings
 - Calendars other than Gregorian
 - Support for time zones
 - Collator objects (`Intl.Collator`) (see below)
 - Properties of the `String` prototype object

A few of the implemented functions may currently be non-conforming and/or incomplete.
Most of those functions have comments marked as 'TODO' in the source code.

The test suite is run with Intl.Collator tests removed, and the Collator
constructor removed from most other tests in the suite. Also some parts of
tests that cannot be passed by a JavaScript implementation have been disabled,
as well as a small part of the same tests that fail due to [this bug in v8][].

 [this bug in v8]: https://code.google.com/p/v8/issues/detail?id=2694


## What about Intl.Collator?

Providing an `Intl.Collator` implementation is no longer a goal of this project. There
are several reasons, including:

 - The CLDR convertor does not automatically convert collation data to JSON
 - The Unicode Collation Algorithm is more complicated that originally anticipated,
   and would increase the code size of Lean Intl too much.
 - The Default Unicode Collation Element Table is huge, even after compression, and
   converting to a native JavaScript object would probably make it slightly larger.
   Server-side JavaScript environments will (hopefully) soon support Intl.Collator,
   and we can't really expect client environments to download this data.


## Compatibility

Lean Intl is designed to be compatible with ECMAScript 3.1 environments in order to
follow the specification as closely as possible. However, some consideration is given
to legacy (ES3) environments, and the goal of this project is to at least provide a
working, albeit non-compliant implementation where ES5 methods are unavailable.

A subset of the tests in the test suite are run in IE 8. Tests that are not passable
are skipped, but these tests are mostly about ensuring built-in function behavior.


## Locale Data

`Lean Intl` uses the Unicode CLDR locale data, as recommended by the specification. The main `Lean Intl`
file contains no locale data itself. In browser environments, the
data should be provided, passed into a JavaScript object using the
`IntlPolyfill.__addLocaleData()` method.

Contents of the `locale-data` directory are a modified form of the Unicode CLDR
data found at http://www.unicode.org/cldr/.


## RegExp cache / restore

`Lean Intl` attempts to cache and restore static RegExp properties before executing any
regular expressions in order to comply with ECMA-402. This process is imperfect,
and some situations are not supported. This behavior is not strictly necessary, and is only
required if the app depends on RegExp static properties not changing (which is highly
unlikely). To disable this functionality, invoke `Intl.__disableRegExpRestore()`.


## Contributing

* Pull requests and stars are always welcome.
* For bugs and feature requests, please create an issue.
* Pull requests must be accompanied by passing automated tests (`$ npm test`).


## License

This software is licensed under the MIT license. See the `LICENSE.txt` file
accompanying this software for terms of use.


## Copyright

<img src="assets/sebastiansoftware.png" alt="Sebastian Software GmbH Logo" width="250" height="200"/>

Copyright 2013 [Andy Earnshaw](https://github.com/andyearnshaw/Intl.js)<br/>
Copyright 2016-2017 [Sebastian Software GmbH](http://www.sebastian-software.de)

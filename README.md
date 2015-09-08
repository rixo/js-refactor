[![Build Status](https://travis-ci.org/hax/js-refactor.svg?branch=master)](https://travis-ci.org/hax/js-refactor)
[![Downloads](https://img.shields.io/apm/dm/js-refactor.svg)](https://atom.io/packages/js-refactor)
[![apm](https://img.shields.io/apm/v/js-refactor.svg)](https://atom.io/packages/js-refactor)

# JS Refactor Package

JavaScript refactoring language plugin for [Atom](https://atom.io/).
**This package requires [refactor](https://atom.io/packages/refactor) package.**
You can install from the preference pane.


## ES6+ Support

Start from v0.6.0, we already have experimental support of ES6+,
track [#6](https://github.com/hax/js-refactor/issues/6) for more details.


## Related Packages

* [refactor](https://atom.io/packages/refactor): Main package.
* [coffee-refactor](https://atom.io/packages/coffee-refactor): Language plugin for CoffeeScript.


## Changelog

### v0.6.0 on 2015-09-08

* Require Atom >=1.0.0, refactor ^0.6.0
* Experimental support of ES6+ (Babel, stage >= 1)
* Start migrating from coffeescript to babel
* Improve esrefactor based on a most recent and active fork
* Use babylon (the parser of babel) instead of esprima
* Update estools (estraverse, escope) to latest version
* Add debug util
* Update travis config as latest atom/ci

* [Changelog of old versions](CHANGELOG.md)

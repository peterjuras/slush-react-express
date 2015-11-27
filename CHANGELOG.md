Changelog - slush-react-express
==============

# 3.0.0
* Switched full templates to JSPM allowing for on the fly compilation and **hot-reloading**
* There are no longer any builds needed for development! Everything is compiled on the fly, drastically reducing development downtime
* Production builds are more than twice as fast now.
* Drastically simplified gulp tasks
* Reordered the folder structure of the full templates to clearly separate client code from server code and adhere to common standards
* All templates now use even more ES6 features
* Full/TypeScript: The gulpfile is now also written in TypeScript
* Updated all modules to their newest versions and React to 0.14.3
* Slush Generator: Rewritten from scratch in TypeScript
* Slush Generator: Cleaned up and minimized npm-published files
* Slush Generator: Created robust tests for every template configuration

### 2.1.1

* Updated minimal template to newest react version and use more ES6
* Fixed missing gulp-rename package in full/javascript template

## 2.1.0

* Rewrote gulp builds to be faster, cleaner and more configurable.

### 2.0.1

* Full templates now using minified React libraries for production builds

# 2.0.0

* Update React to version 0.14.0
* Minimal template now uses Babel transpiler instead of JSXTransformer
* Minimal template now uses ES6 features where appropriate
* Full/JavaScript template now uses ES6 features where appropriate
* Full/JavaScript template now uses babelify instead of reactify

## 1.1.0

* Added sourcemap generation for full templates when building for development
* Fix "Get appname" button in minimal template
* Remove tests from build output in the full/javascript template

### 1.0.1

* Fixed .gitignore file for full templates

# 1.0.0

*Initial release*

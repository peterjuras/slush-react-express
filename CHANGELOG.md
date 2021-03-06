Changelog - slush-react-express
==============

# 4.3.0

* Update minimal template to latest React version and use babel-standalone

# 4.2.0

* Fixed hot reloading in full templates

# 4.0.0

* Updated all React versions to 15.0.1

# 3.6.0

* Upgraded Full/TypeScript template to TypeScript 1.8.

# 3.5.0

* Dependency updates for all templates
* Most notably: Using babel 6 for server-side templates and tests in the Full/JavaScript template.

# 3.4.0

* Switched Full/TypeScript template and generator from tsd to typings due to [deprecation](https://github.com/DefinitelyTyped/tsd/issues/269).
* Full templates: Replaced old jspm-hot-reloader reference with systemjs-hot-reloader.

# 3.3.0

* Full templates now have React unit tests using the React shallow renderer.

# 3.2.0

* Full templates are now using express-react-views to render server views with React.

# 3.1.0

* Full/TypeScript: NameLoaderView is now a stateless React component.

# 3.0.0
* Switched full templates to JSPM allowing for on the fly compilation and **hot-reloading**
* There are no longer any builds needed for development! Everything is compiled on the fly, drastically reducing development downtime
* Production builds are more than twice as fast now.
* Drastically simplified gulp tasks
* Reordered the folder structure of the full templates to clearly separate client code from server code and adhere to common standards
* All templates now use even more ES6 features
* Full/TypeScript: The gulpfile is now also written in TypeScript
* Minimal: React and babel are now saved locally instead of a CDN.
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

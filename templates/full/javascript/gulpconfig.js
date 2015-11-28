// This config file enables you to adjust the default locations and plugin
// behaviors of the gulpfile.
// ----
// The gulpfile offers the following important tasks for you:
//
// ---- Default ----
// Run "gulp"
// ----
// (same as "gulp test")
//
// Default build + test task that bundles and copies all source files, moves them to a destination location and puts the build output through all tests.
//
// ---- Build ----
// Run "gulp build"
// ----
// Bundles and copies all source files and moves them to the destination location without running any tests.
//
// ---- Watch ----
// Run "gulp watch"
// ----
// Watch task which will restart the server or hot reload browser module if necessary.

const config = {
  // Location where the build output will be put
  // default: 'dist'
  buildOutDir: 'dist',

  // Client side static source files location
  // default: 'src/client/static'
  clientStaticDir: 'src/client/static',

  // Client side script source files location
  // default: 'src/client/app'
  clientScriptDir: 'src/client/app',

  // Server side source files location
  // default: 'src/server'
  serverSourceDir: 'src/server',

  // Server tests source files location
  // default: 'test/server'
  testDirServer: 'test/server',

  // Client tests source files location
  // default: 'test/client'
  testDirClient: 'test/client',

  // Specify which plugins are activated for the production build
  plugins: {
    // Writes inline sourcemaps to enable debugging
    // default: false
    sourcemaps: false,

    // Removes debug output like 'console.log()' from scripts
    // default: true
    stripDebug: true,

    // Minifies, refactors and strips comments from scripts
    // default: true
    uglify: true,

    // Minifies HTML
    // default: true
    minifyHtml: true
  },

  // Entry points for jspm bundles. Relative to clientScriptDir
  // default: [ 'index.js' ]
  entryPoints: [
    'index.js'
  ],

  // Bundle output folder. Relative to buildOutDir
  // default: 'client/app'
  bundleOutputDir: 'client/app'
};

module.exports = config;

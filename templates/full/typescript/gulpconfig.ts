// This config file enables you to adjust the default locations and plugin
// behaviors of the gulpfile.
// ----
// The gulpfile offers the following important tasks for you:
//
// ---- Default ----
// Run "gulp"
// (equals to running "gulp build")
// ----
// Default build task that bundles and copies all source files and moves them to a destination location.
//
// ---- Watch ----
// Run "gulp watch"
// ----
// Watch task which will restart the express server if necessary

export default {
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

  // Tests source files location
  // default: 'test/server'
  testDir: 'test/server',

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
  // default: [ 'src/index.tsx' ]
  entryPoints: [
    'src/index.tsx'
  ],

  // Bundle output folder. Relative to buildOutDir
  // default: 'client/app'
  bundleOutputDir: 'client/app'
};

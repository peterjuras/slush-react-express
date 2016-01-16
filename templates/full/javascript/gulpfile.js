'use strict';

// Read the config from gulpconfig.js
const config = require('./gulpconfig');

const del = require('del');                         // Clean up files that are no longer needed
const extend = require('util')._extend;             // Used to extend the current process.env object for hot reloading
const fs = require('fs');                           // Used to create a .gitignore file for the production build
const gulp = require('gulp');
const gulpFilter = require('gulp-filter');          // Filter streams to perform operations on a valid subset of files
const gulpMocha = require('gulp-mocha');            // Runs mocha unit tests
const gutil = require('gulp-util');                 // Allows to return unchanged streams when a plugin is disabled
const htmlreplace = require('gulp-html-replace');   // Replaces the jspm script imports with the generated bundled
const install = require('gulp-install');            // Installs npm packages from a package.json file
const jeditor = require('gulp-json-editor');        // Modifies the built package.json
const jspm = require('gulp-jspm');                  // Used to bundle the client source files
const minifyHtml = require('gulp-htmlmin');
const mkpath = require('mkpath');                   // Creates folders within a path that don't exist yet
const path = require('path');                       // Ensure path operations are valid in Windows & Unix
const sourcemaps = require('gulp-sourcemaps');      // Writes inline sourcemaps to ease debugging
const spawn = require('child_process').spawn;       // Spawns a node server to enable incremental compilation
const stripDebug = require('gulp-strip-debug');     // Removes debug statements from script files

// The watch task spawns a node server which will be referenced in this variable,
// to be able to kill it when the server needs to be restarted.
let node;

// Applies a plugin to the stream if the flag demands for it
function applyPlugin(plugin, flag) {
  return flag ? plugin : gutil.noop();
}

// The default task, which can be called with "gulp"
gulp.task('default', ['test']);

// The general build task which parallely calls its dependants
gulp.task('build', ['copy:server', 'copy:client', 'bundle:client', 'npm:install', 'create:gitignore']);

// Copies all server source files to the build output directory
gulp.task('copy:server', () => {
  // Don't touch jsx view files
  const jsxFilter = gulpFilter([
    '**/**',
    '!**/**.jsx'
  ], { restore: true });

  // Get all server files
  return gulp.src(`${config.serverSourceDir}/**/**`, { base: './' })
  // Remove jsx view files from the stream
    .pipe(jsxFilter)
  // Initialize source maps
    .pipe(applyPlugin(sourcemaps.init(), config.plugins.sourcemaps))
  // Strip debug messages like console.log from the files
    .pipe(applyPlugin(stripDebug(), config.plugins.stripDebug))
  // Write the source maps
    .pipe(applyPlugin(sourcemaps.write(), config.plugins.sourcemaps))
  // Restore jsx view files into the stream
    .pipe(jsxFilter.restore)
  // Put the files in the build output directory
    .pipe(gulp.dest(config.buildOutDir));
});

// Copies all static client files to the build output directory
gulp.task('copy:client', () => {
  const htmlFilter = gulpFilter('**/*.html', { restore: true });

  // Get all static client files
  return gulp.src(`${config.clientStaticDir}/**/**`, { base: './' })

  // Operations on HTML files
    .pipe(htmlFilter)
  // Replace System.js with the bundle reference
    .pipe(htmlreplace({ production: 'index.bundle.js' }))
  // Minify the html
    .pipe(applyPlugin(minifyHtml({
      removeComments: true,
      collapseWhitespace: true
    }), config.plugins.minifyHtml))
  // Restore all files back into the stream
    .pipe(htmlFilter.restore)

  // Put the files in the build output dir
    .pipe(gulp.dest(config.buildOutDir));
});

// Bundles all jspm entry points into single files
gulp.task('bundle:client', () => {
  // Get all entryPoints and prepend the script directory to its path
  const entryPoints = config.entryPoints.map(point => `${config.clientScriptDir}/${point}`);

  return gulp.src(entryPoints, { base: './' })
  // Initialize source maps
    .pipe(applyPlugin(sourcemaps.init(), config.plugins.sourcemaps))
  // Execute the jspm command line tool to generate a bundle
    .pipe(jspm({
      selfExecutingBundle: true,
      minify: config.plugins.uglify,
    }))
  // Strip debug messages like console.log from the files
    .pipe(applyPlugin(stripDebug(), config.plugins.stripDebug))
  // Write the source maps
    .pipe(applyPlugin(sourcemaps.write(), config.plugins.sourcemaps))
  // Put the files in the build output dir
    .pipe(gulp.dest(config.buildOutDir));
});

gulp.task('npm:install', () => {
  // The base for the built package.json will be the current package.json
  return gulp.src('package.json')
  // Clean up the package.json and remove development
  // related sections
    .pipe(jeditor(json => {
      // Tests will not be compiled/copied into the build directory
      delete json.scripts.test;
      // the post install script installs jspm modules, which are no longer needed
      delete json.scripts.postinstall;
      // DevDependencies will no longer be needed in the built project
      delete json.devDependencies;
      // jspm dependencies will also no longer be needed since everything is bundled
      delete json.jspm;
      return json;
    }))
    .pipe(gulp.dest(config.buildOutDir))
  // Run 'npm install' with the production parameter
  // to stop it from installing devDependencies. While the devDependencies are
  // stripped from the package.json before, npm might introduce other production
  // build behavior in the future that we want to preserve
    .pipe(install({
      production: true,
    }));
});

gulp.task('create:gitignore', done => {
  const excluded = [
    'node_modules'
  ];

  mkpath(config.buildOutDir, error => {
    if (error) {
      throw error;
    }

    fs.writeFile(path.join(config.buildOutDir, '.gitignore'), excluded.join('\n'), done);
  });
});

// Runs all unit test within the test directory with mocha
gulp.task('test', ['test:client']);

// Copies all server side tests
gulp.task('copy:server-tests', ['build'], () => {
  return gulp.src([
      `${config.testDirServer}/**/**`,
    ], { base: './' })
    .pipe(gulp.dest(config.buildOutDir));
});

function deleteTestsInBuildOutDir() {
  del(path.join(config.buildOutDir, 'test'));
}

// Runs all server tests
gulp.task('test:server', ['copy:server-tests'], () => {
  return gulp.src(`${path.join(config.buildOutDir, config.testDirServer)}/**/*.js`, { read: false })
    .pipe(gulpMocha({
      require: ['env-test']
    }))
    .on('end', deleteTestsInBuildOutDir)
    .on('error', deleteTestsInBuildOutDir);;
});

// Runs all client side tests
gulp.task('test:client', ['test:server'], () => {
  require('babel-core/register') // Use babel to translate client test files
  return gulp.src(`${config.testDirClient}/**/*.js`, { read: false })
    .pipe(gulpMocha({
      compilers: ['js:babel-core/register'],
      require: ['env-test']
    }));
});

// Creates a node server which will be used by 'gulp watch'
gulp.task('server', () => {
  // Check whether a node server has already been started by this task
  if (node) {
    // Kill the process if node has been running before
    node.kill();
  }

  // Pass on another environment variable to emit hot reloading events
  const watchEnvironment = extend(process.env, { 'gulp:watch': true });

  // Start the node server with the node entry point
  node = spawn('node', [path.join(config.serverSourceDir, 'server.js')], {
    stdio: 'inherit',
    env: watchEnvironment,
  });

  // Listen to the close event to detect errors while running the server
  node.on('close', code => {
    // Check for the error code to detect errors correctly
    if (code === 8) {
      console.log('Error detected, waiting for changes...');
    }
  });
});

// Task that watches the source files for modifications and rebuilds
// the project upon file changes
gulp.task('watch', ['server'], () => {
  // Watch for server side files and restart the server after a succesful build
  gulp.watch(`${config.serverSourceDir}/**/**`, ['server']);
});

// This task cleans all files that are generated by the build process
gulp.task('clean', () => {
  return del(config.buildOutDir);
});

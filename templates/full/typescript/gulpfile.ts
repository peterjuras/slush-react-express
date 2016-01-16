'use strict';

// Read the config from gulpconfig.ts
import config from './gulpconfig';

import childProcess = require('child_process');
import del = require('del');                         // Clean up files that are no longer needed
import fs = require('fs');                           // Used to create a .gitignore file for the production build
import gulp = require('gulp');
import gulpFilter = require('gulp-filter');          // Filter streams to perform operations on a valid subset of files
import gutil = require('gulp-util');                 // Allows to return unchanged streams when a plugin is disabled
import htmlreplace = require('gulp-html-replace');   // Replaces the jspm script imports with the generated bundled
import install = require('gulp-install');            // Installs npm packages from a package.json file
import jeditor = require('gulp-json-editor');        // Modifies the built package.json
import jspm = require('gulp-jspm');                  // Used to bundle the client source files
import minifyHtml = require('gulp-htmlmin');
import mkpath = require('mkpath');                   // Creates folders within a path that don't exist yet
import gulpMocha = require('gulp-mocha');            // Runs mocha unit tests
import path = require('path');                       // Ensure path operations are valid in Windows & Unix
import rename = require('gulp-rename');              // Rename the bundle from .tsx to .js
import sourcemaps = require('gulp-sourcemaps');      // Writes inline sourcemaps to ease debugging
import stripDebug = require('gulp-strip-debug');     // Removes debug statements from script files
import ts = require('gulp-typescript');              // Compiles server side ts files to javascript

const spawn = childProcess.spawn;                    // Spawns a node server to enable incremental compilation
const extend : Function = require('util')._extend;              // Used to extend the current process.env object for hot reloading

// The watch task spawns a node server which will be referenced in this variable,
// to be able to kill it when the server needs to be restarted.
let node : childProcess.ChildProcess;

// The TypeScript project that allows for incremental server source compilation
const tsProject = ts.createProject('tsconfig.json');

// Applies a plugin to the stream if the flag demands for it
function applyPlugin(plugin: NodeJS.ReadWriteStream, flag: boolean) {
  return flag ? plugin : gutil.noop();
}

// The default task, which can be called with "gulp"
gulp.task('default', ['test']);

// The general build task which parallely calls its dependants
gulp.task('build', ['compile:server', 'copy:client', 'bundle:client', 'npm:install', 'create:gitignore']);

// Compiles all server source files and puts them in the build output directory
gulp.task('compile:server', () => {
  // Get all server files
  return gulp.src([
    `${config.serverSourceDir}/**/**`,
    `${config.clientScriptDir}/typings/tsd.d.ts`
  ], { base: './' })
  // Initialize source maps
    .pipe(applyPlugin(sourcemaps.init(), config.plugins.sourcemaps))
  // Compile the files
    .pipe(ts(tsProject))
  // Strip debug messages like console.log from the files
    .pipe(applyPlugin(stripDebug(), config.plugins.stripDebug))
  // Server side tsx templates should still be named tsx instead of js
    .pipe(rename(path => {
      if (/\/view$/.test(path.dirname)) {
        path.extname = '.tsx';
      }
      return path;
    }))
  // Write the source maps
    .pipe(applyPlugin(sourcemaps.write(), config.plugins.sourcemaps))
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
    .pipe(htmlreplace({ production: 'src/index.bundle.js' }))
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
  // Rename the bundle from .tsx to .js
    .pipe(rename(path => path.extname = '.js'))
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
    .pipe(jeditor((json : any) => {
      // Change start script
      json.scripts.start = `node ${path.join(config.serverSourceDir, 'server.js')}`;
      // Tests will not be compiled/copied into the build directory
      delete json.scripts.test;
      // the post install script installs tsd and jspm modules, which are no longer needed
      delete json.scripts.postinstall;
      // DevDependencies will no longer be neeed in the built project
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

gulp.task('create:gitignore', (done : Function) => {
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

// Compiles all server side tests
gulp.task('compile:tests', ['build'], () => {
  return gulp.src([
      `${config.testDir}/**/**.ts`,
      `${config.clientScriptDir}/typings/tsd.d.ts`
    ], { base: './' })
    .pipe(ts(tsProject))
    .js
    .pipe(gulp.dest(config.buildOutDir));
});

function deleteTestsInBuildOutDir() {
  del(path.join(config.buildOutDir, 'test'));
}

// Runs all unit test within the test directory with mocha
gulp.task('test', ['compile:tests'], () => {
  return gulp.src(`${path.join(config.buildOutDir, config.testDir)}/**/*.js`, { read: false })
    .pipe(gulpMocha({
      require: ['env-test']
    }))
    .on('end', deleteTestsInBuildOutDir)
    .on('error', deleteTestsInBuildOutDir);
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
  node = spawn('node_modules/.bin/ts-node', [path.join(config.serverSourceDir, 'server.ts')], {
    stdio: 'inherit',
    env: watchEnvironment,
  });

  // Listen to the close event to detect errors while running the server
  node.on('close', (code : Number) => {
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
  return del([
    config.buildOutDir,
    `${config.clientScriptDir}/**/*.js`,
    `!${config.clientScriptDir}/config.js`,
    `!${config.clientScriptDir}/jspm_packages/**/*.js`,
    `${config.serverSourceDir}/**/*.js`,
    `test/**/*.js`,
    `gulpfile.js`,
    `gulpconfig.js`
  ]);
});

// Read the config from gulpconfig.js
var config = require('./gulpconfig');

var async = require('async');                     // Async for each to create browserify bundles
var browserify = require('browserify');           // React bundling and using 'require('x')' in the browser
var buffer = require('vinyl-buffer');             // Creates streams from browserify bundles
var changed = require('gulp-changed');            // Reduce 'npm install' calls by only passing through a modified package.json
var del = require('del');                         // Clean up files that are no longer needed
var exposify = require('exposify');               // Exposes global variables in browserify bundles
var gulp = require('gulp');
var gulpFilter = require('gulp-filter');          // Filter streams to perform operations on a valid subset of files 
var gutil = require('gulp-util');                 // Allows to return unchanged streams when a plugin is disabled
var install = require('gulp-install');            // Installs npm packages from a package.json file
var intermediate = require('gulp-intermediate');  // Stores current stream in a temporary directory to enable browserify
var jeditor = require('gulp-json-editor');        // Modifies the built package.json
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var mocha = require('gulp-mocha');                // Run node unit tests
var path = require('path');                       // Ensure path operations are valid in Windows & Unix
var source = require('vinyl-source-stream');      // Creates a source file from a browserify bundle
var sourcemaps = require('gulp-sourcemaps');      // Writes inline sourcemaps to ease debugging
var spawn = require('child_process').spawn;       // Spawns a node server to enable incremental compilation
var stripDebug = require('gulp-strip-debug');     // Removes debug statements from script files
var template = require('gulp-template');          // Helps in loading minified/unminified versions of the React libraries
var ts = require('gulp-typescript');              // Compiles .ts & .tsx files to JavaScript
var uglify = require('gulp-uglify');              // Minifies, refactors and removes comments from script files
var yargs = require('yargs').argv;                // Provides easy access to passed command line arguments

// The watch task spawns a node server which will be referenced in this variable,
// to be able to kill it when the server needs to be restarted.
var node;

// The TypeScript project lives in the global scope to enable incremental compilation improvements
// provided by gulp-typescript
var tsProject = ts.createProject(config.TypeScript.tsconfig, config.TypeScript.options);

// The default task, which can be called with "gulp"
gulp.task('default', ['build']);

// The general build task which parallely calls its dependants
gulp.task('build', ['copy', 'compile', 'install']);

// The install task creates a cleaned package.json file
// and runs 'npm install' in the build output directory
gulp.task('install', function () {
  // Don't do anything if --skip-build is passed
  if (yargs['skip-build']) {
    return;
  }
  
  // The base for the built package.json will be the current package.json
  return gulp.src('package.json')
  // Only pass the file through if it is newer than the built file
  // to reduce 'npm install' calls
    .pipe(changed(config.buildOutDir))
  // Clean up the package.json and remove development
  // related sections
    .pipe(jeditor(function (json) {
      // The current package.json points to buildOutDir/start, but the
      // new package.json will live in the buildOutDir, which means that
      // we need to update the start script which will be called by 'npm start'
      json.scripts.start = 'node ' + config.start;
      
      // Tests will not be compiled/copied into the build directory
      delete json.scripts.test;
      // DevDependencies will no longer be needed in the built project
      delete json.devDependencies;

      return json;
    }))
    .pipe(gulp.dest(config.buildOutDir))
  // Run 'npm install' with the production parameter,
  // to stop it from installing devDependencies. While the devDependencies are
  // stripped from the package.json before, npm might introduce other production
  // build behavior in the future that we want to preserve
    .pipe(install({
      production: true
    }));
});

// This task copies the client side source files to the build output folder
gulp.task('copy', function () {
  // Don't do anything if --skip-build is passed
  if (yargs['skip-build']) {
    return;
  }

  // Declare filters for each file type, to feed only
  // the right files into plugins  
  var jsFilter = gulpFilter('**/*.js', { restore: true });
  var htmlFilter = gulpFilter('**/*.html', { restore: true });
  var cssFilter = gulpFilter('**/*.css', { restore: true }); <%= sassFilter %>

  // Index.html is templated and expecting to know whether it should
  // load the minified or full React libraries from the cdn. Therefore,
  // we make sure the correct value is being passed into the template
  var scriptsLocation = {
    minified: apply('.min', '', config.react.minimizeReactLibraries)
  };

  // Get every client file except react source files
  return gulp.src([
    config.clientSourceDir + '/**',
    '!' + config.clientSourceDir + '/' + config.clientReactDir + '/**',
    '!' + config.clientSourceDir + '/' + config.clientReactDir
  ]) <%= sassPipe %>
  
  // Operations on JavaScript files
    .pipe(jsFilter)
  // Initialize source maps
    .pipe(applyPlugin(sourcemaps.init(), config.plugins.sourcemaps))
  // Strip debug messages like "console.log()"
    .pipe(applyPlugin(stripDebug(), config.plugins.stripDebug))
  // Minify, refactor and remove comments
    .pipe(applyPlugin(uglify(), config.plugins.uglify))
  // Write the source maps after the files have been transformed
    .pipe(applyPlugin(sourcemaps.write(), config.plugins.sourcemaps))
  // Restore all files back into the stream
    .pipe(jsFilter.restore)
    
  // Operations on HTML files
    .pipe(htmlFilter)
  // Pass through the template for index.html. The template is expecting either
  // '.min' or the empty string '' as valid script locations for the React libs
    .pipe(template(scriptsLocation))
  // Minify the html
    .pipe(applyPlugin(minifyHtml(), config.plugins.minifyHtml))
  // Restore all files back into the stream
    .pipe(htmlFilter.restore)
    
  // Operations on CSS files
    .pipe(cssFilter)
  // Minify the css
    .pipe(applyPlugin(minifyCss(), config.plugins.minifyCss))
  // Restore all files into the stream
    .pipe(cssFilter.restore)
    
  // Put the files in the client location of the build output folder
    .pipe(gulp.dest(path.join(config.buildOutDir, config.clientOutDir)));
});

// This tasks compiles TypeScript files that are being used both on the server and
// on the client side
gulp.task('compile', function () {
  // Don't do anything if --skip-build is passed
  if (yargs['skip-build']) {
    return;
  }
  
  // Create a filter to exclude react files from the build output since
  // they will be bundled by browserify
  var clientFilter = gulpFilter([
    '**/**',
    '!' + path.join(config.clientSourceDir, 'react') + '/**/**'
  ], { restore: true });

  // Map all react entrypoints for browserify
  var reactGlob = config.react.entrypoints.map(function (entry) {
    // Replace TypeScript extensions since they will be compiled to
    // .js
    var entryJs = entry.replace(/(.tsx|.ts)$/, '.js');
    
    // Add the correct source path before the file names
    return path.join(config.clientSourceDir, 'react', entryJs);
  });

  // Get all TypeScript files that are relevant for compilation
  return gulp.src([
    '**/**.ts',
    '**/**.tsx',
    '!' + config.testDir + '/**',
    '!node_modules/**',
    '!' + config.buildOutDir + '/**'])
  // Initialize source maps
    .pipe(applyPlugin(sourcemaps.init(), config.plugins.sourcemaps))
  // Compile with TypeScript
    .pipe(ts(tsProject))
  // Filter to the JavaScript output files
    .js
  // Strip debug messages like "console.log()"
    .pipe(applyPlugin(stripDebug(), config.plugins.stripDebug))
  // Write the source maps after the files have been transformed
    .pipe(sourcemaps.write(getNestedSourceMapsPath()), config.plugins.sourcemaps)
  // Exclude react files from the stream
    .pipe(clientFilter)
  // Put the files in the build output folder
    .pipe(gulp.dest(config.buildOutDir))
  // Restore the react files into the stream
    .pipe(clientFilter.restore)
  // Browserify doesn't play nice with streams, therefore we put the
  // compiled files into a temporary directory
    .pipe(intermediate({}, function (tempDir, callback) {
      // Create a bundle for each entry point
      async.eachSeries(reactGlob, function (entry, callback) {
        // Get the file name as the resulting bundle name
        var fileParts = entry.split(path.sep);
        var fileName = fileParts[fileParts.length - 1];

        // Create a bundle with browserify
        var bundle = browserify({
          // Point to the temporary directory
          entries: path.join(tempDir, entry),
          // Write sourcemaps if demanded
          debug: apply(true, false, config.plugins.sourcemaps)
          
          // Expose global variables like 'React' without bundling them
        }).transform(exposify,
          {
            expose: config.browserify.globals
          });

        bundle
          .bundle()
        // Set the file name of the buffer
          .pipe(source(fileName))
        // Create a stream
          .pipe(buffer())
        // Initialize source maps
          .pipe(applyPlugin(sourcemaps.init({ loadMaps: true }), config.plugins.sourcemaps))
        // Strip debug messages like "console.log()"
          .pipe(applyPlugin(stripDebug(), config.plugins.stripDebug))
        // Minify, refactor and remove comments
          .pipe(applyPlugin(uglify(), config.plugins.uglify))
        // Write the source maps after the files have been transformed
          .pipe(sourcemaps.write(), config.plugins.sourcemaps)
        // Put the bundle in the correct location
          .pipe(gulp.dest(path.join(config.buildOutDir, config.clientOutDir, 'javascripts')))
        // Call the async callback to signalize that this bundle is completed
          .on('end', callback);
          
        // Call the stream callback once all bundles are created
      }, callback);
    }));
});

// Creates a node server which will be used by 'gulp watch'
gulp.task('server', ['build'], function () {
  // Check whether a node server has already been started by this task
  if (node) {
    // Kill the process if node has been running before
    node.kill();
  }
  
  // Start the node server with the node entry point
  node = spawn('node', [path.join(config.buildOutDir, config.start)], { stdio: 'inherit' });
  
  // Listen to the close event to detect errors while running the server
  node.on('close', function (code) {
    // Check for the error code to detect errors correctly
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

// Task that watches the source files for modifications and rebuilds
// the project upon a change
gulp.task('watch', ['server'], function () {
  // Watch for server side files and restart the server after a succesful build
  gulp.watch([
    '**/**.ts',
    '!node_modules/**',
    '!' + config.buildOutDir + '/**',
    '!' + config.clientSourceDir + '/**',
    '!' + config.testDir + '/**',
    '!typings/**',
  ], ['server']);
  
  // Watch for client side source files and rebuild without a server restart
  gulp.watch([
    config.clientSourceDir + '/**/**.tsx',
    config.clientSourceDir + '/**/**.ts', <%= sassWatch %>
    config.clientSourceDir + '/**/**.html',
    config.clientSourceDir + '/**/**.js',
    config.clientSourceDir + '/**/**.css',
  ], ['build']);
});

// Builds the tests to execute them later on
gulp.task('build:tests', function () {
  // Filter to capture test files
  var testFilter = gulpFilter(config.testDir + '/**/*.js');
  
  // Create a new TypeScript project because we cannot reuse the old instance
  var testProject = ts.createProject(config.TypeScript.tsconfig, config.TypeScript.options);

  // Get all TypeScript files including the test directories
  return gulp.src([
    '**/**.ts',
    '**/**.tsx',
    '!node_modules', '!node_modules/**',
    '!' + config.buildOutDir,
    '!' + config.buildOutDir + '/**'
  ])
  // Initialize source maps
    .pipe(applyPlugin(sourcemaps.init(), config.plugins.sourcemaps))
  // Compile with TypeScript
    .pipe(ts(testProject))
  // Filter to the JavaScript output files
    .js
  // Filter to the compiled test files
    .pipe(testFilter)
  // Write the source maps after the files have been transformed
    .pipe(applyPlugin(sourcemaps.write(), config.plugins.sourcemaps))
  // Put the test files in the same directory as the source files
    .pipe(gulp.dest('./'));
});

// This task runs all tests within the 'tests' folder and deletes the compiled tests
// afterwards
gulp.task('test', ['build', 'build:tests'], function (callback) {
  // Get all compiled tests
  gulp.src(config.testDir + '/**/**.js', { read: false })
  // Run these files through mocha
    .pipe(mocha())
  // Wait until mocha finished testing
    .on('end', function () {
      // Delete the compiled tests
      var deleteGlob = yargs['skip-del'] ? '' : config.testDir + '/**/**.js';
      del(deleteGlob).then(function () {
        // Signalize gulp that our test is finished
        callback();
      });
    });
});

// This task cleans all files that are generated by the build process
gulp.task('clean', function () {
  return del([
    config.buildOutDir,
    config.testDir + '/**/**.js'
  ]);
});

// Applies a plugin to the stream if the flag and current environment demand for it
function applyPlugin(plugin, flag) {
  return apply(plugin, gutil.noop(), flag);
}

// Returns the trueValue if the flag and current environment demand for it
function apply(trueValue, falseValue, flag) {
  // Always means that the trueValue will be returned regardless of the current
  // environment
  if (flag === 'always') {
    return trueValue;
  } else if (flag === 'production') {
    // The trueValue should only be returned if we are currently running in the 
    // production environment
    return yargs.production ? trueValue : falseValue;
  } else if (flag === 'development') {
    // The trueValue should only be returned if we are currently NOT running in the
    // production environment
    return yargs.production ? falseValue : trueValue;
  } else {
    // Reached with the 'never' flag. Always return the falseValue
    return falseValue;
  }
}

// This method is used to calculate the valid source map paths for compiled paths
// to enable tools like Chrome or Visual Studio Code to map the compiles files to
// their correct source counterpaths.
// Source map paths will map according to the following pattern:
// text.js = '';
// folder/text.js = '../'
// folder/folder/text.js = '../../'
// etc.
function getNestedSourceMapsPath() {
  return {
    sourceRoot: function (file) {
      var result = '';
      // By separating the file by the path seperator, we receive the depth of the file
      // as the array length. The filename and actual folder paths are not relevant to
      // the output of this function
      var pathSteps = file.relative.split(path.sep);

      // Iterate over the pathSteps and add the parent directory to the result string
      for (var step in pathSteps) {
        result += '..' + path.sep;
      }
      return result;
    }
  };
}
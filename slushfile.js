var gulp = require('gulp'),
  install = require('gulp-install'),
  conflict = require('gulp-conflict'),
  template = require('gulp-template'),
  es = require('event-stream'),
  inquirer = require('inquirer'),
  rename = require('gulp-rename'),
  emptyDir = require('empty-dir'),
  gulpFilter = require('gulp-filter'),
  run = require('run-sequence'),
  validateName = require('validate-npm-package-name'),
  es = require('event-stream'),
  path = require('path'),
  readline = require('readline'),
  tsd = require('gulp-tsd');

// A test destination can be used to check the generators output.
// "test/" is recommended, since it is ignored by git
var destination = process.env.testDest || './';
var appName;

gulp.task('default', ['generate']);

gulp.task('generate', generate);

gulp.task('generate:minimal', generateMinimal);

gulp.task('generate:full', generateFull);

function generate(callback) {
  var workingDirName = process.cwd().split('/').pop().split('\\').pop();

  if (process.env.NODE_ENV !== "test") {
    console.log('Welcome to the react-express slush generator!');
  }
  inquirer.prompt([{
    type: 'input',
    name: 'appname',
    message: 'What will your app be called?',
    default: formatPackageName(workingDirName.toLowerCase()),
    validate: validateNameAnswer
  }, {
      type: 'list',
      name: 'type',
      message: 'Would you like to use a minimal or a full (gulp builds, tests, production settings) template?',
      choices: ['Minimal', 'Full'],
      default: 0
    }], function (answers) {
      answers = cleanName(answers);
      appName = answers.appname;

      if (answers.type.indexOf('Full') != -1) {
        run('generate:full', callback);
      } else {
        run('generate:minimal', callback);
      }
    });
}

function generateMinimal(done) {
  emptyDir('./', function (err, dirEmpty) {
    var questions = [];
    if (destination === './' && !dirEmpty) {
      questions.push({
        type: 'confirm', name: 'createDir', message: 'The current folder is not empty, do you want to create a new folder?', default: true
      });
    }
    inquirer.prompt(questions, function (answers) {
      answers.appname = appName;

      if (answers.createDir && answers.createDir) {
        destination = destination + answers.appname + '/';
      }

      gulp.src(__dirname + '/templates/minimal/**', { dot: true })
        .pipe(template(answers))
        .pipe(rename(function (path) {
          if (path.basename === '.npmignore') {
            path.basename = '.gitignore';
          }
        }))
        .pipe(conflict(destination))
        .pipe(gulp.dest(destination))
        .pipe(install())
        .on('end', done)
        .resume();
    });
  });
}

function generateFull(done) {
  emptyDir('./', function (err, dirEmpty) {
    var questions = [
      {
        type: 'list',
        name: 'ts',
        message: 'Do you want to write in JavaScript or TypeScript?',
        choices: [
          'JavaScript', 'TypeScript'
        ],
        default: 0
      }, {
        type: 'list',
        name: 'sass',
        message: 'Do you want to style in CSS or SASS?',
        choices: [
          'CSS', 'SASS'
        ],
        default: 0
      }
    ];
    if (destination === './' && !dirEmpty) {
      questions.push({
        type: 'confirm', name: 'createDir', message: 'The current folder is not empty, do you want to create a new folder?', default: true
      });
    }
    inquirer.prompt(questions, function (answers) {
      answers.appname = appName;

      answers.tsignore = '';
      answers = addPackages(answers);

      if (answers.createDir && answers.createDir) {
        destination = destination + answers.appname + '/';
      }

      var scriptDir = 'javascript';
      if (useTypescript(answers)) {
        scriptDir = 'typescript';
        answers.tsignore = '*.js\n**/**.js\ntypings\n!gulpfile.js\n';
      }

      var staticFiles = gulp.src([__dirname + '/templates/full/' + scriptDir + '/**',
        '!' + __dirname + '/templates/full/' + scriptDir + '/typings',
        '!' + __dirname + '/templates/full/' + scriptDir + '/typings/**'])
        .pipe(template(answers, { interpolate: /<%=([\s\S]+?)%>/g }))
        .pipe(conflict(destination))
        .pipe(gulp.dest(destination));

      answers.sassFilter = '';
      answers.sassPipe = '';
      var styleFiles;
      if (answers.sass.indexOf('SASS') != -1) {
        styleFiles = gulp.src(__dirname + '/templates/full/sass/**')
          .pipe(conflict(destination))
          .pipe(gulp.dest(destination));

        answers.sassFilter = '\n\tvar sassFilter = gulpFilter(\'**/*.scss\', { restore: true });'
        answers.sassPipe = '\n\t\t.pipe(sassFilter)\n\t\t.pipe(gulpIf(!yargs.production, sourcemaps.init()))\n\t\t.pipe(require(\'gulp-sass\')())\n\t\t.pipe(gulpIf(!yargs.production, sourcemaps.write()))\n\t\t.pipe(sassFilter.restore)';
      } else {
        styleFiles = gulp.src(__dirname + '/templates/full/css/**')
          .pipe(conflict(destination))
          .pipe(gulp.dest(destination));
      }

      var filter = gulpFilter(['**/**', '!src/favicon.ico'], { 
        restore: true,
        dot: true  
      });

      es.concat(gulp.src(__dirname + '/templates/full/root/**', { dot: true })
        .pipe(filter)
        .pipe(template(answers))
        .pipe(filter.restore)
        .pipe(rename(function (path) {
          if (path.basename === '.npmignore') {
            path.basename = '.gitignore';
          }
        }))
        .pipe(conflict(destination))
        .pipe(gulp.dest(destination))
        .pipe(install({
          args: 'only=dev'
        })), staticFiles, styleFiles)
        .on('end', function () {
          if (useTypescript(answers)) {
            tsd({
              command: 'reinstall',
              config: destination + 'tsd.json'
            }, done);
          } else {
            done();
          }
        })
        //.resume();
    });
  });
}

function addPackages(answers) {
  var packageDelimiter = ',\n\t\t';
  var packages = [];
  var devPackages = [];
  answers.packages = '';
  answers.devPackages = '';

  if (useTypescript(answers)) {
    devPackages.push(['gulp-typescript', '^2.9.0']);
    devPackages.push(['del', '^2.0.2']);
    devPackages.push(['typescript', '^1.6.2']);
  } else {
    devPackages.push(['reactify', '^1.1.1']);
  }

  if (answers.sass.indexOf('SASS') != -1) {
    devPackages.push(['gulp-sass', '^2.0.4']);
  }

  packages.forEach(function (package, index) {
    answers.packages += packageDelimiter + '"' + package[0] + '": "' + package[1] + '"';
  });
  devPackages.forEach(function (package, index) {
    answers.devPackages += packageDelimiter + '"' + package[0] + '": "' + package[1] + '"';
  });
  return answers;
}

function useTypescript(answers) {
  return answers.ts.indexOf('TypeScript') != -1;
}

function cleanName(answers) {
  answers.appname = formatPackageName(answers.appname);
  return answers;
}

function formatPackageName(name) {
  return name.toLowerCase().split(' ').join('-');
}

function validateNameAnswer(input) {
  var validation = validateName(formatPackageName(input));
  if (validation.validForNewPackages) {
    return true;
  } else {
    return 'Your name contains illegal characters. Please choose another name!';
  }
}

module.exports = {
  generate: generate
}
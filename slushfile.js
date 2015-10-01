var gulp = require('gulp'),
  install = require('gulp-install'),
  conflict = require('gulp-conflict'),
  template = require('gulp-template'),
  es = require('event-stream'),
  inquirer = require('inquirer'),
  rename = require('gulp-rename'),
  emptyDir = require('empty-dir'),
  run = require('run-sequence'),
  validateName = require('validate-npm-package-name'),
  readline = require('readline'),
  tsd = require('gulp-tsd');

var destination = process.env.testDest || './';
var appName;

gulp.task('default', ['generate']);

gulp.task('generate', function (callback) {
  var workingDirName = process.cwd().split('/').pop().split('\\').pop();

  console.log('Welcome to the react-express slush generator!');
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
});

gulp.task('generate:minimal', function (done) {
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

      gulp.src(__dirname + '/templates/minimal/**', { dot: true })  // Note use of __dirname to be relative to generator
        .pipe(template(answers))                 // Lodash template support
        .pipe(rename(function (path) {
          if (path.basename === '.npmignore') {
            path.basename = '.gitignore';
          }
        }))
        .pipe(conflict(destination))                    // Confirms overwrites on file conflicts
        .pipe(gulp.dest(destination))                   // Without __dirname here = relative to cwd
        .pipe(install())                      // Run `bower install` and/or `npm install` if necessary
        .on('end', done)
        .resume();
    });
  });
});

gulp.task('generate:full', function (done) {
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

      gulp.src([__dirname + '/templates/full/' + scriptDir + '/**',
        '!' + __dirname + '/templates/full/' + scriptDir + '/typings',
        '!' + __dirname + '/templates/full/' + scriptDir + '/typings/**'])  // Note use of __dirname to be relative to generator
        .pipe(template(answers, { interpolate: /<%=([\s\S]+?)%>/g }))                 // Lodash template support
        .pipe(conflict(destination))                    // Confirms overwrites on file conflicts
        .pipe(gulp.dest(destination));                   // Without __dirname here = relative to cwd

      gulp.src(__dirname + '/templates/full/root/src/favicon.ico')
        .pipe(conflict(destination + 'src'))
        .pipe(gulp.dest(destination + 'src'));

      answers.sassFilter = '';
      answers.sassPipe = '';
      if (answers.sass.indexOf('SASS') != -1) {
        gulp.src(__dirname + '/templates/full/sass/**')
          .pipe(conflict(destination + 'src'))
          .pipe(gulp.dest(destination + 'src'));

        answers.sassFilter = '\n\tvar sassFilter = gulpFilter(\'**/*.scss\', { restore: true });'
        answers.sassPipe = '\n\t\t.pipe(sassFilter)\n\t\t.pipe(require(\'gulp-sass\')())\n\t\t.pipe(sassFilter.restore)';
      } else {
        gulp.src(__dirname + '/templates/full/css/**')
          .pipe(conflict(destination + 'src'))
          .pipe(gulp.dest(destination + 'src'));
      }

      gulp.src([
        __dirname + '/templates/full/root/**',
        '!' + __dirname + '/templates/full/root/src/favicon.ico',
      ], { dot: true })  // Note use of __dirname to be relative to generator
        .pipe(template(answers))                 // Lodash template support
        .pipe(rename(function (path) {
          if (path.basename === '.npmignore') {
            path.basename = '.gitignore';
          }
        }))
        .pipe(conflict(destination))                    // Confirms overwrites on file conflicts
        .pipe(gulp.dest(destination))                   // Without __dirname here = relative to cwd
        .pipe(install({
          args: 'only=dev'
        }))                      // Run `bower install` and/or `npm install` if necessary
        .on('end', function () {
          if (useTypescript(answers)) {
            tsd({
              command: 'reinstall',
              config: destination + 'tsd.json'
            }, done);
          } else {
            done();       // Finished!
          }
        })
        .resume();
    });
  });
});

function addPackages(answers) {
  var packageDelimiter = ',\n\t\t';
  var packages = [];
  var devPackages = [];
  answers.packages = '';
  answers.devPackages = '';

  if (useTypescript(answers)) {
    devPackages.push(['gulp-typescript', '^2.9.0']);
    devPackages.push(['del', '^1.2.0']);
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
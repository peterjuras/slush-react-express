var gulp = require('gulp'),
  install = require('gulp-install'),
  conflict = require('gulp-conflict'),
  template = require('gulp-template'),
  es = require('event-stream'),
  inquirer = require('inquirer'),
  rename = require('gulp-rename'),
  emptyDir = require('empty-dir'),
  jsonEditor = require('gulp-json-editor'),
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

      if (answers.createDir && answers.createDir) {
        destination = destination + answers.appname + '/';
      }

      var scriptDir = 'javascript';
      if (useTypescript(answers)) {
        scriptDir = 'typescript';
      }

      var styleFiles;
      if (answers.sass.indexOf('SASS') != -1) {
        answers.styleExt = 'scss';
        styleFiles = gulp.src(__dirname + '/templates/full/sass/**')
          .pipe(conflict(destination))
          .pipe(gulp.dest(destination));
      } else {
        answers.styleExt = 'css';
        styleFiles = gulp.src(__dirname + '/templates/full/css/**')
          .pipe(conflict(destination))
          .pipe(gulp.dest(destination));
      }

      var packageJsonFilter = gulpFilter('package.json', { restore: true });
      var secondPackageJsonFilter = gulpFilter('package.json');

      var staticFiles = gulp.src(__dirname + '/templates/full/' + scriptDir + '/**', { dot: true })
        .pipe(template(answers, { interpolate: /<%=([\s\S]+?)%>/g }))
        .pipe(rename(function (path) {
          if (path.basename === '.npmignore') {
            path.basename = '.gitignore';
          }
        }))
        .pipe(packageJsonFilter)
        .pipe(jsonEditor(function (json) {
          if (answers.styleExt === 'scss') {
            json.jspm.devDependencies.scss = 'github:mobilexag/plugin-sass@^0.1.0';
          } else {
            json.jspm.devDependencies.css = 'github:systemjs/plugin-css@^0.1.19';
            json.jspm.devDependencies['clean-css'] = 'npm:clean-css@^3.4.8';
          }
          return json;
        }))
        .pipe(packageJsonFilter.restore)
        .pipe(conflict(destination))
        .pipe(gulp.dest(destination))
        .pipe(secondPackageJsonFilter)
        .pipe(install());

      var sharedFiles = gulp.src(__dirname + '/templates/full/root/**')
        .pipe(conflict(destination))
        .pipe(gulp.dest(destination));

      es.concat(sharedFiles, staticFiles, styleFiles)
        .on('end', done);
    });
  });
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

import gulp = require('gulp');
import install = require('gulp-install');
import conflict = require('gulp-conflict');
import template = require('gulp-template');
import inquirer = require('inquirer');
import rename = require('gulp-rename');
import emptyDir = require('empty-dir');
import jsonEditor = require('gulp-json-editor');
import gulpFilter = require('gulp-filter');
import run = require('run-sequence');
import validateName = require('validate-npm-package-name');
import path = require('path');

const es = require('event-stream');

// A test destination can be used to check the generators output.
// "tests/" is recommended, since it is ignored by git
const dest = process.env.testDest || './';
let appName : string;

interface MinimalAnswers extends inquirer.Answers {
  appname: string;
  type: string;
  createDir: boolean;
}

interface FullAnswers extends MinimalAnswers {
  ts: string;
  sass: string;
}

interface Templates {
  appname: string;
  styleExt: string;
}

gulp.task('default', ['generate']);

gulp.task('generate', generate);

gulp.task('generate:minimal', generateMinimal);

gulp.task('generate:full', generateFull);

function generate(callback : gulp.TaskCallback) {
  const workingDirName = process.cwd().split('/').pop().split('\\').pop();
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
    }], (answers : MinimalAnswers) => {
      const cleanedAnswers = cleanName(answers);
      appName = cleanedAnswers.appname;
      if (cleanedAnswers.type.indexOf('Full') !== -1) {
        run('generate:full', callback);
      } else {
        run('generate:minimal', callback);
      }
    });
}

function generateMinimal(done : gulp.TaskCallback) {
  emptyDir('./', (err : any, dirEmpty : boolean) => {
    const questions : inquirer.Question[] = [];
    if (dest === './' && !dirEmpty) {
      questions.push({
        type: 'confirm', name: 'createDir', message: 'The current folder is not empty, do you want to create a new folder?', default: true
      });
    }
    inquirer.prompt(questions, (answers : MinimalAnswers) => {
      answers.appname = appName;
      let destination : string;
      if (answers.createDir) {
        destination = dest + answers.appname + '/';
      } else {
        destination = dest;
      }

      const templateFilter = gulpFilter([
        'package.json',
        'server.js',
        'public/index.html',
        'public/javascripts/main.jsx'
      ], { restore: true });

      const scaffold : any = gulp.src(__dirname + '/templates/minimal/**', { dot: true })
        .pipe(templateFilter)
        .pipe(template(answers))
        .pipe(templateFilter.restore)
        .pipe(rename(function (path) {
          if (path.basename === '.npmignore') {
            path.basename = '.gitignore';
          }
        }))
        .pipe(conflict(destination))
        .pipe(gulp.dest(destination))
        .pipe(install())
        .on('end', done)
        .on('error', done);
      scaffold.resume();
    });
  });
}

function generateFull(done : gulp.TaskCallback) {
  emptyDir('./', function (err : any, dirEmpty : boolean) {
    const questions : inquirer.Question[] = [
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
    if (dest === './' && !dirEmpty) {
      questions.push({
        type: 'confirm', name: 'createDir', message: 'The current folder is not empty, do you want to create a new folder?', default: true
      });
    }
    inquirer.prompt(questions, function (answers : FullAnswers) {
      let destination : string;
      if (answers.createDir) {
        destination = dest + appName + '/';
      } else {
        destination = dest;
      }

      let scriptDir = 'javascript';
      if (useTypescript(answers)) {
        scriptDir = 'typescript';
      }

      let styleFiles : NodeJS.ReadWriteStream;
      let styleExt : string;
      if (answers.sass.indexOf('SASS') != -1) {
        styleExt = 'scss';
        styleFiles = gulp.src(__dirname + '/templates/full/sass/**')
          .pipe(conflict(destination))
          .pipe(gulp.dest(destination));
      } else {
        styleExt = 'css';
        styleFiles = gulp.src(__dirname + '/templates/full/css/**')
          .pipe(conflict(destination))
          .pipe(gulp.dest(destination));
      }

      const templates : Templates = {
        appname: appName,
        styleExt: styleExt
      };

      const packageJsonFilter = gulpFilter('package.json', { restore: true });
      const secondPackageJsonFilter = gulpFilter('package.json');

      const staticFiles = gulp.src(__dirname + '/templates/full/' + scriptDir + '/**', { dot: true })
        .pipe(template(templates, { interpolate: /<%=([\s\S]+?)%>/g }))
        .pipe(rename(path => {
          if (path.basename === '.npmignore') {
            path.basename = '.gitignore';
          }
        }))
        .pipe(packageJsonFilter)
        .pipe(jsonEditor((json : any) => {
          if (templates.styleExt === 'scss') {
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

      const sharedFiles = gulp.src(__dirname + '/templates/full/root/**')
        .pipe(conflict(destination))
        .pipe(gulp.dest(destination));

      es.concat(sharedFiles, staticFiles, styleFiles)
        .on('end', done);
    });
  });
}

function useTypescript(answers : FullAnswers) {
  return answers.ts.indexOf('TypeScript') != -1;
}

function cleanName(answers : MinimalAnswers) {
  answers.appname = formatPackageName(answers.appname);
  return answers;
}

function formatPackageName(name : string) {
  return name.toLowerCase().split(' ').join('-');
}

function validateNameAnswer(input : string) : boolean | string {
  var validation = validateName(formatPackageName(input));
  if (validation.validForNewPackages) {
    return true;
  } else {
    return 'Your name contains illegal characters. Please choose another name!';
  }
}

export default generate;

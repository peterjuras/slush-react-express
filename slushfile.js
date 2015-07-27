var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    es = require('event-stream'),
    inquirer = require('inquirer');

gulp.task('default', function (done) {
  var workingDirName = process.cwd().split('/').pop().split('\\').pop();

  inquirer.prompt([
    {type: 'input', name: 'appname', message: 'What will your app be called?', default: workingDirName},
    {type: 'input', name: 'ts', message: 'typescript or javascript?', default: 'javascript'}
  ],
  function (answers) {
    if (!answers.appname) {
      return done();
    }

    answers = addPackages(answers);

    var scriptDir = 'javascript';
    if (answers.ts.indexOf('typescript') != -1 ||
        answers.ts.indexOf('ts') != -1) {
      scriptDir = 'typescript';
    }
    gulp.src(__dirname + '/templates/' + scriptDir + '/**')  // Note use of __dirname to be relative to generator
      .pipe(template(answers))                 // Lodash template support
      .pipe(conflict('test/'))                    // Confirms overwrites on file conflicts
      .pipe(gulp.dest('test/'));                   // Without __dirname here = relative to cwd

    gulp.src(__dirname + '/templates/root/**')  // Note use of __dirname to be relative to generator
      .pipe(template(answers))                 // Lodash template support
      .pipe(conflict('test/'))                    // Confirms overwrites on file conflicts
      .pipe(gulp.dest('test/'))                   // Without __dirname here = relative to cwd
      .pipe(install())                         // Run `bower install` and/or `npm install` if necessary
      .on('end', function () {
        done();                                // Finished!
      })
      .resume();
  });
});

function addPackages(answers) {
  var packageDelimiter = ',\n\t\t';
  var packages = [];
  answers.packages = '';

  packages.forEach(function(package, index) {
    answers.packages += packageDelimiter + '"' + package + '": "*"';
  });
  return answers;
}
var gulp = require('gulp');
var merge = require('merge-stream');
var del = require('del');
var install = require('gulp-install');
var ts = require('gulp-typescript');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('build', ['move:src'], function() {
  del(['./build/src/**/**', './build/src']);

  return gulp.src('build/package.json')
    .pipe(install({
      production: true
    }));
});

gulp.task('copy:client', function() {
  var js = gulp.src('src/**.ts',
    {
      root: './'
    })
    .pipe(ts(tsProject))
    .js
    .pipe(gulp.dest('build/public/'));

  var html = gulp.src(['src/**', '!src/**/**.ts'], {root: './'})
    .pipe(gulp.dest('build/public/'));

  return merge(js, html);
});

gulp.task('move:src', ['copy'], function() {
  return gulp.src('./build/src/**/**')
    .pipe(gulp.dest('./build/public'));
});

gulp.task('copy', function() {
  var js = gulp.src([
    '**/**.ts',
    '!node_modules', '!node_modules/**'
    ], {
      root: './'
    })
    .pipe(ts(tsProject))
    .js
    .pipe(gulp.dest('build/'));

  var misc = gulp.src([
    '**/**.*',
    '!**/**.ts',
    '!gulpfile.js',
    '!node_modules', '!node_modules/**',
    '!build', '!build/**',
    '!typings', '!typings/**',
    '!tsd.json', '!tsconfig.json'
    ], {
      root: './'
    })
    .pipe(gulp.dest('build/'));
  return merge(js, misc);
});

gulp.task('watch', function() {
  gulp.watch('**/**.ts', ['move:src'])
});
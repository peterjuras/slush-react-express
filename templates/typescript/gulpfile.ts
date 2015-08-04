require('typescript-require')({nodeLib: true});

import gulp = require('gulp');
import merge = require('merge-stream');
import del = require('del');
var install = require('gulp-install');

import ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');

gulp.task('build', ['move:src'], () => {
  del(['./build/src/**/**', './build/src']);

  return gulp.src('build/package.json')
    .pipe(install({
      production: true
    }));
});

gulp.task('copy:client', () => {
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

gulp.task('move:src', ['copy'], () => {
  return gulp.src('./build/src/**/**')
    .pipe(gulp.dest('./build/public'));
});

gulp.task('copy', () => {
  var js = gulp.src([
    '**/**.ts',
    '!gulpfile.ts',
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
    '!gulpfile.ts',
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

gulp.task('watch', () => {
  gulp.watch('**/**.ts', ['move:src'])
});
var gulp = require('gulp');
var merge = require('merge-stream');
var install = require('gulp-install');

gulp.task('build', ['copy:client', 'copy:server'], function() {
  return gulp.src('build/package.json')
    .pipe(install({
      production: true
    }));
});

gulp.task('copy:client', function() {
  return gulp.src('src/**')
    .pipe(gulp.dest('build/public/'));
});

gulp.task('copy:server', function() {
  return gulp.src([
    './**',
    '!src', '!src/**',
    '!gulpfile.js',
    '!node_modules', '!node_modules/**'
    ], {
    root: './'
    })
    .pipe(gulp.dest('build/'));
});
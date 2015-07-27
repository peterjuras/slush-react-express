var gulp = require('gulp');

gulp.task('default', function() {
  return gulp.src(__dirname + '/src/**')
    .pipe(gulp.dest('public/'));
});
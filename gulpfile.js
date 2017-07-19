'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('default', () => {
  return gulp.src('src/**/*.js')
    .pipe(babel({
      presets: ['transform-es2015-modules-commonjs']
    }))
    .pipe(gulp.dest('dist'));
});

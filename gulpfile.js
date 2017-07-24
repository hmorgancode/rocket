'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
// you should be able to remove this after gulp 4.0
const plumber = require('gulp-plumber');

gulp.task('default', ['babel']);

gulp.task('babel', async () => {
  return gulp.src('src/**/*.js')
    .pipe(babel()) // settings in .babelrc
    .pipe(gulp.dest('dist'));
});

gulp.task('watch_babel', async () => {
  return watch('src/**/*.js')
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

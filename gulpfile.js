'use strict';

const dotenv = require('dotenv').config();
const promisify = require('util').promisify;
const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
const git = require('gulp-git');
// const yarn = require('gulp-yarn');
const run = require('gulp-run');
const nodemon = require('gulp-nodemon');
// you should be able to remove this after gulp 4.0
const plumber = require('gulp-plumber');

gulp.task('default', ['start']);

gulp.task('babel', async () => {
  return gulp.src('src/**/*.js')
    .pipe(babel()) // settings in .babelrc
    .pipe(gulp.dest('dist'));
});

gulp.task('start', ['babel'], () => {
  nodemon({
    script: 'dist/index.js',
    ext: 'js',
    env: dotenv.parsed
  });
});

// inspect? 'node inspect -r dotenv/config dist/index.js'

// try switching over to just gulp.watch later?
gulp.task('watch_babel', async () => {
  return watch('src/**/*.js')
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

// gulp.task('install_packages', async () => {
//   return gulp.src(['./package.json', './yarn.lock'])
//     .pipe(yarn());
// });

// bash commands are better suited to a makefile and/or Jenkins or some other CI,
// but for now just do this stuff in gulp.
// or use gulp build tools, nodemon, etc...
gulp.task('build_groot', async () => {
  await promisify(git.updateSubmodule)({ args: '--init' });
  // return run('cd groot && yarn install && yarn build').exec();
  // run(...).exec() is supposed to return a stream, but isn't?
  // and yarn is adding node_modules/gulp-run as a symlink, but it can't be followed?
  // uh, learn what's going on later, or just use CI for this
  const build = new run.Command('cd groot && yarn install && yarn build');
  build.exec = promisify(build.exec);
  console.log('Building groot for production...');
  return build.exec();
});

gulp.task('deploy', ['babel', 'build_groot'], async () => {
  // hacky bash because this is temporary. (create something in dist/public to avoid error when no files are present)
  const prep = new run.Command('cp .env dist/ && touch dist/public/foo && rm -r dist/public/* && cp -r groot/build/* dist/public/');
  prep.exec = promisify(prep.exec);
  console.log('Preparing static files...');
  return prep.exec();
  // move build to root?
  // forever? pm2?
});

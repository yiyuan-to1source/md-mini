'use strict';
/**
 * The main gulp file for dev
 */
const gulp = require('gulp');
const sass = require('gulp-sass');

const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const server = require('gulp-server-io');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const config = require('config');
const { join } = require('path');
// get from config
const paths = config.get('paths');
// task 1
gulp.task('sass', () => {
  return gulp.src(join(__dirname, paths.src, 'md-mini.scss'))
    .pipe(sourcemaps.init())
    .pipe( sass({
      includePaths: join(process.cwd(), 'node_modules')
    }).on('error', sass.logError) )
    .pipe(postcss([
      autoprefixer,
      cssnano
    ]))
    .pipe(rename('md-mini.min.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(
      join(__dirname, paths.dest)
    ));
});

/*
const serve = () => {
  return gulp.src([
    join(__dirname, paths.dest),
    join(__dirname, 'demo'),
    __dirname
  ]).pipe(
    server()
  );
};
*/

/*
gulp.task('watch', done => {
  gulp.watch(join(__dirname, paths.src, '**', '*.scss'), gulp.series('sass'));
  done();
});

gulp.task('dev', gulp.series('sass', 'watch', serve()));
*/

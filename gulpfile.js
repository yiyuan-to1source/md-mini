'use strict';
/**
 * The main gulp file for dev
 */
const gulp = require('gulp');
const clean = require('gulp-clean');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const server = require('gulp-server-io');
const less = require('gulp-less');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const config = require('config');
const { join } = require('path');
// get from config
const paths = config.get('paths');
const pkg = require(join(__dirname, 'package.json'));

// clean files first
gulp.task('clean:dev', () => gulp.src(join(__dirname, paths.dev), {read:false})
  .pipe(clean())
);
// copy html
gulp.task('html:dev', () => gulp.src(join(__dirname, 'index.html'))
  .pipe(gulp.dest())
);


/**
 * Using LESS
 */
const lessFn = dest => () => {
  return gulp.src(join(__dirname, paths.src, 'md-mini.less'))
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: [join(__dirname, 'src', 'less')]
    }))
    .pipe(postcss([
      autoprefixer,
      cssnano
    ]))
    .pipe(rename('md-mini.min.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dest));
};

// dev sass task
gulp.task('less:dev', lessFn(join(__dirname, paths.dev)));
gulp.task('less:build', lessFn(join(__dirname, paths.dest)));

gulp.task('serve', () => gulp.src([
    join(__dirname, paths.dev)
  ]).pipe(
    server({debugger: false})
));

gulp.task('watch', done => {
  gulp.watch(join(__dirname, paths.src, '**', '*.less'), gulp.series('less:dev'));
  done();
});

gulp.task('default', gulp.series('less:dev', 'watch', 'serve'));
// @TODO build task will increment the version semver

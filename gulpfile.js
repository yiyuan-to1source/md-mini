'use strict';
/**
 * The main gulp file for dev
 */
const fs = require('fs');
const gulp = require('gulp');
const clean = require('gulp-clean');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const server = require('gulp-server-io');
const less = require('gulp-less');
const inject = require('gulp-inject');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const config = require('config');
const { join } = require('path');
// get from config
const paths = config.get('paths');
const pkg = require(join(__dirname, 'package.json'));
// checking the size of the file
gulp.task('checksize', done =>  {
  fs.stat(join(__dirname, paths.dest, 'md-mini.min.css'), (err, stats) => {
    console.log('md-mini.min.css size: ', parseInt(stats.size,10)/1024 ) ;
  });
  done();
});

// clean files first
gulp.task('clean:dev', () => gulp.src(join(__dirname, paths.dev), {read:false, allowEmpty: true})
  .pipe(clean())
);
gulp.task('clean:dist', () => gulp.src(join(__dirname, paths.dest), {read:false, allowEmpty: true})
  .pipe(clean())
);

// copy html
gulp.task('html:dev', () => {
  const sources = gulp.src([join(__dirname, paths.dev,'**', '*.css')], {read: false});
  return gulp.src(join(__dirname, paths.demo, 'index.html'))
    .pipe(inject(sources, {ignorePath: paths.dev}))
    .pipe(gulp.dest(join(__dirname, paths.dev)));
});

gulp.task('html:build', () => {
  const sources = gulp.src([join(__dirname, paths.demo, '**', '*.css')], {read: false});
  return gulp.src(join(__dirname, paths.demo, 'index.html'))
    .pipe(inject(sources, {relative: true}))
    .pipe(gulp.dest(join(__dirname)));
});

/**
 * Using LESS
 */
const lessFn = dest => () => {
  let plugins = [autoprefixer];
  let filename = 'md-mini.min.css';
  if (dest === join(__dirname, paths.dest)) {
    plugins.push(cssnano);
  } else {
    filename = ['md-mini', Date.now(), 'css'].join('.');
  }
  return gulp.src(join(__dirname, paths.src, 'md-mini.less'))
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: [join(__dirname, paths.src, 'less')]
    }))
    .pipe(postcss(plugins))
    .pipe(rename(filename))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dest));
};

// dev sass task
gulp.task('less:dev', gulp.series(lessFn(join(__dirname, paths.dev))));
gulp.task('less:build', lessFn(join(__dirname, paths.dest)));
// serve dev
gulp.task('serve', () => gulp.src([
    join(__dirname, paths.dev)
  ]).pipe(
    server({debugger: false})
));
// watching
gulp.task('watch', done => {
  gulp.watch(join(__dirname, paths.src, '**', '*.less'), gulp.series('clean:dev', 'less:dev', 'html:dev'));
  gulp.watch(join(__dirname, paths.demo, 'index.html'), gulp.series('html:dev'));
  done();
});
// trigger
gulp.task('default', gulp.series('clean:dev', 'less:dev', 'html:dev', 'watch', 'serve'));
// @TODO build task will increment the version semver
gulp.task('build', gulp.series('clean:dist', 'less:build', 'html:build', 'checksize'));

const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const config = require('config');
const { join } = require('path');

const paths = config.get('paths');

exports.sassTask = build => {
  return () => {
    const dest = build ? paths.dest : paths.dev;
    const dir = join(__dirname, '..' ,dest, paths.style);
    // console.log('style dir', dir);
    return gulp.src( join(__dirname, '..', paths.app, paths.style, 'main.scss') )
      .pipe(sourcemaps.init())
      .pipe( sass({
        includePaths: join(process.cwd(), 'node_modules')
      }).on('error', sass.logError) )
      .pipe(postcss([
        autoprefixer,
        cssnano
      ]))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(dir));
  };
};

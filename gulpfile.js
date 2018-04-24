const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const config = require('config');
const { join } = require('path');

const paths = config.get('paths');

const sassTask = build => {
  return () => {
    const dest = build ? paths.dest : paths.dev;
    const dir = join(__dirname, '..' ,dest);
    // console.log('style dir', dir);
    return gulp.src(join(__dirname, '..', paths.src, 'md-mini.scss'))
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
      .pipe(gulp.dest(dir));
  };
};

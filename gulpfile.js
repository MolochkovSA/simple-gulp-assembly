import gulp from 'gulp'
import less from 'gulp-less'
import rename from 'gulp-rename'
import cleanCSS from 'gulp-clean-css'
import { deleteAsync } from 'del'
import babel from 'gulp-babel'
import uglify from 'gulp-uglify'
import concate from 'gulp-concat'
import sourcemaps from 'gulp-sourcemaps'
import autoprefixer from 'gulp-autoprefixer'
import imagemin from 'gulp-imagemin'

const path = {
  styles: {
    src: 'src/styles/**/*.less',
    dest: 'dist/css/',
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/scripts/',
  },
  images: {
    src: 'src/images/*',
    dest: 'dist/images/',
  },
}

export const clean = () => {
  return deleteAsync(['dist'])
}

export const styles = () => {
  return gulp
    .src(path.styles.src)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(
      cleanCSS({
        level: 2,
      })
    )
    .pipe(
      rename({
        basename: 'style',
        suffix: '.min',
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.styles.dest))
}

export const scripts = () => {
  return gulp
    .src(path.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(uglify())
    .pipe(concate('main.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.scripts.dest))
}

export const images = () => {
  return gulp
    .src(path.images.src)
    .pipe(imagemin({ progressive: true }))
    .pipe(gulp.dest(path.images.dest))
}

export const watch = () => {
  gulp.watch(path.styles.src, styles)
  gulp.watch(path.scripts.src, scripts)
  gulp.watch(path.images.src, images)
}

export const build = gulp.series(clean, gulp.parallel(styles, scripts, images), watch)

export default build

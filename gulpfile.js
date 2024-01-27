import gulp from 'gulp'
import less from 'gulp-less'
import rename from 'gulp-rename'
import cleanCSS from 'gulp-clean-css'
import { deleteAsync } from 'del'
import babel from 'gulp-babel'
import uglify from 'gulp-uglify'
import concate from 'gulp-concat'

const path = {
  styles: {
    src: 'src/styles/**/*.less',
    dest: 'dist/css/',
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/scripts/',
  },
}

export const clean = () => {
  return deleteAsync(['dist'])
}

export const styles = () => {
  return gulp
    .src(path.styles.src)
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(
      rename({
        basename: 'styles',
        suffix: '.min',
      })
    )
    .pipe(gulp.dest(path.styles.dest))
}

export const scripts = () => {
  return gulp
    .src(path.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concate('main.min.js'))
    .pipe(gulp.dest(path.scripts.dest))
}

export const watch = () => {
  gulp.watch(path.styles.src, styles)
  gulp.watch(path.scripts.src, scripts)
}

export const build = gulp.series(clean, gulp.parallel(styles, scripts), watch)

export default build

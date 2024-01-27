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
import htmlmin from 'gulp-htmlmin'
import size from 'gulp-size'
import newer from 'gulp-newer'
import { create } from 'browser-sync'

const browserSync = create()

const path = {
  html: {
    src: 'src/*.html',
    dest: 'dist/',
  },
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

const clean = () => deleteAsync(['dist/*', '!dist/images'])

const html = () =>
  gulp
    .src(path.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(size({ title: 'html' }))
    .pipe(gulp.dest(path.html.dest))
    .pipe(browserSync.stream())

const styles = () =>
  gulp
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
    .pipe(size({ title: 'styles' }))
    .pipe(gulp.dest(path.styles.dest))
    .pipe(browserSync.stream())

const scripts = () =>
  gulp
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
    .pipe(size({ title: 'scripts' }))
    .pipe(gulp.dest(path.scripts.dest))
    .pipe(browserSync.stream())

const images = () =>
  gulp
    .src(path.images.src)
    .pipe(newer(path.images.dest))
    .pipe(imagemin({ progressive: true }))
    .pipe(size({ title: 'images' }))
    .pipe(gulp.dest(path.images.dest))

const watch = () => {
  browserSync.init({
    server: {
      baseDir: './dist/',
    },
  })
  gulp.watch(path.html.src, html).on('change', browserSync.reload)
  gulp.watch(path.styles.src, styles)
  gulp.watch(path.scripts.src, scripts)
  gulp.watch(path.images.src, images)
}

const build = gulp.series(clean, html, gulp.parallel(styles, scripts, images), watch)

export default build

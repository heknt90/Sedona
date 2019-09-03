'use strict'
var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    del = require('del'),
    rename = require('gulp-rename'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
	  minify = require('gulp-csso'),
    server = require('browser-sync').create(),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    svgstore = require('gulp-svgstore');

gulp.task('style', function() {
  return gulp.src('source/sass/style.scss')
      .pipe(plumber())
      .pipe(sass())
      .pipe(postcss([
        require('css-mqpacker')({sort: true}),
        autoprefixer
      ]))
      .pipe(gulp.dest('build/css'))
      .pipe(minify())
      .pipe(rename('style.min.css'))
      .pipe(gulp.dest('build/css'))
      .pipe(server.stream());
});

gulp.task('images', function () {
  return gulp.src('source/img/**/*.{png,jpg,svg}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagenin.svgo()
    ]))
    .pipe(gulp.dest('build/img'));
});

gulp.task('sprite', function () {
  return gulp.src('source/img/svg/*.svg')
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
});

gulp.task('html', function () {
  return gulp.src('source/*.html')
    .pipe(gulp.dest('build'))
    .pipe(server.stream());
});

gulp.task('clean', function () {
  return del('build')
})

gulp.task('copy', function () {
  return gulp.src([
    'source/fonts/**/*.{woff,woff2}',
    'source/img/**',
    'source/css/**',
    'source/*.html'
  ], {
    base: 'source'
  })
  .pipe(gulp.dest('build'));
});

gulp.task('serve', gulp.series(function () {
  server.init({
    server: {
      baseDir: 'build/'
    },
    notify: false,
    host: 'localhost',
    port: 3000,
    browser: "chrome"
  });
  gulp.watch('source/sass/**/*.scss', gulp.series('style'));
  gulp.watch('source/*.html', gulp.series('html'));
}));

gulp.task('build', gulp.series(
  'clean',
  'copy',
  gulp.parallel(
    'style',
    'sprite'
  )
));

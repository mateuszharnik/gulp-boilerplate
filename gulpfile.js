const gulp = require('gulp');
const browserSync = require('browser-sync');
const scss = require('gulp-sass');
const less = require('gulp-less');
const pug = require('gulp-pug');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const purgecss = require('gulp-purgecss');
const concat = require('gulp-concat');
const replace = require('gulp-html-replace');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const named = require('vinyl-named');

const config = require('./webpack.config');

const preprocessor = 'scss'; // Ustawiamy preprocesor less lub scss

const {
  src, dist, file, watch, babel,
} = require('./config');

function handleError(error) {
  // eslint-disable-next-line
  console.log(error.toString());
  this.emit('end');
}

gulp.task('reload', (done) => {
  browserSync.reload();
  done();
});

gulp.task('del', (done) => {
  del([dist.delete]);
  done();
});

gulp.task('img', () => gulp
  .src(src.img)
  .pipe(changed(dist.img))
  .pipe(imagemin())
  .pipe(gulp.dest(dist.img)));

gulp.task('babel', () => gulp
  .src(babel.src)
  .pipe(named())
  .pipe(webpackStream(config).on('error', handleError), webpack)
  .pipe(gulp.dest(babel.dist)));

gulp.task('js', () => gulp
  .src(src.js)
  .pipe(named())
  .pipe(webpackStream({
    output: {
      filename: '[name].js',
    },
    mode: 'production',
    optimization: {
      splitChunks: {
        cacheGroups: {
          libs: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            name: 'libs',
            filename: 'libs.js',
          },
        },
      },
    },
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      }],
    },
  }).on('error', handleError), webpack)
  .pipe(gulp.dest(dist.js)));

gulp.task('css', () => gulp
  .src(dist.style)
  .pipe(clean({
    level: 2,
  }))
  .pipe(gulp.dest(dist.css)));

gulp.task('concat', () => gulp
  .src(src.style)
  .pipe(concat(dist.concat))
  .pipe(gulp.dest(dist.css)));

gulp.task('purage', () => gulp
  .src(dist.style)
  .pipe(
    purgecss({
      content: [dist.html, dist.scripts],
    }),
  )
  .pipe(gulp.dest(dist.css)));

gulp.task('html', () => gulp
  .src(src.html)
  .pipe(
    replace({
      libs: file.libs,
      css: file.css,
      main: file.main,  // Tylko dla index.html
      js: file.js,  // Dla każdego skryptu aby zachować nazwę
    }),
  )
  .pipe(
    htmlmin({
      sortAttributes: true,
      sortClassName: true,
      collapseWhitespace: true,
    }),
  )
  .pipe(gulp.dest(dist.dist)));

gulp.task('pug', () => gulp
  .src(src.pug)
  .pipe(
    pug({
      pretty: true,
    }).on('error', handleError),
  )
  .pipe(gulp.dest(src.src)));

gulp.task('less', () => gulp
  .src(src.less)
  .pipe(sourcemaps.init())
  .pipe(less().on('error', handleError))
  .pipe(
    autoprefixer({
      browsers: ['last 3 versions'],
    }),
  )
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(src.css))
  .pipe(browserSync.stream()));

gulp.task('scss', () => gulp
  .src(src.scss)
  .pipe(sourcemaps.init())
  .pipe(scss().on('error', scss.logError))
  .pipe(
    autoprefixer({
      browsers: ['last 3 versions'],
    }),
  )
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(src.css))
  .pipe(browserSync.stream()));

gulp.task('build-less', () => gulp
  .src(src.less)
  .pipe(less().on('error', handleError))
  .pipe(
    autoprefixer({
      browsers: ['last 3 versions'],
    }),
  )
  .pipe(gulp.dest(src.css)));

gulp.task('build-scss', () => gulp
  .src(src.scss)
  .pipe(scss().on('error', scss.logError))
  .pipe(
    autoprefixer({
      browsers: ['last 3 versions'],
    }),
  )
  .pipe(gulp.dest(src.css)));

gulp.task('serve', () => {
  browserSync({
    server: src.src,
  });

  if (preprocessor === 'less') {
    gulp.watch(watch.less, gulp.series(['less']));
  } else {
    gulp.watch(watch.scss, gulp.series(['scss']));
  }

  gulp.watch(watch.html, gulp.series(['reload']));
  gulp.watch(watch.bundle, gulp.series(['reload']));
  gulp.watch(watch.js, gulp.series(['babel']));
  gulp.watch(watch.pug, gulp.series(['pug']));
});

gulp.task('build', gulp.series([`build-${preprocessor}`, 'concat', 'html', 'js', 'purage', 'img', 'css']));

gulp.task('default', gulp.series(['babel', `${preprocessor}`, 'pug'], ['serve']));

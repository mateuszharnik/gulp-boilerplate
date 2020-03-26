const src = {
  src: 'src',
  html: 'src/*.html',
  pug: 'src/html/*.pug',
  css: 'src/css',
  style: 'src/css/*.css',
  less: 'src/assets/less/*.less',
  scss: 'src/assets/scss/*.scss',
  js: ['src/js/main.js'], // Tutaj dodajemy inne pliki js dla webpacka
  img: 'src/img/**/*.{jpg,jpeg,png,gif}',
};

const babel = {
  src: src.js,
  dist: 'src/bundle',
};

const file = {
  libs: 'js/libs.js',
  css: 'css/style.css',
  main: 'js/main.js',
  js: {
    src: 'js',
    tpl: '<script src="%s/%f.js"></script>',
  },
};

const watch = {
  html: 'src/*.html',
  pug: 'src/html/**/**/*.pug',
  bundle: 'src/bundle/*.js',
  scss: 'src/assets/scss/**/**/*.scss',
  less: 'src/assets/less/**/**/*.less',
  js: 'src/js/**/**/*.js',
};

const dist = {
  dist: 'dist/',
  delete: 'dist',
  html: 'dist/*.html',
  css: 'dist/css',
  style: 'dist/css/style.css',
  concat: 'style.css',
  js: 'dist/js',
  scripts: 'dist/js/*.js',
  img: 'dist/img',
};

module.exports = {
  src,
  dist,
  file,
  watch,
  babel,
};

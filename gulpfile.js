const gulp = require('gulp'); // подключение всех функций
// поключение плагинов ↓
const concat = require('gulp-concat-css'); //для склеивания файлов в бандл
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();

// Функция создания сервера
function serve() {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });
}

//задача копирования HTML файлов
function html() {
  return gulp
    .src('src/**/*.html') //то откуда галп будет брать файлы
    .pipe(plumber()) //пайп на случай ошибок что бы сборка не падала
    .pipe(gulp.dest('dist/')) // пайп (метод) отправит файл в dist
    .pipe(browserSync.reload({ stream: true })); //пайп перезагрузит странцу в браузере после каждого изменения в файле
}

// задача склеивания css файлов
function css() {
  return gulp
    .src('src/blocks/**/*.css') // указали путь
    .pipe(plumber()) // вызвали пламбер
    .pipe(concat('bundle.css')) // вызвали конкат и склеили файлы
    .pipe(gulp.dest('dist/')) // отправили результат в папку
    .pipe(browserSync.reload({ stream: true }));
}

//Перенос файлов картинок в dist/
function images() {
  return gulp
    .src('src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}')
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.reload({ stream: true }));
}

//Перенос видео в dist/
function videos() {
  return gulp
    .src('src/videos/**/*.{mp4,webm,mov,avi}')
    .pipe(gulp.dest('dist/videos'))
    .pipe(browserSync.reload({ stream: true }));
}

//Очистка папки dist перед каждой новой сборкой
function clean() {
  return del('dist');
}

//задача слежения за файлами
function watchFiles() {
  gulp.watch(['src/**/*.html'], html);
  gulp.watch(['src/blocks/**/*.css'], css);
  gulp.watch(['src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}'], images);
  gulp.watch(['src/videos/**/*.{mp4,webm,mov,avi}'], videos);
}

//сборка одной командой build,
//series(выполняет задачи по очереди)
// parallel(выполняет задачи параллельно)
const build = gulp.series(clean, gulp.parallel(html, css, images, videos));
//параллельное слежение за изменениями (отключить в терминале CONTROL + C)
const watchapp = gulp.parallel(build, watchFiles, serve);

// эти строчки позволяют вызвать задачи из терминала
exports.html = html;
exports.css = css;
exports.images = images;
exports.videos = videos;
exports.clean = clean;

exports.build = build;
exports.watchapp = watchapp;
exports.default = watchapp; // функция watchapp теперь вызывается по команде gulp

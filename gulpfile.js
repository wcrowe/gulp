/// <binding Clean='clean' />
'use strict';

const {
  task,
  src,
  dest,
  parallel,
  series,
  watch
} = require('gulp');
const minify = require("gulp-minify");
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const { compareSha1Digest } = require('gulp-changed');
const rimraf = require('rimraf');
var ignore = require('gulp-ignore');
const browserSync = require('browser-sync').create();

var paths = {
  webroot: "./wwwroot/"
};

paths.js = paths.webroot + "js/**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.less = paths.webroot + "less/site.less";
paths.lessDest = paths.webroot + "less";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.bootStrapSrc = paths.webroot + "lib/bootstrap/scss/**/*.scss";
paths.concatJsDest = paths.webroot + "js/site.min.js";
paths.concatCssDest = paths.webroot + "css/site.min.css";
paths.concatLessDest = paths.webroot + "less/site.css";
paths.boostrapDest = paths.webroot + "css/bootstrap";

task("clean:js", function (cb) {
  rimraf(paths.concatJsDest, cb);
});

task("clean:css", function (cb) {
  rimraf(paths.concatCssDest, cb);
});

task("clean:less", function (cb) {
  console.log("Removing " + paths.concatLessDest);
  rimraf(paths.concatLessDest, cb);
});

task("clean", series(["clean:js", "clean:css", "clean:less"]));

task("min:js", async function () {
  src([paths.js, "!" + paths.minJs], {
    base: "."
  })
    .pipe(concat(paths.concatJsDest))
    .pipe(uglify())
    .pipe(dest("."));
});

task("min:css", async function () {
  src([paths.css, "!" + paths.minCss])
    .pipe(concat(paths.concatCssDest))
    .pipe(cssnano())
    .pipe(dest("."));
});

task("less", async function () {
  src(paths.less)
    .pipe(less({
      compress: true
    })).pipe(dest(paths.lessDest));
  done();
});


task("min", series(["min:js", "min:css"]));

task('watch', () => {
  watch(paths.webroot + "less/*.less", series(["less"]));
});


task('default',
    function(done) { // <--- Insert `done` as a parameter here...
        series('clean', 'less', 'min', 'watch'),
            done(); // <--- ...and call it here.
    });

//compile scss into css
function style() {
    console.log(paths.boostrapDest);
    return src(paths.bootStrapSrc)
        .pipe(sass().on('error', sass.logError))
        .pipe(dest(paths.boostrapDest))
        .pipe(browserSync.stream());
}
exports.style = style;
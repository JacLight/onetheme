var gulp = require('gulp'),
    sass = require('gulp-sass'),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    sourcemaps = require("gulp-sourcemaps"),
    fileinclude = require("gulp-file-include"),
    htmlPrettify = require('gulp-html-prettify'),
    rtlcss = require('gulp-rtlcss'),
    rename = require('gulp-rename'),
    browserSync = require("browser-sync").create(),
    nunjucksRender = require('gulp-nunjucks-render');

var paths = {
    styles: {
        // By using styles/**/*.sass we're telling gulp to check all folders for any sass file
        src: "src/assets/styles/scss/**/*.scss",
        // Compiled files will end up in whichever folder it's found in (partials are not compiled)
        dest: "src/assets/styles/css"
    },

    scripts: {
        // By using styles/**/*.sass we're telling gulp to check all folders for any sass file
        src: "src/assets/scripts/src",
        // Compiled files will end up in whichever folder it's found in (partials are not compiled)
        dest: "src/assets/scripts/dist"
    },

    templates: {
        root: 'src/assets/templates',
        pages: 'src/assets/templates/pages',
        fragments: 'src/assets/templates/fragments'
    },

    demos: 'src/demos',
};

function style() {
    return gulp
        .src(paths.styles.src)
        // Initialize sourcemaps before compilation starts
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded' }))
        .on("error", sass.logError)
        // Use postcss with autoprefixer and compress the compiled file using cssnano
        //.pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(postcss([autoprefixer()]))
        // Now add/write the sourcemaps
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.styles.dest))
        // Add browsersync stream pipe after compilation
        .pipe(browserSync.stream());
}
// Expose the task by exporting it
// This allows you to run it from the commandline using
// $ gulp style
exports.style = style;


function script() {
    return null
}
// Expose the task by exporting it
// This allows you to run it from the commandline using
// $ gulp script
exports.script = script;


function merge() {
    // Gets .html and .nunjucks files in pages
    return gulp.src(paths.templates.pages + '/**/*.+(html|njk)')
        // Renders template with nunjucks
        .pipe(nunjucksRender({
            path: [paths.templates.fragments]
        }))
        // output files in app folder
        .pipe(gulp.dest(paths.demos))
}
// Expose the task by exporting it
// This allows you to run it from the commandline using
// $ gulp nunjucks
exports.merge = merge;

/*
function merge() {
    return gulp.src(['src/assets/templates/pages/index.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'src/assets/templates/fragments'
        }))
        .pipe(htmlPrettify({
            indent_size: 2
        }))
        .pipe(gulp.dest('./src/demos'))
        .pipe(browserSync.stream());
}
*/
// Expose the task by exporting it
// This allows you to run it from the commandline using
// $ gulp script
//exports.merge = merge;

function reload() {
    browserSync.reload();
}

// Add browsersync initialization at the start of the watch task
function watch() {
    browserSync.init({
        // You can tell browserSync to use this directory and serve it as a mini-server
        server: {
            baseDir: "./src"
        }
        // If you are already serving your website locally using something like apache
        // You can use the proxy setting to proxy that instead
        // proxy: "yourlocal.dev"
    });
    gulp.watch(paths.styles.src, style);
    gulp.watch(paths.scripts.src, script);
    gulp.watch(paths.templates.root, merge);   
    // We should tell gulp which files to watch to trigger the reload
    // This can be html or whatever you're using to develop your website
    // Note -- you can obviously add the path to the Paths object
    gulp.watch("src/*.html", reload);
}
// Don't forget to expose the task!
exports.watch = watch



/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.parallel(style, watch);

/*
 * You can still use `gulp.task` to expose tasks
 */
gulp.task('build', build);

/*
 * Define default task that can be called by just running `gulp` from cli
 */
gulp.task('default', build);
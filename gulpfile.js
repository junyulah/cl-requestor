var gulp = require('gulp');
var babel = require('gulp-babel');
var runSequence = require('run-sequence');
var del = require('del');
var Spawner = require('cl-spawner');

var spawner = Spawner();
// use this spawn instead of origin spawn
var spawn = function(cmd, params) {
    return spawner.spawn(cmd, params, {
        stdio: 'inherit',
        cwd: __dirname
    });
};

gulp.task('default', ['start']);

// watch to restart
gulp.watch([
    'src/**/*.js',
    'test/src/**/*.js',
    'index.js'
], ['restart']);

gulp.task('start', function(cb) {
    runSequence('stop', 'init', 'clean', 'build', 'test', cb);
});

gulp.task('restart', function(cb) {
    runSequence('stop', 'clean', 'build', 'test', cb);
});

gulp.task('init', function() {
    return spawn('npm', ['i']);
});

gulp.task('stop', function() {
    return spawner.killAll();
});

gulp.task('test', function() {
    return spawn('npm', ['test']);
});

gulp.task('test-cover', function() {
    return spawn('npm', ['run', 'cover']);
});

gulp.task('clean', function() {
    return del([
        'lib',
        'test/lib'
    ])
});

/**
 * We will build src and test/src directory, so we can write ES6/7 in both src and test/src.
 */
gulp.task('build', ['build-src', 'build-test']);

gulp.task('build-src', function() {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['es2015', 'stage-0']
        }))
        .pipe(gulp.dest('lib'));
});

gulp.task('build-test', function() {
    return gulp.src('test/src/**/*.js')
        .pipe(babel({
            presets: ['es2015', 'stage-0']
        }))
        .pipe(gulp.dest('test/lib'));
});
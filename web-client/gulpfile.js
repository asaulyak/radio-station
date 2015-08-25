var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

gulp.task('browserify', function () {
	browserify('./src/js/main.js')
		.transform('reactify')
		.bundle()
		.pipe(source('main.js'))
		.pipe(gulp.dest('./public/js'));
});

gulp.task('copy', function () {
	gulp.src('src/index.html')
		.pipe(gulp.dest('./public'));

	gulp.src('src/assest/**/*.*')
		.pipe(gulp.dest('./public/assets'));

	gulp.src('src/semantic/**/*.*')
		.pipe(gulp.dest('./public/semantic'));

	gulp.src('src/bower_components/**/*.*')
		.pipe(gulp.dest('./public/bower_components'));
});

gulp.task('default', ['browserify', 'copy'], function () {
	gulp.watch('./src/**/*.*', ['browserify', 'copy']);
});
var gulp = require('gulp'),
	concat = require('gulp-concat'),
	sass = require('gulp-ruby-sass'),
	uglify = require('gulp-uglifyjs'),
	mincss = require('gulp-minify-css'),
	clean = require('gulp-clean'),
	runSequence = require('run-sequence'),
	browserSync = require('browser-sync'),
	reload      = browserSync.reload,
	watch = require('gulp-watch'),
	plumber = require('gulp-plumber'),
	jade = require('gulp-jade'),
	gutil = require('gulp-util'),
	/* utility vars */
	is_production = false,
	sass_style = 'expanded',
	source_map = true,
	paths = {
		/* register 3rd party vendor script files */
		'vendor_js':[
			'bower_components/angular/angular.js',
			'bower_components/angular-route/angular-route.js',
			'bower_components/jquery/dist/jquery.js',
			'bower_components/a11y_kit/dist/a11y_kit.js'
		],
		/* register custom literate coffeescript files */
		'litcoffee':[
			'src/coffeescript/app.litcoffee'
		]
	};

if (gulp.env.prod) {
	is_production = true;
	sass_style = 'compress';
	source_map = false;
}


var onError = function (err) {
	gutil.beep();
	console.log(err);
};

var change_event = function(evt) {
    gutil.log('File', gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + basePaths.src + ')/'), '')), 'was', gutil.colors.magenta(evt.type));
};

gulp.task('templates', function() {

	return gulp.src('src/jade/*.jade')
		.pipe(plumber(onError))
		.pipe(jade())
		.pipe(gulp.dest('./'))
		.pipe(reload({stream:true}));
});

gulp.task('copy', function() {
	gulp.src('src/img/**/*')
		.pipe(gulp.dest('build/img'));

	gulp.src('src/fonts/**')
		.pipe(gulp.dest('build/fonts'));

	gulp.src('src/json/**')
		.pipe(gulp.dest('build/json'));

	gulp.src('src/feed/**')
		.pipe(gulp.dest('build/feed'));

	gulp.src('src/js/vendor/**')
		.pipe(gulp.dest('build/js/vendor'));

	gulp.src('src/index.html')
		.pipe(gulp.dest('build/'));

	gulp.src('src/css/**')
		.pipe(gulp.dest('build/css'));
});

gulp.task('_build',['templates']/*,'copy']*/); //Because 'clean' is async runSequence forces sync

gulp.task('browser-sync', function() {
	browserSync({
			server: {
					baseDir: "./"
			}
	});
});


/* command line entry points */

gulp.task('build', function(cb) {
	runSequence('_build',cb);
});

gulp.task('run', function(cb){
	runSequence('build','browser-sync',cb);
	// gulp.watch('./src/sass/**/*.sass', ['sass']);
	// gulp.watch('./src/sass/**/*.scss', ['sass']);
	gulp.watch('./src/jade/**/*.jade', ['templates']);//.on('change', function (evt) {change_event(evt);});
	// gulp.watch('./src/posts/**/*.md', ['markdown']);
	// gulp.watch('./src/coffeescript/*.litcoffee', ['coffee']);
	// gulp.watch('./src/js/vendor/*.js', ['vendor_js']);
	// gulp.watch('./src/json/*.json', ['copy']);
	// gulp.watch('./src/img/*.png', ['copy']);
	// gulp.watch('./src/img/*.jpg', ['copy']);
	// gulp.watch('./src/img/*.svg', ['copy']);
});

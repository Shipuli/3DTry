var gulp = require('gulp'),
	browserify = require('browserify'),
	watchify = require('watchify'),
	reactify = require('reactify'),
	open = require('gulp-open'),
	sass = require('gulp-sass'),
	livereload = require('gulp-livereload'),
	connect = require('gulp-connect'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	uglify = require('gulp-uglify'),
	sourcemaps = require('gulp-sourcemaps');


var path = {
	HTML: './src/index.html',
	SCSS:'./src/cube.scss',
	ASSETS: '/src/assets/*',
	ENTRY_POINT: './src/js/Index.js',
	DEST:'./build',
	DEST_JS: './build/js'
}
//Copy all assets from src-folder to build-folder
//allowing all source files to be in one place.
gulp.task('copy', function() {
	gulp.src(path.HTML)
		.pipe(gulp.dest(path.DEST))
		.pipe(livereload());
	gulp.src(path.ASSETS)
		.pipe(gulp.dest('./build/assets'));
});

gulp.task('sass', function() {
	gulp.src(path.SCSS)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(path.DEST))
		.pipe(livereload());
});

gulp.task('watch', function() {
	livereload.listen();
	gulp.watch(path.HTML, ['copy']);
	gulp.watch(path.SCSS, ['sass']);
	//configure watcher
	var watcher = watchify(browserify({
		entries: [path.ENTRY_POINT],
		transform:[reactify],
		debug:true,
		cache: {}, packageCache: {}, fullPaths: true
	}));

	return watcher.on('update', function() {
		watcher.bundle()
			.pipe(source('build.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest(path.DEST_JS))
			.pipe(livereload());
			console.log('Updated');
	})
		.bundle()
		.pipe(source('build.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(path.DEST_JS))
});

//Compile task for production
gulp.task('compile', function(){
	browserify({
		entries: [path.ENTRY_POINT],
		transform:[reactify],
	}).bundle()
	.pipe(source('build.js'))
	.pipe(buffer())
	.pipe(uglify())
	.pipe(gulp.dest(path.DEST_JS));
});

gulp.task('open', function(){
	var options= {
		url:'http://localhost:8080/build/index.html',
		app:'chrome'
	}
	gulp.src('./build/index.html')
	.pipe(open('', options))
});
//Start a simple development server
gulp.task('connect', function(){
	connect.server();
});

if(process.env.NODE_ENV === 'production'){
	gulp.task('default', ['sass','copy','compile']);
}else{
	gulp.task('default', ['sass','copy','watch','connect','open']);
}

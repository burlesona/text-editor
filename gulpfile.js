var sys = require('sys')
var exec = require('child_process').exec;

var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var coffee = require('gulp-coffee');

var path = {
  src: {
    core: './src/*.coffee',
    plugins: './src/plugins/*.coffee',
    demo: './demo/scripts/*.coffee'
  },
  dev: {
    root: './demo/compiled/',
    plugins: './demo/compiled/plugins/'
  },
  dist: './dist/'
}

// Setup the files for development
gulp.task('setup', function(){
  // Editor JS
  gulp.src(path.src.core)
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest(path.dev.root));
  // Plugins JS
  gulp.src(path.src.plugins)
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest(path.dev.plugins));
  // Demo JS
  gulp.src(path.src.demo)
    .pipe(coffee().on('error',gutil.log))
    .pipe(gulp.dest(path.dev.root));
});



// Watch the project and demo files and update on changes
gulp.task('watch', function(){
  // Editor JS
  gulp.watch(path.src.core, function(event){
    console.log([event.path,event.type].join(" -- "));
    gulp.src(path.src.core)
      .pipe(coffee({bare: true}).on('error', gutil.log))
      .pipe(gulp.dest(path.dev.root));
  });
  // Plugins JS
  gulp.watch(path.src.plugins, function(event){
    console.log([event.path,event.type].join(" -- "));
    gulp.src(path.src.plugins)
      .pipe(coffee({bare: true}).on('error', gutil.log))
      .pipe(gulp.dest(path.dev.plugins));
  });
  // Demo JS
  gulp.watch(path.src.demo, function(event){
    console.log([event.path,event.type].join(" -- "));
    gulp.src(path.src.demo)
      .pipe(coffee().on('error',gutil.log))
      .pipe(gulp.dest(path.dev.root));
  });
});



// Output the editor and plugins non-minified for development
gulp.task('compile', function() {
  gulp.src(path.src.core)
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(concat('editor-core.js'))
    .pipe(gulp.dest(path.dist));
  gulp.src(path.src.plugins)
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(concat('editor-plugins.js'))
    .pipe(gulp.dest(path.dist));
});



// Minify the editor and plugins for production
gulp.task('build',['compile'],function () {
  //For the moment using concat is just an easy way to rename
  gulp.src(path.dist + 'editor-core.js')
    .pipe(concat('editor-core.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(path.dist));
  gulp.src(path.dist + 'editor-plugins.js')
    .pipe(concat('editor-plugins.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(path.dist));
});


// Default task - start the project and watch for changes in source files
gulp.task('default',['setup','watch']);

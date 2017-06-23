"use strict";

// Configuration
var headerTag;
var siteData;
var config = {
    "basePath": "./node_modules/core",
    "destPath": "./build/assets/",
    "headerJS": {
      "outputFile": "header.min.js",
      "dest": "js",
      "patterns": [
        [
          "js-common/assets/vendor/jquery.min.js"
        ]
      ]
    },
    "footerJS": {
      "outputFile": "footer.min.js",
      "dest": "js",
      "almondFile": "js-common/assets/vendor/almond",
      "configFile": "js-common/assets/js/js-common"
    }
};
config.basePath = "./";
config.destPath = "./assets/";

// References
var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var gulpHeader = require('gulp-header');
var concat = require('gulp-concat');
var extend = require('node.extend');
var flatten = require('gulp-flatten');
var del = require('del');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var path = require("path");
var fs = require("fs");
var sourcemaps = require('gulp-sourcemaps');
var merge = require('merge-stream');
var uglify = require('gulp-uglify');
var path = require("path");
var rjs = require('requirejs');
var gulpif = require('gulp-if');
var exec = require('child_process').exec;

// When session starts
gulp.task("default", function(cb) {
  gulpSequence('build',cb); //, 'browser-watch'
});

// Default
gulp.task("build",function(cb){
  gulpSequence(['build-css', 'build-footer-js', 'build-header-js'],cb);
});

//Generate css from scss
gulp.task('build-css', function () {
 return gulp.src('./circle-chart/assets/scss/*.scss')
   .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	 .pipe(concat('main.css'))
   .pipe(gulp.dest('./assets/css'));
});

// Generate header JS
gulp.task('build-header-js', function() {
  var data = config.headerJS;
  var patterns = data.patterns;
  var streams = [];
  for (var d=0;d<patterns.length;d++) {
    streams.push(gulp.src(patterns[d], { cwd: path.resolve(config.basePath) }));
  }
  var d = new Date();
  var headerComment = '/* Generated: ' + d + headerTag + ' */';
  return merge(streams)
    .pipe(concat(data.outputFile))
    .pipe(gulpHeader(headerComment))
    .pipe(gulp.dest(config.destPath + data.dest));
});

// Generate footer js
gulp.task('build-footer-js', function(done) {
  var data = config.footerJS;
  var module = data.configFile;
  rjs.optimize({
    "mainConfigFile": path.join(config.basePath,data.configFile+'.js'),
    "baseUrl": path.resolve(config.basePath),
    "name": data.almondFile,
    "include": [ data.configFile],
    "wrap": true,
    "out": path.join(config.destPath + data.dest,data.outputFile),
    "optimize": "none",
    "generateSourceMaps": true,
    "preserveLicenseComments": false,
    "wrapShim": false,
    "normalizeDirDefines": 'skip',
    "skipDirOptimize": false
  }, function () {
    var d = new Date();
    var headerComment = '/* Generated: ' + d + headerTag + ' */';
    var stream = gulp.src(path.join(config.destPath + data.dest,data.outputFile))
      .pipe(gulpHeader(headerComment))
      .pipe(gulp.dest(config.destPath + data.dest));
    stream.on('end',function(){ done(); });
  }, done);
});
/// <binding BeforeBuild='default' Clean='clean' />
"use strict";

var del = require("del"),
    gulp = require("gulp"),
    babel = require("gulp-babel"),
    eslint = require("gulp-eslint"),
    npmConfig = require("./package.json"),
    config = npmConfig.gulpConfig;

gulp.task("default", ["build"]);

gulp.task("clean", function (cb) {
    del([config.dest.server, config.dest.static]);
});

gulp.task("build", ["build:server", "build:static"]);

gulp.task("build:server", ["_build:lint"], function () {
    return gulp.src(config.src.server + "/**/*.js")
        .pipe(babel())
        .pipe(gulp.dest(config.dest.server));
});

gulp.task("build:static", ["_build:icons"]);

gulp.task("_build:icons", function () {
    return gulp.src(config.src.static + "/**/*.ico")
        .pipe(gulp.dest(config.dest.static));
});

gulp.task("_build:lint", function () {
    console.dir(npmConfig.eslintConfig);
    return gulp.src(config.src.server + "/**/*.js")
        .pipe(eslint(npmConfig.eslintConfig))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

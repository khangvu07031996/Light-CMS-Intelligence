var gulp = require('gulp');
var sass = require('gulp-sass');
gulp.task('sass',function(){
    return gulp.src('www/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('publics/dist/css'));    
})
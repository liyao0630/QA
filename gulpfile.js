const gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  bs = require('browser-sync').create();

/**
 * Run nodemon.
 */
gulp.task('nodemon', function nodemonCreate(done) {
  let started = false
  nodemon({
    script: './src/index.js',  // server
    ext: 'js html css', // 监听后缀
    env: {
      'NODE_ENV': 'development'
    }
  }).on('start', function startEvent() {
    if (!started) {
      started = true
      setTimeout(function () {
        bs.reload();
        done()
      }, 500);
      done()
    }
  }).on('restart', function restartEvent() {
    setTimeout(function () {
      bs.reload();
      done()
    }, 500);
  })
})

/**
 * When started, delay refresh
 */
gulp.task('bs-delay', function bsDelay(done) {
  setTimeout(function () {
    bs.reload();
    done()
  }, 1000);
});


/**
 * Start the service
 */
gulp.task('server', gulp.series('nodemon', 'bs-delay', function browserSync(done) {
  bs.init({
    proxy: {
      target: 'http://localhost:9530',
      /* middleware: [proxy(['/user/*'], {
        target: 'http://h5.7k7k.com',
        changeOrigin: true
      })] */
    },
    port: 3060,
    notify: false // 更新提示关闭
  }, () => {
    done()
  })

}))

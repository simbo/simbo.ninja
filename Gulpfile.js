/**
 * + Gulpfile
 * https://github.com/gulpjs/gulp/blob/master/docs/API.md
 * https://github.com/gulpjs/gulp/tree/master/docs/recipes
 * =====================================================================
 */
'use strict';

// node modules
var autoplug = require('auto-plug'),
    del      = require('del'),
    gulp     = require('gulp'),
    minimist = require('minimist'),
    path     = require('path'),
    pm2      = require('pm2');

// external data
var config = require(process.cwd() + '/Config.js'),
    pkg    = require(process.cwd() + '/package.json');

// auto-require gulp plugins
var g = autoplug({ prefix: 'gulp', config: pkg });


/**
 * + Error handling
 * =====================================================================
 */

function handleError(err) {
    g.util.log(err.toString());
    this.emit('end');
}

/* = Error handling */


/**
 * + Parse CLI params
 * =====================================================================
 */

var params = (function(p){
        var cliParams = minimist(process.argv.slice(2));
        p.environment = cliParams.environment || cliParams.env || process.env.NODE_ENV || config.gulpParams.environment || 'production';
        return p;
    })({});

/* = Parse CLI params */


/**
 * + PM2 reloading
 * =====================================================================
 */

gulp.task('pm2-reload', function(done) {
    pm2.connect(function(err) {
        pm2.restart('simbo.ninja', function(err, proc) {
            if (err) throw new Error('err');
            pm2.disconnect(function() {
                done();
            });
        });
    });
});

/* = PM2 reloading */


/**
 * + Clean Tasks
 * =====================================================================
 */

// clean generated content
gulp.task('clean:out', function(done) {
    del(config.paths.out, done);
});

/* = Clean Tasks */


/**
 * + Config sync task
 * =====================================================================
 */

gulp.task('config-sync', function() {
    return gulp
        .src(path.join(config.paths.root, 'bower.json'))
        .pipe(g.configSync(config.configSync))
        .pipe(gulp.dest('.'));
});

/* = Config sync task */


/**
 * + Watch Task
 * =====================================================================
 */

gulp.task('watch', function() {

    // quick config
    var watchTasks = {
        app: {
            glob: '**/*',
            cwd: config.paths.app,
            start: 'pm2-reload'
        },
        pkq: {
            glob: 'package.json',
            cwd: config.paths.root,
            start: 'config-sync'
        }
    }

    // show watch info in console
    function logWatchInfo(event) {
        var eventPath = path.relative(config.paths.root, event.path);
        g.util.log('File \'' + g.util.colors.cyan(eventPath) + '\' was ' + g.util.colors.yellow(event.type) + ', running tasks...');
    }

    // create watch tasks
    Object.keys(watchTasks).forEach(function(key) {
        var task = obj[key];
        gulp.watch(task.glob, { cwd: task.cwd }, function(event) {
            logWatchInfo(event);
            gulp.start(task.start);
        });
    });

});

/* = Watch Task */


/**
 * + Common tasks
 * =====================================================================
 */

// default task
gulp.task('default', ['build']);

// full build
gulp.task('build', []);

// build, serve and watch
gulp.task('dev', ['build'], function() {
    gulp.start('watch');
});

/* = Common tasks */


/* = Gulpfile */

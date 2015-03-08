/**
 * + Gulpfile
 * https://github.com/gulpjs/gulp/blob/master/docs/API.md
 * https://github.com/gulpjs/gulp/tree/master/docs/recipes
 * =====================================================================
 */
'use strict';

// node modules
var _            = require('lodash'),
    autoPlug     = require('auto-plug'),
    autoprefixer = require('autoprefixer-core'),
    csswring     = require('csswring'),
    del          = require('del'),
    gulp         = require('gulp'),
    highlightjs  = require('highlight.js'),
    jade         = require('jade'),
    Metalsmith   = require('metalsmith'),
    minimist     = require('minimist'),
    moment       = require('moment'),
    mqpacker     = require('css-mqpacker'),
    path         = require('path'),
    pm2          = require('pm2'),
    runSequence  = require('run-sequence'),
    uglify       = require('uglify-js'),
    util         = require('util');

// external data
var config = require(process.cwd() + '/Config.js'),
    pkg    = require(process.cwd() + '/package.json');

// auto-require gulp plugins
var g  = autoPlug({ prefix: 'gulp', config: pkg }),
    ms = autoPlug({ prefix: 'metalsmith', config: pkg });


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
 * + Stylus / CSS processing
 * =====================================================================
 */

gulp.task('build:css', function() {
    return gulp

        // grab all stylus files in stylus root folder
        .src(config.paths.assetsDev + '/stylus/*.styl')

        // pipe through stylus processor
        .pipe(g.stylus(config.stylus).on('error', handleError))

        // pipe through sourcemaps processor
        .pipe(g.sourcemaps.init({
            loadMaps: true
        }))

        // pipe through postcss processor
        .pipe(g.postcss((function(postcssPlugins){
                // minify only when in production mode
                if (params.environment === 'production') {
                    postcssPlugins.push(csswring(config.csswring));
                }
                return postcssPlugins;
            })([
                autoprefixer(config.autoprefixer),
                mqpacker
            ])
        ).on('error', handleError))

        // pipe through csslint if in development mode
        .pipe(g.if(
            params.environment === 'development',
            g.csslint(config.csslint)
        ))
        .pipe(g.csslint.reporter())

        // write sourcemaps
        .pipe(g.sourcemaps.write('.', {
            includeContent: true,
            sourceRoot: '.'
        }))

        // write processed styles
        .pipe(gulp.dest(path.join(config.paths.assets, 'css')));

});

/* = Stylus / CSS processing */


/**
 * + Custom jade filters
 * =====================================================================
 */

// uglify inline scripts if in production mode
jade.filters.uglify = function(data, options) {
    return params.environment === 'production' ? uglify.minify(data, {fromString: true}).code : data;
}

/* = Custom jade filters */


/**
 * + Metalsmith rendering
 * =====================================================================
 */

gulp.task('build:site', function(done) {

    // parse metadata depending on environment
    _.forEach(config.metadata.environments, function(values, env) {
        if (params.environment===env) {
            config.metadata = _.merge(config.metadata, values);
        }
    });

    // localize moment
    moment.locale(config.metadata.dateLocale);

    // jade options
    var jadeLocals = {
            moment: moment,
            environment: params.environment
        },
        jadeOptions = {
            pretty: params.environment=='development' ? true : false,
            directory: path.relative(config.paths.root, config.paths.templates),
        };

    // set default template to a metalsmith stream
    function defaultTemplate(template) {
        return ms.each(function(file, filename) {
            if (!file.template && file.template!==null) {
                file.template = template;
            }
        });
    }

    // go metalsmith!
    var metalsmith = new Metalsmith(config.paths.root)

        // set basic options
        .source(config.paths.site)
        .destination(config.paths.web)
        .metadata(config.metadata)
        .clean(false)

        // enable drafts
        .use(ms.drafts())

        // define collections
        .use(ms.collections({
            posts: {
                pattern: 'blog/**/*',
                sortBy: 'date',
                reverse: true
            }
        }))

        // render markdown
        .use(ms.branch([
                '**/*.md'
            ])
            .use(ms.markdown(_.merge(config.marked, {
                highlight: function (code) {
                    return highlightjs.highlightAuto(code).value;
                }
            })))
        )

        // render jade files
        .use(ms.branch([
                '**/*.jade'
            ])
            .use(ms.jade(_.merge({
                locals: _.merge(config.metadata, jadeLocals)
            }, jadeOptions)))
        )

        // generate excerpts
        .use(ms.betterExcerpts())

        // parse content
        .use(ms.branch([
                '**/*.html',
                '!blog/**/*'
            ])
            .use(defaultTemplate('page.jade'))
            .use(ms.permalinks({
                relative: false
            }))
        )

        // parse blog
        .use(ms.branch([
                'blog/**/*.html'
            ])
            .use(ms.dateInFilename())
            .use(defaultTemplate('post.jade'))
            .use(ms.permalinks({
                pattern: 'blog/:date/:title',
                date: 'YYYY/MM',
                relative: false
            }))
        )

        // set absolute urls
        .use(ms.branch([
                '**/*.html'
            ])
            .use(ms.each(function(file, filename) {
                file.url = config.metadata.baseUrl + file.path;
            }))
        )

        // render templates
        .use(ms.templates(_.merge({
            engine: 'jade'
        }, jadeOptions, jadeLocals)))

        // put everything together...
        .build(function(err) {
            if (err) throw err;
            done();
        });

});

/* = Metalsmith rendering */


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
 * + Copy tasks
 * =====================================================================
 */

// copy task definitions
var copyTasks = {
        jquery: {
            src: 'jquery.*',
            cwd: 'jquery/dist',
            baseCwd: config.paths.node
        },
        highlightjs: {
            src: 'github.css',
            cwd: 'highlightjs/styles',
            extReplace: '.styl',
            intoDev: true
        }
    },
    copySequence = [];

// create copy tasks
Object.keys(copyTasks).forEach(function(name) {
    var task = copyTasks[name],
        taskName = 'copy:' + name;
    if (!task.hasOwnProperty('baseCwd')) {
        task.baseCwd = config.paths.bower;
    }
    gulp.task(taskName, function() {
        return gulp
            .src(task.src, {
                cwd: path.join(task.baseCwd, task.cwd),
                base: path.join(task.baseCwd, task.cwd)
            })
            .pipe(g.if(task.hasOwnProperty('extReplace'), g.extReplace('.styl')))
            .pipe(gulp.dest(path.join(config.paths[task.intoDev ? 'assetsDev' : 'assetsSrc'], 'vendor', name)));
    });
    copySequence.push(taskName);
});

// copy all dependencies
gulp.task('copy:deps', ['clean:deps'], function(done) {
    runSequence(copySequence, done);
});

/* = Copy tasks */


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
 * + Clean Tasks
 * =====================================================================
 */

// clean generated content
gulp.task('clean:web', function(done) {
    del(config.paths.web, done);
});

// clean all dependencies
gulp.task('clean:deps', function(done) {
    del([
        path.join(config.paths.assetsSrc, 'vendor'),
        path.join(config.paths.assetsDev, 'vendor')
    ], done);
});

/* = Clean Tasks */


/**
 * + Watch Task
 * =====================================================================
 */

gulp.task('watch', function() {

    // watch task defintions
    var watchTasks = {
        stylus: {
            glob: '**/*.styl',
            cwd: path.join(config.paths.assetsDev, 'stylus'),
            start: 'build:css'
        },
        site: {
            glob: [
                'site/**/*',
                'templates/**/*'
            ],
            cwd: config.paths.src,
            start: 'build:site'
        },
        app: {
            glob: '**/*.js',
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
        var task = watchTasks[key];
        gulp.watch(task.glob, _.merge({ cwd: task.cwd }, config.watch), function(event) {
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
gulp.task('build', ['copy:deps', 'clean:web', 'config-sync'], function(done) {
    runSequence(['build:site', 'build:css'], done);
});

// build and watch
gulp.task('dev', ['build'], function() {
    gulp.start('watch');
});

/* = Common tasks */


/* = Gulpfile */

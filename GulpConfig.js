/**
 * + Gulp Config
 * =====================================================================
 */

module.exports = (function(config) {

    // required packages
    var crypto = require('crypto'),
        fs     = require('fs'),
        path   = require('path');

    // data
    var cwd   = process.cwd(),
        pkg   = require(cwd + '/package.json'),
        bower = require(cwd + '/package.json');

    /**
     * + Paths
     * =====================================================================
     */

    config.paths = (function(p) {
        p.root      = cwd;
        p.bower     = path.join(p.root, 'bower_components');
        p.node      = path.join(p.root, 'node_modules');
        p.app       = path.join(p.root, 'app');
        p.src       = path.join(p.root, 'src');
        p.web       = path.join(p.root, 'web');
        p.site      = path.join(p.src,  'site');
        p.templates = path.join(p.src,  'templates');
        p.assetsSrc = path.join(p.site, 'assets');
        p.assetsDev = path.join(p.src,  'assets-dev');
        p.assets    = path.join(p.web,  'assets');
        return p;
    })({});

    /* = Paths */


    /**
     * + Metadata (available in templates)
     * =====================================================================
     */

    // static metadata
    config.metadata = {
        siteTitle:          'simbo.ninja',
        siteDescription:    'Some informative description for search engine results.',
        baseUrl:            '//simbo.ninja/',
        styles:             [
                                'assets/css/main.css'
                            ],
        scripts:            [
                                'assets/js/main.js'
                            ],
        dateLocale:         'de',
        dateFormat:         'Do MMM YYYY',
        dateFormatShort:    'DD.MM.YY',
        dateFormatLong:     'dddd, Do MMMM YYYY'
    };

    // metadata changes depending on environment
    config.metadata.environments = {
        development: {
            baseUrl:            '//localhost:8080/',
            googleAnalytics:    false
        }
    };

    /* = Metadata (available in templates) */


    /**
     * + Functions (available in templates)
     * =====================================================================
     */

    // get dependency version from package.json or bower.json
    config.metadata.getDependencyVersion = function(dep, data, dev) {
        data = data=='bower' ? bower : pkg;
        dev = dev===undefined ? true : dev;
        data = data[(dev?'devD':'d') + 'ependencies']
        return data.hasOwnProperty(dep) ? data[dep].replace(/[^.0-9]/g, '') : '';
    };

    // get the contents of a file
    config.metadata.fileContents = function(file) {
        return fs.readFileSync(path.join(config.paths.root, file));
    };

    // get the hash of a string
    config.metadata.hash = function(string, algorithm) {
        if (!algorithm || crypto.getHashes().indexOf(algorithm)===-1) {
            algorithm = 'md5';
        }
        return crypto
            .createHash(algorithm)
            .update(string, 'utf8')
            .digest('hex');
    };

    /* = Functions (available in templates) */


    /**
      * + Gulp module options
      * =====================================================================
      */

    // gulp default params
    config.gulpParams = {
        environment: 'production'
    };

    // global watch task options
    config.watch = {
        mode: 'auto'
    };

    // marked options
    config.marked = {
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false
    };

    // stylus options
    config.stylus = {
        // add imports and vendor folders to @import path
        paths: [
            path.join(config.paths.assetsDev, 'stylus/imports'),
            path.join(config.paths.assetsDev, 'vendor'),
            path.join(config.paths.assetsSrc, 'img')
        ],
        // function for generating base64 data-uris
        url: {
            name: 'inline-url',
            limit: false
        },
        // create sourcemaps containing inline sources
        sourcemap: {
            inline: true,
            sourceRoot: '.',
            basePath: path.join(path.relative(config.paths.web, config.paths.assets), 'css')
        }
    };

    // autoprefixer options
    config.autoprefixer = {
        browsers: [
            'last 2 versions',
            '> 2%',
            'Opera 12.1',
            'Firefox ESR'
        ]
    };

    // csslint options
    // https://github.com/CSSLint/csslint/wiki/Rules-by-ID
    config.csslint = {
        'box-sizing': false,
        'bulletproof-font-face': false,
        'font-faces': false,
        'compatible-vendor-prefixes': false
    };

    // config sync options
    // https://github.com/danlevan/gulp-config-sync
    config.configSync = {
        fields: [
            'name',
            'version',
            'description',
            'keywords',
            'version',
            'private'
        ],
        space: 2
    };

    /* = Gulp module options */


    return config;
})({});

/* = Gulp Config */

/**
 * + Project Config
 * =====================================================================
 */

module.exports = (function(config) {

    var path = require('path');

    // project paths
    config.paths = (function(p) {
        p.root      = process.cwd();
        p.bower     = path.join(p.root, 'bower_components')
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

    // metadata
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
        googleAnalytics:    'UA-12345678-9',
        googleFonts:        [
                                'Open+Sans:300italic,400italic,700italic,700,300,400:latin',
                                'Source+Code+Pro:400,700:latin'
                            ],
        dateLocale:         'de',
        dateFormat:         'Do MMM YYYY',
        dateFormatShort:    'DD.MM.YY',
        dateFormatLong:     'dddd, Do MMMM YYYY'
    };

    // config for webfontLoader
    config.metadata.webfontConfig = {
        google: {
            families: config.metadata.googleFonts
        }
    };


    // metadata changes depending on environment
    config.metadata.environments = {
        development: {
            baseUrl:            '//localhost:8080/',
            googleAnalytics:    false
        }
    };

    // get jQuery version from bower.json
    config.metadata.jqueryVersion = (function() {
        var bowerPkg = require(process.cwd() + '/bower.json');
        return bowerPkg.devDependencies.hasOwnProperty('jquery') ? bowerPkg.devDependencies.jquery.replace(/[^.0-9]/g, '') : '';
    })();

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
        'box-sizing': false
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

    return config;
})({});

/* = Project Config */

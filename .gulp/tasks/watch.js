'use strict';

var path = require('path');

var arrayify = require('arrayify');

module.exports = [

  'watch everything and trigger respective tasks',

  function(done) {

    var watchers = {
      css: {
        glob: path.join(this.paths.css.src, '**/*.styl'),
        start: 'build:css'
      },
      site: {
        glob: [
          path.join(this.paths.data, '**/*'),
          path.join(this.paths.site.src, '@(content|layouts|partials)/**/*')
        ],
        start: 'build:site'
      }
    };

    Object.keys(watchers).forEach(createWatcher.bind(this));

    this.watchify = true;
    this.runSequence('build:js', done);

    function onWatchEvent(event, watcher) {
      var eventIcon = this.util.colors.yellow('☀ '),
          eventPath = this.util.colors.magenta(
            path.relative(this.paths.cwd, event.path)
          ),
          eventType = this.util.colors.yellow(event.type);
      this.util.log(eventIcon + 'File ' + eventPath + ' was ' + eventType);
    }

    function createWatcher(watcherId) {
      var watcher = watchers[watcherId];
      this.gulp.watch(
        watcher.glob,
        function() {
          this.runSequence.apply(this.gulp, arrayify(watcher.start));
        }.bind(this),
        function(event) {
          onWatchEvent.apply(this, [event, watcher]);
        }.bind(this)
      );
      this.util.log('Watching ' + this.util.colors.magenta(watcherId) + '...');
    }

  }

];

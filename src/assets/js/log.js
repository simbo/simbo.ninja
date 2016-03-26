'use strict';

var $ = require('cash-dom'),
    moment = require('moment'),
    reqwest = require('reqwest');

var renderTemplate = require('functions/render-template');

var $container,
    $body,
    entryTemplate,
    updateTimeout;

$(document).ready(function() {
  $container = $('.log');
  $body = $('body');
  entryTemplate = $('#log-entry-template').html();
  $('#log_clear').on('click', function(ev) {
    ev.preventDefault();
    clearLog();
  });
  queryEntries();
});


function queryEntries() {
  var $entries = $container.find('.log-entry'),
      data = {};
  stopAutoUpdate();
  if ($entries.length > 0) data.after = $($entries[$entries.length - 1]).data('entry').timestamp;
  else data.limit = 100;
  reqwest({
    url: '/api/log/latest',
    type: 'json',
    data: data
  })
    .then(function(result) {
      if (result.entries && result.entries.length > 0) {
        result.entries.reverse().forEach(function(entry) {
          var $entry;
          entry.date = moment(entry.timestamp).format('DD.MM.YYYY HH:mm:ss');
          $entry = $(renderTemplate(entryTemplate, entry));
          $entry.data('entry', entry);
          $container.append($entry);
        });
        $body[0].scrollTop = $body.height();
      }
    })
    .always(startAutoUpdate);
}

function startAutoUpdate() {
  updateTimeout = window.setTimeout(queryEntries, 2000);
}

function stopAutoUpdate() {
  if (updateTimeout) clearTimeout(updateTimeout);
}

function clearLog() {
  stopAutoUpdate();
  reqwest({
    url: '/api/log/clear',
    type: 'json'
  })
    .then(function(result) {
      if (result === true) $container.find('.log-entry').remove();
    })
    .always(startAutoUpdate);
}

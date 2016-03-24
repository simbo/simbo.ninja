'use strict';

var $ = require('cash-dom'),
    moment = require('moment'),
    reqwest = require('reqwest');

var renderTemplate = require('functions/render-template');

var $container,
    $body,
    entries = [],
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
  var data = {};
  stopInterval();
  if (entries.length > 0) data.after = entries[entries.length - 1].timestamp;
  else data.limit = 100;
  reqwest({
    url: '/api/log',
    type: 'json',
    data: data
  })
    .then(function(result) {
      if (result.entries && result.entries.length > 0) {
        result.entries.reverse().forEach(function(entry) {
          var data = entry.value;
          data.id = entry.id;
          data.date = moment(data.timestamp).format('DD.MM.YYYY HH:mm:ss');
          entries.push(data);
          $container.append(renderTemplate(entryTemplate, data));
        });
        $body[0].scrollTop = $body.height();
      }
    })
    .always(startInterval);
}

function startInterval() {
  updateTimeout = window.setTimeout(queryEntries, 1000);
}

function stopInterval() {
  if (updateTimeout) clearTimeout(updateTimeout);
}

function clearLog() {
  stopInterval();
  reqwest({
    url: '/api/log/clear',
    type: 'json'
  })
    .then(function(result) {
      if (result === true) $container.find('.log-entry').remove();
    })
    .always(startInterval);
}

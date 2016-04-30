'use strict';

const q = require('q');

module.exports = qAssert;

function qAssert(assertFn) {
  return q.Promise((resolve, reject) => {
    try {
      assertFn();
      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
}
